'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  FolderKanban,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface Category {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
  projectCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCategories();
    fetchProjectCounts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectCounts = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) return;
      const projects = await res.json();
      const counts: Record<string, number> = {};
      projects.forEach((p: { category: string }) => {
        counts[p.category] = (counts[p.category] || 0) + 1;
      });
      setProjectCounts(counts);
    } catch (err) {
      console.error('Failed to fetch project counts:', err);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add category');
      }

      const data = await res.json();
      setCategories([...categories, data]);
      setNewCategory('');
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update category');
      }

      const data = await res.json();
      setCategories(categories.map((c) => (c.id === id ? data : c)));
      setEditingId(null);
      setEditValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      setCategories(categories.filter((c) => c.id !== category.id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      setDeleteConfirm(null);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
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
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 text-white">
              <Tag className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-[var(--font-display)] font-bold tracking-tight text-[var(--black)]">
              Categories
            </h1>
          </div>
          <p className="text-[var(--gray-500)]">
            Manage project categories. Categories are used to organize and filter projects.
          </p>
        </div>
        {!isAdding && (
          <motion.button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--black)] text-white rounded-xl font-medium shadow-lg shadow-black/10 hover:bg-[var(--gray-800)] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </motion.button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Category Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white rounded-2xl border border-[var(--gray-200)] shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--black)] mb-4">Add New Category</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--gray-50)] border-2 border-transparent focus:border-[var(--accent)] focus:bg-white focus:outline-none transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <motion.button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--black)] text-white rounded-xl font-medium hover:bg-[var(--gray-800)] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  Save
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategory('');
                  }}
                  className="px-4 py-3 text-[var(--gray-600)] hover:text-[var(--black)] rounded-xl hover:bg-[var(--gray-100)] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-[var(--gray-200)] overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--gray-100)]">
              <Tag className="w-8 h-8 text-[var(--gray-400)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--black)] mb-2">No categories yet</h3>
            <p className="text-[var(--gray-500)] mb-6">
              Create your first category to organize projects.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--black)] text-white rounded-lg font-medium hover:bg-[var(--gray-800)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--gray-100)]">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-4 p-4 hover:bg-[var(--gray-50)] transition-colors"
              >
                {/* Order Badge */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--gray-100)] text-[var(--gray-500)] text-sm font-medium">
                  {index + 1}
                </div>

                {/* Category Name / Edit Input */}
                <div className="flex-1">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border-2 border-[var(--accent)] focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate(category.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-[var(--black)]">{category.name}</span>
                      {projectCounts[category.name] !== undefined && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                          <FolderKanban className="w-3 h-3" />
                          {projectCounts[category.name]} project{projectCounts[category.name] !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {editingId === category.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(category.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-[var(--gray-500)] hover:bg-[var(--gray-100)] rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-[var(--gray-500)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category)}
                        className="p-2 text-[var(--gray-500)] hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
