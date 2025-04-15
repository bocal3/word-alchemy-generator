
import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Settings, Download, Upload, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { getAllDictionaries } from "@/utils/dictionaryUtils";
import { Logo } from "@/components/ui/logo";
import Sidebar from "@/components/layout/Sidebar";

const Configuration = () => {
  const { toast } = useToast();
  const [configData, setConfigData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadConfigurations = async () => {
      setIsLoading(true);
      try {
        // Get all dictionaries data
        const dictionaries = await getAllDictionaries();
        
        // Get created dictionaries list
        const createdDictionariesJSON = localStorage.getItem('created_dictionaries');
        const createdDictionaries = createdDictionariesJSON ? JSON.parse(createdDictionariesJSON) : [];
        
        // Get words for each dictionary from localStorage
        const dictionaryData: Record<string, string[]> = {};
        
        // Combine all data
        dictionaries.forEach(dict => {
          const localWords = localStorage.getItem(`dictionary_${dict.id}`);
          if (localWords) {
            try {
              dictionaryData[dict.id] = JSON.parse(localWords);
            } catch (e) {
              console.error(`Error parsing dictionary ${dict.id}:`, e);
            }
          }
        });
        
        // Create configuration object
        const config = {
          dictionaries: dictionaryData,
          createdDictionaries: createdDictionaries
        };
        
        setConfigData(JSON.stringify(config, null, 2));
      } catch (error) {
        console.error("Error loading configurations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les configurations",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfigurations();
  }, [toast]);
  
  const handleExportConfig = () => {
    try {
      // Create a blob with the configuration data
      const blob = new Blob([configData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'psum-configuration.json';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Succès",
        description: "Configuration exportée avec succès",
      });
    } catch (error) {
      console.error("Error exporting configuration:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter la configuration",
        variant: "destructive"
      });
    }
  };
  
  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const config = JSON.parse(content);
        
        // Import dictionaries
        if (config.dictionaries) {
          Object.entries(config.dictionaries).forEach(([id, words]) => {
            localStorage.setItem(`dictionary_${id}`, JSON.stringify(words));
          });
        }
        
        // Import created dictionaries list
        if (config.createdDictionaries) {
          localStorage.setItem('created_dictionaries', JSON.stringify(config.createdDictionaries));
        }
        
        setConfigData(JSON.stringify(config, null, 2));
        
        toast({
          title: "Succès",
          description: "Configuration importée avec succès",
        });
      } catch (error) {
        console.error("Error importing configuration:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'importer la configuration. Vérifiez le format du fichier.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfigData(e.target.value);
  };

  return (
    <div className="psum-container">
      <div className="psum-main">
        <Sidebar activePage="configuration" />
        
        <main className="psum-content">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-spotify">Configuration</h1>
            
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Sauvegarde et restauration</h2>
              <p className="text-muted-foreground mb-4">
                Exportez vos configurations pour les sauvegarder ou les importer sur un autre appareil.
              </p>
              
              <div className="flex gap-4 mb-6">
                <Button 
                  className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                  onClick={handleExportConfig}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exporter la configuration
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    id="importFile"
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                    accept=".json"
                    onChange={handleImportConfig}
                  />
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importer une configuration
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-semibold mb-2">Configuration actuelle</h3>
              {isLoading ? (
                <div className="py-10 text-center text-muted-foreground">Chargement des configurations...</div>
              ) : (
                <Textarea
                  className="font-mono text-sm h-[300px]"
                  value={configData}
                  onChange={handleTextareaChange}
                />
              )}
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Télécharger toutes les données</h2>
              <p className="text-muted-foreground mb-4">
                Téléchargez tous vos dictionnaires et configurations dans un seul fichier.
              </p>
              
              <Button 
                variant="outline" 
                className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                onClick={handleExportConfig}
              >
                <DownloadCloud className="mr-2 h-4 w-4" />
                Télécharger toutes les données
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Configuration;
