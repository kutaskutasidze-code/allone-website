'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout';
import { ColorWave } from '@/components/shared/ColorWave';
import { GlassButton } from '@/components/ui/GlassButton';

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <ColorWave height={180} />
      </div>

      <Container>
        <div className="max-w-3xl mx-auto text-center relative z-10 py-20 lg:py-28">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[var(--accent)] text-sm font-medium tracking-wide mb-4"
          >
            Get in touch
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-[var(--font-display)] font-light text-[var(--black)] leading-[1.15] mb-6"
          >
            Ready to start your next project?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[var(--gray-600)] text-base lg:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            From strategy to deployment, we partner with you to build AI systems that deliver real results.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <GlassButton
              href="/contact"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              className="group"
            >
              Start a conversation
            </GlassButton>
            <GlassButton
              href="/projects"
              variant="secondary"
              size="lg"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              View our work
            </GlassButton>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
