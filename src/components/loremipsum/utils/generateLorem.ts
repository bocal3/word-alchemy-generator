
import { useState, useEffect } from 'react';

export interface Dictionary {
  words: string[];
}

export interface GenerateLoremParams {
  selectedDictionaries: Record<string, boolean>;
  paragraphCount: number;
}

// Function to load dictionary data
const loadDictionary = async (name: string): Promise<Dictionary> => {
  try {
    // Dynamic import of dictionary files
    const module = await import(`../data/${name}.json`);
    return module as Dictionary;
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
export const generateLorem = async ({ selectedDictionaries, paragraphCount }: GenerateLoremParams): Promise<string[]> => {
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

  // Generate paragraphs
  const paragraphs = [];
  
  for (let p = 0; p < paragraphCount; p++) {
    // Each paragraph has between 3 to 7 sentences
    const sentenceCount = Math.floor(Math.random() * 5) + 3;
    
    let paragraph = '';
    for (let s = 0; s < sentenceCount; s++) {
      paragraph += generateRandomSentence(allWords);
      
      if (s < sentenceCount - 1) {
        paragraph += ' ';
      }
    }
    
    paragraphs.push(paragraph);
  }
  
  return paragraphs;
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
