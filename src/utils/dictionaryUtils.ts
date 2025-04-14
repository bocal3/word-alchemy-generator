
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
    // In a browser environment, we can't directly write to files
    // Here we'll use localStorage to simulate saving the dictionary
    // In a real production app, this would call an API endpoint
    
    // Store the dictionary in localStorage
    if (data.words) {
      localStorage.setItem(`dictionary_${name}`, JSON.stringify(data.words));
      
      // Add to list of created dictionaries if it's a new one
      const createdDictionaries = JSON.parse(localStorage.getItem('created_dictionaries') || '[]');
      if (!createdDictionaries.includes(name)) {
        createdDictionaries.push(name);
        localStorage.setItem('created_dictionaries', JSON.stringify(createdDictionaries));
      }
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
  
  // Return combined words
  return [...fileWords, ...parsedLocalWords];
};

// Discover all dictionary files
export const discoverDictionaries = async (): Promise<string[]> => {
  // In a real app, we would scan the directory
  // Here we'll use a predefined list of the core dictionaries
  const coreDictionaries = [
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
  
  // Get created dictionaries from localStorage
  const createdDictionariesJSON = localStorage.getItem('created_dictionaries');
  let createdDictionaries: string[] = [];
  
  if (createdDictionariesJSON) {
    try {
      createdDictionaries = JSON.parse(createdDictionariesJSON);
    } catch (e) {
      console.error('Error parsing created dictionaries:', e);
    }
  }
  
  // Combine core and created dictionaries
  return [...coreDictionaries, ...createdDictionaries];
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
    
    // In a real app, we would write to a file
    // Here we'll use localStorage to simulate file creation
    localStorage.setItem(`dictionary_${slug}`, JSON.stringify(words));
    
    // Add to list of created dictionaries
    const createdDictionaries = JSON.parse(localStorage.getItem('created_dictionaries') || '[]');
    if (!createdDictionaries.includes(slug)) {
      createdDictionaries.push(slug);
      localStorage.setItem('created_dictionaries', JSON.stringify(createdDictionaries));
    }
    
    return true;
  } catch (error) {
    console.error(`Error creating dictionary ${name}:`, error);
    return false;
  }
};

// Add words to an existing dictionary
export const addWordsToDictionary = async (name: string, newWords: string[]): Promise<boolean> => {
  try {
    // Get existing words
    const existingWords = await getDictionaryWords(name);
    
    // Combine and deduplicate
    const combinedWords = [...existingWords, ...newWords];
    const uniqueWords = [...new Set(combinedWords)];
    
    // Save back to storage
    return await saveDictionary(name, { words: uniqueWords });
  } catch (error) {
    console.error(`Error adding words to dictionary ${name}:`, error);
    return false;
  }
};
