'use client';

import { ArrowRight, Repeat2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface ServiceFlipCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href?: string;
  index?: number;
}

export function ServiceFlipCard({
  title,
  subtitle,
  description,
  features,
  href = '#',
  index = 0,
}: ServiceFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Gradient colors matching the buttons
  const glowGradient = 'linear-gradient(135deg, rgba(124, 58, 237, 0.6), rgba(6, 182, 212, 0.5), rgba(34, 197, 94, 0.4), rgba(236, 72, 153, 0.5))';
  const glowGradientHover = 'linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(6, 182, 212, 0.7), rgba(34, 197, 94, 0.6), rgba(236, 72, 153, 0.7))';

  return (
    <div
      ref={cardRef}
      className="group relative h-[280px] sm:h-[300px] w-full [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Always-visible gradient border glow */}
      <div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none transition-all duration-500 z-0"
        style={{
          background: isFlipped ? glowGradientHover : glowGradient,
          opacity: isFlipped ? 0.8 : 0.5,
        }}
      />

      {/* Mouse-following glow on hover */}
      <div
        className="absolute -inset-[2px] rounded-2xl pointer-events-none transition-opacity duration-300 blur-[2px] z-0"
        style={{
          background: isFlipped
            ? `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px,
                rgba(124, 58, 237, 0.8),
                rgba(6, 182, 212, 0.6) 25%,
                rgba(34, 197, 94, 0.5) 50%,
                rgba(236, 72, 153, 0.4) 75%,
                transparent 100%)`
            : 'transparent',
          opacity: isFlipped ? 1 : 0,
        }}
      />

      <div
        className={cn(
          'relative h-full w-full z-10',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]'
        )}
      >
        {/* Front of card - Black */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[backface-visibility:hidden] [transform:rotateY(0deg)]',
            'overflow-hidden rounded-2xl',
            'bg-[#0a0a0a]/90 backdrop-blur-xl',
            'border border-white/10',
            'transition-all duration-700',
            isFlipped ? 'opacity-0' : 'opacity-100'
          )}
          style={{
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.15), 0 0 40px rgba(6, 182, 212, 0.1)',
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

          {/* Animated pulse rings */}
          <div className="absolute inset-0 flex items-start justify-center pt-14">
            <div className="relative flex h-[80px] w-[160px] items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  className={cn(
                    'absolute h-[40px] w-[40px]',
                    'rounded-full',
                    'animate-[scale_3s_linear_infinite]',
                    'opacity-0',
                    'shadow-[0_0_30px_rgba(124,58,237,0.4)]',
                    'group-hover:animate-[scale_2s_linear_infinite]'
                  )}
                  key={i}
                  style={{
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Front content */}
          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-mono bg-white/10 text-white/70 mb-2 border border-white/10">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-[var(--font-display)] font-semibold text-lg text-white leading-snug tracking-tight transition-all duration-500 ease-out group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="line-clamp-2 text-sm text-white/60 tracking-tight transition-all delay-[50ms] duration-500 ease-out group-hover:translate-y-[-4px]">
                  {subtitle}
                </p>
              </div>
              <div className="relative">
                <div
                  className={cn(
                    'absolute inset-[-8px] rounded-lg transition-opacity duration-300',
                    'bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-transparent'
                  )}
                />
                <Repeat2 className="relative z-10 h-4 w-4 text-white/70 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card - Black */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[backface-visibility:hidden] [transform:rotateY(180deg)]',
            'rounded-2xl p-5',
            'bg-[#0a0a0a]/95 backdrop-blur-xl',
            'border border-white/10',
            'flex flex-col',
            'transition-all duration-700',
            isFlipped ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.2), 0 0 60px rgba(6, 182, 212, 0.15)',
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />

          <div className="relative z-10 flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-[var(--font-display)] font-semibold text-lg text-white leading-snug tracking-tight">
                {title}
              </h3>
              <p className="line-clamp-2 text-sm text-white/70 tracking-tight">
                {description}
              </p>
            </div>

            <div className="space-y-2">
              {features.slice(0, 4).map((feature, i) => (
                <div
                  className="flex items-center gap-2 text-sm text-white/80 transition-all duration-500"
                  key={feature}
                  style={{
                    transform: isFlipped
                      ? 'translateX(0)'
                      : 'translateX(-10px)',
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: `${i * 100 + 200}ms`,
                  }}
                >
                  <ArrowRight className="h-3 w-3 text-purple-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-4 border-white/10 border-t pt-4">
            <Link
              href={href}
              className={cn(
                'group/start relative',
                'flex items-center justify-between',
                '-m-2 rounded-xl p-2',
                'transition-all duration-300',
                'bg-white/5',
                'hover:bg-white/10',
                'hover:scale-[1.02] cursor-pointer'
              )}
            >
              <span className="font-medium text-sm text-white/90 transition-colors duration-300">
                Learn more
              </span>
              <div className="relative">
                <div
                  className={cn(
                    'absolute inset-[-6px] rounded-lg transition-all duration-300',
                    'bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-transparent',
                    'scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100'
                  )}
                />
                <ArrowRight className="relative z-10 h-4 w-4 text-white/70 transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110 group-hover/start:text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale {
          0% {
            transform: scale(2);
            opacity: 0;
            box-shadow: 0px 0px 30px rgba(124, 58, 237, 0.5);
          }
          50% {
            transform: translate(0px, -5px) scale(1);
            opacity: 0.7;
            box-shadow: 0px 8px 25px rgba(6, 182, 212, 0.4);
          }
          100% {
            transform: translate(0px, 5px) scale(0.1);
            opacity: 0;
            box-shadow: 0px 10px 20px rgba(34, 197, 94, 0);
          }
        }
      `}</style>
    </div>
  );
}
