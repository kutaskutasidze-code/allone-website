'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from './Container';
import { footerLinks } from '@/data/navigation';

interface ContactInfo {
  email: string;
  location: string;
  phone?: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'hello@allone.ai',
    location: 'San Francisco, CA',
  });

  useEffect(() => {
    fetch('/api/contact-info')
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          setContactInfo(data);
        }
      })
      .catch(() => {
        // Keep default values on error
      });
  }, []);

  return (
    <footer className="py-20 border-t border-[var(--gray-200)] bg-[var(--gray-50)]">
      <Container>
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <Image
                src="/images/allone-logo.png"
                alt="Allone"
                width={32}
                height={32}
                className="group-hover:scale-105 transition-transform duration-300"
                style={{ background: 'transparent' }}
              />
              <span className="text-xl font-[var(--font-display)] font-light text-[var(--black)] tracking-tight uppercase">
                Allone
              </span>
            </Link>
            <p className="mt-6 text-sm text-[var(--gray-600)] max-w-xs leading-relaxed">
              AI automation solutions for forward-thinking businesses ready to scale.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-400)] mb-6">
              Company
            </p>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--gray-600)] hover:text-[var(--black)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-400)] mb-6">
              Services
            </p>
            <ul className="space-y-4">
              {footerLinks.services.slice(0, 4).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--gray-600)] hover:text-[var(--black)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-400)] mb-6">
              Get in Touch
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 text-lg font-[var(--font-display)] font-light text-[var(--black)] hover:text-[var(--gray-600)] transition-colors duration-300 group"
            >
              {contactInfo.email}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-[var(--gray-200)]">
          <p className="text-[11px] text-[var(--gray-400)] tracking-wide">
            &copy; {currentYear} Allone. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-[11px] text-[var(--gray-400)] hover:text-[var(--black)] transition-colors duration-300 tracking-wide"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[11px] text-[var(--gray-400)] hover:text-[var(--black)] transition-colors duration-300 tracking-wide"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
