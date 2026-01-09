'use client';

import { motion } from 'framer-motion';
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
  as: Component = 'h1',
  delay = 0,
}: ShimmerTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden"
    >
      <motion.span
        animate={{
          backgroundPosition: ['200% center', '-200% center'],
        }}
        className={cn(
          'inline-block bg-[length:200%_100%] bg-gradient-to-r',
          'from-[var(--black)] via-[var(--gray-400)] to-[var(--black)]',
          'bg-clip-text text-transparent',
          'font-[var(--font-display)]',
          className
        )}
        transition={{
          duration: 3,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}
