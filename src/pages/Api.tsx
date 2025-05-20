
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { generateLorem } from '@/components/loremipsum/utils/generateLorem';
import { SupportedLanguage } from '@/contexts/LanguageContext';

const ApiPage = () => {
  const { lang, dictionaries, paragraphCount, wordsRange, sentencesRange } = useParams();
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validate language
        const language = lang as SupportedLanguage;
        if (!['en', 'fr', 'es'].includes(language)) {
          throw new Error('Invalid language. Use en, fr or es');
        }

        // Parse dictionaries
        const dictionaryList = dictionaries?.split('-') || [];
        if (dictionaryList.length === 0) {
          throw new Error('No dictionaries specified');
        }

        // Create selected dictionaries object
        const selectedDictionaries: Record<string, boolean> = {};
        dictionaryList.forEach(dict => {
          selectedDictionaries[dict] = true;
        });

        // Parse paragraph count
        const parsedParagraphCount = paragraphCount ? parseInt(paragraphCount) : 1;
        if (isNaN(parsedParagraphCount) || parsedParagraphCount < 1 || parsedParagraphCount > 50) {
          throw new Error('Invalid paragraph count. Use a number between 1 and 50');
        }

        // Parse words per sentence range
        let minWords = 5;
        let maxWords = 15;
        if (wordsRange) {
          const [min, max] = wordsRange.split('-').map(Number);
          if (
            isNaN(min) || isNaN(max) || 
            min < 1 || max < min || 
            min > 50 || max > 50
          ) {
            throw new Error('Invalid words range. Format should be min-max (e.g., 5-15)');
          }
          minWords = min;
          maxWords = max;
        }

        // Parse sentences per paragraph range
        let minSentences = 3;
        let maxSentences = 7;
        if (sentencesRange) {
          const [min, max] = sentencesRange.split('-').map(Number);
          if (
            isNaN(min) || isNaN(max) || 
            min < 1 || max < min || 
            min > 30 || max > 30
          ) {
            throw new Error('Invalid sentences range. Format should be min-max (e.g., 3-7)');
          }
          minSentences = min;
          maxSentences = max;
        }

        // Generate lorem ipsum
        const generatedText = await generateLorem({
          selectedDictionaries,
          paragraphCount: parsedParagraphCount,
          wordsPerSentence: {
            min: minWords,
            max: maxWords,
          },
          sentencesPerParagraph: {
            min: minSentences,
            max: maxSentences,
          },
          language,
        });

        setResult(generatedText);
      } catch (err) {
        console.error('Error generating text:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang, dictionaries, paragraphCount, wordsRange, sentencesRange]);

  // Use document.write to output only the text with simple <p> tags
  useEffect(() => {
    if (!loading) {
      // Clear the document and write only the text with <p> tags
      document.open();
      
      if (!error && result.length > 0) {
        // Add <p> tags around each paragraph
        document.write(result.map(paragraph => `<p>${paragraph}</p>`).join('\n'));
      } else if (error) {
        document.write(`<p>Error: ${error}</p>`);
      } else {
        document.write('<p>No content generated</p>');
      }
      
      document.close();
    }
  }, [loading, error, result]);
  
  // Return empty div as React needs to return something
  return <div></div>;
};

export default ApiPage;
