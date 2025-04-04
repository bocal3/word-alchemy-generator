
import React, { useState } from 'react';
import { useLoremGenerator } from '../utils/generateLorem';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Copy, RefreshCw, Check } from 'lucide-react';

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
  
  const handleCheckboxChange = (id: string) => {
    setSelectedDictionaries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
    
    generate({ selectedDictionaries, paragraphCount });
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
            <h2 className="font-semibold text-lg mb-3">Sélectionnez vos dictionnaires</h2>
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
          
          <div>
            <h2 className="font-semibold text-lg mb-3">Nombre de paragraphes</h2>
            <div className="flex items-center w-full max-w-xs">
              <Input
                type="number"
                min="1"
                max="10"
                value={paragraphCount}
                onChange={handleParagraphCountChange}
                className="w-24"
              />
              <span className="ml-2 text-sm text-muted-foreground">(1-10)</span>
            </div>
          </div>
          
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
