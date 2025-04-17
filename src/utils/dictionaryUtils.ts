import { Dictionary } from '../components/loremipsum/utils/generateLorem';
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
export const loadDictionary = async (id: string, language?: string): Promise<Dictionary> => {
  const lang = language || getCurrentLanguage();
  
  // Try to load from localStorage first
  const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);
  if (localWords) {
    try {
      const words = JSON.parse(localWords);
      return { id, label: id, words };
    } catch (e) {
      console.error('Error parsing localStorage dictionary:', e);
    }
  }
  
  // If not in localStorage, try to load from language-specific JSON file
  try {
    const module = await import(`/components/loremipsum/data/${lang}/${id}.json`);
    return { id, label: id, words: module.words };
  } catch (error) {
    console.error(`Error loading dictionary ${id}:`, error);
    return { id, label: id, words: [] };
  }
};

// Function to save dictionary data
export const saveDictionary = (id: string, words: string[], language?: string): void => {
  const lang = language || getCurrentLanguage();
  const dictionary: Dictionary = {
    id,
    label: id,
    words: words
  };
  
  // Save to localStorage
  localStorage.setItem(`dictionary_${lang}_${id}`, JSON.stringify(words));
  
  // Update list of created dictionaries
  const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
  if (!createdDictionaries.includes(id)) {
    createdDictionaries.push(id);
    localStorage.setItem(`created_dictionaries_${lang}`, JSON.stringify(createdDictionaries));
  }
  
  // Create and download JSON file
  const blob = new Blob([JSON.stringify(dictionary, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Get combined words from file and localStorage with language support
export const getDictionaryWords = async (id: string, language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  const fileDict = await loadDictionary(id, lang);
  const fileWords = fileDict?.words || [];
  
  // Check localStorage for additional words
  const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);
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
export const removeWordFromDictionary = async (dictionaryId: string, word: string): Promise<void> => {
  try {
    const words = await getDictionaryWords(dictionaryId);
    const updatedWords = words.filter(w => w !== word);
    await saveDictionary(dictionaryId, updatedWords);
  } catch (error) {
    console.error(`Error removing word from dictionary ${dictionaryId}:`, error);
    throw error;
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
export const discoverDictionaries = async (lang: SupportedLanguage): Promise<Dictionary[]> => {
  const dictionaries: Dictionary[] = [];
  const basePath = `/data/${lang}`;
  
  try {
    const dictionaryFiles = {
      fr: [
        'survie.json', 'telerealite.json', 'viande.json', 'police.json',
        'randonnee.json', 'startup.json', 'paranormal.json', 'philosophie.json',
        'photo.json', 'latin.json', 'outil.json', 'hipster.json', 'it.json',
        'jeu.json', 'fantasy.json', 'cyberpunk.json', 'developpement.json',
        'biere.json', 'cuisine.json'
      ],
      en: [
        'survival.json', 'realityTV.json', 'meat.json', 'police.json',
        'hiking.json', 'startup.json', 'paranormal.json', 'philosophy.json',
        'photo.json', 'latin.json', 'tool.json', 'hipster.json', 'it.json',
        'game.json', 'fantasy.json', 'cyberpunk.json', 'development.json',
        'beer.json', 'cooking.json'
      ],
      es: [
        'supervivencia.json', 'telerealidad.json', 'carne.json', 'policía.json',
        'senderismo.json', 'startup.json', 'paranormal.json', 'filosofía.json',
        'photo.json', 'latin.json', 'herramienta.json', 'hipster.json', 'it.json',
        'juego.json', 'fantasy.json', 'cyberpunk.json', 'desarrollo.json',
        'cerveza.json', 'cocina.json'
      ]
    };

    const files = dictionaryFiles[lang as keyof typeof dictionaryFiles] || [];
    
    for (const file of files) {
      try {
        const response = await fetch(`${basePath}/${file}`);
        if (response.ok) {
          const data = await response.json();
          const id = file.replace('.json', '');
          dictionaries.push({
            id,
            label: id,
            words: data.words || [],
            description: data.description || ''
          });
        }
      } catch (error) {
        console.error(`Error loading dictionary ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Error discovering dictionaries:', error);
  }

  return dictionaries;
}

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
export const createDictionary = async (id: string, words: string[], language?: SupportedLanguage): Promise<boolean> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // Generate a slug from the dictionary id
    const slug = id
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
    console.error(`Error creating dictionary ${id}:`, error);
    return false;
  }
};

// Add words to an existing dictionary
export const addWordsToDictionary = async (dictionaryId: string, newWords: string[]): Promise<void> => {
  try {
    const existingWords = await getDictionaryWords(dictionaryId);
    const uniqueWords = [...new Set([...existingWords, ...newWords])];
    await saveDictionary(dictionaryId, uniqueWords);
  } catch (error) {
    console.error(`Error adding words to dictionary ${dictionaryId}:`, error);
    throw error;
  }
};

// Function to import dictionary from file
export const importDictionary = async (file: File): Promise<void> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!data.id || !data.label || !Array.isArray(data.words)) {
      throw new Error('Invalid dictionary format');
    }
    
    const dictionary: Dictionary = {
      id: data.id,
      label: data.label,
      words: data.words
    };
    
    await saveDictionary(dictionary.id, dictionary.words);
  } catch (error) {
    console.error('Error importing dictionary:', error);
    throw error;
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
