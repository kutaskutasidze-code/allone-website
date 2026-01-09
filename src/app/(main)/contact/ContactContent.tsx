'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Check, ArrowRight } from 'lucide-react';
import { AnimatedBorderCard } from '@/components/ui/animated-border-card';

interface ContactInfo {
  email: string;
  location: string;
  phone?: string;
}

interface ContactContentProps {
  contactInfo: ContactInfo;
}

interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactContent({ contactInfo }: ContactContentProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '', message: '' });
      }
    } catch {
      setErrors({ message: 'Failed to send. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section className="min-h-screen bg-black pt-28 pb-20 lg:pt-36 lg:pb-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase mb-4">
            Get in touch
          </p>
          <h1 className="text-4xl lg:text-6xl font-light text-white leading-[1.1] mb-6">
            Let's build something amazing together
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info - Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Email Card */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="group block"
            >
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Email</p>
                  <p className="text-white font-medium group-hover:text-zinc-300 transition-colors">
                    {contactInfo.email}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 ml-auto mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Phone Card */}
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="group block"
              >
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Phone</p>
                    <p className="text-white font-medium group-hover:text-zinc-300 transition-colors">
                      {contactInfo.phone}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 ml-auto mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            )}

            {/* Location Card */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Location</p>
                <p className="text-white font-medium">
                  {contactInfo.location}
                </p>
              </div>
            </div>

            {/* Response Time */}
            <p className="text-sm text-zinc-500 pl-1">
              We typically respond within 24 hours
            </p>
          </motion.div>

          {/* Form - Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <AnimatedBorderCard>
              <div className="p-8 lg:p-10">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/[0.1] flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-light text-white mb-3">Message sent</h3>
                    <p className="text-zinc-400 mb-8">
                      Thank you for reaching out. We'll be in touch soon.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/[0.05] transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                          Name <span className="text-zinc-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border ${
                            errors.name ? 'border-red-500/50' : 'border-white/[0.08]'
                          } text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors`}
                        />
                        {errors.name && (
                          <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                          Email <span className="text-zinc-600">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border ${
                            errors.email ? 'border-red-500/50' : 'border-white/[0.08]'
                          } text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors`}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company name (optional)"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        Message <span className="text-zinc-600">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project..."
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border ${
                          errors.message ? 'border-red-500/50' : 'border-white/[0.08]'
                        } text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors resize-none`}
                      />
                      {errors.message && (
                        <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-zinc-900 font-medium flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedBorderCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
