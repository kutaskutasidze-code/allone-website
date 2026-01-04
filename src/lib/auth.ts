import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient, Session } from '@supabase/supabase-js';

/**
 * Custom error class for authentication failures
 */
export class AuthError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Authentication result containing the Supabase client and session
 */
export interface AuthResult {
  supabase: SupabaseClient;
  session: Session;
  userId: string;
}

/**
 * Require authentication for an API route
 * Throws AuthError if not authenticated
 *
 * @example
 * ```ts
 * export async function GET() {
 *   try {
 *     const { supabase, userId } = await requireAuth();
 *     // ... authenticated logic
 *   } catch (err) {
 *     if (err instanceof AuthError) return unauthorized();
 *     return error('Internal server error');
 *   }
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new AuthError('Session error');
  }

  if (!session) {
    throw new AuthError('Unauthorized');
  }

  return {
    supabase,
    session,
    userId: session.user.id,
  };
}

/**
 * Check if a request is authenticated without throwing
 * Useful for optional authentication scenarios
 */
export async function checkAuth(): Promise<AuthResult | null> {
  try {
    return await requireAuth();
  } catch {
    return null;
  }
}
