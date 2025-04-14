import React, { useState, useEffect } from 'react';
import { useLoremGenerator, discoverDictionaries } from '../utils/generateLorem';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

// Import refactored components
import DictionarySelector from './DictionarySelector';
import GeneratorOptions from './GeneratorOptions';
import AdvancedOptions from './AdvancedOptions';
import GeneratedContent from './GeneratedContent';

interface GeneratorProps {
  initialDictionary?: string;
  availableDictionaries?: string[];
}

const Generator: React.FC<GeneratorProps> = ({ initialDictionary, availableDictionaries = [] }) => {
  const { toast } = useToast();
  const { generate, isGenerating, generatedText } = useLoremGenerator();
  
  // State for available dictionaries
  const [dictionaryList, setDictionaryList] = useState<{ id: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dictionaries
  const [selectedDictionaries, setSelectedDictionaries] = useState<Record<string, boolean>>({});
  const [areAllSelected, setAreAllSelected] = useState(false);
  
  // State for generator options
  const [paragraphCount, setParagraphCount] = useState<number>(3);
  const [generateSingleSentence, setGenerateSingleSentence] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  
  // State for advanced options
  const [wordsPerSentence, setWordsPerSentence] = useState({
    min: 5,
    max: 15
  });
  
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState({
    min: 3,
    max: 7
  });
  
  // Load available dictionaries
  useEffect(() => {
    const loadAvailableDictionaries = async () => {
      setIsLoading(true);
      try {
        // Use provided dictionaries or discover them
        const dictionaries = availableDictionaries.length > 0 
          ? availableDictionaries 
          : await discoverDictionaries();
        
        // Format dictionary list
        const formattedList = dictionaries.map(id => ({
          id,
          label: id.charAt(0).toUpperCase() + id.slice(1)
        }));
        
        setDictionaryList(formattedList);
        
        // Initialize selected dictionaries
        const initialSelected: Record<string, boolean> = {};
        formattedList.forEach(dict => {
          // If initialDictionary is provided, only select that one
          if (initialDictionary) {
            initialSelected[dict.id] = dict.id === initialDictionary;
          } else {
            // Default to Latin selected
            initialSelected[dict.id] = dict.id === 'latin';
          }
        });
        
        setSelectedDictionaries(initialSelected);
      } catch (error) {
        console.error('Error loading dictionaries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvailableDictionaries();
  }, [initialDictionary, availableDictionaries]);
  
  // Check if all dictionaries are selected
  useEffect(() => {
    const allSelected = dictionaryList.every(dict => selectedDictionaries[dict.id]);
    setAreAllSelected(allSelected);
  }, [selectedDictionaries, dictionaryList]);
  
  // Event handlers
  const handleCheckboxChange = (id: string) => {
    setSelectedDictionaries(prev => {
      const updated = {
        ...prev,
        [id]: !prev[id]
      };
      
      return updated;
    });
  };
  
  const handleSelectAll = () => {
    const newValue = !areAllSelected;
    
    const newSelectedDictionaries: Record<string, boolean> = {};
    dictionaryList.forEach(dict => {
      newSelectedDictionaries[dict.id] = newValue;
    });
    
    setSelectedDictionaries(newSelectedDictionaries);
  };
  
  const handleParagraphCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (!isNaN(count) && count >= 1 && count <= 10) {
      setParagraphCount(count);
    }
  };
  
  const handleGenerate = () => {
    const atLeastOneDictionarySelected = Object.values(selectedDictionaries).some(value => value);
    
    if (!atLeastOneDictionarySelected) {
      toast({
        title: "Aucun dictionnaire sélectionné",
        description: "Veuillez sélectionner au moins un dictionnaire pour générer du texte.",
        variant: "destructive"
      });
      return;
    }
    
    generate({ 
      selectedDictionaries, 
      paragraphCount,
      wordsPerSentence,
      sentencesPerParagraph,
      generateSingleSentence
    });
  };

  const handleWordsPerSentenceChange = (values: number[]) => {
    setWordsPerSentence({
      min: values[0],
      max: values[1]
    });
  };

  const handleSentencesPerParagraphChange = (values: number[]) => {
    setSentencesPerParagraph({
      min: values[0],
      max: values[1]
    });
  };

  const handleSingleSentenceChange = () => {
    setGenerateSingleSentence(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="p-6">
          <div className="py-10 text-center text-muted-foreground">
            Chargement des dictionnaires...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-spotify">
          Générateur Psum
        </h1>
        <p className="text-muted-foreground mt-2">
          Générez du texte de remplissage thématique pour vos projets
        </p>
      </div>
      
      <Card className="p-6">
        <div className="space-y-6">
          {/* Dictionary selection component */}
          <DictionarySelector
            dictionaries={dictionaryList}
            selectedDictionaries={selectedDictionaries}
            areAllSelected={areAllSelected}
            onDictionaryChange={handleCheckboxChange}
            onSelectAll={handleSelectAll}
          />
          
          {/* Generator options component */}
          <GeneratorOptions
            paragraphCount={paragraphCount}
            generateSingleSentence={generateSingleSentence}
            onParagraphCountChange={handleParagraphCountChange}
            onSingleSentenceChange={handleSingleSentenceChange}
          />
          
          {/* Advanced options component */}
          <AdvancedOptions
            advancedOptionsOpen={advancedOptionsOpen}
            setAdvancedOptionsOpen={setAdvancedOptionsOpen}
            wordsPerSentence={wordsPerSentence}
            sentencesPerParagraph={sentencesPerParagraph}
            generateSingleSentence={generateSingleSentence}
            onWordsPerSentenceChange={handleWordsPerSentenceChange}
            onSentencesPerParagraphChange={handleSentencesPerParagraphChange}
          />
          
          {/* Generate button */}
          <div>
            <Button 
              onClick={handleGenerate} 
              className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                'Générer'
              )}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Generated content component */}
      <GeneratedContent generatedText={generatedText} />
    </div>
  );
};

export default Generator;
