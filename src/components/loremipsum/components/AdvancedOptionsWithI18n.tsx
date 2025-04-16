
import React from 'react';
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EnhancedRangeSlider from './EnhancedRangeSlider';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdvancedOptionsProps {
  advancedOptionsOpen: boolean;
  setAdvancedOptionsOpen: (open: boolean) => void;
  wordsPerSentence: {
    min: number;
    max: number;
  };
  sentencesPerParagraph: {
    min: number;
    max: number;
  };
  generateSingleSentence: boolean;
  onWordsPerSentenceChange: (values: number[]) => void;
  onSentencesPerParagraphChange: (values: number[]) => void;
}

const AdvancedOptionsWithI18n: React.FC<AdvancedOptionsProps> = ({
  advancedOptionsOpen,
  setAdvancedOptionsOpen,
  wordsPerSentence,
  sentencesPerParagraph,
  generateSingleSentence,
  onWordsPerSentenceChange,
  onSentencesPerParagraphChange
}) => {
  const { t } = useLanguage();

  return (
    <Collapsible open={advancedOptionsOpen} onOpenChange={setAdvancedOptionsOpen}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t('generator.advanced.options')}</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-transparent p-1 h-auto">
            {advancedOptionsOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="pt-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {t('generator.words.per.sentence')}
            </label>
            <EnhancedRangeSlider
              value={[wordsPerSentence.min, wordsPerSentence.max]}
              min={1}
              max={20}
              onValueChange={onWordsPerSentenceChange}
              disabled={generateSingleSentence}
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {t('generator.sentences.per.paragraph')}
            </label>
            <EnhancedRangeSlider
              value={[sentencesPerParagraph.min, sentencesPerParagraph.max]}
              min={1}
              max={15}
              onValueChange={onSentencesPerParagraphChange}
              disabled={generateSingleSentence}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedOptionsWithI18n;
