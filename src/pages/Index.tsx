
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoremGenerator } from "@/components/loremipsum";
import { discoverDictionaries } from "@/utils/dictionaryUtils";
import Sidebar from "@/components/layout/Sidebar";

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
        <Sidebar activePage="home" />
        
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
