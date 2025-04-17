import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dictionary } from './utils/generateLorem';
import { getAllDictionaries } from '@/utils/dictionaryUtils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function DictionarySelector() {
  const { language } = useLanguage();
  const [dictionaries, setDictionaries] = useState<{ id: string; label: string; count: number }[]>([]);

  useEffect(() => {
    // Afficher l'alerte de langue au chargement
    alert("Voici la langue : " + language.toUpperCase());

    // Charger les dictionnaires
    const loadDictionaries = async () => {
      const allDictionaries = await getAllDictionaries();
      setDictionaries(allDictionaries);
    };
    loadDictionaries();
  }, [language]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dictionaries.map((dict) => (
        <Link key={dict.id} to={`/dictionary/${dict.id}`}>
          <Button variant="outline" className="w-full h-full p-4 flex flex-col items-start">
            <span className="font-semibold">{dict.label}</span>
            <span className="text-sm text-muted-foreground">
              {dict.count} mots
            </span>
          </Button>
        </Link>
      ))}
    </div>
  );
} 