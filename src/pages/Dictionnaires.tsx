
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Search, PlusCircle, Music, Layers, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Dictionnaires = () => {
  const navigate = useNavigate();
  
  const dictionnaires = [
    { id: 'latin', label: 'Latin', count: 200 },
    { id: 'viande', label: 'Viande', count: 120 },
    { id: 'jeu', label: 'Jeu', count: 180 },
    { id: 'biere', label: 'Bière', count: 90 },
    { id: 'hipster', label: 'Hipster', count: 150 },
    { id: 'developpement', label: 'Développement', count: 220 },
    { id: 'it', label: 'IT', count: 180 },
    { id: 'cuisine', label: 'Cuisine', count: 130 },
    { id: 'fantasy', label: 'Fantasy', count: 170 },
    { id: 'cyberpunk', label: 'Cyberpunk', count: 140 },
    { id: 'philosophie', label: 'Philosophie', count: 110 }
  ];

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
            <a href="/dictionnaires" className="spotify-nav-item font-bold text-spotify">
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
              <a href="/creer-dictionnaire" className="block text-sm spotify-nav-item">
                <ArrowDownCircle size={16} />
                <span>Créer un dictionnaire</span>
              </a>
            </div>
          </div>
        </aside>
        
        <main className="spotify-content">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-spotify">Tous les dictionnaires</h1>
              <Button 
                className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                onClick={() => navigate('/creer-dictionnaire')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Créer un dictionnaire
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dictionnaires.map((dict) => (
                <Card 
                  key={dict.id} 
                  className="p-4 hover:bg-accent/10 transition-all cursor-pointer"
                  onClick={() => navigate(`/dictionnaire/${dict.id}`)}
                >
                  <h3 className="font-bold mb-2">{dict.label}</h3>
                  <p className="text-sm text-muted-foreground">{dict.count} mots</p>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dictionnaires;
