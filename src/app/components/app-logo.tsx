import React from 'react';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 48 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <g>
          <path
            d="M24 0L4.5 9.5V22.5C4.5 31.58 13.06 39.81 24 42C34.94 39.81 43.5 31.58 43.5 22.5V9.5L24 0Z"
            fill="currentColor"
          />
          <path
            d="M20 30V15.75L24.5 24.75L29 15.75V30"
            stroke="hsl(var(--sidebar-background))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
