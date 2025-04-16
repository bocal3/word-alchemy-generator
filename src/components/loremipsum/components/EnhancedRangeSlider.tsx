
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Circle } from 'lucide-react';

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
        <Circle className="h-3 w-3 text-white fill-white stroke-gray-400" />
        <Slider 
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onValueChange}
          disabled={disabled}
          className="mx-1.5"
        />
        <Circle className="h-3 w-3 text-white fill-white stroke-gray-400" />
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
