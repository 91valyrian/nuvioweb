import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs'; // ensure Node runtime on Vercel (not Edge)

// Helpers
function sanitizeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function buildSubject(name, company) {
  return `[Contact] ${name || 'No name'}${company ? ` - ${company}` : ''}`;
}

function buildMailBodies({ name, email, company, message }) {
  const text = `${message || ''}

From: ${name || '-'} <${email || '-'}>
Company: ${company || '-'}`;
  const html = `
    <p><b>Name:</b> ${name || '-'}</p>
    <p><b>Company:</b> ${company || '-'}</p>
    <p><b>Email:</b> ${email || '-'}</p>
    <p><b>Message:</b><br>${sanitizeHtml(message || '')}</p>
  `;
  return { text, html };
}

// Transport 1: SMTP (Gmail etc.)
async function sendViaSMTP(payload) {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`SMTP missing env: ${missing.join(', ')}`);
  }

  const port = Number(process.env.SMTP_PORT);
  const secure = false; // force STARTTLS when using port 587

  console.log('[MAIL:SMTP] host:', process.env.SMTP_HOST, 'port:', port, 'secure:', secure ? 'ssl' : 'starttls');

  const transporter = nodemailer.createTransport({
    // Using both service + host increases compatibility on some providers
    service: process.env.SMTP_SERVICE || undefined, // e.g., 'gmail' (optional)
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    requireTLS: true,
    pool: true,
  });

  await transporter.verify();

  const { text, html } = buildMailBodies(payload);
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,            // must match authenticated account for Gmail
    sender: process.env.MAIL_FROM || process.env.SMTP_USER, // branded display name (optional)
    to: process.env.MAIL_TO,
    replyTo: payload.email ? `${payload.name || 'Website Visitor'} <${payload.email}>` : (process.env.MAIL_FROM || process.env.SMTP_USER),
    subject: buildSubject(payload.name, payload.company),
    text,
    html,
  });

  return { provider: 'smtp', messageId: info.messageId };
}

// Transport 2: Resend (fallback or primary if configured)
// https://resend.com
async function sendViaResend(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');

  const from = process.env.MAIL_FROM || 'no-reply@nuvio.dev';
  const { text, html } = buildMailBodies(payload);

  console.log('[MAIL:RESEND] sending via Resend');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: process.env.MAIL_TO,
      subject: buildSubject(payload.name, payload.company),
      html,
      text,
      reply_to: payload.email || undefined,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed: ${res.status} ${res.statusText} - ${body}`);
  }

  const data = await res.json();
  return { provider: 'resend', id: data?.id || null };
}

// GET: health check for the route
export async function GET() {
  return NextResponse.json({ ok: true, route: 'contact' });
}

export async function POST(req) {
  let stage = 'start';
  try {
    const { name = '', email = '', company = '', message = '' } = await req.json();
    const payload = { name, email, company, message };

    // Strategy:
    // 1) If USE_RESEND === 'true' use Resend first.
    // 2) Else try SMTP. If SMTP fails and RESEND_API_KEY exists, fallback to Resend.
    const useResendFirst = String(process.env.USE_RESEND || '').toLowerCase() === 'true';

    if (useResendFirst) {
      stage = 'resend';
      const out = await sendViaResend(payload);
      return NextResponse.json({ ok: true, ...out });
    }

    stage = 'smtp';
    try {
      const out = await sendViaSMTP(payload);
      return NextResponse.json({ ok: true, ...out });
    } catch (smtpErr) {
      console.error('MAIL ERROR (SMTP):', {
        stage,
        message: smtpErr?.message,
        code: smtpErr?.code,
        errno: smtpErr?.errno,
        response: smtpErr?.response,
        command: smtpErr?.command,
        address: smtpErr?.address,
        port: smtpErr?.port,
      });

      // Fallback to Resend if available
      if (process.env.RESEND_API_KEY) {
        stage = 'resend-fallback';
        const out = await sendViaResend(payload);
        return NextResponse.json({ ok: true, ...out });
      }

      // No fallback configured
      throw smtpErr;
    }
  } catch (e) {
    // Log more structured info to Vercel function logs
    console.error('MAIL ERROR (FINAL):', {
      stage,
      message: e?.message,
      code: e?.code,
      errno: e?.errno,
      response: e?.response,
      command: e?.command,
      address: e?.address,
      port: e?.port,
    });
    return NextResponse.json(
      {
        ok: false,
        stage,
        error: e?.message || String(e),
        code: e?.code || null,
      },
      { status: 500 }
    );
  }
}