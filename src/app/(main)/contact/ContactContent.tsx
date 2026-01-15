'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight, Calendar } from 'lucide-react';
import { AnimatedBorderCard } from '@/components/ui/animated-border-card';
import { CalendlyButton, CalendlyPlaceholder } from '@/components/ui/CalendlyButton';
import { useTranslation } from '@/contexts';

// Set your Calendly URL here after creating your account
const CALENDLY_URL = ''; // e.g., 'https://calendly.com/your-username/30min'

interface ContactInfo {
  email: string;
  location: string;
  phone?: string;
}

interface ContactContentProps {
  contactInfo: ContactInfo;
}

export function ContactContent({ contactInfo }: ContactContentProps) {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen bg-white pt-28 pb-20 lg:pt-36 lg:pb-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase mb-4">
            {t('cta.button')}
          </p>
          <h1 className="text-4xl lg:text-6xl font-light text-zinc-900 leading-[1.1] mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info - Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Email Card */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="group block"
            >
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">{t('contact.email')}</p>
                  <p className="text-zinc-900 font-medium group-hover:text-zinc-700 transition-colors">
                    {contactInfo.email}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 ml-auto mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Phone Card */}
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="group block"
              >
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">{t('contact.phone')}</p>
                    <p className="text-zinc-900 font-medium group-hover:text-zinc-700 transition-colors">
                      {contactInfo.phone}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 ml-auto mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            )}

            {/* Location Card */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">{t('contact.location')}</p>
                <p className="text-zinc-900 font-medium">
                  {contactInfo.location}
                </p>
              </div>
            </div>

            {/* Schedule Demo Card */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-zinc-900" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">{t('contact.scheduleDemo')}</p>
                <p className="text-white text-sm mb-3">
                  {t('contact.scheduleDemoDesc')}
                </p>
                {CALENDLY_URL ? (
                  <CalendlyButton
                    url={CALENDLY_URL}
                    text={t('contact.scheduleDemo')}
                    variant="secondary"
                    size="sm"
                  />
                ) : (
                  <CalendlyPlaceholder
                    text={t('contact.scheduleDemo')}
                    variant="secondary"
                    size="sm"
                  />
                )}
              </div>
            </div>

            {/* Response Time */}
            <p className="text-sm text-zinc-500 pl-1">
              {t('contact.responseTime')}
            </p>
          </motion.div>

          {/* CTA Card - Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedBorderCard>
              <div className="p-10 lg:p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/[0.1] flex items-center justify-center mx-auto mb-8">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-light text-white mb-4">
                  Ready to get started?
                </h3>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                  Drop us an email and tell us about your project. We'll get back to you with ideas and a proposal.
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors"
                >
                  Send us an email
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </AnimatedBorderCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
