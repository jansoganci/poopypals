import React from 'react';

interface MouthProps {
  id: number | null;
}

/**
 * Mouth component for the avatar
 * Each ID corresponds to a different mouth style
 */
export default function Mouth({ id = 1 }: MouthProps) {
  // If no id is provided, use the default (id 1)
  const mouthId = id || 1;
  
  switch (mouthId) {
    case 1:
      return (
        // Simple smile
        <path
          d="M35,60 Q50,70 65,60"
          stroke="#8B4513"
          strokeWidth="2"
          fill="none"
        />
      );
    case 2:
      return (
        // Open mouth (surprised)
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
        // Grin with teeth
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
        // Neutral line
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
        // Default to simple smile
        <path
          d="M35,60 Q50,70 65,60"
          stroke="#8B4513"
          strokeWidth="2"
          fill="none"
        />
      );
  }
}