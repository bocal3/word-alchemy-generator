
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { generateLorem } from '@/components/loremipsum/utils/generateLorem';
import { SupportedLanguage } from '@/contexts/LanguageContext';

const ApiPage = () => {
  const { lang, dictionaries, paragraphCount, wordsRange, sentencesRange, format } = useParams();
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

  // By default, output plain text (no HTML)
  // Only render HTML if format is explicitly set to 'html'
  if (format !== 'html') {
    // Use document.write to output only the text
    useEffect(() => {
      if (!loading && !error) {
        // Clear the document and write only the text
        document.open();
        
        if (result.length > 0) {
          document.write(result.join('\n\n'));
        } else {
          document.write('No content generated');
        }
        
        document.close();
      } else if (!loading && error) {
        document.open();
        document.write(`Error: ${error}`);
        document.close();
      }
    }, [loading, error, result]);
    
    // Return empty div as React needs to return something
    return <div></div>;
  }

  // HTML response only if format is 'html'
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm">
          Format: /api/:lang/:dictionaries/:paragraphCount/:wordsRange/:sentencesRange
        </p>
        <p className="text-sm">
          Example: /api/fr/startup-fantasy/3/5-15/3-7
        </p>
        <p className="text-sm mt-2">
          Add "/html" at the end for HTML output (e.g., /api/fr/startup-fantasy/3/5-15/3-7/html)
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 whitespace-pre-wrap">
      {result.map((paragraph, index) => (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ApiPage;
