
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  src?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=200&h=200", 
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
