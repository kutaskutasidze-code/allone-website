---
name: api-routes
description: Patterns for creating Next.js API routes in the Allone project. Use when building CRUD endpoints, handling authentication, or creating new admin API routes.
---

# API Routes Guide

## File Structure

```
src/app/api/
├── contact/
│   └── route.ts           # Public contact form
└── admin/
    ├── projects/
    │   ├── route.ts       # GET (list), POST (create)
    │   └── [id]/
    │       └── route.ts   # GET, PUT, DELETE (single item)
    ├── services/
    ├── clients/
    ├── stats/
    ├── values/
    ├── about/
    │   └── route.ts       # GET, PUT (single row table)
    └── contact-info/
        └── route.ts       # GET, PUT (single row table)
```

## Standard CRUD Route Template

### Collection Route (`route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List all items
export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch data
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new item
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { field1, field2, is_published } = body;

    // Validate required fields
    if (!field1 || !field2) {
      return NextResponse.json(
        { error: 'field1 and field2 are required' },
        { status: 400 }
      );
    }

    // Get next display_order
    const { data: lastItem } = await supabase
      .from('table_name')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const display_order = lastItem ? lastItem.display_order + 1 : 0;

    // Insert
    const { data, error } = await supabase
      .from('table_name')
      .insert({
        field1,
        field2,
        is_published: is_published ?? true,
        display_order,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Single Item Route (`[id]/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Single item
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update item
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('table_name')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('table_name')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Single-Row Tables Pattern

For tables like `contact_info` and `about_content` that only have one row:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch the single row
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || {});
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Upsert the single row
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if row exists
    const { data: existing } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .single();

    let data, error;

    if (existing) {
      // Update existing
      ({ data, error } = await supabase
        .from('contact_info')
        .update(body)
        .eq('id', existing.id)
        .select()
        .single());
    } else {
      // Insert new
      ({ data, error } = await supabase
        .from('contact_info')
        .insert(body)
        .select()
        .single());
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Response Patterns

```typescript
// Success responses
NextResponse.json(data);                           // 200 OK
NextResponse.json(data, { status: 201 });          // 201 Created
NextResponse.json({ success: true });              // 200 OK (delete)

// Error responses
NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
NextResponse.json({ error: 'Field X is required' }, { status: 400 });
NextResponse.json({ error: 'Not found' }, { status: 404 });
NextResponse.json({ error: error.message }, { status: 500 });
NextResponse.json({ error: 'Internal server error' }, { status: 500 });
```

## Authentication Check

Always include this at the start of admin routes:

```typescript
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Public Routes

For public routes (like contact form), skip auth check:

```typescript
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate and process...
    // No session check needed

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
