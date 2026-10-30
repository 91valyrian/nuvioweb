import { randomUUID } from "node:crypto";

export const INQUIRY_RECIPIENT = "91.valyrian@gmail.com";
export const INQUIRY_HEADER = "X-Nuvio-Inquiry";
export const INQUIRY_ATTACHMENT = "nuvio-inquiry.json";
export class InquiryValidationError extends Error {}
export class MailConfigurationError extends Error {}

const clean = (value, max) =>
  String(value ?? "")
    .trim()
    .slice(0, max);
const oneLine = (value, max) => clean(value, max).replace(/[\r\n]/g, " ");
const list = (value) =>
  (Array.isArray(value) ? value : value ? [value] : [])
    .slice(0, 10)
    .map((v) => oneLine(v, 100))
    .filter(Boolean);
export function normalizeInquiry(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new InquiryValidationError("입력 내용을 확인해 주세요.");
  const name = oneLine(input.name, 100);
  const email = oneLine(input.email, 254);
  const phone = oneLine(input.phone, 40);
  if (input.websiteTrap)
    throw new InquiryValidationError("요청을 확인할 수 없습니다.");
  if (!name) throw new InquiryValidationError("이름을 입력해 주세요.");
  if (!email && !/\d{8,}/.test(phone.replace(/\D/g, "")))
    throw new InquiryValidationError("이메일 또는 연락처를 입력해 주세요.");
  if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
    throw new InquiryValidationError("이메일 주소를 확인해 주세요.");
  if (input.consent !== true)
    throw new InquiryValidationError("개인정보 수집·이용에 동의해 주세요.");
  const url = clean(input.url, 1000);
  if (url && !/^https?:\/\//i.test(url))
    throw new InquiryValidationError(
      "홈페이지 주소는 https:// 또는 http://로 시작해 주세요.",
    );
  return {
    version: 1,
    id: randomUUID(),
    created_at: new Date().toISOString(),
    name,
    email,
    phone,
    company: oneLine(input.company, 200),
    position: oneLine(input.position, 100),
    url,
    services: list(input.services),
    budget: list(input.budget),
    message: clean(input.message, 10000),
    consent: true,
  };
}
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export function inquiryMailOptions(record, sender) {
  const rows = [
    ["이름", record.name],
    ["이메일", record.email],
    ["연락처", record.phone],
    ["회사명", record.company],
    ["직급", record.position],
    ["홈페이지", record.url],
    ["서비스", record.services.join(", ")],
    ["예산", record.budget.join(", ")],
    ["문의 내용", record.message],
  ];
  return {
    from: { name: "누비오 홈페이지 문의", address: sender },
    to: INQUIRY_RECIPIENT,
    ...(record.email
      ? { replyTo: { name: record.name, address: record.email } }
      : {}),
    subject: `[홈페이지 제작 문의] ${record.name}${record.company ? ` · ${record.company}` : ""}`,
    messageId: `<${record.id}@nuvio-web.com>`,
    headers: { [INQUIRY_HEADER]: "v1" },
    text: rows
      .map(([label, value]) => `${label}: ${value || "-"}`)
      .join("\n\n"),
    html: `<h2>홈페이지 제작 문의</h2><table>${rows.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px">${label}</th><td style="padding:10px;white-space:pre-wrap">${escape(value || "-")}</td></tr>`).join("")}</table>`,
    attachments: [
      {
        filename: INQUIRY_ATTACHMENT,
        content: JSON.stringify(record),
        contentType: "application/json",
      },
    ],
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
export function smtpConfiguration(env = process.env) {
  const host = env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(env.SMTP_PORT || 465);
  const user = env.SMTP_USER || INQUIRY_RECIPIENT;
  const pass = env.SMTP_PASS;
  if (!pass || ![465, 587].includes(port))
    throw new MailConfigurationError("메일 발송 설정이 필요합니다.");
  return {
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    pool: false,
  };
}
export function imapConfiguration(env = process.env) {
  const pass =
    env.IMAP_PASS ||
    ((env.SMTP_USER || INQUIRY_RECIPIENT) === INQUIRY_RECIPIENT &&
    /gmail\.com$/.test(env.SMTP_HOST || "smtp.gmail.com")
      ? env.SMTP_PASS
      : "");
  if (!pass)
    throw new MailConfigurationError("Gmail IMAP 연결 설정이 필요합니다.");
  return {
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user: INQUIRY_RECIPIENT, pass },
    tls: { minVersion: "TLSv1.2" },
    logger: false,
    emitLogs: false,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableAutoIdle: true,
  };
}
export async function deliverInquiry(record, config, createTransport) {
  const transport = createTransport(config);
  try {
    const result = await transport.sendMail(
      inquiryMailOptions(record, config.auth.user),
    );
    if (
      !result.accepted?.some(
        (address) => String(address).toLowerCase() === INQUIRY_RECIPIENT,
      )
    )
      throw new Error("Recipient not accepted");
    return { emailSent: true };
  } finally {
    transport.close();
  }
}
