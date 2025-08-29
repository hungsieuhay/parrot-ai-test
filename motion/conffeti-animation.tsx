'use client';

interface ConfettiAnimationProps {
  isActive?: boolean;
  pieces?: number;
  colors?: string[];
  duration?: number;
  className?: string;
}

export const ConfettiAnimation = ({
  isActive = true,
  pieces = 50,
  colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#f9ca24',
    '#f0932b',
    '#eb4d4b',
    '#6c5ce7',
    '#a29bfe',
  ],
  duration = 3000,
  className = '',
}: ConfettiAnimationProps) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-50 overflow-hidden ${className}`}
    >
      {isActive &&
        Array.from({ length: pieces }, (_, i) => (
          <div
            key={i}
            className="animate-confettifall absolute opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 12}px`,
              backgroundColor:
                colors[Math.floor(Math.random() * colors.length)],
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 2000}ms`,
              animationDuration: `${duration + Math.random() * 2000}ms`,
              borderRadius: Math.random() > 0.5 ? '2px' : '50%',
            }}
          />
        ))}
    </div>
  );
};
