'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/ui';
import { ArrayInput } from '@/components/admin';
import type { AboutContent } from '@/types/database';
import { Save, Check, AlertCircle } from 'lucide-react';

export default function AboutPage() {
  const [formData, setFormData] = useState<Partial<AboutContent>>({
    hero_subtitle: 'About Us',
    hero_title: '',
    story_subtitle: 'Our Story',
    story_title: '',
    story_paragraphs: [],
    values_subtitle: 'Our Values',
    values_title: 'What drives us',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const res = await fetch('/api/admin/about');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData(data);
        }
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    setError('');

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_subtitle: formData.hero_subtitle,
          hero_title: formData.hero_title,
          story_subtitle: formData.story_subtitle,
          story_title: formData.story_title,
          story_paragraphs: formData.story_paragraphs,
          values_subtitle: formData.values_subtitle,
          values_title: formData.values_title,
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
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            About Page
          </h1>
          <p className="mt-2 text-[var(--gray-600)]">
            Edit the content displayed on your About page
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--gray-800)] disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="rounded-xl border border-[var(--gray-200)] bg-white p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Hero Section</h2>
          <div className="space-y-6">
            <Input
              label="Subtitle"
              value={formData.hero_subtitle || ''}
              onChange={(e) =>
                setFormData({ ...formData, hero_subtitle: e.target.value })
              }
              placeholder="About Us"
            />
            <Textarea
              label="Main Title"
              value={formData.hero_title || ''}
              onChange={(e) =>
                setFormData({ ...formData, hero_title: e.target.value })
              }
              placeholder="We help businesses unlock the power of intelligent automation"
              rows={2}
            />
          </div>
        </div>

        {/* Story Section */}
        <div className="rounded-xl border border-[var(--gray-200)] bg-white p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Story Section</h2>
          <div className="space-y-6">
            <Input
              label="Subtitle"
              value={formData.story_subtitle || ''}
              onChange={(e) =>
                setFormData({ ...formData, story_subtitle: e.target.value })
              }
              placeholder="Our Story"
            />
            <Textarea
              label="Title"
              value={formData.story_title || ''}
              onChange={(e) =>
                setFormData({ ...formData, story_title: e.target.value })
              }
              placeholder="From vision to reality"
              rows={2}
            />
            <ArrayInput
              label="Story Paragraphs"
              value={formData.story_paragraphs || []}
              onChange={(paragraphs) =>
                setFormData({ ...formData, story_paragraphs: paragraphs })
              }
              placeholder="Add a paragraph of your story..."
            />
            <p className="text-xs text-[var(--gray-500)]">
              Each item becomes a separate paragraph in your story section.
            </p>
          </div>
        </div>

        {/* Values Section Headers */}
        <div className="rounded-xl border border-[var(--gray-200)] bg-white p-6">
          <h2 className="text-lg font-semibold text-black mb-6">Values Section</h2>
          <div className="space-y-6">
            <Input
              label="Subtitle"
              value={formData.values_subtitle || ''}
              onChange={(e) =>
                setFormData({ ...formData, values_subtitle: e.target.value })
              }
              placeholder="Our Values"
            />
            <Input
              label="Title"
              value={formData.values_title || ''}
              onChange={(e) =>
                setFormData({ ...formData, values_title: e.target.value })
              }
              placeholder="What drives us"
            />
            <p className="text-xs text-[var(--gray-500)]">
              Manage individual values in the{' '}
              <a href="/admin/values" className="underline hover:text-black">
                Values section
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
