'use client';

import { forwardRef, useRef, useEffect, useCallback, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlassButtonVariant = 'primary' | 'secondary';
type GlassButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  children?: React.ReactNode;
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  href?: string;
}

const sizeClasses: Record<GlassButtonSize, string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-sm',
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading,
      disabled,
      children,
      href,
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

    const content = (
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </span>
    );

    const commonClasses = cn(
      'relative inline-flex items-center justify-center rounded-full',
      'font-medium tracking-wide',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'primary'
        ? 'bg-[var(--black)] text-white hover:bg-[var(--black)]/90'
        : 'bg-white/80 backdrop-blur-sm text-[var(--black)] border border-[var(--gray-200)] hover:border-[var(--gray-300)] hover:bg-white',
      sizeClasses[size],
      className
    );

    // Wrapper with gradient border effect
    const wrapperContent = (
      <div
        ref={containerRef}
        className="relative group rounded-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Gradient border glow - only visible on hover */}
        <div
          className="absolute -inset-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: isHovering
              ? `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.4), rgba(236, 72, 153, 0.3) 40%, transparent 70%)`
              : 'transparent',
          }}
        />

        {href ? (
          <motion.a
            href={href}
            className={commonClasses}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
          >
            {content}
          </motion.a>
        ) : (
          <motion.button
            ref={forwardedRef}
            className={commonClasses}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
            disabled={disabled || isLoading}
            {...props}
          >
            {content}
          </motion.button>
        )}
      </div>
    );

    return wrapperContent;
  }
);

GlassButton.displayName = 'GlassButton';
