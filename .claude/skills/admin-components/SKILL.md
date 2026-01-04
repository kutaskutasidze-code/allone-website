---
name: admin-components
description: Patterns for building admin UI components in the Allone project. Use when creating admin forms, tables, dialogs, or navigation. Includes Tailwind CSS patterns, lucide-react icons, and cn utility usage.
---

# Admin Components Guide

## File Locations

- Admin components: `src/components/admin/`
- Admin pages: `src/app/admin/`
- Utility functions: `src/lib/utils.ts`

## Core Imports

```typescript
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

// Icons from lucide-react
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Briefcase,
  Users,
  BarChart3,
  Heart,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
} from 'lucide-react';
```

## Design System

### Colors (CSS Variables)

```css
/* Grays */
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-500: #6b7280;
--gray-600: #4b5563;

/* Primary */
bg-black text-white  /* Active/primary state */
```

### Common Class Patterns

```typescript
// Card/Container
"rounded-lg border border-[var(--gray-200)] bg-white p-6"

// Button - Primary
"rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"

// Button - Secondary
"rounded-lg border border-[var(--gray-200)] px-4 py-2 text-sm font-medium text-[var(--gray-600)] hover:bg-[var(--gray-100)] transition-colors"

// Button - Danger
"rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"

// Input
"w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"

// Label
"block text-sm font-medium text-[var(--gray-600)] mb-1"

// Navigation item (inactive)
"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--gray-600)] hover:bg-[var(--gray-100)] hover:text-black transition-all"

// Navigation item (active)
"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-black text-white"
```

## Component Patterns

### Page Layout

```typescript
export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Page Title</h1>
          <p className="text-[var(--gray-500)]">Page description</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-[var(--gray-200)] bg-white">
        {/* ... */}
      </div>
    </div>
  );
}
```

### Form Structure

```typescript
<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">
      Field Label
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      required
    />
  </div>

  {/* Textarea */}
  <div>
    <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">
      Description
    </label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={4}
      className="w-full rounded-lg border border-[var(--gray-200)] px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black resize-none"
    />
  </div>

  {/* Toggle/Checkbox */}
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={isPublished}
      onChange={(e) => setIsPublished(e.target.checked)}
      className="h-4 w-4 rounded border-[var(--gray-200)]"
    />
    <label className="text-sm text-[var(--gray-600)]">Published</label>
  </div>

  {/* Actions */}
  <div className="flex gap-3 pt-4">
    <button
      type="submit"
      className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
    >
      <Save className="h-4 w-4" />
      Save
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="rounded-lg border border-[var(--gray-200)] px-4 py-2 text-sm font-medium text-[var(--gray-600)] hover:bg-[var(--gray-100)] transition-colors"
    >
      Cancel
    </button>
  </div>
</form>
```

### Table Structure

```typescript
<div className="overflow-hidden rounded-lg border border-[var(--gray-200)]">
  <table className="w-full">
    <thead className="bg-[var(--gray-100)]">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">
          Name
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">
          Status
        </th>
        <th className="px-4 py-3 text-right text-sm font-medium text-[var(--gray-600)]">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-[var(--gray-200)]">
      {items.map((item) => (
        <tr key={item.id} className="hover:bg-[var(--gray-50)]">
          <td className="px-4 py-3 text-sm">{item.name}</td>
          <td className="px-4 py-3">
            <span className={cn(
              "inline-flex rounded-full px-2 py-1 text-xs font-medium",
              item.is_published
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            )}>
              {item.is_published ? 'Published' : 'Draft'}
            </span>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex justify-end gap-2">
              <button className="p-1 text-[var(--gray-500)] hover:text-black">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-1 text-[var(--gray-500)] hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Existing Components

### ArrayInput
Location: `src/components/admin/ArrayInput.tsx`
For managing array fields (technologies, features, paragraphs)

### ConfirmDialog
Location: `src/components/admin/ConfirmDialog.tsx`
For delete confirmations

### AdminSidebar
Location: `src/components/admin/AdminSidebar.tsx`
Main navigation sidebar

## Icons Reference

Common icons from `lucide-react`:
- Navigation: `LayoutDashboard`, `FolderKanban`, `Settings`, `Briefcase`
- Actions: `Plus`, `Edit`, `Trash2`, `Save`, `X`, `LogOut`
- Content: `Users`, `BarChart3`, `Heart`, `FileText`
- Arrows: `ChevronLeft`, `ChevronRight`, `ArrowUp`, `ArrowDown`
