import React from 'react';
import { cn } from '@/lib/utils';
import Head from './parts/Head';
import Eyes from './parts/Eyes';
import Mouth from './parts/Mouth';
import Accessory from './parts/Accessory';

export interface AvatarProps {
  headId?: number | null;
  eyesId?: number | null;
  mouthId?: number | null;
  accessoryId?: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Avatar({ 
  headId = 1, 
  eyesId = 1, 
  mouthId = 1, 
  accessoryId = null,
  className = "",
  size = "md"
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  };

  return (
    <div className={cn("relative rounded-full bg-amber-100 dark:bg-amber-800", sizeClasses[size], className)}>
      {/* Base SVG container */}
      <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Head component */}
        <Head id={headId} />
        
        {/* Eyes component */}
        <Eyes id={eyesId} />
        
        {/* Mouth component */}
        <Mouth id={mouthId} />
        
        {/* Accessory component (optional) */}
        {accessoryId && <Accessory id={accessoryId} />}
      </svg>
    </div>
  );
}