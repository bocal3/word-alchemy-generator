import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import { useToast } from './use-toast';

const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español'
};

const languageFlags: Record<SupportedLanguage, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸'
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang as SupportedLanguage);
    toast({
      title: "Langue sélectionnée",
      description: `La langue a été changée en ${newLang.toUpperCase()}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">{languageNames[language]}</span>
          <span className="md:hidden">{languageFlags[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem 
            key={code}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
            className={language === code ? "bg-accent" : ""}
          >
            <span className="mr-2">{languageFlags[code as SupportedLanguage]}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
