"use client";
import { useState } from "react";
import Input from "./_components/Input";
import Textarea from "./_components/Textarea";
import Checkbox from "./_components/Checkbox";

const SERVICE_OPTIONS = [
  "브랜딩 홈페이지",
  "랜딩 페이지",
  "온라인 쇼핑몰",
  "홈페이지 리뉴얼",
  "검색엔진 최적화",
  "웹 접근성 최적화",
  "사이트 유지 관리",
];

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

    const services = Array.from(
      form.querySelectorAll('input[name="services"]:checked')
    ).map((el) => el.value);

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
    <main className="container" >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Contact</h1>
      <p style={{ color: "#aaa", margin: "0 0 24px" }}>
        필요한 서비스를 선택하고 정보를 입력해 주세요. 빠르게 연락드리겠습니다.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 20 }}>
        {/* Services (multiple) */}
        <fieldset style={{ border: "1px solid #333", padding: 16, borderRadius: 8 }}>
          <legend style={{ padding: "0 8px" }}>필요한 서비스 선택 (복수 선택 가능)</legend>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {SERVICE_OPTIONS.map((label) => (
              <Checkbox key={label} name="services" value={label} label={label} />
            ))}
          </div>
        </fieldset>

        {/* Two-column grid for basics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input name="name" label="Full name" required placeholder="Full name *" />
          <Input name="company" label="Company" placeholder="Company" />

          <Input name="position" label="Position" placeholder="Position (직급)" />
          <Input
            name="phone"
            label="Phone Number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="숫자만 입력"
            onChange={(e)=>{ e.target.value = e.target.value.replace(/\D/g,''); }}
          />

          <Input name="email" type="email" label="E-mail" required placeholder="E-mail *" />
          <Input name="url" type="url" label="Url" placeholder="https://..." />
        </div>

        <Textarea name="message" label="Message" placeholder="문의내용" rows={6} />

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