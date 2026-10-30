"use client";
import { useRef, useState } from "react";
import { SITE_URL, jsonLd } from "@/lib/site";
import { trackLead } from "@/lib/analytics";
import "./contact.css";
const SERVICES = [
  "브랜딩 홈페이지",
  "랜딩 페이지",
  "온라인 쇼핑몰",
  "홈페이지 리뉴얼",
  "검색엔진 최적화",
  "웹 접근성 최적화",
  "사이트 유지 관리",
  "아직 정하지 못했어요",
];
const BUDGETS = [
  "100만원 이하",
  "200만원 이하",
  "300만원 이하",
  "500만원 이하",
  "1,000만원 이하",
  "상담 후 결정",
];
function Field({
  name,
  label,
  required = false,
  type = "text",
  hint,
  ...props
}) {
  return (
    <div className="contact-field">
      <label htmlFor={`contact-${name}`}>
        {label}{" "}
        {required ? (
          <span className="contact-required">필수</span>
        ) : (
          <span className="contact-optional">선택</span>
        )}
      </label>
      <input
        id={`contact-${name}`}
        name={name}
        type={type}
        required={required}
        aria-describedby={hint ? `contact-${name}-hint` : undefined}
        {...props}
      />
      {hint && (
        <p id={`contact-${name}-hint`} className="contact-field-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
export default function ContactPage() {
  const [status, setStatus] = useState("idle"),
    [error, setError] = useState("");
  const busy = useRef(false),
    resultRef = useRef(null),
    policyRef = useRef(null);
  async function onSubmit(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setStatus("sending");
    setError("");
    const form = event.currentTarget,
      fd = new FormData(form);
    const payload = Object.fromEntries(
      [
        "name",
        "email",
        "phone",
        "company",
        "url",
        "message",
        "websiteTrap",
      ].map((key) => [key, String(fd.get(key) || "")]),
    );
    payload.services = fd.getAll("services");
    payload.budget = fd.getAll("budget");
    payload.consent = fd.get("consent") === "on";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(45000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok !== true)
        throw new Error(
          data.error ||
            "전송을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      trackLead("contact");
      form.reset();
      setStatus("success");
    } catch (cause) {
      setStatus("error");
      setError(
        cause.name === "TimeoutError"
          ? "응답이 지연되고 있습니다. 작성 내용은 유지됩니다. 잠시 후 메일 수신 여부를 확인하거나 직접 연락해 주세요."
          : cause.message || "연결 상태를 확인한 뒤 다시 시도해 주세요.",
      );
    } finally {
      busy.current = false;
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }
  return (
    <main className="contact-inquiry">
      <section className="contact-heading">
        <p className="contact-eyebrow">CONTACT NUVIO</p>
        <h1>
          어떤 홈페이지를
          <br />
          만들고 싶으신가요?
        </h1>
        <p>
          정리된 기획안이 없어도 괜찮습니다.
          <br />
          필요한 내용을 남겨주시면 함께 방향을 찾아드릴게요.
        </p>
      </section>
      <div className="contact-layout">
        <aside className="contact-guide">
          <h2>문의 후 이렇게 진행돼요</h2>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>문의 내용 확인</strong>
                <p>목적과 필요한 기능을 살펴봅니다.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>방향과 범위 상담</strong>
                <p>프로젝트에 맞는 구성과 일정을 논의합니다.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>견적 및 진행 안내</strong>
                <p>합의한 범위를 바탕으로 제안드립니다.</p>
              </div>
            </li>
          </ol>
          <div className="contact-direct">
            <p>바로 이야기하고 싶다면</p>
            <a href="mailto:91.valyrian@gmail.com">91.valyrian@gmail.com ↗</a>
            <a href="tel:01099286110">전화로 문의하기 ↗</a>
            <a
              href="https://pf.kakao.com/_Rhhcn/chat"
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오톡으로 문의하기 ↗
            </a>
          </div>
        </aside>
        <div className="contact-form-card">
          {status === "success" ? (
            <section
              className="contact-success"
              ref={resultRef}
              tabIndex={-1}
              role="status"
            >
              <span className="contact-success-icon" aria-hidden="true">
                ✓
              </span>
              <h2>문의가 전송되었습니다.</h2>
              <p>
                남겨주신 내용을 확인한 뒤 입력하신 연락처로 연락드리겠습니다.
              </p>
              <button type="button" onClick={() => setStatus("idle")}>
                새 문의 작성하기
              </button>
            </section>
          ) : (
            <form onSubmit={onSubmit} aria-busy={status === "sending"}>
              <div className="contact-form-heading">
                <h2>프로젝트 문의</h2>
                <p>
                  <span className="contact-required">필수</span> 표시만
                  입력하셔도 문의할 수 있습니다.
                </p>
              </div>
              <fieldset disabled={status === "sending"}>
                <legend>
                  <span>01</span> 어떤 도움이 필요하신가요?
                </legend>
                <p className="contact-hint">
                  여러 개 선택할 수 있어요. 아직 정하지 못하셔도 괜찮습니다.
                </p>
                <div className="contact-choices">
                  {SERVICES.map((label) => (
                    <label className="contact-choice" key={label}>
                      <input type="checkbox" name="services" value={label} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset disabled={status === "sending"}>
                <legend>
                  <span>02</span> 연락받으실 정보를 알려주세요.
                </legend>
                <div className="contact-fields">
                  <Field
                    name="name"
                    label="이름 / 담당자명"
                    required
                    autoComplete="name"
                    maxLength={100}
                    placeholder="성함을 입력해 주세요"
                  />
                  <Field
                    name="email"
                    label="이메일"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    placeholder="답변받으실 이메일 주소"
                  />
                  <Field
                    name="phone"
                    label="연락처"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    placeholder="010-0000-0000"
                  />
                  <Field
                    name="company"
                    label="회사 / 브랜드명"
                    autoComplete="organization"
                    maxLength={200}
                    placeholder="회사명 또는 브랜드명"
                  />
                  <div className="contact-full">
                    <Field
                      name="url"
                      label="기존 홈페이지"
                      type="url"
                      autoComplete="url"
                      maxLength={1000}
                      placeholder="https://"
                      hint="현재 운영 중인 홈페이지가 있다면 알려주세요."
                    />
                  </div>
                </div>
              </fieldset>
              <fieldset disabled={status === "sending"}>
                <legend>
                  <span>03</span> 프로젝트를 간단히 소개해 주세요.
                </legend>
                <div className="contact-field">
                  <label htmlFor="contact-message">
                    문의 내용 <span className="contact-required">필수</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    maxLength={8000}
                    placeholder={
                      "예) 회사 소개와 제작 사례를 보여주는 홈페이지가 필요해요.\n원하는 일정, 필요한 기능, 참고 사이트 등을 자유롭게 적어 주세요."
                    }
                  />
                </div>
                <p className="contact-budget-title">
                  예상 예산 <span className="contact-optional">선택</span>
                </p>
                <div className="contact-choices contact-budget">
                  {BUDGETS.map((label) => (
                    <label className="contact-choice" key={label}>
                      <input
                        type="radio"
                        name="budget"
                        value={label}
                        defaultChecked={label === "상담 후 결정"}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="contact-trap" aria-hidden="true">
                <label htmlFor="contact-website-trap">
                  이 항목은 비워 두세요
                </label>
                <input
                  id="contact-website-trap"
                  name="websiteTrap"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="contact-consent">
                <label>
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    disabled={status === "sending"}
                  />
                  <span>
                    상담을 위한 개인정보 수집·이용에 동의합니다. <b>필수</b>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => policyRef.current.showModal()}
                >
                  수집 항목 확인
                </button>
              </div>
              {status === "error" && (
                <div
                  className="contact-error"
                  role="alert"
                  ref={resultRef}
                  tabIndex={-1}
                >
                  <strong>아직 전송되지 않았어요.</strong>
                  <p>{error}</p>
                  <a href="mailto:91.valyrian@gmail.com">
                    메일로 직접 문의하기 ↗
                  </a>
                </div>
              )}
              <button
                className="contact-submit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending"
                  ? "문의를 보내고 있어요…"
                  : "프로젝트 문의 보내기"}
                <span aria-hidden="true">↗</span>
              </button>
              <p className="contact-submit-note" aria-live="polite">
                {status === "sending"
                  ? "전송이 끝날 때까지 잠시만 기다려 주세요."
                  : "전송이 완료되면 접수 결과를 이 화면에서 안내합니다."}
              </p>
            </form>
          )}
        </div>
      </div>
      <dialog
        className="contact-policy"
        ref={policyRef}
        aria-labelledby="contact-policy-title"
      >
        <h2 id="contact-policy-title">상담을 위한 개인정보 수집·이용</h2>
        <p>입력하신 정보는 프로젝트 상담과 답변을 위해 이용합니다.</p>
        <dl>
          <dt>수집 항목</dt>
          <dd>
            이름, 이메일, 선택 입력한 연락처·회사명·홈페이지, 문의 내용과 선택한
            서비스·예산
          </dd>
          <dt>이용 목적</dt>
          <dd>문의 확인, 상담 및 견적 안내, 답변을 위한 연락</dd>
          <dt>문의처</dt>
          <dd>
            <a href="mailto:91.valyrian@gmail.com">91.valyrian@gmail.com</a>
          </dd>
        </dl>
        <p>
          수집·이용에 동의하지 않을 수 있으나, 동의하지 않으면 이 양식으로
          문의를 접수할 수 없습니다.
        </p>
        <button type="button" onClick={() => policyRef.current.close()}>
          확인하고 닫기
        </button>
      </dialog>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "홈페이지 제작 문의 · 견적 요청",
            url: `${SITE_URL}/contact`,
            inLanguage: "ko",
          }),
        }}
      />
    </main>
  );
}
