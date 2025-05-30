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

// Get available dictionary files for the selected language
export const getAvailableDictionaryFiles = async (language: SupportedLanguage): Promise<string[]> => {
  try {
    // In a browser environment, we can't directly read the filesystem
    // Here we define the available dictionaries for each language
    const commonDictionaries = [
      'latin', 'games', 'survival', 'paranormal', 'fantasy', 'hiking',
      'meat', 'tools', 'development', 'it', 'police', 'cuisine',
      'photo', 'startup', 'cyberpunk', 'reality-tv', 'philosophy', 'beer'
    ];
    
    // Language-specific name mappings
    const languageMappings: Record<string, Record<string, string>> = {
      fr: {
        'games': 'jeu',
        'survival': 'survie',
        'hiking': 'randonnee',
        'tools': 'outils',
        'development': 'developpement',
        'meat': 'viande',
        'beer': 'biere',
        'reality-tv': 'telerealite',
        'cyberpunk': 'cyberpunk'
      },
      es: {
        'games': 'juegos',
        'survival': 'supervivencia',
        'hiking': 'senderismo',
        'tools': 'herramientas',
        'development': 'desarrollo',
        'meat': 'carne',
        'beer': 'cerveza',
        'reality-tv': 'telerrealidad',
        'cyberpunk': 'ciberpunk'
      }
    };
    
    // Map dictionary names based on language
    let availableDictionaries: string[] = commonDictionaries.map(dict => {
      if (language !== 'en' && languageMappings[language] && languageMappings[language][dict]) {
        return languageMappings[language][dict];
      }
      return dict;
    });
    
    return availableDictionaries;
  } catch (error) {
    console.error(`Error getting available dictionaries:`, error);
    return [];
  }
};

// Function to load dictionary data with language support
export const loadDictionary = async (name: string, language?: SupportedLanguage): Promise<Dictionary | null> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // Try to load from language-specific directory
    try {
      const module = await import(`../components/loremipsum/data/${lang}/${name}.json`);
      return module as Dictionary;
    } catch (languageError) {
      console.error(`Dictionary ${name} not found for language ${lang}`, languageError);
      
      // If we can't find it in the language folder, check user-created dictionaries
      const localWords = localStorage.getItem(`dictionary_${lang}_${name}`);
      if (localWords) {
        try {
          const parsedWords = JSON.parse(localWords);
          return { words: parsedWords };
        } catch (e) {
          console.error('Error parsing localStorage dictionary:', e);
          return null;
        }
      }
      
      // No dictionary found
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
    
    // In a browser environment, we can't directly write to files
    // Here we'll use localStorage to simulate saving the dictionary
    
    // Store the dictionary in localStorage with language prefix
    if (data.words) {
      localStorage.setItem(`dictionary_${lang}_${name}`, JSON.stringify(data.words));
      
      // Add to list of created dictionaries if it's a new one
      const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
      if (!createdDictionaries.includes(name)) {
        createdDictionaries.push(name);
        localStorage.setItem(`created_dictionaries_${lang}`, JSON.stringify(createdDictionaries));
      }
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

// Discover all dictionary files with language support
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  
  // Get available dictionaries for the current language
  const availableDictionaries = await getAvailableDictionaryFiles(lang);
  
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
  
  // Combine language-specific dictionaries and created dictionaries
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
