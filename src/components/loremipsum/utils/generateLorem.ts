import { useState } from 'react';
import { SupportedLanguage } from '@/contexts/LanguageContext';

export interface Dictionary {
  id: string;
  label: string;
  words: string[];
  description?: string;
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
    const parsedLang = JSON.parse(storedLang) as SupportedLanguage;st parsedLang = JSON.parse(storedLang) as SupportedLanguage;
    return ['fr', 'en', 'es'].includes(parsedLang) ? parsedLang : 'en';en';
  } catch (error) {
    console.error('Error getting current language:', error);Error getting current language:', error);
    return 'en';
  }
};

// Function to load dictionary data with language supportoad dictionary data with language support
const loadDictionary = async (id: string, language?: SupportedLanguage): Promise<Dictionary> => {ortedLanguage): Promise<Dictionary> => {
  try {
    const lang = language || getCurrentLanguage();st lang = language || getCurrentLanguage();
    // Try to load from language-specific directory first
    try {
      const module = await import(`/components/loremipsum/data/${lang}/${id}.json`);/data/${lang}/${id}.json`);
      const fileDict = module as Dictionary;
      // Check if we have additional words in localStorage
      const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);_${lang}_${id}`);
      if (localWords) {(localWords) {
        try {
          const parsedLocalWords = JSON.parse(localWords);
          return {
            id,
            label: id,
            words: [...fileDict.words, ...parsedLocalWords]fileDict.words, ...parsedLocalWords]
          };
        } catch (e) {
          console.error('Error parsing localStorage dictionary:', e);ry:', e);
          return { id, label: id, words: fileDict.words };n { id, label: id, words: fileDict.words };
        }
      }
      return { id, label: id, words: fileDict.words };
    } catch (importError) {ror) {
      // If language-specific file doesn't exist, try the default directoryectory
      try {
        const module = await import(`/components/loremipsum/data/${id}.json`);ipsum/data/${id}.json`);
        const fileDict = module as Dictionary;dule as Dictionary;
        // Check if we have additional words in localStorage
        const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);onary_${lang}_${id}`);
        if (localWords) {
          try {
            const parsedLocalWords = JSON.parse(localWords); const parsedLocalWords = JSON.parse(localWords);
            return {
              id,
              label: id,
              words: [...fileDict.words, ...parsedLocalWords]]
            };
          } catch (e) {
            console.error('Error parsing localStorage dictionary:', e);le.error('Error parsing localStorage dictionary:', e);
            return { id, label: id, words: fileDict.words };
          }
        }
        return { id, label: id, words: fileDict.words };el: id, words: fileDict.words };
      } catch (defaultImportError) {
        // If no file exists, check localStorage only
        const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);s = localStorage.getItem(`dictionary_${lang}_${id}`);
        if (localWords) {
          try {
            const parsedWords = JSON.parse(localWords);
            return { id, label: id, words: parsedWords };words: parsedWords };
          } catch (e) {
            console.error('Error parsing localStorage dictionary:', e);
            return { id, label: id, words: [] };words: [] };
          }
        }
        // No file and no localStorage data
        return { id, label: id, words: [] };bel: id, words: [] };
      }
    }
  } catch (error) {
    console.error(`Error loading dictionary ${id}:`, error);
    return { id, label: id, words: [] };
  }
};

// This function generates random sentences from the selected dictionaries from the selected dictionaries
const generateRandomSentence = (words: string[], minWords: number = 5, maxWords: number = 15): string => {g[], minWords: number = 5, maxWords: number = 15): string => {
  const sentenceLength = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;s - minWords + 1)) + minWords;
  let sentence = '';
  for (let i = 0; i < sentenceLength; i++) { < sentenceLength; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];s.length)];
    
    // Capitalize the first word of the sentence
    if (i === 0) {
      sentence += randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
    } else {
      sentence += randomWord;
    }
    // Add comma randomly (but not as the last character)
    if (i < sentenceLength - 1 && Math.random() < 0.1) {if (i < sentenceLength - 1 && Math.random() < 0.1) {
      sentence += ', ';
    } else if (i < sentenceLength - 1) {
      sentence += ' ';
    }
  }
  // Add period at the end of the sentence
  sentence += '.';= '.';
  
  return sentence;
};

// Main function to generate lorem ipsum text
export const generateLorem = async ({ rem = async ({ 
  selectedDictionaries, 
  paragraphCount,
  wordsPerSentence,
  sentencesPerParagraph,graph,
  generateSingleSentence = false,generateSingleSentence = false,
  language,
}: GenerateLoremParams): Promise<string[]> => {rams): Promise<string[]> => {
  const lang = language || getCurrentLanguage();const lang = language || getCurrentLanguage();
  // Get the names of selected dictionaries
  const dictNames = Object.entries(selectedDictionaries)ectedDictionaries)
    .filter(([_, isSelected]) => isSelected)ted]) => isSelected)
    .map(([name]) => name);
  if (dictNames.length === 0) {
    return ['Please select at least one dictionary.'];ct at least one dictionary.'];
  }
  // Load all selected dictionariested dictionaries
  const loadedDictionaries = await Promise.all(dictNames.map(name => loadDictionary(name, lang)));dictNames.map(name => loadDictionary(name, lang)));
  
  // Combine all words from selected dictionariesne all words from selected dictionaries
  const allWords = loadedDictionaries.flatMap(dict => dict.words || []);ict => dict.words || []);
  
  if (allWords.length === 0) {
    return ['No words found in selected dictionaries.'];tionaries.'];
  }
  // If we're generating just a single sentencence
  if (generateSingleSentence) {
    const sentence = generateRandomSentence( const sentence = generateRandomSentence(
      allWords, 
      wordsPerSentence.min, 
      wordsPerSentence.max
    );  );
    return [sentence];
  }
  // Generate paragraphs// Generate paragraphs
  const paragraphs = [];
  
  for (let p = 0; p < paragraphCount; p++) {or (let p = 0; p < paragraphCount; p++) {
    // Each paragraph has between min to max sentenceseen min to max sentences
    const sentenceCount = Math.floor(Math.random() * 
      (sentencesPerParagraph.max - sentencesPerParagraph.min + 1)) + x - sentencesPerParagraph.min + 1)) + 
      sentencesPerParagraph.min;
    let paragraph = '';
    for (let s = 0; s < sentenceCount; s++) {eCount; s++) {
      paragraph += generateRandomSentence(
        allWords, , 
        wordsPerSentence.min, , 
        wordsPerSentence.maxax
      ););
      if (s < sentenceCount - 1) {unt - 1) {
        paragraph += ' ';;
      }    }
    }
    paragraphs.push(paragraph);
  }
    
  return paragraphs;
};
  
/**
 * Discover dictionaries with language supportport
 * Updated to check if dictionary files actually exist for the current languagedictionary files actually exist for the current language
 */
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {(language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();guage || getCurrentLanguage();
  let availableDictionaries: string[] = [];tring[] = [];
  // Check which dictionaries actually exist for the current language
  for (const dict of potentialDictionaries) { Découverte des dictionnaires pour la langue : ${lang}`);
    try {
      // Latin is in the root directory, so handle it speciallyionaries) {
      await import(`../data/${lang}/${dict}.json`);
      availableDictionaries.push(dict); JSON existe pour la langue donnée
    } catch (e) { await import(`../data/${lang}/${dict}.json`);
      // Skip if import fails (dictionary doesn't exist)  availableDictionaries.push(dict);
    }re trouvé : ${dict}`);
  } } catch (e) {
  // Get created dictionaries from localStorage with language prefix    console.warn(`⚠️ Dictionnaire non trouvé pour ${lang} : ${dict}`);
  const createdDictionariesJSON = localStorage.getItem(`created_dictionaries_${lang}`);
  let createdDictionaries: string[] = [];
  if (createdDictionariesJSON) {
    try {/ Vérifiez les dictionnaires créés dans localStorage
      createdDictionaries = JSON.parse(createdDictionariesJSON);
    } catch (e) {
      console.error('Error parsing created dictionaries:', e);
    }
  }
  // Combine available core dictionaries and created dictionariesuvés : ${createdDictionaries}`);
  return [...availableDictionaries, ...createdDictionaries];ch (e) {
};es créés :', e);

// Get potential dictionaries from files
export const getPotentialDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  console.log('🔍 Debug - Langue courante pour les dictionnaires potentiels :', lang);Dictionaries, ...createdDictionaries];
  let dictionaries: string[] = [];Liste finale des dictionnaires pour ${lang} :`, allDictionaries);

  try {
    const response = await fetch(`/components/loremipsum/data/${lang}/`);
    if (!response.ok) {
      console.error(`❌ Erreur lors de la récupération des fichiers pour ${lang}`);
      return [];tring[]> => {
    }uage();

    const text = await response.text();];
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');lang}/`);
    const links = doc.querySelectorAll('a');ON files in the language directory

    links.forEach(link => {
      const filename = link.textContent;
      if (filename && filename.endsWith('.json')) {  const links = doc.querySelectorAll('a');
        const id = filename.replace('.json', '');ang);
        dictionaries.push(id);
        console.log(`📄 Fichier trouvé : ${id}`);
      }
    });

    return dictionaries;ouvé:', id);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des dictionnaires potentiels :', error);
    return [];
  }
};ectory

// Get available dictionaries from localStorage
export const getAvailableDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();s);
  // Get potential dictionaries from files
  const potentialDictionaries = await getPotentialDictionaries(lang);
  console.log('📂 Debug - Dictionnaires potentiels:', potentialDictionaries);
  Storage
  // Get created dictionaries from localStorageuage?: SupportedLanguage): Promise<string[]> => {
  const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
  
  // Combine and return unique dictionaries= await getPotentialDictionaries(lang);
  return [...new Set([...potentialDictionaries, ...createdDictionaries])];tentiels:', potentialDictionaries);
};

// Custom hook to use the generatorted_dictionaries_${lang}`) || '[]');
export const useLoremGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);dictionaries
  const [generatedText, setGeneratedText] = useState<string[]>([]);ies, ...createdDictionaries])];

  const generate = async (params: GenerateLoremParams) => {
    setIsGenerating(true);
    try {
      const result = await generateLorem(params);false);
      setGeneratedText(result);g[]>([]);
    } catch (error) {
      console.error('Error generating lorem ipsum:', error);
      setGeneratedText(['An error occurred while generating text.']);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, generatedText };
};    setIsGenerating(false);
