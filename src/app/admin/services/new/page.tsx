'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Input, Textarea, Select } from '@/components/ui';
import { ArrayInput } from '@/components/admin';
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

export default function NewServicePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'MessageSquare',
    features: [] as string[],
    is_published: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data: lastService } = await supabase
        .from('services')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .single();

      const display_order = lastService ? lastService.display_order + 1 : 0;

      const { error: insertError } = await supabase.from('services').insert({
        ...formData,
        display_order,
      });

      if (insertError) {
        throw insertError;
      }

      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      console.error('Error creating service:', err);
      setError('Failed to create service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Add New Service
        </h1>
        <p className="mt-2 text-[var(--gray-600)]">
          Create a new service offering
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-xl border border-[var(--gray-200)] bg-white p-6 space-y-6">
          <Input
            label="Service Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., AI Chatbots & Assistants"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe what this service offers..."
            rows={4}
            required
          />

          <Select
            label="Icon"
            value={formData.icon}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
            }
            options={iconOptions}
          />

          <ArrayInput
            label="Features"
            value={formData.features}
            onChange={(features) =>
              setFormData({ ...formData, features })
            }
            placeholder="Add a feature (e.g., Natural language understanding)"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) =>
                setFormData({ ...formData, is_published: e.target.checked })
              }
              className="h-4 w-4 rounded border-[var(--gray-300)] text-black focus:ring-black"
            />
            <label
              htmlFor="is_published"
              className="text-sm text-[var(--gray-700)]"
            >
              Publish immediately
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
            {isSubmitting ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
}
