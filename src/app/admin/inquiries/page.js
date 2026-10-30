"use client";

import { useEffect, useState } from "react";
import "./inquiries.css";

export default function AdminInquiriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadInquiries();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  };

  // 인증 상태 확인
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        loadInquiries();
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
      setInquiries([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const loadInquiries = async ({ append = false } = {}) => {
    setFetching(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/inquiries${append && nextCursor ? `?before=${nextCursor}` : ""}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (res.status === 401) {
        setIsAuthenticated(false);
        setInquiries([]);
        return;
      }
      if (!res.ok || !data.ok)
        throw new Error(data.error || "문의 목록을 불러올 수 없습니다.");
      setInquiries((prev) =>
        append ? [...prev, ...(data.inquiries || [])] : data.inquiries || [],
      );
      setNextCursor(data.hasMore ? data.nextCursor : null);
      setHasLoaded(true);
    } catch (err) {
      setError(err.message || "문의 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "이 문의를 목록에서 보관 처리할까요? 원본은 Gmail의 NUVIO-Inquiries-Archive 폴더로 이동하며 영구 삭제되지 않습니다.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/inquiries?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        loadInquiries();
      } else {
        setError("보관 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setError("보관 처리 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="inquiries-admin min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            관리자 로그인
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
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
              className="w-full px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const res = await fetch(
        `/api/admin/inquiries?id=${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !currentStatus }),
        },
      );

      if (res.ok) {
        loadInquiries();
      } else {
        setError("완료 상태 변경 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setError("완료 상태 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="inquiries-admin min-h-screen bg-[#1a1a2e] text-white p-4 md:p-8 pt-24 md:pt-32">
      <div className="container mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">문의사항 관리</h1>
          <div className="flex gap-4">
            <button
              onClick={() => loadInquiries()}
              disabled={fetching}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm cursor-pointer"
            >
              새로고침
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-sm cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 통계 */}
        <div className="mb-6 text-white/60">
          불러온 문의 {inquiries.length}건
          {inquiries.filter((inq) => inq.completed).length > 0 && (
            <span className="ml-2">
              (완료: {inquiries.filter((inq) => inq.completed).length}건)
            </span>
          )}
        </div>

        <p className="mailbox-note">
          Gmail로 접수된 문의를 표시합니다. 전환 이전의 DB 문의는 자동으로
          이동하지 않습니다.
        </p>
        {error && (
          <div role="alert" className="mailbox-error">
            {error}
          </div>
        )}
        {fetching && <p role="status">메일함에서 문의를 불러오고 있습니다…</p>}
        {/* 문의사항 목록 */}
        {inquiries.length === 0 && !fetching && !error && hasLoaded ? (
          <div className="text-center py-20 text-white/60">
            문의사항이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`bg-white/5 backdrop-blur-md border rounded-xl p-6 hover:border-white/20 transition-colors ${
                  inquiry.completed
                    ? "border-green-500/30 opacity-60"
                    : "border-white/10"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() =>
                        handleToggleComplete(inquiry.id, inquiry.completed)
                      }
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                        inquiry.completed
                          ? "bg-green-500 border-green-500"
                          : "border-white/30 hover:border-green-500/50"
                      }`}
                      title={inquiry.completed ? "완료 취소" : "완료 처리"}
                    >
                      {inquiry.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-white/50">
                          {formatDate(inquiry.created_at)}
                        </div>
                        {inquiry.completed && (
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                            완료
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {inquiry.name || "이름 없음"}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded hover:bg-red-500/10 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    보관
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">연락처:</span>{" "}
                    <span className="text-white">{inquiry.phone || "-"}</span>
                  </div>
                  {inquiry.email && (
                    <div>
                      <span className="text-white/60">이메일:</span>{" "}
                      <span className="text-white">{inquiry.email}</span>
                    </div>
                  )}
                  {inquiry.company && (
                    <div>
                      <span className="text-white/60">회사명:</span>{" "}
                      <span className="text-white">{inquiry.company}</span>
                    </div>
                  )}
                  {inquiry.url && inquiry.url !== "없음" && (
                    <div>
                      <span className="text-white/60">홈페이지:</span>{" "}
                      <span className="text-white">{inquiry.url}</span>
                    </div>
                  )}
                  {inquiry.budget && (
                    <div>
                      <span className="text-white/60">예산:</span>{" "}
                      <span className="text-white">
                        {Array.isArray(inquiry.budget)
                          ? inquiry.budget.join(", ")
                          : inquiry.budget}
                      </span>
                    </div>
                  )}
                  {inquiry.services && inquiry.services.length > 0 && (
                    <div>
                      <span className="text-white/60">서비스:</span>{" "}
                      <span className="text-white">
                        {Array.isArray(inquiry.services)
                          ? inquiry.services.join(", ")
                          : inquiry.services}
                      </span>
                    </div>
                  )}
                </div>

                {inquiry.message && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-white/60 text-sm mb-2">문의 내용:</div>
                    <div className="text-white whitespace-pre-wrap">
                      {inquiry.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {nextCursor && (
          <button
            className="mailbox-more"
            type="button"
            disabled={fetching}
            onClick={() => loadInquiries({ append: true })}
          >
            이전 문의 더 보기
          </button>
        )}
      </div>
    </div>
  );
}
