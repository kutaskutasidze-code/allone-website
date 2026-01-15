'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Calendly types
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface CalendlyButtonProps {
  url: string;
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export function CalendlyButton({
  url,
  text = 'Schedule a Demo',
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
}: CalendlyButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Calendly script is already loaded
    if (window.Calendly) {
      setIsLoaded(true);
      return;
    }

    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      // Cleanup is optional since we want the script to persist
    };
  }, []);

  const handleClick = () => {
    if (isLoaded && window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    }
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium tracking-wide rounded-full
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--black)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[var(--black)] text-white
      hover:bg-[var(--gray-800)]
      active:scale-[0.98]
    `,
    secondary: `
      bg-[var(--gray-100)] text-[var(--black)]
      hover:bg-[var(--gray-200)]
      active:scale-[0.98]
    `,
    outline: `
      border-2 border-[var(--black)] text-[var(--black)]
      hover:bg-[var(--black)] hover:text-white
      active:scale-[0.98]
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isLoaded}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {showIcon && <Calendar className="w-4 h-4" />}
      {text}
    </button>
  );
}

// Placeholder version for when Calendly URL is not set
export function CalendlyPlaceholder({
  text = 'Schedule a Demo',
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
}: Omit<CalendlyButtonProps, 'url'>) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium tracking-wide rounded-full
    transition-all duration-300
    opacity-60 cursor-not-allowed
  `;

  const variants = {
    primary: 'bg-[var(--gray-300)] text-[var(--gray-600)]',
    secondary: 'bg-[var(--gray-100)] text-[var(--gray-500)]',
    outline: 'border-2 border-[var(--gray-300)] text-[var(--gray-500)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      type="button"
      disabled
      title="Calendly URL not configured"
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {showIcon && <Calendar className="w-4 h-4" />}
      {text}
    </button>
  );
}
