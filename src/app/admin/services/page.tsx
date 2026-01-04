'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ConfirmDialog } from '@/components/admin';
import type { Service } from '@/types/database';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const { error } = await supabase.from('services').delete().eq('id', deleteId);

    if (error) {
      console.error('Error deleting service:', error);
    } else {
      setServices(services.filter((s) => s.id !== deleteId));
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('services')
      .update({ is_published: !currentState })
      .eq('id', id);

    if (error) {
      console.error('Error updating service:', error);
    } else {
      setServices(
        services.map((s) =>
          s.id === id ? { ...s, is_published: !currentState } : s
        )
      );
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Services
          </h1>
          <p className="mt-2 text-[var(--gray-600)]">
            Manage your service offerings
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--gray-800)]"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--gray-300)] bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gray-100)]">
            <Plus className="h-6 w-6 text-[var(--gray-400)]" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-black">No services yet</h3>
          <p className="mt-2 text-sm text-[var(--gray-500)]">
            Get started by creating your first service.
          </p>
          <Link
            href="/admin/services/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[var(--gray-800)]"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--gray-200)] bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--gray-200)] bg-[var(--gray-50)]">
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--gray-500)]">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--gray-500)]">
                  Icon
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--gray-500)]">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[var(--gray-500)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-200)]">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-[var(--gray-50)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-[var(--gray-400)] cursor-grab" />
                      <div>
                        <p className="font-medium text-black">{service.title}</p>
                        <p className="text-sm text-[var(--gray-500)] line-clamp-1">
                          {service.features.length} features
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-[var(--gray-100)] px-2.5 py-1 text-xs font-medium text-[var(--gray-700)]">
                      {service.icon}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublished(service.id, service.is_published)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        service.is_published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-[var(--gray-100)] text-[var(--gray-500)] hover:bg-[var(--gray-200)]'
                      }`}
                    >
                      {service.is_published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="rounded-lg p-2 text-[var(--gray-500)] transition-colors hover:bg-[var(--gray-100)] hover:text-black"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(service.id)}
                        className="rounded-lg p-2 text-[var(--gray-500)] transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
