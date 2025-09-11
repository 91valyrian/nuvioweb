"use client";
import { useState } from "react";

export default function ContactPage() {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setOk(false);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    // collect checked services
    const services = Array.from(
      form.querySelectorAll('input[name="services"]:checked')
    ).map((el) => el.value);

    // phone: keep digits only (no hyphen)
    const rawPhone = (fd.get("phone") || "").toString();
    const phone = rawPhone.replace(/\D/g, "");

    const payload = {
      services,
      name: fd.get("name"),
      company: fd.get("company"),
      position: fd.get("position"),
      phone,
      email: fd.get("email"),
      url: fd.get("url"),
      message: fd.get("message"),
      consent: fd.get("consent") ? true : false,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "전송 중 오류가 발생했습니다.");
      } else {
        setOk(true);
        form.reset();
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ padding: "48px 16px", maxWidth: 960 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Contact</h1>
      <p style={{ color: "#aaa", margin: "0 0 24px" }}>
        필요한 서비스를 선택하고 정보를 입력해 주세요. 빠르게 연락드리겠습니다.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 20 }}>
        {/* Services (multiple) */}
        <fieldset style={{ border: "1px solid #333", padding: 16, borderRadius: 8 }}>
          <legend style={{ padding: "0 8px" }}>필요한 서비스 선택 (복수 선택 가능)</legend>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              "브랜딩 홈페이지",
              "랜딩 페이지",
              "온라인 쇼핑몰",
              "홈페이지 리뉴얼",
              "검색엔진 최적화",
              "웹 접근성 최적화",
              "사이트 유지 관리",
            ].map((label) => (
              <label key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" name="services" value={label} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Two-column grid for basics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label className="sr-only" htmlFor="name">Full name</label>
            <input id="name" name="name" required placeholder="Full name *" className="field" />
          </div>
          <div>
            <label className="sr-only" htmlFor="company">Company</label>
            <input id="company" name="company" placeholder="Company" className="field" />
          </div>

          <div>
            <label className="sr-only" htmlFor="position">Position</label>
            <input id="position" name="position" placeholder="Position (직급)" className="field" />
          </div>
          <div>
            <label className="sr-only" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Phone Number (숫자만)"
              className="field"
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required placeholder="E-mail *" className="field" />
          </div>
          <div>
            <label className="sr-only" htmlFor="url">Url</label>
            <input id="url" name="url" type="url" placeholder="Url (홈페이지 주소)" className="field" />
          </div>
        </div>

        <textarea name="message" placeholder="Message (문의내용)" rows={6} className="field" />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="consent" required /> 개인정보 처리방침에 동의합니다.
        </label>

        <button type="submit" disabled={loading} className="btn" style={{ justifySelf: "end" }}>
          {loading ? "Sending..." : "Send"}
        </button>

        {ok && <p style={{ color: "green" }}>메일이 성공적으로 발송되었습니다!</p>}
        {error && <p style={{ color: "tomato" }}>{error}</p>}
      </form>

      {/* A11y helper class if not present */}
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
          white-space: nowrap;
        }
      `}</style>
    </main>
  );
}