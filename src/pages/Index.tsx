
import React, { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library } from "lucide-react";
import { LoremGenerator } from "@/components/loremipsum";
import { useLocation } from "react-router-dom";
import { discoverDictionaries } from "@/utils/dictionaryUtils";

const Index = () => {
  const location = useLocation();
  const [dictionaries, setDictionaries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedDictionary = location.state?.selectedDictionary;
  
  useEffect(() => {
    const loadDictionaries = async () => {
      setIsLoading(true);
      try {
        const dicts = await discoverDictionaries();
        setDictionaries(dicts);
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
            <h2 className="text-xl font-bold text-spotify">Psum</h2>
            <ThemeToggle />
          </div>
          
          <nav className="space-y-1">
            <a href="/" className="psum-nav-item-active">
              <Home size={20} />
              <span>Accueil</span>
            </a>
            <a href="/dictionnaires" className="psum-nav-item">
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
            <h1 className="text-3xl font-bold mb-6 text-spotify">Générateur Psum</h1>
            <div className="animate-fade-in rounded-xl overflow-hidden bg-card p-6 shadow-sm border border-border">
              {isLoading ? (
                <div className="py-10 text-center text-muted-foreground">Chargement des dictionnaires...</div>
              ) : (
                <LoremGenerator 
                  initialDictionary={selectedDictionary} 
                  availableDictionaries={dictionaries}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
