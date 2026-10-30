import { after, NextResponse } from "next/server";
import { classifyInquiryMail } from "@/lib/inquiry-mailbox";
import nodemailer from "nodemailer";
import {
  normalizeInquiry,
  deliverInquiry,
  smtpConfiguration,
  InquiryValidationError,
  MailConfigurationError,
} from "@/lib/inquiry-mail";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const json = (data, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function GET() {
  return json(
    { ok: false, error: "문의 전송은 POST 요청을 사용해 주세요." },
    405,
  );
}
export async function POST(req) {
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > 32768)
      return json(
        { ok: false, error: "문의 내용이 너무 깁니다. 내용을 줄여 주세요." },
        413,
      );
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      return json({ ok: false, error: "입력 내용을 확인해 주세요." }, 400);
    }
    const record = normalizeInquiry(input);
    if (Buffer.byteLength(JSON.stringify(record), "utf8") > 32768)
      return json(
        { ok: false, error: "문의 내용이 너무 깁니다. 내용을 줄여 주세요." },
        413,
      );
    const config = smtpConfiguration();
    await deliverInquiry(record, config, nodemailer.createTransport);
    // Classification is independent of accepted delivery; never invite a duplicate submission.
    after(async () => {
      try {
        await classifyInquiryMail(record);
      } catch (error) {
        console.error("[CONTACT_MAIL_CLASSIFICATION_FAILED]", {
          code: error.code || error.name,
        });
      }
    });
    // This is delivery acknowledgement, never a simulated database success.
    if (process.env.NTFY_TOPIC) {
      try {
        await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
          method: "POST",
          headers: {
            Title: "New inquiry",
            Click: "https://nuvio-web.com/admin/inquiries",
          },
          body: "New website inquiry received.",
          signal: AbortSignal.timeout(2500),
        });
      } catch {
        /* Email already accepted. */
      }
    }
    return json({
      ok: true,
      emailSent: true,
      storage: "gmail",
      message: "문의가 전송되었습니다. 확인 후 연락드리겠습니다.",
    });
  } catch (error) {
    if (error instanceof InquiryValidationError)
      return json({ ok: false, error: error.message }, 400);
    console.error("[CONTACT_MAIL_FAILED]", {
      code: error.code || error.name,
      responseCode: error.responseCode,
    });
    return json(
      {
        ok: false,
        error:
          "전송을 완료하지 못했습니다. 작성하신 내용은 그대로 유지됩니다. 잠시 후 다시 시도하거나 91.valyrian@gmail.com으로 직접 문의해 주세요.",
      },
      error instanceof MailConfigurationError ? 503 : 502,
    );
  }
}
