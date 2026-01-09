'use client';

import { forwardRef } from 'react';
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
  lg: 'px-8 py-3.5 text-sm',
};

// Generate smooth keyframes (24 steps for ultra-smooth rotation)
const generateGlowKeyframes = () => {
  const steps = 24;
  const keyframes: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const x = Math.sin(angle) * 2;
    const y = -Math.cos(angle) * 2;
    const x2 = Math.sin(angle) * 1;
    const y2 = -Math.cos(angle) * 1;
    keyframes.push(
      `inset ${x.toFixed(2)}px ${y.toFixed(2)}px 8px rgba(255,255,255,0.5), inset ${x2.toFixed(2)}px ${y2.toFixed(2)}px 3px rgba(255,255,255,0.7)`
    );
  }
  return keyframes;
};

const glowKeyframes = generateGlowKeyframes();

function AnimatedGlowButton({
  children,
  className,
  size,
  href,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  size: GlassButtonSize;
  href?: string;
} & Omit<HTMLMotionProps<'button'>, 'ref' | 'children'>) {
  const buttonContent = (
    <>
      {/* Black background with animated inner glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--black)] border border-zinc-600"
        animate={{ boxShadow: glowKeyframes }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }
        }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </>
  );

  const commonClasses = cn(
    'relative inline-flex items-center justify-center rounded-full',
    'font-medium tracking-wide text-white',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gray-400)]/30 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={commonClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={commonClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
}

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

    const isPrimary = variant === 'primary';

    // Use animated glow button for primary variant
    if (isPrimary) {
      return (
        <AnimatedGlowButton
          className={className}
          size={size}
          href={href}
          disabled={disabled || isLoading}
          {...props}
        >
          {content}
        </AnimatedGlowButton>
      );
    }

    // Secondary variant - regular button
    const commonClasses = cn(
      'relative inline-flex items-center justify-center rounded-full',
      'font-medium tracking-wide',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gray-400)]/30 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'border',
      'bg-white text-[var(--black)] border-[var(--gray-300)] hover:border-[var(--gray-400)]',
      sizeClasses[size],
      className
    );

    if (href) {
      return (
        <motion.a
          href={href}
          className={commonClasses}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={forwardedRef}
        className={commonClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
