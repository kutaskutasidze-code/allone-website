'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  /** Content for the front of the card */
  front: React.ReactNode;
  /** Content for the back of the card */
  back: React.ReactNode;
  /** Additional classes for the container */
  className?: string;
  /** Gradient color theme for the back */
  gradientTheme?: 'blue' | 'purple' | 'pink' | 'coral' | 'cyan';
  /** Height of the card */
  height?: string;
  /** Disable the flip animation */
  disabled?: boolean;
}

const gradientThemes = {
  blue: {
    from: '#3d5a80',
    via: '#5a7a9e',
    to: '#2d4a6a',
    glow: 'rgba(61, 90, 128, 0.4)',
  },
  purple: {
    from: '#7c3aed',
    via: '#a855f7',
    to: '#5b21b6',
    glow: 'rgba(124, 58, 237, 0.4)',
  },
  pink: {
    from: '#ec4899',
    via: '#f472b6',
    to: '#be185d',
    glow: 'rgba(236, 72, 153, 0.4)',
  },
  coral: {
    from: '#f97316',
    via: '#fb923c',
    to: '#c2410c',
    glow: 'rgba(249, 115, 22, 0.4)',
  },
  cyan: {
    from: '#06b6d4',
    via: '#22d3ee',
    to: '#0891b2',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
};

export function FlipCard({
  front,
  back,
  className,
  gradientTheme = 'purple',
  height = '100%',
  disabled = false,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [glowState, setGlowState] = useState({ x: 0.5, y: 0.5, intensity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });

  const theme = gradientThemes[gradientTheme];

  // Smooth animation for glow effect
  const animate = useCallback(() => {
    const lerp = 0.1;
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;

    const dx = currentRef.current.x - 0.5;
    const dy = currentRef.current.y - 0.5;
    const distance = Math.sqrt(dx * dx + dy * dy);

    setGlowState(prev => ({
      x: currentRef.current.x,
      y: currentRef.current.y,
      intensity: isFlipped ? 0 : Math.min(distance * 2, 1) * 0.4,
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [isFlipped]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    targetRef.current = { x, y };
  }, [disabled]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsFlipped(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!disabled) {
      setIsFlipped(false);
      targetRef.current = { x: 0.5, y: 0.5 };
    }
  }, [disabled]);

  const borderGradient = glowState.intensity > 0.01
    ? `radial-gradient(
        350px circle at ${glowState.x * 100}% ${glowState.y * 100}%,
        rgba(124, 58, 237, ${glowState.intensity * 0.5}),
        rgba(236, 72, 153, ${glowState.intensity * 0.35}) 30%,
        rgba(61, 90, 128, ${glowState.intensity * 0.2}) 60%,
        transparent 80%
      )`
    : 'transparent';

  return (
    <div
      ref={cardRef}
      className={cn('perspective cursor-pointer', className)}
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front side */}
        <div className="absolute inset-0 backface-hidden">
          {/* Glow border layer */}
          <div
            className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
            style={{
              background: borderGradient,
              opacity: !isFlipped && glowState.intensity > 0 ? 1 : 0,
            }}
          />

          {/* Glass background */}
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/25 via-white/15 to-white/10 backdrop-blur-xl" />

          {/* Border */}
          <div className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none" />

          {/* Top highlight */}
          <div className="absolute inset-x-[1px] top-[1px] h-[40%] rounded-t-2xl bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 h-full">{front}</div>
        </div>

        {/* Back side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {/* Colorful gradient background */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.via} 50%, ${theme.to} 100%)`,
            }}
          >
            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)`,
              }}
            />

            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Glass overlay on gradient */}
          <div className="absolute inset-[1px] rounded-2xl bg-white/5 backdrop-blur-sm" />

          {/* Border with glow */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none"
            style={{
              boxShadow: `inset 0 1px 1px rgba(255,255,255,0.2), 0 0 30px ${theme.glow}`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full text-white">{back}</div>
        </div>
      </motion.div>
    </div>
  );
}

// Subcomponents for structured card content
export function FlipCardFront({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('h-full p-5', className)}>{children}</div>;
}

export function FlipCardBack({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('h-full p-5 flex flex-col', className)}>
      {children}
    </div>
  );
}

export function FlipCardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('font-[var(--font-display)] font-semibold text-lg tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function FlipCardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm opacity-90 leading-relaxed', className)}>
      {children}
    </p>
  );
}

export function FlipCardFeatures({ features, className }: { features: string[]; className?: string }) {
  return (
    <ul className={cn('space-y-1.5 text-xs', className)}>
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1 w-1 h-1 rounded-full bg-white/60 flex-shrink-0" />
          <span className="opacity-90">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
