
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Search, PlusCircle, Music, Layers, ArrowDownCircle, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DictionnaireDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Cette fonction simulerait la récupération des données du dictionnaire sélectionné
  const getDictionaryData = (dictionaryId: string) => {
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
    
    return dictionaries[dictionaryId] || {
      title: id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Inconnu',
      description: 'Aucune description disponible pour ce dictionnaire.',
      words: ['Mot1', 'Mot2', 'Mot3', 'Mot4', 'Mot5']
    };
  };
  
  const dictionary = getDictionaryData(id || '');

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
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <Button className="bg-spotify hover:bg-spotify/90 text-spotify-foreground rounded-full">
                <Play className="mr-2 h-4 w-4" />
                Générer du texte
              </Button>
              <Button variant="outline" className="rounded-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Mots du dictionnaire</h2>
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dictionary.words.map((word, index) => (
                  <div key={index} className="p-2 border rounded-md text-center">
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
