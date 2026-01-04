import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email';
import { success, error, validationError, rateLimited, methodNotAllowed } from '@/lib/api-response';
import { contactFormSchema } from '@/lib/validations';
import { checkContactRateLimit, getClientIp } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    // Check rate limit
    const rateLimit = await checkContactRateLimit(request);
    if (!rateLimit.allowed) {
      logger.warn('Contact form rate limited', { ip, resetAt: rateLimit.resetAt });
      return rateLimited();
    }

    // Parse and validate request body
    const body = await request.json();

    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return validationError(result.error);
    }

    const validated = result.data;

    logger.info('Contact form submission', {
      ip,
      email: validated.email,
      service: validated.service,
    });

    // Send email
    await sendEmail({
      name: validated.name,
      email: validated.email,
      company: validated.company,
      service: validated.service,
      message: validated.message,
    });

    logger.info('Contact form email sent', { email: validated.email });

    return success({ message: 'Message sent successfully!' });
  } catch (err) {
    logger.error('Contact form error', { error: String(err), ip });
    return error('Failed to send message. Please try again later.');
  }
}

export async function GET() {
  return methodNotAllowed();
}
