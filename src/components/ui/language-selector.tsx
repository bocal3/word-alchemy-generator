
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';

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
  const { language, setLanguage, t } = useLanguage();

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
            onClick={() => setLanguage(code as SupportedLanguage)}
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
