"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PIXEL_CODE_HTML = `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1532252177885828');
fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1532252177885828&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->`;

const PIXEL_ID = "1532252177885828";

export default function AdminPixelPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.ok && data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setError(data.error || "비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setPassword("");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(PIXEL_CODE_HTML);
    alert("코드가 클립보드에 복사되었습니다.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            관리자 로그인
          </h1>
          <p className="text-white/60 text-sm text-center mb-6">
            Meta 픽셀 페이지는 관리자만 접근할 수 있습니다.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-main"
                placeholder="비밀번호를 입력하세요"
                required
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-main text-white font-bold rounded-lg hover:bg-[#1244F9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white p-4 md:p-8 pt-24 md:pt-32">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Meta 픽셀</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/inquiries"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              문의관리
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-sm cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">픽셀 상태</h2>
            <p className="text-white/80 text-sm mb-4">
              이 사이트의 전역 레이아웃에 Meta 픽셀이 적용되어 있으며, 모든
              페이지에서 PageView 이벤트가 전송됩니다.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <dt className="text-white/60">픽셀 ID</dt>
              <dd className="font-mono text-main">{PIXEL_ID}</dd>
              <dt className="text-white/60">기본 이벤트</dt>
              <dd>PageView</dd>
            </dl>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                설치된 픽셀 코드
              </h2>
              <button
                type="button"
                onClick={copyCode}
                className="px-4 py-2 bg-main hover:bg-[#1244F9] rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                코드 복사
              </button>
            </div>
            <p className="text-white/60 text-sm mb-4">
              아래 코드는 레이아웃에 이미 포함되어 있습니다. 참고용으로만
              확인하세요.
            </p>
            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm text-white/90 font-mono whitespace-pre-wrap break-all">
              {PIXEL_CODE_HTML}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
