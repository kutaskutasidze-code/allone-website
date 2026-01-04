'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ConfirmDialog } from '@/components/admin';
import { Input } from '@/components/ui';
import type { Stat } from '@/types/database';
import { Plus, Trash2, Save, X } from 'lucide-react';

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStat, setNewStat] = useState({ value: '', label: '' });
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching stats:', error);
    } else {
      setStats(data || []);
    }
    setIsLoading(false);
  };

  const handleChange = (id: string, field: 'value' | 'label', newValue: string) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, [field]: newValue } : s)));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const { error } = await supabase.from('stats').upsert(
      stats.map((s, index) => ({
        id: s.id,
        value: s.value,
        label: s.label,
        display_order: index,
        updated_at: new Date().toISOString(),
      }))
    );

    if (error) {
      console.error('Error saving stats:', error);
    } else {
      setHasChanges(false);
    }

    setIsSaving(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStat.value || !newStat.label) return;

    const { data, error } = await supabase
      .from('stats')
      .insert({
        value: newStat.value,
        label: newStat.label,
        display_order: stats.length,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding stat:', error);
    } else if (data) {
      setStats([...stats, data]);
      setNewStat({ value: '', label: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const { error } = await supabase.from('stats').delete().eq('id', deleteId);

    if (error) {
      console.error('Error deleting stat:', error);
    } else {
      setStats(stats.filter((s) => s.id !== deleteId));
    }

    setIsDeleting(false);
    setDeleteId(null);
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
          <h1 className="text-3xl font-bold tracking-tight text-black">Stats</h1>
          <p className="mt-2 text-[var(--gray-600)]">
            Edit the statistics displayed on the About page
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--gray-800)] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--gray-300)] bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:border-black"
          >
            <Plus className="h-4 w-4" />
            Add Stat
          </button>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddForm(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Add New Stat</h2>
              <button onClick={() => setShowAddForm(false)} className="text-[var(--gray-400)] hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Value"
                value={newStat.value}
                onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                placeholder="e.g., 50+"
                required
              />
              <Input
                label="Label"
                value={newStat.label}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                placeholder="e.g., Projects"
                required
              />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm text-[var(--gray-600)] hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[var(--gray-800)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Stat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {stats.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--gray-300)] bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gray-100)]">
            <Plus className="h-6 w-6 text-[var(--gray-400)]" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-black">No stats yet</h3>
          <p className="mt-2 text-sm text-[var(--gray-500)]">
            Add statistics to display on your About page.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-xl border border-[var(--gray-200)] bg-white p-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[var(--gray-500)] mb-2">
                    Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleChange(stat.id, 'value', e.target.value)}
                    className="w-full text-3xl font-bold text-black bg-transparent border-0 border-b border-transparent focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[var(--gray-500)] mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleChange(stat.id, 'label', e.target.value)}
                    className="w-full text-sm text-[var(--gray-600)] bg-transparent border-0 border-b border-transparent focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={() => setDeleteId(stat.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--gray-500)] hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Stat"
        message="Are you sure you want to delete this stat? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
