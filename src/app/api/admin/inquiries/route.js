import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  sameOriginRequest,
} from "@/lib/admin-session";
import {
  listMailInquiries,
  changeMailInquiry,
  MailboxChangedError,
  InquiryNotFoundError,
} from "@/lib/inquiry-mailbox";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const response = (data, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
async function authenticated() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE_NAME)?.value);
}
function failure(error) {
  console.error("[INQUIRY_MAILBOX]", { code: error.code || error.name });
  if (error instanceof MailboxChangedError)
    return response({ ok: false, error: error.message }, 409);
  if (error instanceof InquiryNotFoundError)
    return response({ ok: false, error: error.message }, 404);
  return response(
    {
      ok: false,
      error:
        "Gmail함에 연결하지 못했습니다. IMAP 사용 설정과 앱 비밀번호를 확인해 주세요. 기존 메일은 삭제되지 않았습니다.",
    },
    503,
  );
}
export async function GET(req) {
  if (!(await authenticated()))
    return response({ ok: false, error: "로그인이 필요합니다." }, 401);
  const before = new URL(req.url).searchParams.get("before");
  if (before && !/^\d{1,10}$/.test(before))
    return response({ ok: false, error: "목록 요청을 확인해 주세요." }, 400);
  try {
    return response({
      ok: true,
      storage: "gmail",
      ...(await listMailInquiries({
        before: before ? Number(before) : undefined,
      })),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(req) {
  if (!(await authenticated()))
    return response({ ok: false, error: "로그인이 필요합니다." }, 401);
  if (!sameOriginRequest(req))
    return response({ ok: false, error: "허용되지 않은 요청입니다." }, 403);
  try {
    const id = new URL(req.url).searchParams.get("id"),
      { completed } = await req.json();
    if (!id || typeof completed !== "boolean")
      return response({ ok: false, error: "변경 요청을 확인해 주세요." }, 400);
    return response(await changeMailInquiry(id, { completed }));
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(req) {
  if (!(await authenticated()))
    return response({ ok: false, error: "로그인이 필요합니다." }, 401);
  if (!sameOriginRequest(req))
    return response({ ok: false, error: "허용되지 않은 요청입니다." }, 403);
  const id = new URL(req.url).searchParams.get("id");
  if (!id)
    return response({ ok: false, error: "문의 ID를 확인해 주세요." }, 400);
  try {
    return response({
      ...(await changeMailInquiry(id, { archive: true })),
      archived: true,
    });
  } catch (error) {
    return failure(error);
  }
}
