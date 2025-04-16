
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface GeneratorOptionsProps {
  paragraphCount: number;
  generateSingleSentence: boolean;
  onParagraphCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSingleSentenceChange: () => void;
}

const GeneratorOptions: React.FC<GeneratorOptionsProps> = ({
  paragraphCount,
  generateSingleSentence,
  onParagraphCountChange,
  onSingleSentenceChange
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-4">
      <div className={`flex items-center space-x-2 ${generateSingleSentence ? 'opacity-50' : ''}`}>
        <Label htmlFor="paragraph-count" className="text-sm font-medium">{t('generator.paragraphs')}:</Label>
        <Input
          id="paragraph-count"
          type="number"
          min="1"
          max="10"
          value={paragraphCount}
          onChange={onParagraphCountChange}
          className="w-20"
          disabled={generateSingleSentence}
        />
        <span className="text-xs text-muted-foreground">(1-10)</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="single-sentence" 
          checked={generateSingleSentence} 
          onCheckedChange={onSingleSentenceChange}
        />
        <Label htmlFor="single-sentence" className="text-sm">
          {t('generator.single.sentence')}
        </Label>
      </div>
    </div>
  );
};

export default GeneratorOptions;
