
import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { getAllDictionaries } from "@/utils/dictionaryUtils";
import Sidebar from "@/components/layout/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

const Dictionnaires = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [dictionnaires, setDictionnaires] = useState<{ id: string; label: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadDictionaries = async () => {
      setIsLoading(true);
      try {
        const dicts = await getAllDictionaries(language);
        setDictionnaires(dicts);
      } catch (error) {
        console.error("Error loading dictionaries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDictionaries();
  }, [language]);

  return (
    <div className="psum-container">
      <div className="psum-main">
        <Sidebar activePage="dictionaries" />
        
        <main className="psum-content">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-spotify">{t('dictionaries.all')}</h1>
              <Button 
                className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                onClick={() => navigate('/creer-dictionnaire')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('nav.create')}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">{t('generator.loading')}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dictionnaires.map((dict) => (
                  <Card 
                    key={dict.id} 
                    className="p-4 hover:bg-accent/50 transition-all cursor-pointer border border-border shadow-sm"
                    onClick={() => navigate(`/dictionnaire/${dict.id}`)}
                  >
                    <h3 className="font-bold mb-2">{dict.label}</h3>
                    <p className="text-sm text-muted-foreground">{dict.count} {t('create.words.count')}</p>
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
