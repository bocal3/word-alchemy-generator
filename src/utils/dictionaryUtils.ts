
import type { Dictionary } from "@/components/loremipsum/utils/generateLorem";

// Function to load dictionary data
export const loadDictionary = async (name: string): Promise<Dictionary | null> => {
  try {
    // Dynamic import of dictionary files
    const module = await import(`../components/loremipsum/data/${name}.json`);
    return module as Dictionary;
  } catch (error) {
    console.error(`Error loading dictionary ${name}:`, error);
    return null;
  }
};

// Function to save dictionary data
export const saveDictionary = async (name: string, data: Partial<Dictionary>): Promise<boolean> => {
  try {
    // In a real app, this would save to a backend or localStorage
    // Since we can't write to files in the browser directly, we'll simulate saving
    // and show a message to the user about the limitation
    console.log(`Would save dictionary ${name}:`, data);
    
    // Let's save to localStorage for persistence within the session
    if (data.words) {
      localStorage.setItem(`dictionary_${name}`, JSON.stringify(data.words));
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving dictionary ${name}:`, error);
    return false;
  }
};

// Get combined words from file and localStorage
export const getDictionaryWords = async (name: string): Promise<string[]> => {
  const fileDict = await loadDictionary(name);
  const fileWords = fileDict?.words || [];
  
  // Check localStorage for additional words
  const localWords = localStorage.getItem(`dictionary_${name}`);
  let parsedLocalWords: string[] = [];
  
  if (localWords) {
    try {
      parsedLocalWords = JSON.parse(localWords);
    } catch (e) {
      console.error('Error parsing localStorage dictionary:', e);
    }
  }
  
  // Combine and deduplicate words
  const allWords = [...fileWords, ...parsedLocalWords];
  return [...new Set(allWords)]; // Remove duplicates
};

// Discover all dictionary files in the data directory
export const discoverDictionaries = async (): Promise<string[]> => {
  // This is a fixed list based on the structure of the project
  // In a real app, this would be dynamically generated from the server
  return [
    'latin',
    'viande',
    'jeu',
    'biere',
    'hipster',
    'survie',
    'randonnee',
    'outils',
    'developpement',
    'it',
    'police',
    'cuisine',
    'photo',
    'paranormal',
    'startup',
    'fantasy',
    'cyberpunk',
    'telerealite',
    'philosophie'
  ];
};

// Get all available dictionaries with metadata
export const getAllDictionaries = async (): Promise<{ id: string; label: string; count: number }[]> => {
  try {
    const dictionaries = await discoverDictionaries();
    
    // Map dictionaries to metadata objects
    const dictionariesWithMeta = await Promise.all(
      dictionaries.map(async (id) => {
        const words = await getDictionaryWords(id);
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

// Create a new dictionary
export const createDictionary = async (name: string, words: string[]): Promise<boolean> => {
  try {
    // Generate a slug from the dictionary name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Store in localStorage
    localStorage.setItem(`dictionary_${slug}`, JSON.stringify(words));
    
    // Also add to the list of custom dictionaries
    const customDicts = localStorage.getItem('custom_dictionaries') || '[]';
    let parsedCustomDicts: string[] = [];
    
    try {
      parsedCustomDicts = JSON.parse(customDicts);
    } catch (e) {
      console.error('Error parsing custom dictionaries:', e);
    }
    
    if (!parsedCustomDicts.includes(slug)) {
      parsedCustomDicts.push(slug);
      localStorage.setItem('custom_dictionaries', JSON.stringify(parsedCustomDicts));
    }
    
    return true;
  } catch (error) {
    console.error(`Error creating dictionary ${name}:`, error);
    return false;
  }
};
