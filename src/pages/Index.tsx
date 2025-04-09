
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Search, PlusCircle, Music, Layers, ArrowDownCircle } from "lucide-react";
import { LoremGenerator } from "@/components/loremipsum";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="spotify-container">
      <div className="spotify-main">
        <aside className="spotify-sidebar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Lorem Ipsum</h2>
            <ThemeToggle />
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="spotify-nav-item">
              <Home size={20} />
              <span>Accueil</span>
            </a>
            <a href="#" className="spotify-nav-item">
              <Search size={20} />
              <span>Rechercher</span>
            </a>
            <a href="#" className="spotify-nav-item">
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
              <a href="#" className="block text-sm spotify-nav-item">
                <Music size={16} />
                <span>Latin</span>
              </a>
              <a href="#" className="block text-sm spotify-nav-item">
                <Layers size={16} />
                <span>Développement</span>
              </a>
              <a href="#" className="block text-sm spotify-nav-item">
                <ArrowDownCircle size={16} />
                <span>Créer un dictionnaire</span>
              </a>
            </div>
          </div>
        </aside>
        
        <main className="spotify-content">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Générateur Lorem Ipsum</h1>
            <div className="animate-fade-in">
              <LoremGenerator />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
