'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Target, Lightbulb, Users, Rocket } from 'lucide-react';
import { Container } from '@/components/layout';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { useRef, useEffect, useState } from 'react';
import type { Stat, CompanyValue, AboutContent as AboutContentType } from '@/types/database';

const valueIcons = [Target, Lightbulb, Users, Rocket];

// Animated counter component
function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const hasPlus = value.includes('+');

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  return <>{count}{hasPlus ? '+' : ''}{suffix}</>;
}

interface AboutContentProps {
  stats: Stat[];
  values: CompanyValue[];
  about: Partial<AboutContentType>;
}

export function AboutContent({ stats, values, about }: AboutContentProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="pt-28 pb-16 lg:pt-36 lg:pb-20 relative overflow-hidden">
        <Container>
          <motion.div className="max-w-4xl" style={{ y, opacity }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-[var(--accent)] text-sm font-medium tracking-wide mb-4"
            >
              {about.hero_subtitle || 'About Us'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2.5rem,7vw,4.5rem)] font-[var(--font-display)] font-light text-[var(--black)] leading-[1.1] tracking-[-0.02em] mb-8"
            >
              We help businesses unlock the power of intelligent automation
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 h-1 bg-[var(--accent)] origin-left rounded-full"
            />
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-20 relative">
          <Container>
            <GlassPanel padding="lg" rounded="3xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      className="text-4xl md:text-5xl font-[var(--font-display)] font-semibold text-[var(--accent)] mb-2"
                      whileInView={{ scale: [0.5, 1.1, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <AnimatedCounter value={stat.value} />
                    </motion.div>
                    <div className="text-xs uppercase tracking-wider text-[var(--gray-500)]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </Container>
        </section>
      )}

      {/* Story */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[var(--accent)] text-sm font-medium tracking-wide mb-4">
                {about.story_subtitle || 'Our Story'}
              </p>
              <h2 className="text-3xl lg:text-4xl font-[var(--font-display)] font-light text-[var(--black)] leading-tight">
                Built by engineers who believe in accessible AI
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlassPanel padding="lg" rounded="2xl" className="space-y-6">
                <div className="space-y-4 text-[var(--gray-600)] leading-relaxed">
                  {(about.story_paragraphs || []).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <GlassButton
                  href="/contact"
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Work With Us
                </GlassButton>
              </GlassPanel>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Values */}
      {values.length > 0 && (
        <section className="py-24 lg:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <p className="text-[var(--accent)] text-sm font-medium tracking-wide mb-4">
                {about.values_subtitle || 'Our Values'}
              </p>
              <h2 className="text-3xl lg:text-4xl font-[var(--font-display)] font-light text-[var(--black)] leading-tight">
                What drives us
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const IconComponent = valueIcons[index % valueIcons.length];

                return (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <GlassPanel padding="lg" rounded="2xl" hover className="h-full">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent)]/10 mb-5">
                        <IconComponent className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <span className="text-xs font-mono text-[var(--gray-400)] mb-2 block">
                        {value.number}
                      </span>
                      <h3 className="text-xl font-[var(--font-display)] font-semibold text-[var(--black)] mb-3">
                        {value.title}
                      </h3>
                      <p className="text-[var(--gray-600)] leading-relaxed text-sm">
                        {value.description}
                      </p>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
