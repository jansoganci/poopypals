import React from 'react';

interface AccessoryProps {
  id: number | null;
}

/**
 * Accessory component for the avatar
 * Each ID corresponds to a different accessory style
 */
export default function Accessory({ id = null }: AccessoryProps) {
  // If no id is provided, return nothing
  if (!id) return null;
  
  switch (id) {
    case 1:
      return (
        // Party hat
        <path
          d="M35,15 L50,0 L65,15 C65,15 55,20 50,18 C45,20 35,15 35,15 Z"
          fill="#FFC107"
          stroke="#8B4513"
          strokeWidth="1.5"
        />
      );
    case 2:
      return (
        // Glasses
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
        // Crown
        <path
          d="M35,15 L40,25 L50,18 L60,25 L65,15 L65,25 C65,25 55,30 50,30 C45,30 35,25 35,25 L35,15 Z"
          fill="#FFD700"
          stroke="#8B4513"
          strokeWidth="1.5"
        />
      );
    case 4:
      return (
        // Bowtie
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
}