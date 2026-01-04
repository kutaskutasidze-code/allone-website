'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { ConfirmDialog } from '@/components/admin';
import type { Project } from '@/types/database';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
  FolderKanban,
  ImageIcon,
  Calendar,
  DollarSign,
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('name')
      .order('display_order', { ascending: true });
    if (data) {
      setCategories(data.map(c => c.name));
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesDescription = project.description.toLowerCase().includes(query);
        const matchesTech = project.technologies.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesTech) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;

      // Status filter
      if (statusFilter === 'published' && !project.is_published) return false;
      if (statusFilter === 'draft' && project.is_published) return false;

      return true;
    });
  }, [projects, searchQuery, categoryFilter, statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const { error } = await supabase.from('projects').delete().eq('id', deleteId);

    if (error) {
      console.error('Error deleting project:', error);
    } else {
      setProjects(projects.filter((p) => p.id !== deleteId));
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !currentState })
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
    } else {
      setProjects(
        projects.map((p) =>
          p.id === id ? { ...p, is_published: !currentState } : p
        )
      );
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || statusFilter !== 'all';

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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500 text-white">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-[var(--font-display)] font-bold tracking-tight text-[var(--black)]">
              Projects
            </h1>
          </div>
          <p className="text-[var(--gray-500)]">
            Manage your portfolio projects. {projects.length} total, {projects.filter(p => p.is_published).length} published.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--black)] text-white rounded-xl font-medium shadow-lg shadow-black/10 hover:bg-[var(--gray-800)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[var(--gray-200)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)] hover:text-[var(--black)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none pl-10 pr-10 py-3 rounded-xl bg-white border border-[var(--gray-200)] focus:border-[var(--accent)] focus:outline-none cursor-pointer min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex rounded-xl bg-white border border-[var(--gray-200)] overflow-hidden">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-[var(--black)] text-white'
                  : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
              }`}
            >
              {status === 'all' ? 'All' : status === 'published' ? 'Published' : 'Drafts'}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-[var(--gray-500)]">
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--gray-300)] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gray-100)]">
            <FolderKanban className="h-8 w-8 text-[var(--gray-400)]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[var(--black)]">No projects yet</h3>
          <p className="mt-2 text-[var(--gray-500)]">
            Get started by creating your first project.
          </p>
          <Link
            href="/admin/projects/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--black)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--gray-800)]"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gray-100)]">
            <Search className="h-8 w-8 text-[var(--gray-400)]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[var(--black)]">No results found</h3>
          <p className="mt-2 text-[var(--gray-500)]">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-[var(--accent)] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-2xl border border-[var(--gray-200)] bg-white p-5 hover:border-[var(--gray-300)] hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                {/* Image Preview */}
                <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-[var(--gray-100)] overflow-hidden">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[var(--gray-400)]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[var(--black)] group-hover:text-[var(--accent)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--gray-500)] line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-2 rounded-lg text-[var(--gray-500)] hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="p-2 rounded-lg text-[var(--gray-500)] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex rounded-lg bg-[var(--gray-100)] px-2.5 py-1 text-xs font-medium text-[var(--gray-700)]">
                      {project.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.project_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    {project.revenue > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        <DollarSign className="w-3 h-3" />
                        {project.revenue >= 1000 ? `${(project.revenue / 1000).toFixed(1)}K` : project.revenue.toFixed(0)}
                      </span>
                    )}
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="text-xs text-[var(--gray-500)]">
                        +{project.technologies.length - 2} more
                      </span>
                    )}
                    <button
                      onClick={() => togglePublished(project.id, project.is_published)}
                      className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        project.is_published
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-[var(--gray-100)] text-[var(--gray-500)] hover:bg-[var(--gray-200)]'
                      }`}
                    >
                      {project.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
