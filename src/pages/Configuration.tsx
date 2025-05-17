import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Library, Settings, Download, Upload, DownloadCloud, Api } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { getAllDictionaries, getDictionaryWords, getCurrentLanguage } from "@/utils/dictionaryUtils";
import { Logo } from "@/components/ui/logo";
import Sidebar from "@/components/layout/Sidebar";
import { useLanguage, SupportedLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";
import { SaveReminder } from "@/components/ui/save-reminder";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Configuration = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [configData, setConfigData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadConfigurations();
  }, [toast, t]);
  
  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const allData = await exportAllData();
      setConfigData(JSON.stringify(allData, null, 2));
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
  
  // Function to gather all data for export
  const exportAllData = async () => {
    // Get current language
    const currentLang = getCurrentLanguage();
    
    // Prepare data object for all languages
    const allLanguageData: Record<SupportedLanguage, any> = {
      en: {},
      fr: {},
      es: {}
    };
    
    // Process each language
    for (const lang of ['en', 'fr', 'es'] as SupportedLanguage[]) {
      // Get all dictionaries for this language
      const dictionaries = await getAllDictionaries(lang);
      
      // Get created dictionaries list
      const createdDictionariesJSON = localStorage.getItem(`created_dictionaries_${lang}`);
      const createdDictionaries = createdDictionariesJSON ? JSON.parse(createdDictionariesJSON) : [];
      
      // Get words for each dictionary from localStorage
      const dictionaryData: Record<string, string[]> = {};
      
      // Get words for all dictionaries
      await Promise.all(
        dictionaries.map(async (dict) => {
          try {
            const words = await getDictionaryWords(dict.id, lang);
            if (words && words.length > 0) {
              dictionaryData[dict.id] = words;
            }
          } catch (e) {
            console.error(`Error processing dictionary ${dict.id}:`, e);
          }
        })
      );
      
      // Store data for this language
      allLanguageData[lang] = {
        dictionaries: dictionaryData,
        createdDictionaries
      };
    }
    
    // Create final configuration object with all languages
    const config = {
      languages: allLanguageData,
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0"
    };
    
    return config;
  };
  
  const handleExportConfig = async () => {
    try {
      setIsLoading(true);
      
      // Get all data using the exportAllData function
      const completeData = await exportAllData();
      
      // Convert to JSON
      const jsonData = JSON.stringify(completeData, null, 2);
      
      // Create a blob with the configuration data
      const blob = new Blob([jsonData], { type: 'application/json' });
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setIsLoading(true);
        const content = e.target?.result as string;
        const config = JSON.parse(content);
        
        // Import dictionaries for all languages
        if (config.languages) {
          for (const lang of ['en', 'fr', 'es'] as SupportedLanguage[]) {
            const langData = config.languages[lang];
            
            if (!langData) continue;
            
            // Import dictionaries for this language
            if (langData.dictionaries) {
              Object.entries(langData.dictionaries).forEach(([id, words]) => {
                localStorage.setItem(`dictionary_${lang}_${id}`, JSON.stringify(words));
              });
            }
            
            // Import created dictionaries list for this language
            if (langData.createdDictionaries) {
              localStorage.setItem(`created_dictionaries_${lang}`, JSON.stringify(langData.createdDictionaries));
            }
          }
        } 
        // Backward compatibility with old format
        else if (config.dictionaries) {
          const currentLang = getCurrentLanguage();
          
          // Import dictionaries
          Object.entries(config.dictionaries).forEach(([id, words]) => {
            localStorage.setItem(`dictionary_${currentLang}_${id}`, JSON.stringify(words));
          });
          
          // Import created dictionaries list
          if (config.createdDictionaries) {
            localStorage.setItem(`created_dictionaries_${currentLang}`, JSON.stringify(config.createdDictionaries));
          }
        }
        
        // Refresh the displayed data
        await loadConfigurations();
        
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
      } finally {
        setIsLoading(false);
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
      
      // Get all data using the exportAllData function
      const completeData = await exportAllData();
      
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

  const ApiExample = ({ baseUrl }: { baseUrl: string }) => (
    <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
      <code>{baseUrl}/api/fr/startup-fantasy/3/5-15/3-7</code>
    </pre>
  );

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
              <div className="flex items-center gap-2 mb-4">
                <Api className="h-5 w-5 text-spotify" />
                <h2 className="text-xl font-bold">API</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                {t('alert.api.info')}
              </p>
              
              <h3 className="font-semibold mb-2">{t('api.format')}</h3>
              <div className="bg-muted p-4 rounded-md mb-4 overflow-auto">
                <code className="text-sm">/api/:lang/:dictionaries/:paragraphCount/:wordsRange/:sentencesRange</code>
              </div>
              
              <div className="grid gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-sm">{t('api.parameters')}:</h4>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
                    <li><span className="font-mono text-primary">:lang</span> - {t('api.lang')} (en, fr, es)</li>
                    <li><span className="font-mono text-primary">:dictionaries</span> - {t('api.dictionaries')}</li>
                    <li><span className="font-mono text-primary">:paragraphCount</span> - {t('api.paragraphCount')} (1-50)</li>
                    <li><span className="font-mono text-primary">:wordsRange</span> - {t('api.wordsRange')} (min-max)</li>
                    <li><span className="font-mono text-primary">:sentencesRange</span> - {t('api.sentencesRange')} (min-max)</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="font-semibold mb-2">{t('api.example')}</h3>
              <ApiExample baseUrl={window.location.origin} />
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-4">
                    {t('api.testLive')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{t('api.title')}</DialogTitle>
                    <DialogDescription>{t('api.description')}</DialogDescription>
                  </DialogHeader>
                  <iframe
                    src={`${window.location.origin}/api/fr/startup-fantasy/2/5-15/3-7`}
                    className="w-full h-96 border rounded-md mt-4"
                  ></iframe>
                </DialogContent>
              </Dialog>
            </Card>
            
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
