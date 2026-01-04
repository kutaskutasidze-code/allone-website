'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'bordered' | 'filled';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-white',
  bordered: 'bg-white border border-[var(--gray-200)]',
  filled: 'bg-[var(--gray-50)]',
};

const paddingStyles = {
  none: '',
  sm: 'p-5',
  md: 'p-7',
  lg: 'p-10',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = false,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4 } : undefined}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'transition-all duration-300',
          variantStyles[variant],
          paddingStyles[padding],
          hover && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
  as?: 'h2' | 'h3' | 'h4';
}

export function CardTitle({ className, children, as: Tag = 'h3' }: CardTitleProps) {
  return (
    <Tag
      className={cn(
        'font-[var(--font-serif)] font-medium text-black',
        Tag === 'h2' && 'text-3xl',
        Tag === 'h3' && 'text-2xl',
        Tag === 'h4' && 'text-xl',
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <p className={cn('text-[var(--gray-600)] leading-relaxed', className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn('mt-6 pt-6 border-t border-[var(--gray-100)]', className)}>
      {children}
    </div>
  );
}
