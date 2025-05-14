import React from 'react';

interface EyesProps {
  id: number | null;
}

/**
 * Eyes component for the avatar
 * Each ID corresponds to a different eyes style
 */
export default function Eyes({ id = 1 }: EyesProps) {
  // If no id is provided, use the default (id 1)
  const eyesId = id || 1;
  
  switch (eyesId) {
    case 1:
      return (
        // Simple round eyes
        <>
          <circle cx="35" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <circle cx="65" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <circle cx="35" cy="40" r="2" fill="#000000" />
          <circle cx="65" cy="40" r="2" fill="#000000" />
        </>
      );
    case 2:
      return (
        // Sleepy/happy eyes (curved lines)
        <>
          <path d="M30,40 Q35,35 40,40" stroke="#000000" strokeWidth="2" fill="none" />
          <path d="M60,40 Q65,35 70,40" stroke="#000000" strokeWidth="2" fill="none" />
        </>
      );
    case 3:
      return (
        // Surprised/wide eyes
        <>
          <circle cx="35" cy="40" r="7" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <circle cx="65" cy="40" r="7" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <circle cx="35" cy="40" r="3" fill="#000000" />
          <circle cx="65" cy="40" r="3" fill="#000000" />
        </>
      );
    case 4:
      return (
        // Winking eyes
        <>
          <circle cx="35" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <circle cx="35" cy="40" r="2" fill="#000000" />
          <path d="M60,40 Q65,36 70,40" stroke="#000000" strokeWidth="2" fill="none" />
        </>
      );
    default:
      return (
        // Default to simple round eyes
        <>
          <circle cx="35" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <circle cx="65" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <circle cx="35" cy="40" r="2" fill="#000000" />
          <circle cx="65" cy="40" r="2" fill="#000000" />
        </>
      );
  }
}