
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface Dictionary {
  id: string;
  label: string;
}

interface DictionarySelectorProps {
  dictionaries: Dictionary[];
  selectedDictionaries: Record<string, boolean>;
  areAllSelected: boolean;
  onDictionaryChange: (id: string) => void;
  onSelectAll: () => void;
}

const DictionarySelector: React.FC<DictionarySelectorProps> = ({
  dictionaries,
  selectedDictionaries,
  areAllSelected,
  onDictionaryChange,
  onSelectAll
}) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">{t('generator.select.dictionaries')}</h2>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="checkbox-select-all" 
            checked={areAllSelected} 
            onCheckedChange={onSelectAll}
          />
          <Label htmlFor="checkbox-select-all" className="text-sm">
            {t('generator.select.all')}
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {dictionaries.map((dict) => (
          <div key={dict.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`checkbox-${dict.id}`} 
              checked={selectedDictionaries[dict.id] || false} 
              onCheckedChange={() => onDictionaryChange(dict.id)}
            />
            <Label htmlFor={`checkbox-${dict.id}`} className="text-sm">
              {dict.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DictionarySelector;
