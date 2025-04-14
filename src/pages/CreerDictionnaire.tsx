
import React, { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, PlusCircle, Music, Layers, ArrowDownCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createDictionary } from "@/utils/dictionaryUtils";

const CreerDictionnaire = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [words, setWords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour le dictionnaire.",
        variant: "destructive"
      });
      return;
    }
    
    if (!words.trim()) {
      toast({
        title: "Mots requis",
        description: "Veuillez entrer au moins quelques mots pour le dictionnaire.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Process the words (split by line, trim, remove duplicates)
    const wordList = words
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0)
      .filter((word, index, self) => self.indexOf(word) === index);

    try {
      // Create the dictionary
      const success = await createDictionary(name, wordList);
      
      if (success) {
        toast({
          title: "Dictionnaire créé",
          description: `Le dictionnaire "${name}" a été créé avec succès avec ${wordList.length} mots.`,
        });
        
        // Navigate to dictionaries page after successful creation
        navigate('/dictionnaires');
      } else {
        throw new Error("Échec de la création du dictionnaire");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du dictionnaire.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to generate a slug from the dictionary name
  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD') // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with dash
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
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
              <a href="/dictionnaire/latin" className="block text-sm spotify-nav-item">
                <Music size={16} />
                <span>Latin</span>
              </a>
              <a href="/dictionnaire/developpement" className="block text-sm spotify-nav-item">
                <Layers size={16} />
                <span>Développement</span>
              </a>
              <a href="/dictionnaire/biere" className="block text-sm spotify-nav-item">
                <Layers size={16} />
                <span>Bière</span>
              </a>
              <a href="/creer-dictionnaire" className="block text-sm spotify-nav-item font-bold text-spotify">
                <ArrowDownCircle size={16} />
                <span>Créer un dictionnaire</span>
              </a>
            </div>
          </div>
        </aside>
        
        <main className="spotify-content">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-spotify">Créer un nouveau dictionnaire</h1>
            
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du dictionnaire</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Ex: Science Fiction"
                  />
                  {name && (
                    <p className="text-xs text-muted-foreground">
                      Identifiant: {generateSlug(name)}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnelle)</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Décrivez votre dictionnaire..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="words">Mots (un par ligne)</Label>
                  <Textarea 
                    id="words" 
                    value={words} 
                    onChange={e => setWords(e.target.value)} 
                    placeholder="Entrez vos mots, un par ligne..."
                    className="min-h-32"
                  />
                  {words && (
                    <p className="text-xs text-muted-foreground">
                      {words.split('\n').filter(w => w.trim().length > 0).length} mot(s)
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Création en cours...' : 'Enregistrer le dictionnaire'}
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreerDictionnaire;
