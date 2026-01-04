'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const sizeStyles = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
};

const iconSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

export function Logo({ className, size = 'md', showIcon = true }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      {showIcon && (
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'relative flex items-center justify-center',
            'bg-[var(--slate-950)] rounded-lg',
            iconSizes[size]
          )}
        >
          {/* Abstract AI pattern */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4/5 h-4/5"
            aria-hidden="true"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--cyan-400)]"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--cyan-300)]"
            />
          </svg>
        </motion.div>
      )}
      <span
        className={cn(
          'font-[var(--font-display)] font-bold tracking-tight',
          'text-[var(--slate-950)]',
          'group-hover:text-gradient transition-all duration-300',
          sizeStyles[size]
        )}
      >
        ALLONE
      </span>
    </Link>
  );
}
