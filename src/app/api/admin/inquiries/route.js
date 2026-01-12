import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

const SESSION_COOKIE_NAME = "admin_session";

// 세션 토큰 검증
function verifySessionToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [timestamp] = decoded.split("-");
    const age = Date.now() - parseInt(timestamp);
    return age < 24 * 60 * 60 * 1000; // 24시간
  } catch {
    return false;
  }
}

// 인증 확인 미들웨어
async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken || !verifySessionToken(sessionToken)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Supabase에서 문의사항 조회
async function getInquiries() {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SUPABASE ERROR] Failed to get inquiries:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[SUPABASE ERROR] Exception:", err);
    return [];
  }
}

export async function GET() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    return NextResponse.json(
      { ok: false, error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ ok: true, inquiries });
  } catch (error) {
    console.error("[GET ERROR]", error);
    return NextResponse.json(
      { ok: false, error: "문의사항을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    return NextResponse.json(
      { ok: false, error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { completed } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "문의사항 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("inquiries")
      .update({ completed: !!completed })
      .eq("id", id);

    if (error) {
      console.error("[SUPABASE ERROR] Failed to update inquiry:", error);
      return NextResponse.json(
        { ok: false, error: "완료 상태 변경 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH ERROR]", error);
    return NextResponse.json(
      { ok: false, error: "완료 상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    return NextResponse.json(
      { ok: false, error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "문의사항 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[SUPABASE ERROR] Failed to delete inquiry:", error);
      return NextResponse.json(
        { ok: false, error: "문의사항 삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE ERROR]", error);
    return NextResponse.json(
      { ok: false, error: "문의사항 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
