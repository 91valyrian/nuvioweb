"use client";
import { useEffect, useState } from "react";
import Input from "./_components/Input";
import Textarea from "./_components/Textarea";
import Checkbox from "./_components/Checkbox";
import Radiobox from "./_components/Radiobox";
import SubVisual from "@/components/SubVisual";
import Modal from "@/components/Modal";
import Policy from "./_components/Policy";

const SERVICE_OPTIONS = [
  "브랜딩 홈페이지",
  "랜딩 페이지",
  "온라인 쇼핑몰",
  "홈페이지 리뉴얼",
  "검색엔진 최적화",
  "웹 접근성 최적화",
  "사이트 유지 관리",
];

const BUDGET_OPTIONS = [
  "200만원 이하",
  "300만원 이하",
  "500만원 이하",
  "1,000만원 이하",
  "5,000만원 이하",
];

export default function ContactPage() {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  // 결과 모달 상태
  const [result, setResult] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const openResult = (type, message) =>
    setResult({ open: true, type, message });
  const closeResult = () => setResult((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setPolicyOpen(false);
        setResult((prev) => ({ ...prev, open: false }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    const budgets = Array.from(
      form.querySelectorAll('input[name="budget"]:checked')
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
      budget: budgets,
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
        openResult(
          "error",
          data?.error ||
            "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      } else {
        setOk(true);
        openResult("success", "메일이 성공적으로 발송되었습니다!");
        form.reset();
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
      openResult(
        "error",
        "네트워크 오류가 발생했습니다. 연결 상태를 확인해 주세요."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <SubVisual value="Contact" image="/images/contact/visual.webp" />

      <section className="">
        <div className="container py-[150px]">
          <form onSubmit={onSubmit}>
            {/* Services (multiple) */}
            <fieldset className="flex flex-wrap md:flex-nowrap gap-[50px] md:gap-[20px]">
              <h3 className="w-full md:w-[335px] xl:w-[465px] shrink-0">
                <legend className="text-[52px] md:text-[39px] leading-[62px] md:leading-[49px] font-bold rotate-x-up">
                  필요한 서비스를
                  <br />
                  선택해주세요.
                  <span className="block text-[28px] md:text-[20px] text-neutral-500 mt-[10px] font-medium">
                    중복 선택 가능
                  </span>
                </legend>
              </h3>
              <div className="w-full flex flex-wrap gap-[20px]">
                {SERVICE_OPTIONS.map((label) => (
                  <Checkbox
                    key={label}
                    name="services"
                    value={label}
                    label={label}
                    className="w-[calc(50%_-_10px)] md:w-[calc(33.3333%_-_13.4px)] rotate-x-up"
                  />
                ))}
              </div>
            </fieldset>

            {/* Budget (multiple) */}
            <fieldset className="flex flex-wrap md:flex-nowrap gap-[50px] md:gap-[20px] mt-[150px]">
              <h3 className="w-full md:w-[335px] xl:w-[465px] shrink-0">
                <legend className="text-[52px] md:text-[39px] leading-[62px] md:leading-[49px] font-bold rotate-x-up">
                  프로젝트 예산을
                  <br />
                  선택해주세요.
                </legend>
              </h3>
              <div className="w-full flex flex-wrap gap-[20px]">
                {BUDGET_OPTIONS.map((label) => (
                  <Radiobox
                    key={label}
                    name="budget"
                    value={label}
                    label={label}
                    className="w-[calc(50%_-_10px)] md:w-[calc(33.3333%_-_13.4px)] rotate-x-up"
                  />
                ))}
              </div>
            </fieldset>

            {/* Two-column grid for basics */}
            <fieldset className="flex flex-wrap md:flex-nowrap gap-[50px] md:gap-[20px] mt-[150px]">
              <h3 className="w-full md:w-[335px] xl:w-[465px] shrink-0">
                <legend className="text-[52px] md:text-[39px] leading-[62px] md:leading-[49px] font-bold rotate-x-up">
                  기본 정보를
                  <br />
                  입력해주세요.
                </legend>
              </h3>

              <div className="w-full">
                <div className="grid grid-cols-2 gap-[15px]">
                  <Input
                    name="name"
                    label="Full name"
                    required
                    placeholder="Full name"
                    className="rotate-x-up"
                  />
                  <Input
                    name="company"
                    label="Company"
                    placeholder="Company"
                    className="rotate-x-up"
                  />

                  <Input
                    name="position"
                    label="Position"
                    placeholder="Position"
                    className="mt-[40px] rotate-x-up"
                  />
                  <Input
                    name="phone"
                    label="Phone Number"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Phone Number"
                    className="mt-[40px] rotate-x-up"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                  />

                  <Input
                    name="email"
                    type="email"
                    label="E-mail"
                    required
                    placeholder="E-mail"
                    className="mt-[40px] rotate-x-up"
                  />
                  <Input
                    name="url"
                    type="url"
                    label="Url"
                    placeholder="Url"
                    className="mt-[40px] rotate-x-up"
                  />
                </div>

                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Message"
                  className="mt-[40px] rotate-x-up"
                  rows={6}
                />

                <div className="mt-[50px] mb-[10px] flex items-center gap-4 rotate-x-up">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none ">
                    {/* ✅ peer는 반드시 먼저 와야 함 */}
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="peer sr-only"
                    />

                    {/* ✅ 체크박스 UI: svg는 기본 숨김, span에서 peer-checked로 자식 svg 토글 */}
                    <span
                      aria-hidden="true"
                      className="
          relative grid place-items-center
          w-[36px] h-[36px]
          md:w-[26px] md:h-[26px]
          border-3 border-white/90 bg-transparent
          transition-colors
          peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-white/60
          peer-checked:[&>svg]:opacity-100
        "
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="w-[26px] h-[26px] md:w-[16px] md:h-[16px] text-white opacity-0 transition-opacity duration-150 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 10l4 4 8-8" />
                      </svg>
                    </span>

                    <span className="text-[30px] md:text-[20px] leading-none text-white decoration-white/70">
                      <b className="underline underline-offset-[3px] ">
                        개인정보 처리방침
                      </b>
                      에 동의합니다.
                    </span>
                  </label>

                  {/* 우측: 보기 버튼 */}
                  <button
                    type="button"
                    onClick={() => setPolicyOpen(true)}
                    className="rotate-x-up text-[28px] md:text-[18px] px-4 py-2 border border-white/30 rounded-[9999px] hover:border-white/80 hover:bg-white/5 transition cursor-pointer"
                    aria-haspopup="dialog"
                    aria-controls="policy-dialog"
                    aria-expanded={policyOpen}
                  >
                    내용 보기
                  </button>
                </div>

                <div className="flex justify-end mt-[50px] rotate-x-up">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn text-[34px] md:text-[31px] w-[160px] h-[160px] rounded-[9999px] border-2"
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </section>

      <Modal
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
        title="개인정보 처리방침"
        variant="default"
        size="lg"
        ariaLabelledby="policy-title"
      >
        <Policy />
        {/* footer */}
        {(() => null)()}
      </Modal>

      <Modal
        open={result.open}
        onClose={closeResult}
        title={result.type === "success" ? "전송 완료" : "전송 실패"}
        variant={result.type === "success" ? "success" : "error"}
        size="md"
        ariaLabelledby="result-title"
        footer={
          result.type === "success" ? (
            <button
              type="button"
              onClick={closeResult}
              className="px-4 py-2 rounded-lg border border-main text-main hover:border-main text-[28px] md:text-[18px] cursor-pointer"
            >
              확인
            </button>
          ) : (
            <button
              type="button"
              onClick={closeResult}
              className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/60 hover:bg-white/5 text-[28px] md:text-[18px] cursor-pointer"
            >
              닫기
            </button>
          )
        }
      >
        <p className="text-[28px] md:text-[18px]">{result.message}</p>
      </Modal>

      {/* JSON-LD: ContactPage + Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "홈페이지 제작 문의 · 견적 요청",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com"}/contact`,
              inLanguage: "ko",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "nuvio",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  availableLanguage: ["ko"],
                  url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com"}/contact`,
                },
              ],
            },
          ]),
        }}
      />
    </main>
  );
}
