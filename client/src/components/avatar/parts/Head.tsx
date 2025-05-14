import React from 'react';

interface HeadProps {
  id: number | null;
}

/**
 * Head component for the avatar
 * Each ID corresponds to a different head shape
 */
export default function Head({ id = 1 }: HeadProps) {
  // If no id is provided, use the default (id 1)
  const headId = id || 1;
  
  switch (headId) {
    case 1:
      return (
        // Round head
        <circle cx="50" cy="50" r="45" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />
      );
    case 2:
      return (
        // Square head with rounded corners
        <rect x="10" y="10" width="80" height="80" rx="15" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />
      );
    case 3:
      return (
        // Oval head (vertically stretched)
        <ellipse cx="50" cy="50" rx="40" ry="45" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />
      );
    case 4:
      return (
        // Pear-shaped head
        <path
          d="M50,10 C70,10 85,30 85,50 C85,75 70,90 50,90 C30,90 15,75 15,50 C15,30 30,10 50,10 Z"
          fill="#FFDFC4"
          stroke="#8B4513"
          strokeWidth="1.5"
        />
      );
    default:
      return (
        // Default to round head
        <circle cx="50" cy="50" r="45" fill="#FFDFC4" stroke="#8B4513" strokeWidth="1.5" />
      );
  }
}