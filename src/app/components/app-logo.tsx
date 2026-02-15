import React from 'react';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M250 450C250 450 400 350 400 150H100C100 350 250 450 250 450Z"
          fill="black"
        />

        <path
          d="M250 430C250 430 380 340 380 165H120C120 340 250 430 250 430Z"
          fill="white"
        />

        <path
          d="M180 130L200 100L250 130L300 100L320 130V140H180V130Z"
          fill="black"
        />

        <text
          x="50%"
          y="65%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="Serif, 'Times New Roman'"
          fontSize="160"
          fontWeight="bold"
          fill="black"
        >
          M
        </text>

        <path
          d="M80 200Q40 250 80 350M420 200Q460 250 420 350"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
