const express = require('express');
const cors = require('cors');
const path = require('path');

// Adapte ce chemin si besoin selon l'emplacement de generateLorem
const { generateLorem } = require('./src/components/loremipsum/utils/generateLorem');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Route API pour générer le texte
app.get('/api/generate', async (req, res) => {
  try {
    const { lang, dictionaries, paragraphCount, wordsRange, sentencesRange } = req.query;

    // Validation des paramètres (reprend la logique de ton composant React)
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

    const parsedParagraphCount = paragraphCount ? parseInt(paragraphCount) : 1;
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

    // Génération du texte
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

// (Optionnel) Sert le frontend React si besoin
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
