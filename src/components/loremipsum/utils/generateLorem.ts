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
const getCurrentLanguage = (): SupportedLanguage => {'english','french', 'spanish'];
  try {
    const storedLang = localStorage.getItem('psum-language');
    if (!storedLang) return 'en';pportedLanguage => {
    y {
    const parsedLang = JSON.parse(storedLang) as SupportedLanguage;
    return ['fr', 'en', 'es'].includes(parsedLang) ? parsedLang : 'en';
  } catch (error) {
    console.error('Error getting current language:', error);nguage;
    return 'en';, 'en', 'es'].includes(parsedLang) ? parsedLang : 'en';
  } catch (error) {
};  console.error('Error getting current language:', error);
    return 'en';
// Function to load dictionary data with language support
const loadDictionary = async (id: string, language?: SupportedLanguage): Promise<Dictionary> => {
  try {
    const lang = language || getCurrentLanguage();support
    t loadDictionary = async (id: string, language?: SupportedLanguage): Promise<Dictionary> => {
    // Try to load from language-specific directory first
    try { lang = language || getCurrentLanguage();
      const module = await import(`/components/loremipsum/data/${lang}/${id}.json`);
      const fileDict = module as Dictionary;rectory first
      y {
      // Check if we have additional words in localStoragedata/${lang}/${id}.json`);
      const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);
      if (localWords) {
        try {k if we have additional words in localStorage
          const parsedLocalWords = JSON.parse(localWords);${lang}_${id}`);
          return { s) {
            id,
            label: id,LocalWords = JSON.parse(localWords);
            words: [...fileDict.words, ...parsedLocalWords] 
          };id,
        } catch (e) {,
          console.error('Error parsing localStorage dictionary:', e);
          return { id, label: id, words: fileDict.words };
        } catch (e) {
      }   console.error('Error parsing localStorage dictionary:', e);
          return { id, label: id, words: fileDict.words };
      return { id, label: id, words: fileDict.words };
    } catch (importError) {
      // If language-specific file doesn't exist, try the default directory
      try {n { id, label: id, words: fileDict.words };
        const module = await import(`/components/loremipsum/data/${id}.json`);
        const fileDict = module as Dictionary;st, try the default directory
        y {
        // Check if we have additional words in localStoragedata/${id}.json`);
        const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);
        if (localWords) {
          try {k if we have additional words in localStorage
            const parsedLocalWords = JSON.parse(localWords);${lang}_${id}`);
            return { s) {
              id,
              label: id,LocalWords = JSON.parse(localWords);
              words: [...fileDict.words, ...parsedLocalWords] 
            };id,
          } catch (e) {,
            console.error('Error parsing localStorage dictionary:', e);
            return { id, label: id, words: fileDict.words };
          } catch (e) {
        }   console.error('Error parsing localStorage dictionary:', e);
            return { id, label: id, words: fileDict.words };
        return { id, label: id, words: fileDict.words };
      } catch (defaultImportError) {
        // If no file exists, check localStorage only
        const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);
        if (localWords) {ortError) {
          try {o file exists, check localStorage only
            const parsedWords = JSON.parse(localWords);nary_${lang}_${id}`);
            return { id, label: id, words: parsedWords };
          } catch (e) {
            console.error('Error parsing localStorage dictionary:', e);
            return { id, label: id, words: [] };dWords };
          } catch (e) {
        }   console.error('Error parsing localStorage dictionary:', e);
            return { id, label: id, words: [] };
        // No file and no localStorage data
        return { id, label: id, words: [] };
      } 
    }   // No file and no localStorage data
  } catch (error) {, label: id, words: [] };
    console.error(`Error loading dictionary ${id}:`, error);
    return { id, label: id, words: [] };
  } catch (error) {
};  console.error(`Error loading dictionary ${id}:`, error);
    return { id, label: id, words: [] };
// This function generates random sentences from the selected dictionaries
const generateRandomSentence = (words: string[], minWords: number = 5, maxWords: number = 15): string => {
  const sentenceLength = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let sentence = '';erates random sentences from the selected dictionaries
  nst generateRandomSentence = (words: string[], minWords: number = 5, maxWords: number = 15): string => {
  for (let i = 0; i < sentenceLength; i++) {dom() * (maxWords - minWords + 1)) + minWords;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    // Capitalize the first word of the sentence
    if (i === 0) {rd = words[Math.floor(Math.random() * words.length)];
      sentence += randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
    } else {alize the first word of the sentence
      sentence += randomWord;
    } sentence += randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
    } else {
    // Add comma randomly (but not as the last character)
    if (i < sentenceLength - 1 && Math.random() < 0.1) {
      sentence += ', ';
    } else if (i < sentenceLength - 1) {e last character)
      sentence += ' ';ngth - 1 && Math.random() < 0.1) {
    } sentence += ', ';
  } } else if (i < sentenceLength - 1) {
      sentence += ' ';
  // Add period at the end of the sentence
  sentence += '.';
  
  return sentence; the end of the sentence
};sentence += '.';
  
// Main function to generate lorem ipsum text
export const generateLorem = async ({ 
  selectedDictionaries, 
  paragraphCount,to generate lorem ipsum text
  wordsPerSentence,teLorem = async ({ 
  sentencesPerParagraph,
  generateSingleSentence = false,
  languageSentence,
}: GenerateLoremParams): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  language
  // Get the names of selected dictionaries=> {
  const dictNames = Object.entries(selectedDictionaries)
    .filter(([_, isSelected]) => isSelected)
    .map(([name]) => name);ted dictionaries
  const dictNames = Object.entries(selectedDictionaries)
  if (dictNames.length === 0) {> isSelected)
    return ['Please select at least one dictionary.'];
  }
  if (dictNames.length === 0) {
  // Load all selected dictionaries one dictionary.'];
  const loadedDictionaries = await Promise.all(dictNames.map(name => loadDictionary(name, lang)));
  
  // Combine all words from selected dictionaries
  const allWords = loadedDictionaries.flatMap(dict => dict.words || []);dDictionary(name, lang)));
  
  if (allWords.length === 0) {lected dictionaries
    return ['No words found in selected dictionaries.'];ct.words || []);
  }
  if (allWords.length === 0) {
  // If we're generating just a single sentencearies.'];
  if (generateSingleSentence) {
    const sentence = generateRandomSentence(
      allWords, nerating just a single sentence
      wordsPerSentence.min, ) {
      wordsPerSentence.maxateRandomSentence(
    );allWords, 
    return [sentence];.min, 
  }   wordsPerSentence.max
    );
  // Generate paragraphs
  const paragraphs = [];
  
  for (let p = 0; p < paragraphCount; p++) {
    // Each paragraph has between min to max sentences
    const sentenceCount = Math.floor(Math.random() * 
      (sentencesPerParagraph.max - sentencesPerParagraph.min + 1)) + 
      sentencesPerParagraph.min;n min to max sentences
    const sentenceCount = Math.floor(Math.random() * 
    let paragraph = '';graph.max - sentencesPerParagraph.min + 1)) + 
    for (let s = 0; s < sentenceCount; s++) {
      paragraph += generateRandomSentence(
        allWords, = '';
        wordsPerSentence.min, ceCount; s++) {
        wordsPerSentence.maxandomSentence(
      );allWords, 
        wordsPerSentence.min, 
      if (s < sentenceCount - 1) {
        paragraph += ' ';
      }
    } if (s < sentenceCount - 1) {
        paragraph += ' ';
    paragraphs.push(paragraph);
  } }
    
  return paragraphs;paragraph);
};}
  
/**eturn paragraphs;
 * Discover dictionaries with language support
 * Updated to check if dictionary files actually exist for the current language
 */
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage(); exist for the current language
  let availableDictionaries: string[] = [];
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  // Check which dictionaries actually exist for the current language
  for (const dict of potentialDictionaries) {
    try {
      // Latin is in the root directory, so handle it specially
      await import(`../data/${lang}/${dict}.json`);${dict}.json`);
      availableDictionaries.push(dict);
    } catch (e) { in the root directory, so handle it specially
      // Skip if import fails (dictionary doesn't exist)lang}: ${dict}`);
    } availableDictionaries.push(dict);
  } } catch (e) {
      // Skip if import fails (dictionary doesn't exist)
  // Get created dictionaries from localStorage with language prefix
  const createdDictionariesJSON = localStorage.getItem(`created_dictionaries_${lang}`);
  let createdDictionaries: string[] = [];
  // Get created dictionaries from localStorage with language prefix
  if (createdDictionariesJSON) {= localStorage.getItem(`created_dictionaries_${lang}`);
    try {atedDictionaries: string[] = [];
      createdDictionaries = JSON.parse(createdDictionariesJSON);
    } catch (e) {ionariesJSON) {
      console.error('Error parsing created dictionaries:', e);
    } createdDictionaries = JSON.parse(createdDictionariesJSON);
  } } catch (e) {
      console.error('Error parsing created dictionaries:', e);
  // Combine available core dictionaries and created dictionaries
  return [...availableDictionaries, ...createdDictionaries];
};
  // Combine available core dictionaries and created dictionaries
// Get available dictionaries based on languageictionaries];
export const getPotentialDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  console.log('🔍 Debug - Langue courante:', lang);
  let dictionaries: string[] = [];anguage): Promise<string[]> => {
  try {  const lang = language || getCurrentLanguage();
  try {st response = await fetch(`/components/loremipsum/data/${lang}/`);le.log('🔍 Debug - Langue courante:', lang);
    // Get all JSON files in the language directory
    const response = await fetch(`/components/loremipsum/data/${lang}/`);;
    const text = await response.text(); défaut
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = doc.querySelectorAll('a');
    const parser = new DOMParser();const parser = new DOMParser();
    console.log('📂 Debug - Fichiers trouvés dans le dossier:', lang);
    const links = doc.querySelectorAll('a');const links = doc.querySelectorAll('a');
    // Add each dictionary file
    links.forEach(link => { Fichiers trouvés dans le dossier:', lang);
      const filename = link.textContent;
      if (filename && filename.endsWith('.json')) {
        const id = filename.replace('.json', '');', ''));
        console.log('📄 Debug - Fichier dictionnaire trouvé:', id);
        dictionaries.push(id);
      }id = filename.replace('.json', '');
    });urn dictionaries; console.log('📄 Debug - Fichier dictionnaire trouvé:', id);
  } catch (error) {        dictionaries.push(id);
    // Add latin.json from root directoryal dictionaries:', error);
    console.log('➕ Debug - Ajout du dictionnaire latin');
    dictionaries.push('latin');
};    // Add latin.json from root directory
    console.log('✅ Debug - Liste finale des dictionnaires:', dictionaries);
    return dictionaries;ariesatin');
  } catch (error) {ilableDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
    console.error('❌ Debug - Erreur lors de la récupération des dictionnaires:', error);
    return ['latin']; // Fallback to latin if error
  }/ Get potential dictionaries from files catch (error) {
};const potentialDictionaries = await getPotentialDictionaries(lang);  console.error('❌ Debug - Erreur lors de la récupération des dictionnaires:', error);
      return ['latin']; // Fallback to latin if error
// Get available dictionaries from localStorage
export const getAvailableDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {');
  const lang = language || getCurrentLanguage();
  // Combine and return unique dictionaries Get available dictionaries
  // Get potential dictionaries from filesries, ...createdDictionaries])];ync (language?: SupportedLanguage): Promise<string[]> => {
  const potentialDictionaries = await getPotentialDictionaries(lang);
  console.log('📂 Debug - Dictionnaires potentiels:', potentialDictionaries);
  
  // Get created dictionaries from localStorage
  const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');const [isGenerating, setIsGenerating] = useState(false);
   useState<string[]>([]);rage
  // Combine and return unique dictionaries
  return [...new Set([...potentialDictionaries, ...createdDictionaries])];const generate = async (params: GenerateLoremParams) => {
};    setIsGenerating(true);  // Combine and return unique dictionaries
tionaries])];
// Custom hook to use the generator(params);
export const useLoremGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string[]>([]);    console.error('Error generating lorem ipsum:', error);port const useLoremGenerator = () => {
   text.']);
  const generate = async (params: GenerateLoremParams) => {ext] = useState<string[]>([]);
    setIsGenerating(true);IsGenerating(false);
    try {
      const result = await generateLorem(params);
      setGeneratedText(result);
    } catch (error) {
      console.error('Error generating lorem ipsum:', error);
      setGeneratedText(['An error occurred while generating text.']);rate, isGenerating, generatedText };
    } finally {
      setIsGenerating(false);    }  };    return { generate, isGenerating, generatedText };};
