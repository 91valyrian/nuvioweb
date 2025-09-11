import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  return new Response('contact api ok'); // 라우트 확인용
}

export async function POST(req) {
  try {
    const { name, email, company, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,                // smtp.gmail.com
      port: Number(process.env.SMTP_PORT || 465), // 465 or 587
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // (선택) 연결 확인 로그
    // const ok = await transporter.verify().catch(e => e);
    // console.log('SMTP verify:', ok);

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,             // Gmail이면 SMTP_USER와 동일 권장
      to: process.env.MAIL_TO,                 // 수신자(운영/본인)
      replyTo: email,                          // 고객 메일
      subject: `[Contact] ${name}${company ? ` - ${company}` : ''}`,
      text: `${message || ''}\n\nFrom: ${name} <${email}>`,
      // html: ...  (원하면 HTML 본문)
    });

    // console.log('sendMail info:', info);
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e) {
    console.error('MAIL ERROR:', e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}