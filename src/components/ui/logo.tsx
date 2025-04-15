
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <span 
      className={cn(
        "text-2xl font-bold", 
        className
      )}
      style={{ color: '#668fcc' }}
    >
      [Psum]
    </span>
  );
};
