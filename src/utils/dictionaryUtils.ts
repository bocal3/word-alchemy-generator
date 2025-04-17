import type { Dictionary } from "@/components/loremipsum/utils/generateLorem";
import { SupportedLanguage } from "@/contexts/LanguageContext";

// Function to get current language
export const getCurrentLanguage = (): SupportedLanguage => {
  const storedLang = localStorage.getItem('psum-language');
  console.log('🌍 Debug - Langue stockée dans localStorage:', storedLang);
  
  if (storedLang) {
    try {
      const lang = JSON.parse(storedLang) as SupportedLanguage;
      console.log('🌍 Debug - Langue parsée:', lang);
      const isValid = ['fr', 'en', 'es'].includes(lang);
      console.log('🌍 Debug - Langue valide ?', isValid);
      return isValid ? lang as SupportedLanguage : 'en';
    } catch (e) {
      console.error('Error parsing stored language:', e);
      return 'en';
    }
  }
  
  // Default to browser language or English
  const browserLang = navigator.language.split('-')[0];
  console.log('🌍 Debug - Langue du navigateur:', browserLang);
  const isValidBrowserLang = ['fr', 'en', 'es'].includes(browserLang);
  console.log('🌍 Debug - Langue du navigateur valide ?', isValidBrowserLang);
  return isValidBrowserLang ? browserLang as SupportedLanguage : 'en';
};

// Function to load dictionary data with language support
export const loadDictionary = async (name: string, language?: SupportedLanguage): Promise<Dictionary | null> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // First try to load from localStorage
    const localData = localStorage.getItem(`dictionary_${lang}_${name}`);
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        return { words: parsedData.words };
      } catch (e) {
        console.error('Error parsing localStorage dictionary:', e);
      }
    }
    
    // Then try language-specific import
    try {
      const module = await import(`../components/loremipsum/data/${lang}/${name}.json`);
      return module as Dictionary;
    } catch (error) {
      console.error(`Error loading dictionary ${name} for language ${lang}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`Error loading dictionary ${name}:`, error);
    return null;
  }
};

// Function to save dictionary data
export const saveDictionary = async (name: string, data: Partial<Dictionary>, language?: SupportedLanguage): Promise<boolean> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // Create the dictionary data object
    const dictionaryData = {
      name,
      language: lang,
      words: data.words || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(dictionaryData, null, 2);
    
    // Create a blob
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a download link
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `dictionary_${lang}_${name}.json`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Also store in localStorage for quick access
    localStorage.setItem(`dictionary_${lang}_${name}`, jsonData);
    
    // Update created dictionaries list
    const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
    if (!createdDictionaries.includes(name)) {
      createdDictionaries.push(name);
      localStorage.setItem(`created_dictionaries_${lang}`, JSON.stringify(createdDictionaries));
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving dictionary ${name}:`, error);
    return false;
  }
};

// Get combined words from file and localStorage with language support
export const getDictionaryWords = async (name: string, language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  const fileDict = await loadDictionary(name, lang);
  const fileWords = fileDict?.words || [];
  
  // Check localStorage for additional words
  const localWords = localStorage.getItem(`dictionary_${lang}_${name}`);
  let parsedLocalWords: string[] = [];
  
  if (localWords) {
    try {
      parsedLocalWords = JSON.parse(localWords);
    } catch (e) {
      console.error('Error parsing localStorage dictionary:', e);
    }
  }
  
  // Return combined words
  return [...fileWords, ...parsedLocalWords];
};

// Remove word from dictionary
export const removeWordFromDictionary = async (name: string, wordToRemove: string, language?: SupportedLanguage): Promise<boolean> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // Get existing words
    const words = await getDictionaryWords(name, lang);
    
    // Filter out the word to remove
    const updatedWords = words.filter(word => word !== wordToRemove);
    
    // If nothing changed, word wasn't found
    if (words.length === updatedWords.length) {
      return false;
    }
    
    // Save back to storage
    return await saveDictionary(name, { words: updatedWords }, lang);
  } catch (error) {
    console.error(`Error removing word from dictionary ${name}:`, error);
    return false;
  }
};

// Function to get display name from filename
const getDisplayName = (filename: string): string => {
  // Remove .json extension and capitalize first letter
  return filename
    .replace('.json', '')
    .charAt(0).toUpperCase() + filename.replace('.json', '').slice(1);
};

// Discover all dictionary files with language support
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<{ id: string; label: string }[]> => {
  const lang = language || getCurrentLanguage();
  let dictionaries: { id: string; label: string }[] = [];

  try {
    // Get available dictionaries
    const potentialDictionaries = await getPotentialDictionaries(lang);
    
    // Add each dictionary file
    for (const id of potentialDictionaries) {
      dictionaries.push({
        id,
        label: getDisplayName(id)
      });
    }

    // Add any created dictionaries from localStorage
    const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
    for (const dictName of createdDictionaries) {
      if (!dictionaries.some(d => d.id === dictName)) {
        dictionaries.push({
          id: dictName,
          label: getDisplayName(dictName)
        });
      }
    }

    return dictionaries;
  } catch (error) {
    console.error('Error discovering dictionaries:', error);
    return [];
  }
};

// Get all available dictionaries with metadata
export const getAllDictionaries = async (language?: SupportedLanguage): Promise<{ id: string; label: string; count: number }[]> => {
  try {
    const lang = language || getCurrentLanguage();
    const dictionaries = await discoverDictionaries(lang);
    
    // Map dictionaries to metadata objects
    const dictionariesWithMeta = await Promise.all(
      dictionaries.map(async (dict) => {
        const words = await getDictionaryWords(dict.id, lang);
        return {
          id: dict.id,
          label: dict.label,
          count: words.length
        };
      })
    );
    
    return dictionariesWithMeta;
  } catch (error) {
    console.error('Error getting dictionaries:', error);
    return [];
  }
};

// Create a new dictionary with language support
export const createDictionary = async (name: string, words: string[], language?: SupportedLanguage): Promise<boolean> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // Generate a slug from the dictionary name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // In a real app, we would write to a file
    // Here we'll use localStorage to simulate file creation
    localStorage.setItem(`dictionary_${lang}_${slug}`, JSON.stringify(words));
    
    // Add to list of created dictionaries
    const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
    if (!createdDictionaries.includes(slug)) {
      createdDictionaries.push(slug);
      localStorage.setItem(`created_dictionaries_${lang}`, JSON.stringify(createdDictionaries));
    }
    
    return true;
  } catch (error) {
    console.error(`Error creating dictionary ${name}:`, error);
    return false;
  }
};

// Add words to an existing dictionary
export const addWordsToDictionary = async (name: string, newWords: string[], language?: SupportedLanguage): Promise<boolean> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // Get existing words
    const existingWords = await getDictionaryWords(name, lang);
    
    // Combine and deduplicate
    const combinedWords = [...existingWords, ...newWords];
    const uniqueWords = [...new Set(combinedWords)];
    
    // Save back to storage
    return await saveDictionary(name, { words: uniqueWords }, lang);
  } catch (error) {
    console.error(`Error adding words to dictionary ${name}:`, error);
    return false;
  }
};

// Function to import dictionary from file
export const importDictionary = async (file: File): Promise<boolean> => {
  try {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const dictionaryData = JSON.parse(content);
          
          if (!dictionaryData.name || !dictionaryData.language || !dictionaryData.words) {
            throw new Error('Invalid dictionary format');
          }
          
          // Save to localStorage
          localStorage.setItem(
            `dictionary_${dictionaryData.language}_${dictionaryData.name}`,
            JSON.stringify(dictionaryData)
          );
          
          // Update created dictionaries list
          const createdDictionaries = JSON.parse(
            localStorage.getItem(`created_dictionaries_${dictionaryData.language}`) || '[]'
          );
          if (!createdDictionaries.includes(dictionaryData.name)) {
            createdDictionaries.push(dictionaryData.name);
            localStorage.setItem(
              `created_dictionaries_${dictionaryData.language}`,
              JSON.stringify(createdDictionaries)
            );
          }
          
          resolve(true);
        } catch (error) {
          console.error('Error importing dictionary:', error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Error in importDictionary:', error);
    return false;
  }
};

// Get available dictionaries based on language
export const getPotentialDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  console.log('🔍 Debug - Langue courante:', lang);
  let dictionaries: string[] = [];

  try {
    // Liste des dictionnaires par langue
    const dictionaryFiles = {
      fr: [
        'survie', 'telerealite', 'viande', 'police', 'randonnee', 'startup',
        'paranormal', 'philosophie', 'photo', 'latin', 'outils', 'hipster',
        'it', 'jeu', 'fantasy', 'cyberpunk', 'developpement', 'biere', 'cuisine'
      ],
      en: [
        'survival', 'realityTV', 'meat', 'police', 'hiking', 'startup',
        'paranormal', 'philosophy', 'photo', 'latin', 'tools', 'hipster',
        'it', 'game', 'fantasy', 'cyberpunk', 'development', 'beer', 'cooking'
      ],
      es: [
        'supervivencia', 'telerealidad', 'carne', 'policia', 'senderismo', 'startup',
        'paranormal', 'filosofia', 'foto', 'latin', 'herramientas', 'hipster',
        'it', 'juego', 'fantasia', 'cyberpunk', 'desarrollo', 'cerveza', 'cocina'
      ]
    };

    // Récupérer les dictionnaires pour la langue courante
    dictionaries = dictionaryFiles[lang] || ['latin'];
    console.log('📂 Debug - Dictionnaires trouvés:', dictionaries);

    return dictionaries;
  } catch (error) {
    console.error('❌ Debug - Erreur lors de la récupération des dictionnaires:', error);
    return ['latin']; // Fallback to latin if error
  }
};
