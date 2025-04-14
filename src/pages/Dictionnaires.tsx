
import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { getAllDictionaries } from "@/utils/dictionaryUtils";
import { Logo } from "@/components/ui/logo";

const Dictionnaires = () => {
  const navigate = useNavigate();
  const [dictionnaires, setDictionnaires] = useState<{ id: string; label: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadDictionaries = async () => {
      setIsLoading(true);
      try {
        const dicts = await getAllDictionaries();
        setDictionnaires(dicts);
      } catch (error) {
        console.error("Error loading dictionaries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDictionaries();
  }, []);

  return (
    <div className="psum-container">
      <div className="psum-main">
        <aside className="psum-sidebar">
          <div className="flex justify-between items-center mb-6">
            <Logo />
            <ThemeToggle />
          </div>
          
          <nav className="space-y-1">
            <a href="/" className="psum-nav-item">
              <Home size={20} />
              <span>Accueil</span>
            </a>
            <a href="/dictionnaires" className="psum-nav-item-active">
              <Library size={20} />
              <span>Dictionnaires</span>
            </a>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">© 2025 Psum - Générateur de texte</p>
          </div>
        </aside>
        
        <main className="psum-content">
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
            
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">Chargement des dictionnaires...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dictionnaires.map((dict) => (
                  <Card 
                    key={dict.id} 
                    className="p-4 hover:bg-accent/50 transition-all cursor-pointer border border-border shadow-sm"
                    onClick={() => navigate(`/dictionnaire/${dict.id}`)}
                  >
                    <h3 className="font-bold mb-2">{dict.label}</h3>
                    <p className="text-sm text-muted-foreground">{dict.count} mots</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dictionnaires;
