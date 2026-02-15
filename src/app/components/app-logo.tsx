import React from 'react';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle cx="50" cy="50" r="50" fill="hsl(var(--primary))" />
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="Merriweather, serif"
          fontSize="60"
          fontWeight="bold"
          fill="hsl(var(--primary-foreground))"
        >
          M
        </text>
      </svg>
    </div>
  );
}
