
import { useState } from 'react';
import { SupportedLanguage } from '@/contexts/LanguageContext';
import { loadDictionary, getCurrentLanguage, discoverDictionaries as utilsDiscoverDictionaries } from '@/utils/dictionaryUtils';

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
  language?: SupportedLanguage;
}

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
  generateSingleSentence = false,
  language
}: GenerateLoremParams): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  
  // Get the names of selected dictionaries
  const dictNames = Object.entries(selectedDictionaries)
    .filter(([_, isSelected]) => isSelected)
    .map(([name]) => name);
  
  if (dictNames.length === 0) {
    return ['Please select at least one dictionary.'];
  }

  // Load all selected dictionaries
  const loadedDictionaries = await Promise.all(
    dictNames.map(name => loadDictionary(name, lang))
  );
  
  // Filter out null dictionaries and combine all words
  const allWords = loadedDictionaries
    .filter(dict => dict !== null)
    .flatMap(dict => dict?.words || []);
  
  if (allWords.length === 0) {
    return ['No words found in selected dictionaries.'];
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
 * Discover dictionaries with language support
 * This is a wrapper around the utility function
 */
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  return await utilsDiscoverDictionaries(language);
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
      setGeneratedText(['An error occurred while generating text.']);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { generate, isGenerating, generatedText };
};
