import { revalidatePath } from 'next/cache';
import { invalidateCache } from '@/lib/cache';
import { requireAuth, AuthError } from '@/lib/auth';
import { success, error, validationError, unauthorized } from '@/lib/api-response';
import { idParamSchema } from '@/lib/validations';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { supabase, userId } = await requireAuth();
    const { id } = await params;

    // Validate ID
    const idResult = idParamSchema.safeParse({ id });
    if (!idResult.success) {
      return validationError(idResult.error);
    }

    logger.db('delete', 'stats', { userId, resourceId: id });

    const { error: dbError } = await supabase
      .from('stats')
      .delete()
      .eq('id', id);

    if (dbError) {
      logger.error('Failed to delete stat', { error: dbError.message, userId, resourceId: id });
      return error('Failed to delete stat');
    }

    logger.audit('delete', 'stats', id, userId);
    invalidateCache('stats');
    revalidatePath('/about');
    revalidatePath('/');

    return success({ deleted: true });
  } catch (err) {
    if (err instanceof AuthError) return unauthorized();
    logger.error('Unexpected error in DELETE /api/admin/stats/[id]', { error: String(err) });
    return error('Internal server error');
  }
}
