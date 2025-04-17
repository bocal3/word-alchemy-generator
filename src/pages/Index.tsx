import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoremGenerator } from "@/components/loremipsum";
import { discoverDictionaries } from "@/components/loremipsum/utils/generateLorem";
import Sidebar from "@/components/layout/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const location = useLocation();
  const { t, language } = useLanguage();
  const [dictionaries, setDictionaries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [folderContent, setFolderContent] = useState<string>(''); // État pour le contenu du dossier
  const selectedDictionary = location.state?.selectedDictionary;

  useEffect(() => {
    const loadDictionaries = async () => {
      console.log(`🌍 Langue actuelle : ${language}`);
      setIsLoading(true);
      try {
        const dicts = await discoverDictionaries(language);
        setDictionaries(dicts);
        console.log(`📚 Dictionnaires chargés :`, dicts);

        // Mettre à jour le contenu du dossier dans l'état
        setFolderContent(`📂 Contenu du dossier pour la langue "${language}" :\n${dicts.join(', ')}`);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des dictionnaires :", error);
        setFolderContent(`❌ Erreur lors du chargement des dictionnaires pour la langue "${language}".`);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionaries();
  }, [language]); // Recharge les dictionnaires à chaque changement de langue

  return (
    <div className="psum-container">
      <div className="psum-main">
        <Sidebar activePage="home" />
        
        <main className="psum-content">
          <div className="max-w-4xl mx-auto">
            {/* Label pour afficher le contenu du dossier */}
            <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{folderContent}</p>
            <h1 className="text-3xl font-bold mb-6 text-spotify">{t('generator.title')}</h1>
            <div className="animate-fade-in rounded-xl overflow-hidden bg-card p-6 shadow-sm border border-border">
              {isLoading ? (
                <div className="py-10 text-center text-muted-foreground">{t('generator.loading')}</div>
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
