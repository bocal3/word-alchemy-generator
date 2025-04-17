import type { Dictionary } from "@/components/loremipsum/utils/generateLorem";
import { SupportedLanguage } from "@/contexts/LanguageContext";

// Function to get current language
export const getCurrentLanguage = (): SupportedLanguage => {
  const storedLang = localStorage.getItem('psum-language');
  if (storedLang) {
    try {
      const lang = JSON.parse(storedLang) as SupportedLanguage;
      return ['fr', 'en', 'es'].includes(lang) ? lang as SupportedLanguage : 'en';
    } catch (e) {
      console.error('Error parsing stored language:', e);
      return 'en';
    }
  }
  
  // Default to browser language or English
  const browserLang = navigator.language.split('-')[0];
  return ['fr', 'en', 'es'].includes(browserLang) ? browserLang as SupportedLanguage : 'en';
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
    } catch (languageError) {
      // Fallback to default location
      const module = await import(`../components/loremipsum/data/${name}.json`);
      return module as Dictionary;
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

// Dictionary name mappings for different languages
const dictionaryNameMappings: Record<SupportedLanguage, Record<string, string>> = {
  fr: {
    latin: 'latin',
    viande: 'viande',
    jeu: 'jeu',
    biere: 'biere',
    hipster: 'hipster',
    survie: 'survie',
    randonnee: 'randonnee',
    outils: 'outils',
    developpement: 'developpement',
    it: 'it',
    police: 'police',
    cuisine: 'cuisine',
    photo: 'photo',
    paranormal: 'paranormal',
    startup: 'startup',
    fantasy: 'fantasy',
    cyberpunk: 'cyberpunk',
    telerealite: 'telerealite',
    philosophie: 'philosophie'
  },
  en: {
    latin: 'latin',
    viande: 'meat',
    jeu: 'game',
    biere: 'beer',
    hipster: 'hipster',
    survie: 'survival',
    randonnee: 'hiking',
    outils: 'tools',
    developpement: 'development',
    it: 'it',
    police: 'police',
    cuisine: 'cooking',
    photo: 'photo',
    paranormal: 'paranormal',
    startup: 'startup',
    fantasy: 'fantasy',
    cyberpunk: 'cyberpunk',
    telerealite: 'realityTV',
    philosophie: 'philosophy'
  },
  es: {
    latin: 'latin',
    viande: 'carne',
    jeu: 'juego',
    biere: 'cerveza',
    hipster: 'hipster',
    survie: 'supervivencia',
    randonnee: 'senderismo',
    outils: 'herramienta',
    developpement: 'desarrollo',
    it: 'it',
    police: 'policía',
    cuisine: 'cocina',
    photo: 'photo',
    paranormal: 'paranormal',
    startup: 'startup',
    fantasy: 'fantasy',
    cyberpunk: 'cyberpunk',
    telerealite: 'telerealidad',
    philosophie: 'filosofía'
  }
};

// Discover all dictionary files with language support - check if files actually exist
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  let availableDictionaries: string[] = [];
  
  // Get the dictionary name mappings for the current language
  const mappings = dictionaryNameMappings[lang];
  
  // Check which dictionaries actually exist for the current language
  for (const [frName, localizedName] of Object.entries(mappings)) {
    try {
      // Latin is in the root directory, so handle it specially
      if (frName === 'latin') {
        try {
          await import(`../components/loremipsum/data/latin.json`);
          availableDictionaries.push('latin');
        } catch (e) {
          // Latin dictionary not found
        }
      } else {
        // For other dictionaries, check in language-specific folder
        try {
          await import(`../components/loremipsum/data/${lang}/${localizedName}.json`);
          availableDictionaries.push(frName); // We use the French name as the ID
        } catch (e) {
          // Dictionary not found for this language
        }
      }
    } catch (e) {
      // Skip if import fails (dictionary doesn't exist)
    }
  }
  
  // Get created dictionaries from localStorage
  const createdDictionariesJSON = localStorage.getItem(`created_dictionaries_${lang}`);
  let createdDictionaries: string[] = [];
  
  if (createdDictionariesJSON) {
    try {
      createdDictionaries = JSON.parse(createdDictionariesJSON);
    } catch (e) {
      console.error('Error parsing created dictionaries:', e);
    }
  }
  
  // Combine available core dictionaries and created dictionaries
  return [...availableDictionaries, ...createdDictionaries];
};

// Get all available dictionaries with metadata
export const getAllDictionaries = async (language?: SupportedLanguage): Promise<{ id: string; label: string; count: number }[]> => {
  try {
    const lang = language || getCurrentLanguage();
    const dictionaries = await discoverDictionaries(lang);
    
    // Map dictionaries to metadata objects
    const dictionariesWithMeta = await Promise.all(
      dictionaries.map(async (id) => {
        const words = await getDictionaryWords(id, lang);
        return {
          id,
          label: id.charAt(0).toUpperCase() + id.slice(1),
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
