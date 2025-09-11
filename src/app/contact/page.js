"use client";
import { useState } from "react";

export default function ContactPage() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        company: fd.get("company"),
        message: fd.get("message"),
      }),
    });
    setOk(res.ok);
    setLoading(false);
  }

  return (
    <main className="container" style={{ padding: "48px 16px", maxWidth: 720 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Contact</h1>
      <p style={{ color: "#555", margin: "0 0 24px" }}>
        프로젝트 문의를 남겨주세요. 빠르게 답변드리겠습니다.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input name="name" required placeholder="Name *" className="field" />
        <input name="email" type="email" required placeholder="Email *" className="field" />
        <input name="company" placeholder="Company" className="field" />
        <textarea name="message" placeholder="Message" rows={6} className="field" />
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Sending..." : "Send"}
        </button>
        {ok && <p style={{ color: "green" }}>메일이 성공적으로 발송되었습니다!</p>}
      </form>
    </main>
  );
}