'use client';

import { ArrowRight } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface ServiceExpandCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href?: string;
  index?: number;
}

export function ServiceExpandCard({
  title,
  subtitle,
  description,
  features,
  href = '#',
  index = 0,
}: ServiceExpandCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <motion.div
      ref={cardRef}
      className="group relative w-full"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onMouseMove={handleMouseMove}
      layout
    >
      {/* Border - black/gray */}
      <div
        className="absolute -inset-[1.5px] rounded-2xl pointer-events-none transition-all duration-300"
        style={{
          background: isExpanded ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.15)',
        }}
      />

      {/* Subtle outer glow on hover */}
      <div
        className="absolute -inset-[3px] rounded-2xl pointer-events-none transition-all duration-300 blur-[2px]"
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          opacity: isExpanded ? 1 : 0,
        }}
      />

      {/* Card content */}
      <motion.div
        className={cn(
          'relative rounded-2xl bg-white overflow-hidden',
          'transition-shadow duration-300',
          isExpanded && 'shadow-lg'
        )}
        layout
      >
        {/* Main content - always visible */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono bg-[var(--gray-100)] text-[var(--gray-500)] border border-[var(--gray-200)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4 text-[var(--gray-400)] group-hover:text-[var(--accent)] transition-colors" />
            </motion.div>
          </div>

          {/* Title & Subtitle */}
          <h3 className="font-[var(--font-display)] font-semibold text-lg text-[var(--black)] leading-snug tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--gray-500)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--gray-200)] to-transparent mb-4" />

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {features.slice(0, 4).map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-[var(--gray-600)]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--black)]" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Link */}
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors group/link"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
