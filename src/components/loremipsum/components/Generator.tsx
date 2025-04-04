
import React, { useState } from 'react';
import { useLoremGenerator } from '../utils/generateLorem';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Copy, RefreshCw, Check, SlidersHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const dictionaries = [
  { id: 'latin', label: 'Latin' },
  { id: 'viande', label: 'Viande' },
  { id: 'jeu', label: 'Jeu' },
  { id: 'biere', label: 'Bière' },
  { id: 'hipster', label: 'Hipster' },
  { id: 'survie', label: 'Survie' },
  { id: 'randonnee', label: 'Randonnée' },
  { id: 'outils', label: 'Outils' },
  { id: 'developpement', label: 'Développement' },
  { id: 'it', label: 'IT' },
  { id: 'police', label: 'Police' },
  { id: 'cuisine', label: 'Cuisine' },
  { id: 'photo', label: 'Photo' },
  { id: 'paranormal', label: 'Paranormal' },
  { id: 'startup', label: 'Startup' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'telerealite', label: 'Télé-réalité' },
  { id: 'philosophie', label: 'Philosophie' }
];

const Generator: React.FC = () => {
  const { toast } = useToast();
  const { generate, isGenerating, generatedText } = useLoremGenerator();
  
  const [selectedDictionaries, setSelectedDictionaries] = useState<Record<string, boolean>>({
    latin: true,
    viande: false,
    jeu: false,
    biere: false,
    hipster: false,
    survie: false,
    randonnee: false,
    outils: false,
    developpement: false,
    it: false,
    police: false,
    cuisine: false,
    photo: false,
    paranormal: false,
    startup: false,
    fantasy: false,
    cyberpunk: false,
    telerealite: false,
    philosophie: false
  });
  
  const [paragraphCount, setParagraphCount] = useState<number>(3);
  const [copied, setCopied] = useState(false);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [generateSingleSentence, setGenerateSingleSentence] = useState(false);
  
  const [wordsPerSentence, setWordsPerSentence] = useState({
    min: 5,
    max: 15
  });
  
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState({
    min: 3,
    max: 7
  });
  
  const handleCheckboxChange = (id: string) => {
    setSelectedDictionaries(prev => {
      const updated = {
        ...prev,
        [id]: !prev[id]
      };
      
      // Check if all dictionaries are now selected
      const allSelected = dictionaries.every(dict => updated[dict.id]);
      setAreAllSelected(allSelected);
      
      return updated;
    });
  };
  
  const handleSelectAll = () => {
    const newValue = !areAllSelected;
    setAreAllSelected(newValue);
    
    const newSelectedDictionaries: Record<string, boolean> = {};
    dictionaries.forEach(dict => {
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
  
  const handleCopy = () => {
    const textToCopy = generatedText.join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    
    toast({
      title: "Texte copié !",
      description: "Le texte généré a été copié dans le presse-papiers."
    });
    
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Générateur de Lorem Ipsum Thématique
        </h1>
        <p className="text-muted-foreground mt-2">
          Générez du texte de remplissage thématique pour vos projets
        </p>
      </div>
      
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Sélectionnez vos dictionnaires</h2>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-select-all" 
                  checked={areAllSelected} 
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="checkbox-select-all" className="text-sm">
                  Tout sélectionner
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {dictionaries.map((dict) => (
                <div key={dict.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`checkbox-${dict.id}`} 
                    checked={selectedDictionaries[dict.id]} 
                    onCheckedChange={() => handleCheckboxChange(dict.id)}
                  />
                  <Label htmlFor={`checkbox-${dict.id}`} className="text-sm">
                    {dict.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${generateSingleSentence ? 'opacity-50' : ''}`}>
              <Label htmlFor="paragraph-count" className="text-sm font-medium">Nombre de paragraphes:</Label>
              <Input
                id="paragraph-count"
                type="number"
                min="1"
                max="10"
                value={paragraphCount}
                onChange={handleParagraphCountChange}
                className="w-20"
                disabled={generateSingleSentence}
              />
              <span className="text-xs text-muted-foreground">(1-10)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="single-sentence" 
                checked={generateSingleSentence} 
                onCheckedChange={handleSingleSentenceChange}
              />
              <Label htmlFor="single-sentence" className="text-sm">
                Générer une seule phrase
              </Label>
            </div>
          </div>
          
          <Collapsible open={advancedOptionsOpen} onOpenChange={setAdvancedOptionsOpen} className="border rounded-md p-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between">
                <span className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Options avancées
                </span>
                <span className="text-xs text-muted-foreground">
                  {advancedOptionsOpen ? "Masquer" : "Afficher"}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Nombre de mots par phrase: {wordsPerSentence.min} - {wordsPerSentence.max}</h3>
                  <Slider 
                    defaultValue={[wordsPerSentence.min, wordsPerSentence.max]}
                    min={3}
                    max={20}
                    step={1}
                    value={[wordsPerSentence.min, wordsPerSentence.max]}
                    onValueChange={handleWordsPerSentenceChange}
                    className="my-4"
                  />
                </div>
                <div className={generateSingleSentence ? 'opacity-50' : ''}>
                  <h3 className="text-sm font-medium mb-2">Nombre de phrases par paragraphe: {sentencesPerParagraph.min} - {sentencesPerParagraph.max}</h3>
                  <Slider 
                    defaultValue={[sentencesPerParagraph.min, sentencesPerParagraph.max]}
                    min={1}
                    max={12}
                    step={1}
                    value={[sentencesPerParagraph.min, sentencesPerParagraph.max]}
                    onValueChange={handleSentencesPerParagraphChange}
                    className="my-4"
                    disabled={generateSingleSentence}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div>
            <Button 
              onClick={handleGenerate} 
              className="bg-violet-600 hover:bg-violet-700 text-white"
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
      
      {generatedText.length > 0 && (
        <Card className="mt-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Texte généré</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy} 
              className="flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copier
                </>
              )}
            </Button>
          </div>
          <Separator className="my-2" />
          <div className="space-y-4 mt-4 max-h-[400px] overflow-y-auto p-2">
            {generatedText.map((paragraph, index) => (
              <p key={index} className="text-sm text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Generator;
