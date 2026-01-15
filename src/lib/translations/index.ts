import { en } from './en';
import { ka } from './ka';

export type Locale = 'en' | 'ka';

export const translations = {
  en,
  ka,
} as const;

export const localeNames: Record<Locale, string> = {
  en: 'EN',
  ka: 'KA',
};

export const localeFullNames: Record<Locale, string> = {
  en: 'English',
  ka: 'ქართული',
};

// Helper to get nested translation value
export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          return key; // Return key if not found at all
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}

export { en, ka };
