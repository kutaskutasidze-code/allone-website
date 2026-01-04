'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ContactInfo } from '@/types/database';
import { Save, Check, Mail, MapPin, Phone, Settings, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    email: '',
    location: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await fetch('/api/admin/contact-info');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData(data);
        }
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.email || !formData.location) return;

    setIsSaving(true);
    setSaved(false);
    setError('');

    try {
      const res = await fetch('/api/admin/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          location: formData.location,
          phone: formData.phone || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await res.json();
      setFormData(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-8 h-8 border-2 border-[var(--gray-300)] border-t-[var(--accent)] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--gray-700)] text-white">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-[var(--font-display)] font-bold tracking-tight text-[var(--black)]">
              Settings
            </h1>
          </div>
          <p className="text-[var(--gray-500)]">
            Manage your website contact information
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={isSaving || !formData.email || !formData.location}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--black)] text-white rounded-xl font-medium shadow-lg shadow-black/10 hover:bg-[var(--gray-800)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Form */}
      <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <h2 className="text-lg font-semibold text-[var(--black)] mb-2">
          Contact Information
        </h2>
        <p className="text-sm text-[var(--gray-500)] mb-6">
          This information is displayed on the contact page and in the footer.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--gray-100)]">
              <Mail className="h-5 w-5 text-[var(--gray-600)]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hello@allone.ai"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--gray-100)]">
              <MapPin className="h-5 w-5 text-[var(--gray-600)]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--gray-100)]">
              <Phone className="h-5 w-5 text-[var(--gray-600)]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                Phone Number <span className="text-[var(--gray-400)]">(optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
