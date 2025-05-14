import React from 'react';
import { cn } from '@/lib/utils';

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

  // Render head based on headId
  const renderHead = () => {
    switch (headId) {
      case 1:
        return <circle cx="50" cy="50" r="45" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />;
      case 2:
        return <rect x="10" y="10" width="80" height="80" rx="15" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />;
      case 3:
        return <ellipse cx="50" cy="50" rx="40" ry="45" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />;
      case 4:
        return (
          <path
            d="M50,10 C70,10 85,30 85,50 C85,75 70,90 50,90 C30,90 15,75 15,50 C15,30 30,10 50,10 Z"
            fill="#FFDFC4"
            stroke="#8B4513"
            strokeWidth="1.5"
          />
        );
      default:
        return <circle cx="50" cy="50" r="45" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />;
    }
  };

  // Render eyes based on eyesId
  const renderEyes = () => {
    switch (eyesId) {
      case 1:
        return (
          <>
            <circle cx="35" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="65" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="35" cy="40" r="2" fill="#000000" />
            <circle cx="65" cy="40" r="2" fill="#000000" />
          </>
        );
      case 2:
        return (
          <>
            <path d="M30,40 Q35,35 40,40" stroke="#000000" strokeWidth="2" fill="none" />
            <path d="M60,40 Q65,35 70,40" stroke="#000000" strokeWidth="2" fill="none" />
          </>
        );
      case 3:
        return (
          <>
            <circle cx="35" cy="40" r="7" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="65" cy="40" r="7" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="35" cy="40" r="3" fill="#000000" />
            <circle cx="65" cy="40" r="3" fill="#000000" />
          </>
        );
      case 4:
        return (
          <>
            <circle cx="35" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="35" cy="40" r="2" fill="#000000" />
            <path d="M60,40 Q65,36 70,40" stroke="#000000" strokeWidth="2" fill="none" />
          </>
        );
      default:
        return (
          <>
            <circle cx="35" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="65" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            <circle cx="35" cy="40" r="2" fill="#000000" />
            <circle cx="65" cy="40" r="2" fill="#000000" />
          </>
        );
    }
  };

  // Render mouth based on mouthId
  const renderMouth = () => {
    switch (mouthId) {
      case 1:
        return (
          <path
            d="M35,60 Q50,70 65,60"
            stroke="#8B4513"
            strokeWidth="2"
            fill="none"
          />
        );
      case 2:
        return (
          <ellipse
            cx="50"
            cy="65"
            rx="10"
            ry="7"
            fill="#8B4513"
          />
        );
      case 3:
        return (
          <>
            <path
              d="M30,60 Q50,75 70,60"
              stroke="#8B4513"
              strokeWidth="2"
              fill="#FFD1DC"
            />
            <path
              d="M35,60 L35,65 M45,60 L45,68 M55,60 L55,68 M65,60 L65,65"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </>
        );
      case 4:
        return (
          <line
            x1="35"
            y1="65"
            x2="65"
            y2="65"
            stroke="#8B4513"
            strokeWidth="2"
          />
        );
      default:
        return (
          <path
            d="M35,60 Q50,70 65,60"
            stroke="#8B4513"
            strokeWidth="2"
            fill="none"
          />
        );
    }
  };

  // Render accessory based on accessoryId
  const renderAccessory = () => {
    if (!accessoryId) return null;
    
    switch (accessoryId) {
      case 1:
        return (
          <path
            d="M35,15 L50,0 L65,15 C65,15 55,20 50,18 C45,20 35,15 35,15 Z"
            fill="#FFC107"
            stroke="#8B4513"
            strokeWidth="1.5"
          />
        );
      case 2:
        return (
          <>
            <circle
              cx="35"
              cy="40"
              r="8"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
            />
            <circle
              cx="65"
              cy="40"
              r="8"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
            />
            <line
              x1="43"
              y1="40"
              x2="57"
              y2="40"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </>
        );
      case 3:
        return (
          <path
            d="M35,15 L40,25 L50,18 L60,25 L65,15 L65,25 C65,25 55,30 50,30 C45,30 35,25 35,25 L35,15 Z"
            fill="#FFD700"
            stroke="#8B4513"
            strokeWidth="1.5"
          />
        );
      case 4:
        return (
          <path
            d="M40,75 L35,80 L40,85 L50,82 L60,85 L65,80 L60,75 L50,78 L40,75 Z"
            fill="#FF5252"
            stroke="#8B4513"
            strokeWidth="1"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative rounded-full bg-amber-100 dark:bg-amber-800", sizeClasses[size], className)}>
      {/* Base SVG container */}
      <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Render avatar parts */}
        {renderHead()}
        {renderEyes()}
        {renderMouth()}
        {renderAccessory()}
      </svg>
    </div>
  );
}