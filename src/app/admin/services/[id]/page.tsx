'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Input, Textarea, Select } from '@/components/ui';
import { ArrayInput } from '@/components/admin';
import type { Service } from '@/types/database';
import { ArrowLeft, Save } from 'lucide-react';

const iconOptions = [
  { value: 'MessageSquare', label: 'MessageSquare (Chatbots)' },
  { value: 'Workflow', label: 'Workflow (Automation)' },
  { value: 'Brain', label: 'Brain (AI/ML)' },
  { value: 'LineChart', label: 'LineChart (Analytics)' },
  { value: 'Settings', label: 'Settings (Consulting)' },
  { value: 'Code', label: 'Code (Development)' },
  { value: 'Database', label: 'Database (Data)' },
  { value: 'Shield', label: 'Shield (Security)' },
];

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'MessageSquare',
    features: [],
    is_published: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      router.push('/admin/services');
      return;
    }

    setFormData(data);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase
        .from('services')
        .update({
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          features: formData.features,
          is_published: formData.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Failed to update service. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      <div className="mb-8">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-sm text-[var(--gray-600)] hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-black">
          Edit Service
        </h1>
        <p className="mt-2 text-[var(--gray-600)]">
          Update service details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-xl border border-[var(--gray-200)] bg-white p-6 space-y-6">
          <Input
            label="Service Title"
            value={formData.title || ''}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., AI Chatbots & Assistants"
            required
          />

          <Textarea
            label="Description"
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe what this service offers..."
            rows={4}
            required
          />

          <Select
            label="Icon"
            value={formData.icon || 'MessageSquare'}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
            }
            options={iconOptions}
          />

          <ArrayInput
            label="Features"
            value={formData.features || []}
            onChange={(features) =>
              setFormData({ ...formData, features })
            }
            placeholder="Add a feature (e.g., Natural language understanding)"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published ?? true}
              onChange={(e) =>
                setFormData({ ...formData, is_published: e.target.checked })
              }
              className="h-4 w-4 rounded border-[var(--gray-300)] text-black focus:ring-black"
            />
            <label
              htmlFor="is_published"
              className="text-sm text-[var(--gray-700)]"
            >
              Published
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/services"
            className="px-6 py-2.5 text-sm font-medium text-[var(--gray-600)] hover:text-black transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--gray-800)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
