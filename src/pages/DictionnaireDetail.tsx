
import React, { useState, useEffect } from "react";
import { PlusCircle, Play, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loadDictionary, saveDictionary, getDictionaryWords, removeWordFromDictionary } from "@/utils/dictionaryUtils";
import Sidebar from "@/components/layout/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { SaveReminder } from "@/components/ui/save-reminder";

const DictionnaireDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [newWord, setNewWord] = useState("");
  const [dictionary, setDictionary] = useState<{ title: string, description: string, words: string[] }>({
    title: '',
    description: '',
    words: []
  });
  const [showReminder, setShowReminder] = useState(false);
  
  useEffect(() => {
    const loadDictionaryData = async () => {
      if (!id) return;
      
      try {
        // Get combined words from file and localStorage
        const words = await getDictionaryWords(id);
        
        setDictionary({
          title: id.charAt(0).toUpperCase() + id.slice(1),
          description: `${t('dictionary.description')} "${id}"`,
          words
        });
      } catch (error) {
        console.error("Error loading dictionary:", error);
        toast({
          title: t('alert.error'),
          description: "Unable to load dictionary",
          variant: "destructive"
        });
      }
    };
    
    loadDictionaryData();
  }, [id, toast, t]);

  const handleAddWord = () => {
    if (!newWord.trim()) {
      toast({
        title: t('alert.error'),
        description: t('dictionary.word.empty'),
        variant: "destructive"
      });
      return;
    }

    if (dictionary.words.includes(newWord.trim())) {
      toast({
        title: t('alert.error'),
        description: t('dictionary.word.exists'),
        variant: "destructive"
      });
      return;
    }

    const updatedWords = [...dictionary.words, newWord.trim()];
    setDictionary({
      ...dictionary,
      words: updatedWords
    });

    // Save the updated dictionary
    if (id) {
      saveDictionary(id, { words: updatedWords })
        .then(() => {
          toast({
            title: t('alert.success'),
            description: `"${newWord.trim()}" ${t('dictionary.word.added')}`,
          });
          setShowReminder(true);
        })
        .catch(() => {
          toast({
            description: `"${newWord.trim()}" ${t('dictionary.word.added')} (${t('alert.save.reminder')})`,
          });
        });
    }

    setNewWord("");
  };

  const handleDeleteWord = async (wordToDelete: string) => {
    if (!id) return;
    
    try {
      const success = await removeWordFromDictionary(id, wordToDelete);
      
      if (success) {
        // Update local state
        setDictionary({
          ...dictionary,
          words: dictionary.words.filter(word => word !== wordToDelete)
        });
        
        toast({
          title: t('alert.success'),
          description: `"${wordToDelete}" ${t('dictionary.word.deleted')}`,
        });
        
        setShowReminder(true);
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      toast({
        title: t('alert.error'),
        description: "Unable to delete word",
        variant: "destructive"
      });
    }
  };

  const handleGenerateText = () => {
    navigate('/', { state: { selectedDictionary: id } });
  };

  const handleDownloadDictionary = () => {
    try {
      // Create object with dictionary data
      const dictData = {
        id,
        title: dictionary.title,
        description: dictionary.description,
        words: dictionary.words
      };
      
      // Convert to JSON
      const jsonData = JSON.stringify(dictData, null, 2);
      
      // Create a blob
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `dictionnaire-${id}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: t('alert.download.success'),
        description: t('alert.download.success.message').replace('{title}', dictionary.title),
      });
    } catch (error) {
      console.error("Error downloading dictionary:", error);
      toast({
        title: t('alert.download.error'),
        description: t('alert.download.error.message'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="psum-container">
      <div className="psum-main">
        <Sidebar activePage="dictionary-detail" />
        
        <main className="psum-content">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-6 mb-8">
              <div className="w-36 h-36 bg-spotify/20 flex items-center justify-center rounded-md text-5xl font-bold text-spotify">
                {dictionary.title.charAt(0)}
              </div>
              <div>
                <Badge className="mb-2">{t('dictionary.title')}</Badge>
                <h1 className="text-4xl font-bold mb-2 text-spotify">{dictionary.title}</h1>
                <p className="text-muted-foreground">{dictionary.description}</p>
                <p className="text-muted-foreground mt-1">{dictionary.words.length} {t('create.words.count')}</p>
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <Button className="bg-spotify hover:bg-spotify/90 text-spotify-foreground rounded-full" onClick={handleGenerateText}>
                <Play className="mr-2 h-4 w-4" />
                {t('dictionary.generate')}
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={handleDownloadDictionary}
              >
                <Download className="mr-2 h-4 w-4" />
                {t('dictionary.download')}
              </Button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">{t('dictionary.add.word')}</h2>
              <div className="flex gap-2">
                <Input 
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder={t('dictionary.new.word')}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                />
                <Button onClick={handleAddWord} className="bg-spotify hover:bg-spotify/90 text-spotify-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('dictionary.add')}
                </Button>
              </div>
            </div>
            
            {showReminder && <SaveReminder />}
            
            <h2 className="text-xl font-bold mb-4">{t('dictionary.word.count')} ({dictionary.words.length})</h2>
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dictionary.words.map((word, index) => (
                  <div key={index} className="p-2 border rounded-md text-center hover:bg-accent/10 transition-colors flex justify-between items-center group">
                    <span className="flex-1 truncate">{word}</span>
                    <button 
                      onClick={() => handleDeleteWord(word)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete word"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DictionnaireDetail;
