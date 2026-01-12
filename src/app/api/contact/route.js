import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// 문의사항 저장 경로
// Vercel 서버리스 환경에서는 /tmp 디렉토리만 쓰기 가능
const INQUIRIES_FILE = process.env.VERCEL
  ? path.join("/tmp", "inquiries.json")
  : path.join(process.cwd(), "data", "inquiries.json");

// 문의사항을 파일에 저장
function saveInquiry(payload) {
  try {
    // Vercel 환경에서는 /tmp 디렉토리 사용
    if (process.env.VERCEL) {
      const tmpDir = "/tmp";
      if (!fs.existsSync(tmpDir)) {
        console.warn("[WARN] /tmp directory does not exist");
        return null;
      }
    } else {
      // 로컬 환경에서는 data 디렉토리 생성
      const dataDir = path.dirname(INQUIRIES_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    // 기존 문의사항 읽기
    let inquiries = [];
    if (fs.existsSync(INQUIRIES_FILE)) {
      try {
        const fileContent = fs.readFileSync(INQUIRIES_FILE, "utf8");
        inquiries = JSON.parse(fileContent);
      } catch (err) {
        console.error("[ERROR] Failed to read inquiries file:", err);
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
    
    console.log("[SUCCESS] Inquiry saved:", {
      id: newInquiry.id,
      name: newInquiry.name,
      file: INQUIRIES_FILE,
    });

    return newInquiry;
  } catch (err) {
    // 에러 상세 로깅
    console.error("[ERROR] Failed to save inquiry:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      path: err.path,
      syscall: err.syscall,
      stack: err.stack,
      filePath: INQUIRIES_FILE,
      isVercel: !!process.env.VERCEL,
    });
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
  // 환경변수 설정 상태 확인 (민감한 값은 마스킹)
  const envStatus = {
    SMTP_HOST: process.env.SMTP_HOST ? "✓ set" : "✗ missing",
    SMTP_PORT: process.env.SMTP_PORT ? "✓ set" : "✗ missing",
    SMTP_USER: process.env.SMTP_USER ? `✓ ${process.env.SMTP_USER.substring(0, 3)}***` : "✗ missing",
    SMTP_PASS: process.env.SMTP_PASS ? "✓ set (hidden)" : "✗ missing",
    MAIL_FROM: process.env.MAIL_FROM ? "✓ set" : "✗ missing",
    MAIL_TO: process.env.MAIL_TO ? `✓ ${process.env.MAIL_TO.substring(0, 3)}***` : "✗ missing",
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "✓ set (fallback)" : "✗ not set",
    USE_RESEND: process.env.USE_RESEND || "false",
    VERCEL: process.env.VERCEL ? "✓ yes" : "✗ no (local)",
  };

  return NextResponse.json({
    ok: true,
    route: "contact",
    env: envStatus,
    inquiriesPath: INQUIRIES_FILE,
  });
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

    // 문의사항을 파일에 저장 (Vercel에서는 /tmp 사용, 영구 저장 안됨)
    const savedInquiry = saveInquiry(payload);
    console.log("[CONTACT] Inquiry save result:", savedInquiry ? "success" : "failed");

    // 메일 발송 - Vercel 서버리스 환경에서는 반드시 await 필요
    // (응답 반환 후 함수가 종료되므로 백그라운드 처리 불가)
    let emailResult = { sent: false, error: null };
    try {
      const useResendFirst =
        String(process.env.USE_RESEND || "").toLowerCase() === "true";

      if (useResendFirst) {
        const result = await sendViaResend(payload);
        console.log("[MAIL] Sent via Resend:", result);
        emailResult = { sent: true, provider: "resend" };
      } else {
        try {
          const result = await sendViaSMTP(payload);
          console.log("[MAIL] Sent via SMTP:", result);
          emailResult = { sent: true, provider: "smtp" };
        } catch (smtpErr) {
          console.error("[MAIL ERROR] SMTP failed:", {
            message: smtpErr?.message,
            code: smtpErr?.code,
            stack: smtpErr?.stack,
          });

          // SMTP 실패 시 Resend로 폴백
          if (process.env.RESEND_API_KEY) {
            const result = await sendViaResend(payload);
            console.log("[MAIL] Sent via Resend (fallback):", result);
            emailResult = { sent: true, provider: "resend-fallback" };
          } else {
            emailResult = { sent: false, error: smtpErr?.message };
          }
        }
      }
    } catch (mailErr) {
      console.error("[MAIL ERROR] All methods failed:", {
        message: mailErr?.message,
        code: mailErr?.code,
      });
      emailResult = { sent: false, error: mailErr?.message };
    }

    // 성공 응답 반환
    return NextResponse.json({
      ok: true,
      message: "문의사항이 접수되었습니다.",
      emailSent: emailResult.sent,
      emailProvider: emailResult.provider || null,
    });
  } catch (e) {
    console.error("CONTACT API ERROR:", {
      message: e?.message,
      code: e?.code,
      stack: e?.stack,
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
