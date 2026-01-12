import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const INQUIRIES_FILE = path.join(process.cwd(), "data", "inquiries.json");
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-this";

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

// 문의사항 읽기
function getInquiries() {
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      return [];
    }

    const fileContent = fs.readFileSync(INQUIRIES_FILE, "utf8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Failed to read inquiries:", err);
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
    const inquiries = getInquiries();
    return NextResponse.json({ ok: true, inquiries });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "문의사항을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 문의사항 저장
function saveInquiries(inquiries) {
  try {
    const dataDir = path.dirname(INQUIRIES_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save inquiries:", err);
    throw err;
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

    const inquiries = getInquiries();
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, completed: !!completed } : inq
    );

    saveInquiries(updated);

    return NextResponse.json({ ok: true });
  } catch (error) {
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

    const inquiries = getInquiries();
    const filtered = inquiries.filter((inq) => inq.id !== id);

    saveInquiries(filtered);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "문의사항 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
