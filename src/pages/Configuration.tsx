
import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Settings, Download, Upload, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { getAllDictionaries, getDictionaryWords } from "@/utils/dictionaryUtils";
import { Logo } from "@/components/ui/logo";
import Sidebar from "@/components/layout/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";

const Configuration = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
          title: t('alert.error'),
          description: t('alert.config.error.message'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfigurations();
  }, [toast, t]);
  
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
        title: t('alert.success'),
        description: t('alert.config.success.message'),
      });
    } catch (error) {
      console.error("Error exporting configuration:", error);
      toast({
        title: t('alert.error'),
        description: t('alert.config.error.message'),
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
          title: t('alert.success'),
          description: t('alert.config.success.message'),
        });
      } catch (error) {
        console.error("Error importing configuration:", error);
        toast({
          title: t('alert.error'),
          description: t('alert.config.error.message'),
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfigData(e.target.value);
  };

  const handleExportAllData = async () => {
    try {
      setIsLoading(true);
      // Get all dictionaries
      const dictionaries = await getAllDictionaries();
      
      // Create an object to store all dictionary words
      const allDictionaryData: Record<string, string[]> = {};
      
      // Fetch words for each dictionary (including both default and user-added words)
      await Promise.all(dictionaries.map(async (dict) => {
        const words = await getDictionaryWords(dict.id);
        allDictionaryData[dict.id] = words;
      }));
      
      // Get created dictionaries list
      const createdDictionariesJSON = localStorage.getItem('created_dictionaries');
      const createdDictionaries = createdDictionariesJSON ? JSON.parse(createdDictionariesJSON) : [];
      
      // Create a complete data object
      const completeData = {
        dictionaries: allDictionaryData,
        createdDictionaries: createdDictionaries,
        // Add any other app data that should be included
        exportDate: new Date().toISOString(),
        appVersion: "1.0.0"
      };
      
      // Convert to JSON
      const jsonData = JSON.stringify(completeData, null, 2);
      
      // Create a blob and trigger download
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'psum-complete-data.json';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: t('alert.success'),
        description: t('alert.download.success.message').replace('{title}', 'Psum'),
      });
    } catch (error) {
      console.error("Error exporting all data:", error);
      toast({
        title: t('alert.error'),
        description: t('alert.download.error.message'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="psum-container">
      <div className="psum-main">
        <Sidebar activePage="configuration" />
        
        <main className="psum-content">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-spotify">{t('config.title')}</h1>
              <LanguageSelector />
            </div>
            
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">{t('config.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('alert.save.reminder')}
              </p>
              
              <div className="flex gap-4 mb-6">
                <Button 
                  className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                  onClick={handleExportConfig}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('config.save')}
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
                    {t('config.save')}
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-semibold mb-2">{t('config.title')}</h3>
              {isLoading ? (
                <div className="py-10 text-center text-muted-foreground">{t('generator.loading')}</div>
              ) : (
                <Textarea
                  className="font-mono text-sm h-[300px]"
                  value={configData}
                  onChange={handleTextareaChange}
                />
              )}
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">{t('config.download')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('alert.save.reminder')}
              </p>
              
              <Button 
                variant="outline" 
                className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                onClick={handleExportAllData}
                disabled={isLoading}
              >
                <DownloadCloud className="mr-2 h-4 w-4" />
                {t('config.download')}
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Configuration;
