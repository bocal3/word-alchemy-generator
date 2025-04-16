
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Search, PlusCircle, Music, Layers, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";

const Recherche = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="spotify-container">
      <div className="spotify-main">
        <aside className="spotify-sidebar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t('app.name')}</h2>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
          
          <nav className="space-y-1">
            <a href="/" className="spotify-nav-item">
              <Home size={20} />
              <span>{t('nav.home')}</span>
            </a>
            <a href="/recherche" className="spotify-nav-item font-bold text-spotify">
              <Search size={20} />
              <span>{t('nav.search')}</span>
            </a>
            <a href="/dictionnaires" className="spotify-nav-item">
              <Library size={20} />
              <span>{t('nav.dictionaries')}</span>
            </a>
          </nav>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-sidebar-foreground">{t('nav.dictionaries')}</h3>
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
                <span>{t('dictionary.dev')}</span>
              </a>
              <a href="/creer-dictionnaire" className="block text-sm spotify-nav-item">
                <ArrowDownCircle size={16} />
                <span>{t('nav.create')}</span>
              </a>
            </div>
          </div>
        </aside>
        
        <main className="spotify-content">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-spotify">{t('search.title')}</h1>
            
            <div className="flex gap-4 mb-8">
              <Input 
                placeholder={t('search.placeholder')} 
                className="flex-1"
              />
              <Button className="bg-spotify hover:bg-spotify/90 text-spotify-foreground">
                {t('search.button')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Latin', t('dictionary.dev'), 'Fantasy', 'Cyberpunk', t('dictionary.cuisine'), 'Startup'].map((dict) => (
                <div key={dict} className="spotify-card cursor-pointer" onClick={() => navigate(`/dictionnaire/${dict.toLowerCase()}`)}>
                  <h3 className="font-bold mb-2">{dict}</h3>
                  <p className="text-sm text-muted-foreground">{t('dictionary.thematic')}</p>
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
