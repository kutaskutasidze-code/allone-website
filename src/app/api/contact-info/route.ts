import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Public endpoint to get contact info (no auth required)
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contact_info')
      .select('email, location, phone')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || { email: 'hello@allone.ai', location: 'San Francisco, CA' });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { email: 'hello@allone.ai', location: 'San Francisco, CA' },
      { status: 200 }
    );
  }
}
