import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs'; // Use nodejs runtime for nodemailer compatibility if needed later
export const dynamic = 'force-dynamic';

// 1. Zod Schema Validation (Dutch Error Messages)
const contactSchema = z.object({
  naam: z.string().min(2, "Naam moet minimaal 2 tekens bevatten"),
  email: z.string().email("Voer een geldig e-mailadres in"),
  telefoon: z.string().optional(),
  onderwerp: z.string().optional(),
  bericht: z.string().min(10, "Bericht moet minimaal 10 tekens bevatten"),
});

// 2. Rate Limiting Setup (Defensive)
// If UPSTASH_REDIS_REST_URL is missing, we skip rate limiting (dev mode fallback)
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  : null;

const ratelimit = redis
  ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour per IP
    analytics: true,
  })
  : null;

export async function POST(request: NextRequest) {
  try {
    // 3. Rate Limiting Check
    if (ratelimit) {
      const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { ok: false, error: 'Te veel verzoeken. Probeer het later opnieuw.' },
          { status: 429 }
        );
      }
    }

    // 4. Parse & Validate Body
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      // Get the first error message to display
      const firstError = Object.values(formattedErrors)[0]?.[0] || 'Ongeldige invoer';

      return NextResponse.json(
        { ok: false, error: firstError, details: formattedErrors },
        { status: 400 }
      );
    }

    const { naam, email, telefoon, onderwerp, bericht } = result.data;

    // 5. Mock Email Sending (Simulate Delay)
    console.log(`[CONTACT] Van: ${naam} <${email}>`);
    if (telefoon) console.log(`[CONTACT] Tel: ${telefoon}`);
    if (onderwerp) console.log(`[CONTACT] Onderwerp: ${onderwerp}`);
    console.log(`[CONTACT] Bericht: ${bericht.substring(0, 50)}...`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Implement actual email sending provider here
    // Example: Resend, SendGrid, or Nodemailer
    // await sendEmail({ to: 'info@prowebstudio.nl', subject: `Nieuw bericht van ${naam}`, ... });

    return NextResponse.json({
      ok: true,
      message: 'Bedankt! We hebben uw bericht ontvangen en nemen zo snel mogelijk contact op.'
    });

  } catch (error) {
    console.error('Cantact API Error:', error);
    return NextResponse.json(
      { ok: false, error: 'Er is een technische fout opgetreden. Stuur ons direct een e-mail op info@prowebstudio.nl.' },
      { status: 500 }
    );
  }
}