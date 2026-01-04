'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'dark' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--gray-100)] text-[var(--gray-700)]',
  dark: 'bg-black text-white',
  outline: 'bg-transparent border border-[var(--gray-300)] text-[var(--gray-600)]',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1',
        'text-xs font-medium uppercase tracking-wider',
        'transition-colors duration-200',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
