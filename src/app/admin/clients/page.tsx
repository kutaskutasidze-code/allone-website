'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ConfirmDialog } from '@/components/admin';
import { Input } from '@/components/ui';
import type { Client } from '@/types/database';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
} from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', logo_text: '' });
  const [editData, setEditData] = useState({ name: '', logo_text: '' });
  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.logo_text) return;

    const { data: lastClient } = await supabase
      .from('clients')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const display_order = lastClient ? lastClient.display_order + 1 : 0;

    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: formData.name,
        logo_text: formData.logo_text,
        is_published: true,
        display_order,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding client:', error);
    } else if (data) {
      setClients([...clients, data]);
      setFormData({ name: '', logo_text: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('clients')
      .update({
        name: editData.name,
        logo_text: editData.logo_text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating client:', error);
    } else {
      setClients(
        clients.map((c) =>
          c.id === id ? { ...c, name: editData.name, logo_text: editData.logo_text } : c
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const { error } = await supabase.from('clients').delete().eq('id', deleteId);

    if (error) {
      console.error('Error deleting client:', error);
    } else {
      setClients(clients.filter((c) => c.id !== deleteId));
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('clients')
      .update({ is_published: !currentState })
      .eq('id', id);

    if (error) {
      console.error('Error updating client:', error);
    } else {
      setClients(
        clients.map((c) =>
          c.id === id ? { ...c, is_published: !currentState } : c
        )
      );
    }
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setEditData({ name: client.name, logo_text: client.logo_text });
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
            Clients
          </h1>
          <p className="mt-2 text-[var(--gray-600)]">
            Manage client logos displayed in the marquee
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--gray-800)]"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddForm(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Add New Client</h2>
              <button onClick={() => setShowAddForm(false)} className="text-[var(--gray-400)] hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Acme Inc"
                required
              />
              <Input
                label="Logo Text"
                value={formData.logo_text}
                onChange={(e) => setFormData({ ...formData, logo_text: e.target.value })}
                placeholder="e.g., ACME"
                hint="Text displayed as the logo"
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
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--gray-300)] bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gray-100)]">
            <Plus className="h-6 w-6 text-[var(--gray-400)]" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-black">No clients yet</h3>
          <p className="mt-2 text-sm text-[var(--gray-500)]">
            Add your first client to display in the marquee.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl border border-[var(--gray-200)] bg-white p-5 transition-all hover:border-[var(--gray-300)]"
            >
              {editingId === client.id ? (
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <Input
                    label="Logo Text"
                    value={editData.logo_text}
                    onChange={(e) => setEditData({ ...editData, logo_text: e.target.value })}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-sm text-[var(--gray-600)] hover:text-black"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(client.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--gray-800)]"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold tracking-tight text-black">
                        {client.logo_text}
                      </p>
                      <p className="mt-1 text-sm text-[var(--gray-500)]">{client.name}</p>
                    </div>
                    <button
                      onClick={() => togglePublished(client.id, client.is_published)}
                      className={`rounded-full p-1.5 transition-colors ${
                        client.is_published
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-[var(--gray-100)] text-[var(--gray-400)] hover:bg-[var(--gray-200)]'
                      }`}
                    >
                      {client.is_published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => startEdit(client)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[var(--gray-600)] transition-colors hover:bg-[var(--gray-100)] hover:text-black"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(client.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[var(--gray-600)] transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
