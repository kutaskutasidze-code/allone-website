'use client';

import { useLanguage } from '@/contexts';
import { Locale, localeNames } from '@/lib/translations';
import { motion } from 'framer-motion';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();

  const locales: Locale[] = ['en', 'ka'];

  return (
    <div
      className={`
        inline-flex items-center gap-1 p-1 rounded-full
        bg-[var(--gray-100)] border border-[var(--gray-200)]
        ${className}
      `}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className="relative px-3 py-1 text-xs font-medium tracking-wide rounded-full transition-colors duration-200"
        >
          {locale === loc && (
            <motion.div
              layoutId="language-indicator"
              className="absolute inset-0 bg-white rounded-full shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span
            className={`
              relative z-10 transition-colors duration-200
              ${locale === loc ? 'text-[var(--black)]' : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'}
            `}
          >
            {localeNames[loc]}
          </span>
        </button>
      ))}
    </div>
  );
}
