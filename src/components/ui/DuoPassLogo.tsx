import React from 'react';

interface DuoPassLogoProps {
  width?: number;
  height?: number;
  className?: string;
  fill?: string;
}

export default function DuoPassLogo({
  width = 500,
  height = 500,
  className = '',
}: DuoPassLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 500 500"
      className={className}
      role="img"
      aria-label="DuoPass Club Logo"
    >
      <defs>
        <linearGradient id="duopass-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Background Circle */}
      <circle 
        cx="250" 
        cy="250" 
        r="240" 
        fill="url(#duopass-grad1)" 
        stroke="#ffffff" 
        strokeWidth="4"
      />
      
      {/* DUO Text */}
      <text 
        x="250" 
        y="200" 
        fontFamily="Arial, sans-serif" 
        fontSize="60" 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="#ffffff"
      >
        DUO
      </text>
      
      {/* PASS Text */}
      <text 
        x="250" 
        y="280" 
        fontFamily="Arial, sans-serif" 
        fontSize="40" 
        fontWeight="normal" 
        textAnchor="middle" 
        fill="#ffffff"
      >
        PASS
      </text>
      
      {/* Club Text */}
      <text 
        x="250" 
        y="320" 
        fontFamily="Arial, sans-serif" 
        fontSize="24" 
        fontWeight="normal" 
        textAnchor="middle" 
        fill="#ffffff" 
        opacity="0.8"
      >
        Club
      </text>
      
      {/* Decorative Elements */}
      <circle cx="150" cy="150" r="8" fill="#ffffff" opacity="0.6" />
      <circle cx="350" cy="150" r="6" fill="#ffffff" opacity="0.4" />
      <circle cx="120" cy="300" r="4" fill="#ffffff" opacity="0.5" />
      <circle cx="380" cy="320" r="5" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}