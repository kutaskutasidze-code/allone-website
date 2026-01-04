'use client';

import { forwardRef, useRef, useState, useCallback } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }, []);

    const MotionComponent = motion[as] as typeof motion.div;

    return (
      <div
        ref={containerRef}
        className={cn('relative group', roundedClasses[rounded])}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Gradient border glow - only visible on hover */}
        <div
          className={cn(
            'absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
            roundedClasses[rounded]
          )}
          style={{
            background: isHovering
              ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.25), rgba(236, 72, 153, 0.15) 50%, transparent 80%)`
              : 'transparent',
          }}
        />

        <MotionComponent
          ref={forwardedRef}
          className={cn(
            'relative',
            'bg-white/60 backdrop-blur-md',
            'border border-[var(--gray-200)]/60',
            paddingClasses[padding],
            roundedClasses[rounded],
            hover && 'transition-all duration-300 hover:bg-white/80 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5',
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
