'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ArrowRight, MessageSquare, Workflow, Cpu, Lightbulb, Check } from 'lucide-react';
import { ServiceAnimations } from '@/components/sections/ServiceAnimations';
import type { Service } from '@/types/database';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Workflow,
  Cpu,
  Lightbulb,
};

interface ServicesContentProps {
  services: Service[];
}

export function ServicesContent({ services }: ServicesContentProps) {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-10 lg:pt-28 lg:pb-14 border-b border-[var(--gray-200)]">
        <Container>
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--gray-500)] mb-8"
            >
              Our Services
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[clamp(2.5rem,7vw,5rem)] font-[var(--font-display)] font-light text-[var(--accent)] leading-[1.05] tracking-[-0.02em] mb-8"
            >
              AI-powered solutions for modern businesses
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[var(--gray-600)] max-w-2xl"
            >
              We design and build custom AI automation systems that transform how your business operates,
              helping you work smarter and scale faster.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Services List */}
      <section className="py-24 lg:py-32">
        <Container>
          {services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--gray-500)]">No services available yet.</p>
            </div>
          ) : (
          <div className="space-y-24 lg:space-y-32">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Cpu;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={service.id}
                  id={`service-${service.id}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                    isEven ? '' : 'lg:grid-flow-dense'
                  }`}
                >
                  {/* Content */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[var(--gray-100)] flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-[var(--accent)]" />
                      </div>
                      <span className="text-sm font-mono text-[var(--gray-400)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-[var(--font-display)] font-light text-[var(--black)] mb-6">
                      {service.title}
                    </h2>

                    <p className="text-lg text-[var(--gray-600)] leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[var(--accent)]" />
                          </div>
                          <span className="text-sm text-[var(--gray-700)]">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      onClick={() => window.location.href = '/contact'}
                    >
                      Get Started
                    </Button>
                  </div>

                  {/* Visual - Canvas Animation */}
                  <div className={`relative ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                    <motion.div
                      className="aspect-square max-w-md mx-auto relative bg-white rounded-3xl overflow-hidden"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      {/* Canvas Animation */}
                      {(() => {
                        const AnimationComponent = ServiceAnimations[index] || ServiceAnimations[0];
                        return <AnimationComponent />;
                      })()}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          )}
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 lg:py-32 border-t border-[var(--gray-200)] bg-[var(--gray-50)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-[var(--font-display)] font-light text-[var(--black)] mb-6"
            >
              Not sure which service fits your needs?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[var(--gray-600)] mb-8"
            >
              Let&apos;s discuss your challenges and find the right solution together.
              We offer free consultations to help you understand how AI can transform your business.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => window.location.href = '/contact'}
              >
                Schedule a Consultation
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
