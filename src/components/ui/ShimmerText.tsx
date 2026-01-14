'use client';

import { cn } from '@/lib/utils';

interface ShimmerTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
}

export function ShimmerText({
  text,
  className,
  delay = 0,
}: ShimmerTextProps) {
  return (
    <div
      className="relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <span
        className={cn(
          'inline-block animate-shimmer-text',
          'font-[var(--font-display)]',
          className
        )}
      >
        {text}
      </span>
    </div>
  );
}
