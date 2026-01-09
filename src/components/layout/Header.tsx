'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from './Container';
import { navigation } from '@/data/navigation';
import { GlassButton } from '@/components/ui/GlassButton';
import { useContactInfo } from '@/contexts';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { contactInfo } = useContactInfo();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-500',
          isScrolled
            ? 'py-4 bg-white/95 backdrop-blur-md border-b border-[var(--gray-200)]'
            : 'py-6 bg-transparent'
        )}
      >
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <Image
                src="/images/allone-logo.png"
                alt="Allone"
                width={32}
                height={32}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-lg font-[var(--font-display)] font-light text-[var(--black)] tracking-tight uppercase">
                Allone
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm tracking-wide transition-colors duration-300 underline-animate',
                    pathname === item.href
                      ? 'text-[var(--black)]'
                      : 'text-[var(--gray-500)] hover:text-[var(--black)]'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <GlassButton
                href="/contact"
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
                className="group"
              >
                Get in touch
              </GlassButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--black)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--black)]" />
              )}
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-white"
          >
            <div className="flex flex-col h-full pt-24 pb-8 px-6">
              <nav className="flex-1 space-y-1">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'block py-3 text-xl font-[var(--font-display)] font-light border-b border-[var(--gray-200)]',
                        'transition-colors duration-300',
                        pathname === item.href
                          ? 'text-[var(--black)]'
                          : 'text-[var(--gray-400)]'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-8 border-t border-[var(--gray-200)]"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-400)] mb-3">
                  Get in touch
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-base font-[var(--font-display)] font-medium text-[var(--black)]"
                >
                  {contactInfo.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
