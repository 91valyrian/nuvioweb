import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  generateSessionToken,
  verifySessionToken,
  verifyAdminPassword,
  sameOriginRequest,
} from "@/lib/admin-session";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const response = (data, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export async function POST(req) {
  if (!sameOriginRequest(req))
    return response({ ok: false, error: "허용되지 않은 요청입니다." }, 403);
  try {
    const { password } = await req.json();
    if (!verifyAdminPassword(password))
      return response(
        { ok: false, error: "비밀번호가 올바르지 않습니다." },
        401,
      );
    const store = await cookies();
    store.set(SESSION_COOKIE_NAME, generateSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });
    return response({ ok: true, authenticated: true });
  } catch {
    return response(
      { ok: false, error: "관리자 인증 설정을 확인해 주세요." },
      503,
    );
  }
}
export async function GET() {
  const store = await cookies();
  return response({
    ok: true,
    authenticated: verifySessionToken(store.get(SESSION_COOKIE_NAME)?.value),
  });
}
export async function DELETE(req) {
  if (!sameOriginRequest(req)) return response({ ok: false }, 403);
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  return response({ ok: true, authenticated: false });
}
