
import { useState, useEffect } from 'react';

export interface Dictionary {
  words: string[];
}

export interface GenerateLoremParams {
  selectedDictionaries: Record<string, boolean>;
  paragraphCount: number;
  wordsPerSentence: {
    min: number;
    max: number;
  };
  sentencesPerParagraph: {
    min: number;
    max: number;
  };
  generateSingleSentence?: boolean;
}

// Function to load dictionary data
const loadDictionary = async (name: string): Promise<Dictionary> => {
  try {
    // Check localStorage first for custom dictionaries
    const localWords = localStorage.getItem(`dictionary_${name}`);
    if (localWords) {
      try {
        const parsedWords = JSON.parse(localWords);
        return { words: parsedWords };
      } catch (e) {
        console.error('Error parsing localStorage dictionary:', e);
      }
    }
    
    // Try dynamic import of dictionary files
    try {
      const module = await import(`../data/${name}.json`);
      return module as Dictionary;
    } catch (importError) {
      console.error(`No dictionary file found for ${name}, using localStorage only`);
      return { words: [] }; 
    }
  } catch (error) {
    console.error(`Error loading dictionary ${name}:`, error);
    return { words: [] };
  }
};

// This function generates random sentences from the selected dictionaries
const generateRandomSentence = (words: string[], minWords: number = 5, maxWords: number = 15): string => {
  const sentenceLength = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let sentence = '';
  
  for (let i = 0; i < sentenceLength; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    // Capitalize the first word of the sentence
    if (i === 0) {
      sentence += randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
    } else {
      sentence += randomWord;
    }
    
    // Add comma randomly (but not as the last character)
    if (i < sentenceLength - 1 && Math.random() < 0.1) {
      sentence += ', ';
    } else if (i < sentenceLength - 1) {
      sentence += ' ';
    }
  }
  
  // Add period at the end of the sentence
  sentence += '.';
  
  return sentence;
};

// Main function to generate lorem ipsum text
export const generateLorem = async ({ 
  selectedDictionaries, 
  paragraphCount,
  wordsPerSentence,
  sentencesPerParagraph,
  generateSingleSentence = false
}: GenerateLoremParams): Promise<string[]> => {
  // Get the names of selected dictionaries
  const dictNames = Object.entries(selectedDictionaries)
    .filter(([_, isSelected]) => isSelected)
    .map(([name]) => name);
  
  if (dictNames.length === 0) {
    return ['Veuillez sélectionner au moins un dictionnaire.'];
  }

  // Load all selected dictionaries
  const loadedDictionaries = await Promise.all(dictNames.map(name => loadDictionary(name)));
  
  // Combine all words from selected dictionaries
  const allWords = loadedDictionaries.flatMap(dict => dict.words || []);
  
  if (allWords.length === 0) {
    return ['Aucun mot trouvé dans les dictionnaires sélectionnés.'];
  }

  // If we're generating just a single sentence
  if (generateSingleSentence) {
    const sentence = generateRandomSentence(
      allWords, 
      wordsPerSentence.min, 
      wordsPerSentence.max
    );
    return [sentence];
  }

  // Generate paragraphs
  const paragraphs = [];
  
  for (let p = 0; p < paragraphCount; p++) {
    // Each paragraph has between min to max sentences
    const sentenceCount = Math.floor(Math.random() * 
      (sentencesPerParagraph.max - sentencesPerParagraph.min + 1)) + 
      sentencesPerParagraph.min;
    
    let paragraph = '';
    for (let s = 0; s < sentenceCount; s++) {
      paragraph += generateRandomSentence(
        allWords, 
        wordsPerSentence.min, 
        wordsPerSentence.max
      );
      
      if (s < sentenceCount - 1) {
        paragraph += ' ';
      }
    }
    
    paragraphs.push(paragraph);
  }
  
  return paragraphs;
};

/**
 * Découvre dynamiquement les dictionnaires disponibles dans le dossier data
 * @returns Un tableau contenant les noms des dictionnaires disponibles
 */
export const discoverDictionaries = async (): Promise<string[]> => {
  // This is a fixed list based on the project structure
  const baseDictionaries = [
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
  
  // Get custom dictionaries from localStorage
  const customDictsString = localStorage.getItem('custom_dictionaries');
  let customDicts: string[] = [];
  
  if (customDictsString) {
    try {
      const parsed = JSON.parse(customDictsString);
      if (Array.isArray(parsed)) {
        customDicts = parsed;
      }
    } catch (e) {
      console.error('Error parsing custom dictionaries:', e);
    }
  }
  
  // Combine base and custom dictionaries
  return [...baseDictionaries, ...customDicts];
};

// Custom hook to use the generator
export const useLoremGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string[]>([]);
  
  const generate = async (params: GenerateLoremParams) => {
    setIsGenerating(true);
    try {
      const result = await generateLorem(params);
      setGeneratedText(result);
    } catch (error) {
      console.error('Error generating lorem ipsum:', error);
      setGeneratedText(['Une erreur est survenue lors de la génération du texte.']);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { generate, isGenerating, generatedText };
};
