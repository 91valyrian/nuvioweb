import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// 문의사항 저장 경로
const INQUIRIES_FILE = path.join(process.cwd(), "data", "inquiries.json");

// 문의사항을 파일에 저장
function saveInquiry(payload) {
  try {
    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(INQUIRIES_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 기존 문의사항 읽기
    let inquiries = [];
    if (fs.existsSync(INQUIRIES_FILE)) {
      try {
        const fileContent = fs.readFileSync(INQUIRIES_FILE, "utf8");
        inquiries = JSON.parse(fileContent);
      } catch (err) {
        console.error("Failed to read inquiries file:", err);
        inquiries = [];
      }
    }

    // 새 문의사항 추가
    const newInquiry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...payload,
    };

    inquiries.unshift(newInquiry); // 최신순으로 앞에 추가

    // 파일에 저장
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");

    return newInquiry;
  } catch (err) {
    console.error("Failed to save inquiry:", err);
    // 저장 실패해도 메일 발송은 계속 진행
    return null;
  }
}

// ----- helpers -----
function sanitizeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function buildSubject(name, company) {
  return `[홈페이지 제작 문의] ${name || "No name"}${company ? ` - ${company}` : ""}`;
}

function buildMailBodies({
  services = [],
  name,
  email,
  company,
  position,
  phone,
  url,
  message,
  budget = [],
}) {
  // Plain-text version (for clients that don't render HTML)
  const text =
    `Contact Form Submission\n\n` +
    `Services: ${Array.isArray(services) && services.length ? services.join(", ") : "-"}\n` +
    `Name: ${name || "-"}\n` +
    `Company: ${company || "-"}\n` +
    `Position: ${position || "-"}\n` +
    `Phone: ${phone || "-"}\n` +
    `Email: ${email || "-"}\n` +
    `Url: ${url || "-"}\n` +
    `Budget: ${Array.isArray(budget) && budget.length ? budget.join(", ") : "-"}\n` +
    `\nMessage:\n${message || ""}`;

  // HTML version with an email-safe table layout
  const row = (label, value) => `
    <tr>
      <th style="text-align:left;padding:8px 10px;width:160px;background:#f6f6f6;border:1px solid #eaeaea;">${sanitizeHtml(label)}</th>
      <td style="padding:8px 10px;border:1px solid #eaeaea;">${value}</td>
    </tr>`;

  const servicesHtml =
    Array.isArray(services) && services.length
      ? services.map(sanitizeHtml).join(", ")
      : "-";
  const budgetHtml =
    Array.isArray(budget) && budget.length
      ? budget.map(sanitizeHtml).join(", ")
      : "-";

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111;">
    <h2 style="margin:0 0 12px 0;font-size:16px;">홈페이지 제작 문의 내용</h2>
    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #eaeaea;background:#fff;">
      ${row("요청 서비스", servicesHtml)}
      ${row("이름", sanitizeHtml(name || "-"))}
      ${row("회사명", sanitizeHtml(company || "-"))}
      ${row("직급", sanitizeHtml(position || "-"))}
      ${row("연락처", sanitizeHtml(phone || "-"))}
      ${row("이메일", sanitizeHtml(email || "-"))}
      ${row("홈페이지", sanitizeHtml(url || "-"))}
      ${row("예산", budgetHtml)}
      ${row("문의 내용", sanitizeHtml(message || ""))}
    </table>
  </div>`;

  return { text, html };
}

// ----- SMTP sender -----
async function sendViaSMTP(payload) {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "MAIL_TO",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length)
    throw new Error(`SMTP missing env: ${missing.join(", ")}`);

  const port = Number(process.env.SMTP_PORT);
  const secure = port === 465; // 465 = SSL, 587 = STARTTLS

  console.log("[MAIL:SMTP]", {
    host: process.env.SMTP_HOST,
    port,
    secure: secure ? "ssl" : "starttls",
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    ...(port === 587 ? { requireTLS: true } : {}),
    tls: { minVersion: "TLSv1.2" },
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
    replyTo: payload.email
      ? `${payload.name || "Website Visitor"} <${payload.email}>`
      : process.env.MAIL_FROM || process.env.SMTP_USER,
    subject: buildSubject(payload.name, payload.company),
    text,
    html,
  });

  return { provider: "smtp", messageId: info.messageId };
}

// ----- Resend fallback -----
async function sendViaResend(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const from = process.env.MAIL_FROM || "no-reply@nuvio.dev";
  const { text, html } = buildMailBodies(payload);

  console.log("[MAIL:RESEND] sending via Resend");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
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
  return { provider: "resend", id: data?.id || null };
}

// ----- route handlers -----
export async function GET() {
  return NextResponse.json({ ok: true, route: "contact" });
}

// 백그라운드에서 메일 발송 처리 (비동기)
async function sendEmailInBackground(payload) {
  // 에러가 발생해도 사용자에게는 영향을 주지 않도록 처리
  try {
    const useResendFirst =
      String(process.env.USE_RESEND || "").toLowerCase() === "true";

    if (useResendFirst) {
      await sendViaResend(payload);
      console.log("[MAIL] Sent via Resend (background)");
      return;
    }

    try {
      await sendViaSMTP(payload);
      console.log("[MAIL] Sent via SMTP (background)");
    } catch (smtpErr) {
      console.error("MAIL ERROR (SMTP):", {
        message: smtpErr?.message,
        code: smtpErr?.code,
      });

      if (process.env.RESEND_API_KEY) {
        await sendViaResend(payload);
        console.log("[MAIL] Sent via Resend (fallback, background)");
      } else {
        throw smtpErr;
      }
    }
  } catch (e) {
    // 백그라운드 에러는 로그만 남기고 사용자에게는 영향 없음
    console.error("MAIL ERROR (BACKGROUND):", {
      message: e?.message,
      code: e?.code,
    });
  }
}

export async function POST(req) {
  try {
    const {
      services = [],
      name = "",
      email = "",
      company = "",
      position = "",
      phone = "",
      url = "",
      message = "",
      budget = [],
    } = await req.json();

    const payload = {
      services: Array.isArray(services) ? services : [],
      name,
      email,
      company,
      position,
      phone,
      url,
      budget: Array.isArray(budget) ? budget : budget ? [budget] : [],
      message,
    };

    // 문의사항을 파일에 저장 (즉시 처리)
    saveInquiry(payload);

    // 메일 발송은 백그라운드에서 비동기로 처리 (사용자 응답을 블로킹하지 않음)
    sendEmailInBackground(payload).catch((err) => {
      console.error("Background email sending failed:", err);
    });

    // 사용자에게 즉시 성공 응답 반환
    return NextResponse.json({
      ok: true,
      message: "문의사항이 접수되었습니다.",
      sentInBackground: true,
    });
  } catch (e) {
    console.error("CONTACT API ERROR:", {
      message: e?.message,
      code: e?.code,
    });
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || "문의사항 접수 중 오류가 발생했습니다.",
        code: e?.code || null,
      },
      { status: 500 }
    );
  }
}
