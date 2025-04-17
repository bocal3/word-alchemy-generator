import { useState } from 'react';
import { SupportedLanguage } from '@/contexts/LanguageContext';

export interface Dictionary {
  id: string;
  label: string;
  words: string[];
  description?: string;
}
// test
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

/**
 * Load a dictionary by its ID and language
 * This function fetches the content of the dictionary file
 */
const loadDictionary = async (id: string, language?: SupportedLanguage): Promise<Dictionary> => {
  const lang = language || getCurrentLanguage();
  try {
    const module = await import(`/components/loremipsum/data/${lang}/${id}.json`);
    const fileDict = module as Dictionary;
      /* webpackIgnore: true */
    // Check if we have additional words in localStoragen`
    const localWords = localStorage.getItem(`dictionary_${lang}_${id}`);
    if (localWords) {module as Dictionary;
      try {
        const parsedLocalWords = JSON.parse(localWords);ge
        return {ords = localStorage.getItem(`dictionary_${lang}_${id}`);
          id,Words) {
          label: id,
          words: [...fileDict.words, ...parsedLocalWords],
        };turn {
      } catch (e) {
        console.error('❌ Erreur lors de l’analyse des mots dans localStorage :', e);
        return { id, label: id, words: fileDict.words };],
      } };
    } } catch (e) {
        console.error('❌ Erreur lors de l’analyse des mots dans localStorage :', e);
    return { id, label: id, words: fileDict.words };s };
  } catch (error) {
    console.error(`❌ Erreur lors du chargement du dictionnaire ${id} pour ${lang} :`, error);
    return { id, label: id, words: [] };
  } return { id, label: id, words: fileDict.words };
};} catch (error) {
    console.error(`❌ Erreur lors du chargement du dictionnaire ${id} pour ${lang} :`, error);
// This function generates random sentences from the selected dictionariesen cas d'erreur
const generateRandomSentence = (words: string[], minWords: number = 5, maxWords: number = 15): string => {
  const sentenceLength = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let sentence = '';
  for (let i = 0; i < sentenceLength; i++) {from the selected dictionaries
    const randomWord = words[Math.floor(Math.random() * words.length)];maxWords: number = 15): string => {
    nst sentenceLength = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    // Capitalize the first word of the sentence
    if (i === 0) {i < sentenceLength; i++) {
      sentence += randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
    } else {
      sentence += randomWord;ord of the sentence
    }f (i === 0) {
    // Add comma randomly (but not as the last character)ndomWord.slice(1);
    if (i < sentenceLength - 1 && Math.random() < 0.1) {
      sentence += ', ';mWord;
    } else if (i < sentenceLength - 1) {
      sentence += ' ';mly (but not as the last character)
    }f (i < sentenceLength - 1 && Math.random() < 0.1) {
  }   sentence += ', ';
  // Add period at the end of the sentence
  sentence += '.';' ';
    }
  return sentence;
};// Add period at the end of the sentence
  sentence += '.';
// Main function to generate lorem ipsum text
export const generateLorem = async ({
  selectedDictionaries, 
  paragraphCount,
  wordsPerSentence, generate lorem ipsum text
  sentencesPerParagraph,em = async ({
  generateSingleSentence = false,
  language,Count,
}: GenerateLoremParams): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  // Get the names of selected dictionaries
  const dictNames = Object.entries(selectedDictionaries)
    .filter(([_, isSelected]) => isSelected)> {
    .map(([name]) => name);getCurrentLanguage();
  if (dictNames.length === 0) {dictionaries
    return ['Please select at least one dictionary.'];s)
  } .filter(([_, isSelected]) => isSelected)
  // Load all selected dictionaries
  const loadedDictionaries = await Promise.all(
    dictNames.map(async (name) => {  return ['Please select at least one dictionary.'];
      try {
        return await loadDictionary(name, lang);
      } catch (error) {const loadedDictionaries = await Promise.all(dictNames.map(name => loadDictionary(name, lang)));
        console.warn(`⚠️ Dictionnaire manquant ou inaccessible : ${name}`);
        return { id: name, label: name, words: [] }; // Retourne un dictionnaire vide
      }onst allWords = loadedDictionaries.flatMap(dict => dict.words || []);
    })
  );
  ionaries.'];
  // Combine all words from selected dictionaries
  const allWords = loadedDictionaries.flatMap(dict => dict.words || []);t a single sentence
  ce) {
  if (allWords.length === 0) {nst sentence = generateRandomSentence(
    return ['No words found in selected dictionaries.'];
  }   wordsPerSentence.min, 
  // If we're generating just a single sentenceax
  if (generateSingleSentence) {
    const sentence = generateRandomSentence(  return [sentence];
      allWords, 
      wordsPerSentence.min, 
      wordsPerSentence.max
    );
    return [sentence];ount; p++) {
  }as between min to max sentences
  // Generate paragraphsdom() * 
  const paragraphs = [];esPerParagraph.min + 1)) + 
  Paragraph.min;
  for (let p = 0; p < paragraphCount; p++) {
    // Each paragraph has between min to max sentencesenceCount; s++) {
    const sentenceCount = Math.floor(Math.random() * ragraph += generateRandomSentence(
      (sentencesPerParagraph.max - sentencesPerParagraph.min + 1)) + 
      sentencesPerParagraph.min;min, 
    let paragraph = ''; wordsPerSentence.max
    for (let s = 0; s < sentenceCount; s++) { );
      paragraph += generateRandomSentence() {
        allWords,      paragraph += ' ';
        wordsPerSentence.min,   }
        wordsPerSentence.max
      );  paragraphs.push(paragraph);
      if (s < sentenceCount - 1) {}
        paragraph += ' '; 
      }
    }
    paragraphs.push(paragraph);
  }/**
    
  return paragraphs; current language
};
  
/**
 * Discover dictionaries with language supportnst dictionaryFiles: Record<SupportedLanguage, string[]> = {
 * Optimized to only fetch the list of available files for the current language  fr: ['survie', 'telerealite', 'viande', 'police', 'randonnee', 'startup'],
 */
 'policia', 'senderismo', 'startup'],
// Liste statique des fichiers JSON disponibles pour chaque langue
const dictionaryFiles: Record<SupportedLanguage, string[]> = {
  fr: ['survie', 'telerealite', 'viande', 'police', 'randonnee', 'startup'],anguage): Promise<string[]> => {
  en: ['survival', 'realityTV', 'meat', 'police', 'hiking', 'startup'],
  es: ['supervivencia', 'telerealidad', 'carne', 'policia', 'senderismo', 'startup'],
};
hiers JSON
export const discoverDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();es pour ${lang} :`, availableDictionaries);
  console.log(`🔍 Debug - Langue actuelle : ${lang}`);
tez les dictionnaires créés dans localStorage
  // Utilisez la liste statique pour récupérer les fichiers JSONdictionaries_${lang}`);
  const availableDictionaries = dictionaryFiles[lang] || [];
  console.log(`📂 Dictionnaires disponibles pour ${lang} :`, availableDictionaries);ionariesJSON) {

  // Ajoutez les dictionnaires créés dans localStorage createdDictionaries = JSON.parse(createdDictionariesJSON);
  const createdDictionariesJSON = localStorage.getItem(`created_dictionaries_${lang}`);   console.log(`📂 Dictionnaires créés trouvés : ${createdDictionaries}`);
  let createdDictionaries: string[] = [];    } catch (e) {
  if (createdDictionariesJSON) {dictionnaires créés :', e);
    try {
      createdDictionaries = JSON.parse(createdDictionariesJSON);
      console.log(`📂 Dictionnaires créés trouvés : ${createdDictionaries}`);
    } catch (e) {naires disponibles et créés
      console.error('❌ Erreur lors de l’analyse des dictionnaires créés :', e);const allDictionaries = [...availableDictionaries, ...createdDictionaries];
    }  console.log(`✅ Liste finale des dictionnaires pour ${lang} :`, allDictionaries);
  }

  // Combinez les dictionnaires disponibles et créés
  const allDictionaries = [...availableDictionaries, ...createdDictionaries];
  console.log(`✅ Liste finale des dictionnaires pour ${lang} :`, allDictionaries); files
export const getPotentialDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  return allDictionaries; lang = language || getCurrentLanguage();
};ls :', lang);
ing[] = [];
// Get potential dictionaries from files
export const getPotentialDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();onst response = await fetch(`/components/loremipsum/data/${lang}/`);
  console.log('🔍 Debug - Langue courante pour les dictionnaires potentiels :', lang);    if (!response.ok) {
  let dictionaries: string[] = [];a récupération des fichiers pour ${lang}`);

  try {
    const response = await fetch(`/components/loremipsum/data/${lang}/`);
    if (!response.ok) {    const text = await response.text();
      console.error(`❌ Erreur lors de la récupération des fichiers pour ${lang}`);arser();
      return [];ext, 'text/html');
    }

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');f (filename && filename.endsWith('.json')) {
    const links = doc.querySelectorAll('a'); const id = filename.replace('.json', '');
        dictionaries.push(id);
    links.forEach(link => {Fichier trouvé : ${id}`);
      const filename = link.textContent;
      if (filename && filename.endsWith('.json')) {
        const id = filename.replace('.json', '');
        dictionaries.push(id); return dictionaries;
        console.log(`📄 Fichier trouvé : ${id}`);} catch (error) {
      }    console.error('❌ Erreur lors de la récupération des dictionnaires potentiels :', error);
    });

    return dictionaries;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des dictionnaires potentiels :', error);
    return []; Promise<string[]> => {
  }  const lang = language || getCurrentLanguage();
};

// Get available dictionaries from localStorageconsole.log('📂 Debug - Dictionnaires potentiels:', potentialDictionaries);
export const getAvailableDictionaries = async (language?: SupportedLanguage): Promise<string[]> => {
  const lang = language || getCurrentLanguage();
  // Get potential dictionaries from filesconst createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
  const potentialDictionaries = await getPotentialDictionaries(lang);  
  console.log('📂 Debug - Dictionnaires potentiels:', potentialDictionaries);ionaries
naries, ...createdDictionaries])];
  // Get created dictionaries from localStorage
  const createdDictionaries = JSON.parse(localStorage.getItem(`created_dictionaries_${lang}`) || '[]');
  // Custom hook to use the generator
  // Combine and return unique dictionaries
  return [...new Set([...potentialDictionaries, ...createdDictionaries])];IsGenerating] = useState(false);
};generatedText, setGeneratedText] = useState<string[]>([]);

// Custom hook to use the generators: GenerateLoremParams) => {
export const useLoremGenerator = () => {rue);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string[]>([]);
tedText(result);
  const generate = async (params: GenerateLoremParams) => {
    setIsGenerating(true); console.error('Error generating lorem ipsum:', error);
    try {  setGeneratedText(['An error occurred while generating text.']);
      const result = await generateLorem(params);    } finally {
      setGeneratedText(result);
    } catch (error) {  }
      console.error('Error generating lorem ipsum:', error);  };









};  return { generate, isGenerating, generatedText };  };    }      setIsGenerating(false);    } finally {      setGeneratedText(['An error occurred while generating text.']);
  return { generate, isGenerating, generatedText };
};
