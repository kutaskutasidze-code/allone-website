'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '@/components/layout';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useRef } from 'react';

interface ContactInfo {
  email: string;
  location: string;
  phone?: string;
}

interface ContactContentProps {
  contactInfo: ContactInfo;
}

export function ContactContent({ contactInfo }: ContactContentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <section ref={sectionRef} className="pt-28 pb-20 lg:pt-36 lg:pb-28 relative overflow-hidden min-h-[85vh]">
      <Container>
        <motion.div
          className="max-w-3xl mx-auto text-center"
          style={{ y, opacity }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[var(--accent)] text-sm font-medium tracking-wide mb-4"
          >
            Contact
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-display)] font-light text-[var(--black)] leading-tight mb-6"
          >
            Let's connect
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[var(--gray-600)] mb-12"
          >
            Have a project in mind? We'd love to hear from you.
          </motion.p>

          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassPanel padding="xl" rounded="3xl" className="mb-10">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Email */}
                <motion.a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-[var(--gray-100)]/50"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/15 transition-colors">
                    <Mail className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-[var(--gray-500)] mb-2">Email</span>
                  <span className="text-base font-medium text-[var(--black)] group-hover:text-[var(--accent)] transition-colors">
                    {contactInfo.email}
                  </span>
                </motion.a>

                {/* Phone (if available) */}
                {contactInfo.phone && (
                  <motion.a
                    href={`tel:${contactInfo.phone}`}
                    className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-[var(--gray-100)]/50"
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/15 transition-colors">
                      <Phone className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-[var(--gray-500)] mb-2">Phone</span>
                    <span className="text-base font-medium text-[var(--black)] group-hover:text-[var(--accent)] transition-colors">
                      {contactInfo.phone}
                    </span>
                  </motion.a>
                )}

                {/* Location */}
                <motion.div
                  className="flex flex-col items-center p-4 rounded-2xl"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-[var(--gray-500)] mb-2">Location</span>
                  <span className="text-base font-medium text-[var(--black)]">
                    {contactInfo.location}
                  </span>
                </motion.div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Response time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-2 text-sm text-[var(--gray-500)]"
          >
            <Clock className="w-4 h-4" />
            <span>We typically respond within 24 hours</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
