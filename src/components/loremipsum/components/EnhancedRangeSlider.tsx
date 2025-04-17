
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedRangeSliderProps {
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  onValueChange: (values: number[]) => void;
  disabled?: boolean;
}

const EnhancedRangeSlider: React.FC<EnhancedRangeSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  disabled = false
}) => {
  const { t } = useLanguage();

  return (
    <div className="relative pt-1">
      <Slider 
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
        disabled={disabled}
        className="mx-1.5"
      />
      <div className="flex justify-between mt-1">
        <div className="flex justify-between w-full">
          <span className="text-xs text-muted-foreground">{value[0]}</span>
          <span className="text-xs text-muted-foreground">{value[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRangeSlider;
