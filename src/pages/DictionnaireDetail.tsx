
import React, { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Search, PlusCircle, Music, Layers, ArrowDownCircle, Play, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loadDictionary, saveDictionary } from "@/utils/dictionaryUtils";

const DictionnaireDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newWord, setNewWord] = useState("");
  const [dictionary, setDictionary] = React.useState<{ title: string, description: string, words: string[] }>({
    title: '',
    description: '',
    words: []
  });
  
  React.useEffect(() => {
    // Load dictionary data when the component mounts or id changes
    if (id) {
      // Try to load the actual dictionary file
      loadDictionary(id)
        .then(data => {
          if (data && data.words) {
            setDictionary({
              title: id.charAt(0).toUpperCase() + id.slice(1),
              description: `Dictionnaire de mots liés à "${id}"`,
              words: data.words
            });
          } else {
            // Fallback to static data if dictionary file couldn't be loaded
            const dictionaries: Record<string, { title: string, description: string, words: string[] }> = {
              latin: {
                title: 'Latin',
                description: 'Dictionnaire latin classique utilisé en typographie depuis les années 1500.',
                words: ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit']
              },
              developpement: {
                title: 'Développement',
                description: 'Termes liés au développement logiciel et à la programmation.',
                words: ['Code', 'API', 'Framework', 'Debug', 'Backend', 'Frontend', 'Database', 'Deploy']
              },
              fantasy: {
                title: 'Fantasy',
                description: 'Vocabulaire issu des univers de fantasy médiévale.',
                words: ['Dragon', 'Magie', 'Épée', 'Royaume', 'Sorcier', 'Créature', 'Elfe', 'Nain']
              },
              cyberpunk: {
                title: 'Cyberpunk',
                description: 'Vocabulaire issu des univers de science-fiction cyberpunk.',
                words: ['Cyberespace', 'Implant', 'Réalité', 'Virtuel', 'Hacker', 'Néon', 'Mégacorpo', 'IA']
              },
            };
            
            setDictionary(dictionaries[id] || {
              title: id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Inconnu',
              description: 'Aucune description disponible pour ce dictionnaire.',
              words: ['Mot1', 'Mot2', 'Mot3', 'Mot4', 'Mot5']
            });
          }
        })
        .catch(error => {
          console.error("Erreur lors du chargement du dictionnaire:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger le dictionnaire",
            variant: "destructive"
          });
        });
    }
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

    // Try to save the dictionary if it's a valid ID
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

  return (
    <div className="spotify-container">
      <div className="spotify-main">
        <aside className="spotify-sidebar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Lorem Ipsum</h2>
            <ThemeToggle />
          </div>
          
          <nav className="space-y-1">
            <a href="/" className="spotify-nav-item">
              <Home size={20} />
              <span>Accueil</span>
            </a>
            <a href="/recherche" className="spotify-nav-item">
              <Search size={20} />
              <span>Rechercher</span>
            </a>
            <a href="/dictionnaires" className="spotify-nav-item">
              <Library size={20} />
              <span>Dictionnaires</span>
            </a>
          </nav>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-sidebar-foreground">DICTIONNAIRES</h3>
              <Button variant="ghost" size="icon" className="rounded-full">
                <PlusCircle size={16} />
              </Button>
            </div>
            
            <div className="space-y-2">
              <a 
                href="/dictionnaire/latin" 
                className={`block text-sm spotify-nav-item ${id === 'latin' ? 'font-bold text-spotify' : ''}`}
              >
                <Music size={16} />
                <span>Latin</span>
              </a>
              <a 
                href="/dictionnaire/developpement" 
                className={`block text-sm spotify-nav-item ${id === 'developpement' ? 'font-bold text-spotify' : ''}`}
              >
                <Layers size={16} />
                <span>Développement</span>
              </a>
              <a 
                href="/dictionnaire/biere" 
                className={`block text-sm spotify-nav-item ${id === 'biere' ? 'font-bold text-spotify' : ''}`}
              >
                <Layers size={16} />
                <span>Bière</span>
              </a>
              <a href="/creer-dictionnaire" className="block text-sm spotify-nav-item">
                <ArrowDownCircle size={16} />
                <span>Créer un dictionnaire</span>
              </a>
            </div>
          </div>
        </aside>
        
        <main className="spotify-content">
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
              <Button variant="outline" className="rounded-full">
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
