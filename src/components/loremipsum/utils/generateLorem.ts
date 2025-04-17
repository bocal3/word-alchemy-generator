import { useState } from 'react';
import { SupportedLanguage } from '@/contexts/LanguageContext';

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

// Function to get current language from localStorage
const getCurrentLanguage = (): SupportedLanguage => {
  try {
    const storedLang = localStorage.getItem('psum-language');
    if (!storedLang) return 'en';
    
    const parsedLang = JSON.parse(storedLang) as SupportedLanguage;
    return ['fr', 'en', 'es'].includes(parsedLang) ? parsedLang : 'en';
  } catch (error) {
    console.error('Error getting current language:', error);
    return 'en';
  }
};

// Function to load dictionary data with language support
const loadDictionary = async (name: string, language?: SupportedLanguage): Promise<Dictionary> => {
  try {
    const lang = language || getCurrentLanguage();
    
    // Try to load from language-specific directory first
    try {
      const module = await import(`../data/${lang}/${name}.json`);
      const fileDict = module as Dictionary;
      
      // Check if we have additional words in localStorage
      const localWords = localStorage.getItem(`dictionary_${lang}_${name}`);
      if (localWords) {
        try {
          const parsedLocalWords = JSON.parse(localWords);
          return { 
            words: [...fileDict.words, ...parsedLocalWords] 
          };
        } catch (e) {
          console.error('Error parsing localStorage dictionary:', e);
          return fileDict;
        }
      }
      
      return fileDict;
    } catch (importError) {
      // If language-specific file doesn't exist, try the default directory
      try {
        const module = await import(`../data/${name}.json`);
        const fileDict = module as Dictionary;
        
        // Check if we have additional words in localStorage
        const localWords = localStorage.getItem(`dictionary_${lang}_${name}`);
        if (localWords) {
          try {
            const parsedLocalWords = JSON.parse(localWords);
            return { 
              words: [...fileDict.words, ...parsedLocalWords] 
            };
          } catch (e) {
            console.error('Error parsing localStorage dictionary:', e);
            return fileDict;
          }
        }
        
        return fileDict;
      } catch (defaultImportError) {
        // If no file exists, check localStorage only
        const localWords = localStorage.getItem(`dictionary_${lang}_${name}`);
        if (localWords) {
          try {
            const parsedWords = JSON.parse(localWords);
            return { words: parsedWords };
          } catch (e) {
            console.error('Error parsing localStorage dictionary:', e);
            return { words: [] };
          }
        }
        
        // No file and no localStorage data
        return { words: [] };
      }
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
  const loadedDictionaries = await Promise.all(dictNames.map(name => loadDictionary(name, lang)));
  
  // Combine all words from selected dictionaries
  const allWords = loadedDictionaries.flatMap(dict => dict.words || []);
  
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
 * Updated to check if dictionary files actually exist for the current language
 */
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  let availableDictionaries: string[] = [];
  
  // Core dictionaries that might be available
  const potentialDictionaries = [
    'latin', // Latin is in the root directory
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
  
  // Check which dictionaries actually exist for the current language
  for (const dict of potentialDictionaries) {
    try {
      // Latin is in the root directory, so handle it specially
      if (dict === 'latin') {
        try {
          await import(`../data/latin.json`);
          availableDictionaries.push('latin');
        } catch (e) {
          // Latin dictionary not found
        }
      } else {
        // For other dictionaries, check in language-specific folder
        try {
          await import(`../data/${lang}/${dict}.json`);
          availableDictionaries.push(dict);
        } catch (e) {
          // Dictionary not found for this language
        }
      }
    } catch (e) {
      // Skip if import fails (dictionary doesn't exist)
    }
  }
  
  // Get created dictionaries from localStorage with language prefix
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
