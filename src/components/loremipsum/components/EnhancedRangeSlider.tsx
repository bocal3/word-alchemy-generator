
import React from 'react';
import { Slider } from '@/components/ui/slider';

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
  return (
    <div className="relative pt-1">
      <div className="flex justify-between items-center">
        <div className="h-3 w-3 rounded-full border border-gray-400"></div>
        <Slider 
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onValueChange}
          disabled={disabled}
          className="mx-1.5"
        />
        <div className="h-3 w-3 rounded-full border border-gray-400"></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">{min}</span>
        <div className="flex justify-around w-full px-8">
          <span className="text-xs text-muted-foreground">{value[0]}</span>
          <span className="text-xs text-muted-foreground">{value[1]}</span>
        </div>
        <span className="text-xs text-muted-foreground">{max}</span>
      </div>
    </div>
  );
};

export default EnhancedRangeSlider;
