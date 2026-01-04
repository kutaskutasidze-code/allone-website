'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '@/components/layout';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useRef } from 'react';
import type { Client } from '@/types/database';

interface ClientsProps {
  clients?: Client[];
}

// Inner component that uses scroll animations
function ClientsContent({ clients }: { clients: Client[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden">
      <Container>
        <motion.div style={{ opacity, y }}>
          {/* Glass container for the entire section */}
          <GlassPanel padding="lg" rounded="3xl" className="backdrop-blur-xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium tracking-wide mb-4">
                Our Partners
              </span>
              <p className="text-[var(--gray-600)] text-sm font-medium">
                Trusted by leading companies worldwide
              </p>
            </motion.div>

            {/* Logos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 items-center justify-items-center">
              {clients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group cursor-default p-4 rounded-xl transition-all duration-300 hover:bg-white/50"
                >
                  <span className="text-xl lg:text-2xl font-[var(--font-display)] font-semibold text-[var(--gray-400)] group-hover:text-[var(--accent)] transition-colors duration-300 tracking-tight">
                    {client.logo_text}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </Container>
    </section>
  );
}

export function Clients({ clients = [] }: ClientsProps) {
  if (clients.length === 0) {
    return null;
  }

  return <ClientsContent clients={clients} />;
}
