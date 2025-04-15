
import React, { useState, useEffect } from "react";
import { PlusCircle, Play, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loadDictionary, saveDictionary, getDictionaryWords } from "@/utils/dictionaryUtils";
import Sidebar from "@/components/layout/Sidebar";

const DictionnaireDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newWord, setNewWord] = useState("");
  const [dictionary, setDictionary] = useState<{ title: string, description: string, words: string[] }>({
    title: '',
    description: '',
    words: []
  });
  
  useEffect(() => {
    const loadDictionaryData = async () => {
      if (!id) return;
      
      try {
        // Get combined words from file and localStorage
        const words = await getDictionaryWords(id);
        
        setDictionary({
          title: id.charAt(0).toUpperCase() + id.slice(1),
          description: `Dictionnaire de mots liés à "${id}"`,
          words
        });
      } catch (error) {
        console.error("Erreur lors du chargement du dictionnaire:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le dictionnaire",
          variant: "destructive"
        });
      }
    };
    
    loadDictionaryData();
  }, [id, toast]);

  const handleAddWord = () => {
    if (!newWord.trim()) {
      toast({
        title: "Mot vide",
        description: "Veuillez entrer un mot valide",
        variant: "destructive"
      });
      return;
    }

    if (dictionary.words.includes(newWord.trim())) {
      toast({
        title: "Mot existant",
        description: "Ce mot existe déjà dans le dictionnaire",
        variant: "destructive"
      });
      return;
    }

    const updatedWords = [...dictionary.words, newWord.trim()];
    setDictionary({
      ...dictionary,
      words: updatedWords
    });

    // Save the updated dictionary
    if (id) {
      saveDictionary(id, { words: updatedWords })
        .then(() => {
          toast({
            title: "Mot ajouté",
            description: `"${newWord.trim()}" a été ajouté au dictionnaire`,
          });
        })
        .catch(() => {
          toast({
            description: `"${newWord.trim()}" a été ajouté temporairement (sauvegarde impossible)`,
          });
        });
    }

    setNewWord("");
  };

  const handleGenerateText = () => {
    navigate('/', { state: { selectedDictionary: id } });
  };

  const handleDownloadDictionary = () => {
    try {
      // Create object with dictionary data
      const dictData = {
        id,
        title: dictionary.title,
        description: dictionary.description,
        words: dictionary.words
      };
      
      // Convert to JSON
      const jsonData = JSON.stringify(dictData, null, 2);
      
      // Create a blob
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `dictionnaire-${id}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Téléchargement réussi",
        description: `Le dictionnaire "${dictionary.title}" a été téléchargé.`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement du dictionnaire:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le dictionnaire",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="psum-container">
      <div className="psum-main">
        <Sidebar activePage="dictionary-detail" />
        
        <main className="psum-content">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-6 mb-8">
              <div className="w-36 h-36 bg-spotify/20 flex items-center justify-center rounded-md text-5xl font-bold text-spotify">
                {dictionary.title.charAt(0)}
              </div>
              <div>
                <Badge className="mb-2">Dictionnaire</Badge>
                <h1 className="text-4xl font-bold mb-2 text-spotify">{dictionary.title}</h1>
                <p className="text-muted-foreground">{dictionary.description}</p>
                <p className="text-muted-foreground mt-1">{dictionary.words.length} mots</p>
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <Button className="bg-spotify hover:bg-spotify/90 text-spotify-foreground rounded-full" onClick={handleGenerateText}>
                <Play className="mr-2 h-4 w-4" />
                Générer du texte
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={handleDownloadDictionary}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Ajouter un mot</h2>
              <div className="flex gap-2">
                <Input 
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Nouveau mot..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                />
                <Button onClick={handleAddWord} className="bg-spotify hover:bg-spotify/90 text-spotify-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Mots du dictionnaire ({dictionary.words.length})</h2>
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dictionary.words.map((word, index) => (
                  <div key={index} className="p-2 border rounded-md text-center hover:bg-accent/10 transition-colors">
                    {word}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DictionnaireDetail;
