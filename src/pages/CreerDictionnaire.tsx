
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createDictionary } from "@/utils/dictionaryUtils";
import { Save } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { SaveReminder } from "@/components/ui/save-reminder";

const CreerDictionnaire = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [words, setWords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: t('create.name.required'),
        description: t('create.name.required.message'),
        variant: "destructive"
      });
      return;
    }
    
    if (!words.trim()) {
      toast({
        title: t('create.words.required'),
        description: t('create.words.required.message'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Process the words (split by line, trim, remove duplicates)
    const wordList = words
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0)
      .filter((word, index, self) => self.indexOf(word) === index);

    try {
      // Create the dictionary
      const success = await createDictionary(name, wordList);
      
      if (success) {
        toast({
          title: t('create.success'),
          description: t('create.success.message')
            .replace('{name}', name)
            .replace('{count}', wordList.length.toString()),
        });
        
        // Navigate to dictionaries page after successful creation
        navigate('/dictionnaires');
      } else {
        throw new Error("Failed to create dictionary");
      }
    } catch (error) {
      toast({
        title: t('create.error'),
        description: t('create.error.message'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to generate a slug from the dictionary name
  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD') // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with dash
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  };

  // Show reminder when user starts typing
  const handleInput = () => {
    if (!showReminder) {
      setShowReminder(true);
    }
  };

  return (
    <div className="psum-container">
      <div className="psum-main">
        <Sidebar activePage="create-dictionary" />
        
        <main className="psum-content">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-spotify">{t('create.title')}</h1>
            
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('create.name')}</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => {
                      setName(e.target.value);
                      handleInput();
                    }} 
                    placeholder={t('create.name.placeholder')}
                  />
                  {name && (
                    <p className="text-xs text-muted-foreground">
                      {t('create.id')}: {generateSlug(name)}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('create.description')}</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={e => {
                      setDescription(e.target.value);
                      handleInput();
                    }} 
                    placeholder={t('create.description.placeholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="words">{t('create.words')}</Label>
                  <Textarea 
                    id="words" 
                    value={words} 
                    onChange={e => {
                      setWords(e.target.value);
                      handleInput();
                    }} 
                    placeholder={t('create.words.placeholder')}
                    className="min-h-32"
                  />
                  {words && (
                    <p className="text-xs text-muted-foreground">
                      {words.split('\n').filter(w => w.trim().length > 0).length} {t('create.words.count')}
                    </p>
                  )}
                </div>
                
                {showReminder && <SaveReminder />}
                
                <Button 
                  type="submit" 
                  className="bg-spotify hover:bg-spotify/90 text-spotify-foreground"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? t('create.submitting') : t('create.button')}
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreerDictionnaire;
