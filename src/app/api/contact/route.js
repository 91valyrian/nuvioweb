import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// ----- helpers -----
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

function buildMailBodies({ services = [], name, email, company, position, phone, url, message }) {
  // Plain-text version (for clients that don't render HTML)
  const text = `Contact Form Submission\n\n` +
    `Services: ${Array.isArray(services) && services.length ? services.join(', ') : '-'}\n` +
    `Name: ${name || '-'}\n` +
    `Company: ${company || '-'}\n` +
    `Position: ${position || '-'}\n` +
    `Phone: ${phone || '-'}\n` +
    `Email: ${email || '-'}\n` +
    `Url: ${url || '-'}\n` +
    `\nMessage:\n${message || ''}`;

  // HTML version with an email-safe table layout
  const row = (label, value) => `
    <tr>
      <th style="text-align:left;padding:8px 10px;width:160px;background:#f6f6f6;border:1px solid #eaeaea;">${sanitizeHtml(label)}</th>
      <td style="padding:8px 10px;border:1px solid #eaeaea;">${value}</td>
    </tr>`;

  const servicesHtml = Array.isArray(services) && services.length
    ? services.map(sanitizeHtml).join(', ')
    : '-';

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111;">
    <h2 style="margin:0 0 12px 0;font-size:16px;">Contact Form Submission</h2>
    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #eaeaea;background:#fff;">
      ${row('Services', servicesHtml)}
      ${row('Name', sanitizeHtml(name || '-'))}
      ${row('Company', sanitizeHtml(company || '-'))}
      ${row('Position', sanitizeHtml(position || '-'))}
      ${row('Phone', sanitizeHtml(phone || '-'))}
      ${row('Email', sanitizeHtml(email || '-'))}
      ${row('Url', sanitizeHtml(url || '-'))}
      ${row('Message', sanitizeHtml(message || ''))}
    </table>
  </div>`;

  return { text, html };
}

// ----- SMTP sender -----
async function sendViaSMTP(payload) {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`SMTP missing env: ${missing.join(', ')}`);

  const port = Number(process.env.SMTP_PORT);
  const secure = port === 465; // 465 = SSL, 587 = STARTTLS

  console.log('[MAIL:SMTP]', { host: process.env.SMTP_HOST, port, secure: secure ? 'ssl' : 'starttls' });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    ...(port === 587 ? { requireTLS: true } : {}),
    tls: { minVersion: 'TLSv1.2' },
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    pool: true,
  });

  await transporter.verify();

  const { text, html } = buildMailBodies(payload);
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER, // must match Gmail account
    sender: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    replyTo: payload.email ? `${payload.name || 'Website Visitor'} <${payload.email}>` : (process.env.MAIL_FROM || process.env.SMTP_USER),
    subject: buildSubject(payload.name, payload.company),
    text,
    html,
  });

  return { provider: 'smtp', messageId: info.messageId };
}

// ----- Resend fallback -----
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

// ----- route handlers -----
export async function GET() {
  return NextResponse.json({ ok: true, route: 'contact' });
}

export async function POST(req) {
  let stage = 'start';
  try {
    const {
      services = [],
      name = '',
      email = '',
      company = '',
      position = '',
      phone = '',
      url = '',
      message = '',
    } = await req.json();

    const payload = {
      services: Array.isArray(services) ? services : [],
      name,
      email,
      company,
      position,
      phone,
      url,
      message,
    };

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

      if (process.env.RESEND_API_KEY) {
        stage = 'resend-fallback';
        const out = await sendViaResend(payload);
        return NextResponse.json({ ok: true, ...out });
      }
      throw smtpErr;
    }
  } catch (e) {
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
      { ok: false, stage, error: e?.message || String(e), code: e?.code || null },
      { status: 500 }
    );
  }
}