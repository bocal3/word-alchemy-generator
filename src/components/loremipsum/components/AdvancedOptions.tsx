
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RangeValue {
  min: number;
  max: number;
}

interface AdvancedOptionsProps {
  advancedOptionsOpen: boolean;
  setAdvancedOptionsOpen: (open: boolean) => void;
  wordsPerSentence: RangeValue;
  sentencesPerParagraph: RangeValue;
  generateSingleSentence: boolean;
  onWordsPerSentenceChange: (values: number[]) => void;
  onSentencesPerParagraphChange: (values: number[]) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  advancedOptionsOpen,
  setAdvancedOptionsOpen,
  wordsPerSentence,
  sentencesPerParagraph,
  generateSingleSentence,
  onWordsPerSentenceChange,
  onSentencesPerParagraphChange
}) => {
  return (
    <Collapsible open={advancedOptionsOpen} onOpenChange={setAdvancedOptionsOpen} className="border rounded-md p-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between">
          <span className="flex items-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Options avancées
          </span>
          <span className="text-xs text-muted-foreground">
            {advancedOptionsOpen ? "Masquer" : "Afficher"}
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Nombre de mots par phrase: {wordsPerSentence.min} - {wordsPerSentence.max}</h3>
            <Slider 
              defaultValue={[wordsPerSentence.min, wordsPerSentence.max]}
              min={3}
              max={20}
              step={1}
              value={[wordsPerSentence.min, wordsPerSentence.max]}
              onValueChange={onWordsPerSentenceChange}
              className="my-4"
            />
          </div>
          <div className={generateSingleSentence ? 'opacity-50' : ''}>
            <h3 className="text-sm font-medium mb-2">Nombre de phrases par paragraphe: {sentencesPerParagraph.min} - {sentencesPerParagraph.max}</h3>
            <Slider 
              defaultValue={[sentencesPerParagraph.min, sentencesPerParagraph.max]}
              min={1}
              max={12}
              step={1}
              value={[sentencesPerParagraph.min, sentencesPerParagraph.max]}
              onValueChange={onSentencesPerParagraphChange}
              className="my-4"
              disabled={generateSingleSentence}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedOptions;
