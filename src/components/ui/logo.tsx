
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  src?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  src = "/src/img/logo.png", 
  alt = "Psum Logo" 
}) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn("w-10 h-10 rounded-full object-cover", className)}
    />
  );
};
