import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // 기본값 (환경변수로 변경 권장)
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-this";

// 간단한 세션 토큰 생성 (실제 운영 환경에서는 더 강력한 방법 사용 권장)
function generateSessionToken() {
  return Buffer.from(`${Date.now()}-${SESSION_SECRET}`).toString("base64");
}

function verifySessionToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [timestamp] = decoded.split("-");
    const age = Date.now() - parseInt(timestamp);
    // 세션 유효기간: 24시간
    return age < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function POST(req) {
  try {
    const { password } = await req.json();

    if (password === ADMIN_PASSWORD) {
      const sessionToken = generateSessionToken();
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24시간
        path: "/",
      });

      return NextResponse.json({ ok: true, authenticated: true });
    }

    return NextResponse.json(
      { ok: false, error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "인증 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken && verifySessionToken(sessionToken)) {
      return NextResponse.json({ ok: true, authenticated: true });
    }

    return NextResponse.json({ ok: false, authenticated: false });
  } catch (error) {
    return NextResponse.json({ ok: false, authenticated: false });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({ ok: true, authenticated: false });
  } catch (error) {
    return NextResponse.json({ ok: false });
  }
}
