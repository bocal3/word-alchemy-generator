const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateLorem } = require('./components/loremipsum/utils/generateLorem');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Route API format : /api/generate/:lang/:dictionaries/:paragraphCount/:wordsRange/:sentencesRange
app.get('/api/generate/:lang/:dictionaries/:paragraphCount/:wordsRange/:sentencesRange', async (req, res) => {
  try {
    const { lang, dictionaries, paragraphCount, wordsRange, sentencesRange } = req.params;

    // Validation des paramètres
    const language = lang;
    if (!['en', 'fr', 'es'].includes(language)) {
      throw new Error('Invalid language. Use en, fr or es');
    }

    const dictionaryList = dictionaries ? dictionaries.split('-') : [];
    if (dictionaryList.length === 0) {
      throw new Error('No dictionaries specified');
    }
    const selectedDictionaries = {};
    dictionaryList.forEach(dict => {
      selectedDictionaries[dict] = true;
    });

    const parsedParagraphCount = parseInt(paragraphCount);
    if (isNaN(parsedParagraphCount) || parsedParagraphCount < 1 || parsedParagraphCount > 50) {
      throw new Error('Invalid paragraph count. Use a number between 1 and 50');
    }

    let minWords = 5, maxWords = 15;
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

    let minSentences = 3, maxSentences = 7;
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

    // Utilisation de ton générateur
    const generatedText = await generateLorem({
      selectedDictionaries,
      paragraphCount: parsedParagraphCount,
      wordsPerSentence: { min: minWords, max: maxWords },
      sentencesPerParagraph: { min: minSentences, max: maxSentences },
      language,
    });

    // Réponse HTML simple
    res.setHeader('Content-Type', 'text/html');
    res.send(generatedText.map(p => `<p>${p}</p>`).join('\n'));
  } catch (err) {
    res.status(400).send(`<p>Error: ${err.message}</p>`);
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
