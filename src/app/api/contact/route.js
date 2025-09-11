import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// GET: health check for the route
export async function GET() {
  return NextResponse.json({ ok: true, route: 'contact' });
}

export async function POST(req) {
  try {
    const { name = '', email = '', company = '', message = '' } = await req.json();

    // 1) Strict env check (no localhost fallback)
    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      return NextResponse.json(
        { ok: false, error: `Missing environment variables: ${missing.join(', ')}` },
        { status: 500 }
      );
    }

    const port = Number(process.env.SMTP_PORT);
    const secure = port === 465; // 465: SSL, 587: STARTTLS

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port,
      secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      ...(port === 587 ? { requireTLS: true } : {}),
      // Optional hardening:
      // tls: { ciphers: 'TLSv1.2' },
      // connectionTimeout: 10000,
    });

    // Verify connection (fail fast if misconfigured)
    await transporter.verify();

    const subject = `[Contact] ${name || 'No name'}${company ? ` - ${company}` : ''}`;

    const safeMessageHtml = (message || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM, // For Gmail, this should usually equal SMTP_USER
      to: process.env.MAIL_TO,
      replyTo: email ? `${name || 'Website Visitor'} &lt;${email}&gt;` : process.env.MAIL_FROM,
      subject,
      text: `${message || ''}\n\nFrom: ${name} <${email || '-'}>\nCompany: ${company || '-'}`,
      html: `
        <p><b>Name:</b> ${name || '-'}</p>
        <p><b>Company:</b> ${company || '-'}</p>
        <p><b>Email:</b> ${email || '-'}</p>
        <p><b>Message:</b><br>${safeMessageHtml}</p>
      `,
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e) {
    console.error('MAIL ERROR:', e);
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}