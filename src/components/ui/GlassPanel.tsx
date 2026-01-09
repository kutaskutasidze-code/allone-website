'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlassPanelPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  children?: React.ReactNode;
  padding?: GlassPanelPadding;
  hover?: boolean;
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  as?: 'div' | 'article' | 'section' | 'aside';
}

const paddingClasses: Record<GlassPanelPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const roundedClasses: Record<NonNullable<GlassPanelProps['rounded']>, string> = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      children,
      padding = 'md',
      hover = false,
      rounded = '2xl',
      as = 'div',
      ...props
    },
    forwardedRef
  ) => {
    const MotionComponent = motion[as] as typeof motion.div;

    return (
      <div className={cn('relative group', roundedClasses[rounded])}>
        {/* Static gradient border */}
        <div
          className={cn(
            'absolute -inset-[1px] transition-all duration-300 pointer-events-none',
            'bg-gradient-to-b from-[var(--gray-200)] via-[var(--gray-300)] to-[var(--gray-400)]',
            'group-hover:from-[var(--gray-300)] group-hover:via-[var(--gray-400)] group-hover:to-[var(--gray-500)]',
            roundedClasses[rounded]
          )}
        />

        <MotionComponent
          ref={forwardedRef}
          className={cn(
            'relative',
            'bg-white',
            paddingClasses[padding],
            roundedClasses[rounded],
            'transition-all duration-300',
            hover && 'group-hover:-translate-y-0.5',
            'shadow-sm group-hover:shadow-lg',
            className
          )}
          {...props}
        >
          {children}
        </MotionComponent>
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

// Simple compound components
export const GlassPanelHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mb-4', className)} {...props} />
));
GlassPanelHeader.displayName = 'GlassPanelHeader';

export const GlassPanelTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }
>(({ className, as: Tag = 'h3', ...props }, ref) => (
  <Tag
    ref={ref}
    className={cn(
      'font-[var(--font-display)] font-semibold text-[var(--black)] tracking-tight',
      className
    )}
    {...props}
  />
));
GlassPanelTitle.displayName = 'GlassPanelTitle';

export const GlassPanelContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-[var(--gray-600)]', className)} {...props} />
));
GlassPanelContent.displayName = 'GlassPanelContent';

export const GlassPanelFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-6 pt-4 border-t border-[var(--gray-200)]/50', className)} {...props} />
));
GlassPanelFooter.displayName = 'GlassPanelFooter';
