import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 1. Zod Schema Validation (Dutch Error Messages)
const contactSchema = z.object({
  naam: z.string().min(2, "Naam moet minimaal 2 tekens bevatten"),
  email: z.string().email("Voer een geldig e-mailadres in"),
  telefoon: z.string().optional(),
  projectTypes: z.array(z.string()).optional(), // Add projectTypes support
  onderwerp: z.string().optional(),
  bericht: z.string().min(10, "Bericht moet minimaal 10 tekens bevatten"),
});

// 2. Rate Limiting Setup (Defensive)
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

    // Remap frontend fields to schema fields if necessary
    // Frontend sends: name, email, phone, projectTypes, message
    const payload = {
      naam: body.name || body.naam,
      email: body.email,
      telefoon: body.phone || body.telefoon,
      projectTypes: body.projectTypes,
      bericht: body.message || body.bericht,
      onderwerp: body.subject || body.onderwerp || 'Nieuw bericht via ProWeb Studio',
    };

    const result = contactSchema.safeParse(payload);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(formattedErrors)[0]?.[0] || 'Ongeldige invoer';

      return NextResponse.json(
        { ok: false, error: firstError, details: formattedErrors },
        { status: 400 }
      );
    }

    const { naam, email, telefoon, onderwerp, bericht, projectTypes } = result.data;

    // 5. Send Email via Nodemailer
    // Check for SMTP credentials
    const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || process.env.BREVO_SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS || process.env.BREVO_API_KEY;

    if (!smtpUser || !smtpPass) {
      console.warn('[CONTACT] Missing SMTP credentials. Mocking email send.');
      console.log(`[MOCK EMAIL] From: ${naam} <${email}>, To: ${process.env.CONTACT_INBOX}`);

      // Simulate network delay for dev experience
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json({
        ok: true,
        message: 'Bedankt! We hebben uw bericht ontvangen (DEV MODE).'
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const contactInbox = process.env.CONTACT_INBOX || 'info@prowebstudio.nl';

    // Format Project Types
    const interestTags = projectTypes && projectTypes.length > 0
      ? projectTypes.map(t => `<span style="background:#e0f2fe;color:#0284c7;padding:4px 8px;border-radius:4px;margin-right:4px;font-size:12px;">${t}</span>`).join('')
      : '';

    // Email to Admin
    const emailSubject = onderwerp ? `[ProWeb Lead] ${onderwerp}` : `[ProWeb Lead] ${naam} - ${interestTags ? projectTypes?.join(', ') : 'Contactaanvraag'}`;

    // Authenticated Sender (Must match Verified Sender in Brevo)
    const authenticatedSender = process.env.CONTACT_INBOX || 'contact@prowebstudio.nl';

    await transporter.sendMail({
      from: `"ProWeb Website" <${authenticatedSender}>`, // MUST be your verified sender
      to: contactInbox,
      replyTo: `"${naam}" <${email}>`, // This allows you to click "Reply" and answer the visitor
      subject: emailSubject,
      text: `Naam: ${naam}\nEmail: ${email}\nTelefoon: ${telefoon || 'Niet opgegeven'}\nOnderwerp: ${onderwerp || 'Geen'}\n\nBericht:\n${bericht}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Nieuwe Contactaanvraag</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p><strong>Naam:</strong> ${naam}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a> (Reply-To configured)</p>
            <p><strong>Telefoon:</strong> ${telefoon || 'Niet opgegeven'}</p>
            ${interestTags ? `<p><strong>Interesses:</strong><br><br>${interestTags}</p>` : ''}
            <p><strong>Onderwerp:</strong> ${onderwerp || 'Geen'}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #334155;">Bericht:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #1e293b; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">${bericht.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: 'Bedankt! We hebben uw bericht ontvangen en nemen zo snel mogelijk contact op.'
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { ok: false, error: `Er is een technische fout opgetreden bij het versturen: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}