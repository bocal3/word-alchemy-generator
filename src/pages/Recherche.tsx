
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Search, PlusCircle, Music, Layers, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Recherche = () => {
  const navigate = useNavigate();

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
            <a href="/recherche" className="spotify-nav-item font-bold text-spotify">
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
            <h1 className="text-3xl font-bold mb-6 text-spotify">Rechercher un dictionnaire</h1>
            
            <div className="flex gap-4 mb-8">
              <Input 
                placeholder="Rechercher des mots, des dictionnaires..." 
                className="flex-1"
              />
              <Button className="bg-spotify hover:bg-spotify/90 text-spotify-foreground">
                Rechercher
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Latin', 'Développement', 'Fantasy', 'Cyberpunk', 'Cuisine', 'Startup'].map((dict) => (
                <div key={dict} className="spotify-card cursor-pointer" onClick={() => navigate(`/dictionnaire/${dict.toLowerCase()}`)}>
                  <h3 className="font-bold mb-2">{dict}</h3>
                  <p className="text-sm text-muted-foreground">Dictionnaire thématique</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Recherche;
