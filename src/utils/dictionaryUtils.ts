
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
// In a real app, this would save to a backend or localStorage
export const saveDictionary = async (name: string, data: Partial<Dictionary>): Promise<boolean> => {
  try {
    // For now, this is a mock function that pretends to save data
    // In a real application, this would save to localStorage or a backend API
    console.log(`Saving dictionary ${name}:`, data);
    return true;
  } catch (error) {
    console.error(`Error saving dictionary ${name}:`, error);
    return false;
  }
};

// Get all available dictionaries
export const getAllDictionaries = async (): Promise<{ id: string; label: string; count: number }[]> => {
  try {
    // This would normally fetch from an API or backend
    // For now, we'll just return a hard-coded list
    return [
      { id: 'latin', label: 'Latin', count: 200 },
      { id: 'viande', label: 'Viande', count: 120 },
      { id: 'jeu', label: 'Jeu', count: 180 },
      { id: 'biere', label: 'Bière', count: 90 },
      { id: 'hipster', label: 'Hipster', count: 150 },
      { id: 'developpement', label: 'Développement', count: 220 },
      { id: 'it', label: 'IT', count: 180 },
      { id: 'cuisine', label: 'Cuisine', count: 130 },
      { id: 'fantasy', label: 'Fantasy', count: 170 },
      { id: 'cyberpunk', label: 'Cyberpunk', count: 140 },
      { id: 'philosophie', label: 'Philosophie', count: 110 }
    ];
  } catch (error) {
    console.error('Error getting dictionaries:', error);
    return [];
  }
};
