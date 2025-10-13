"use client";
import { useState } from "react";
import Input from "./_components/Input";
import Textarea from "./_components/Textarea";
import Checkbox from "./_components/Checkbox";
import SubVisual from "@/components/SubVisual";

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
    <main>
      <SubVisual value="Contact" image="/images/contact/visual.png" />

      <section className="" data-reveal="fade-up" data-reveal-delay="0.8">
        <div className="container py-[150px]">
          <form onSubmit={onSubmit}>
            {/* Services (multiple) */}
            <fieldset className="flex flex-wrap md:flex-nowrap gap-[50px] md:gap-[20px]">
              <h3 className="w-full md:w-[335px] xl:w-[465px] shrink-0">
                <legend className="text-[52px] md:text-[39px] leading-[62px] md:leading-[49px] font-bold">
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
                    className="w-[calc(50%_-_10px)] md:w-[calc(33.3333%_-_13.4px)]"
                  />
                ))}
              </div>
            </fieldset>

            {/* Two-column grid for basics */}
            <fieldset className="flex flex-wrap md:flex-nowrap gap-[50px] md:gap-[20px] mt-[150px]">
              <h3 className="w-full md:w-[335px] xl:w-[465px] shrink-0">
                <legend className="text-[52px] md:text-[39px] leading-[62px] md:leading-[49px] font-bold">
                  기본 정보를
                  <br />
                  입력해주세요.
                </legend>
              </h3>

              <div className="w-full">
                <div className="grid grid-cols-2 gap-[20px]">
                  <Input
                    name="name"
                    label="Full name"
                    required
                    placeholder="Full name"
                  />
                  <Input name="company" label="Company" placeholder="Company" />

                  <Input
                    name="position"
                    label="Position"
                    placeholder="Position"
                    className="mt-[40px]"
                  />
                  <Input
                    name="phone"
                    label="Phone Number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Phone Number"
                    className="mt-[40px]"
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
                    className="mt-[40px]"
                  />
                  <Input
                    name="url"
                    type="url"
                    label="Url"
                    placeholder="Url"
                    className="mt-[40px]"
                  />
                </div>

                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Message"
                  className="mt-[40px]"
                  rows={6}
                />

                <div className="mt-[50px] mb-[10px]">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
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
                </div>

                {ok && (
                  <p style={{ color: "green" }}>
                    메일이 성공적으로 발송되었습니다!
                  </p>
                )}

                <div className="flex justify-end mt-[50px]">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn text-[34px] md:text-[31px] w-[160px] h-[160px] rounded-[9999px] border-2"
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>

                {error && <p style={{ color: "tomato" }}>{error}</p>}
              </div>
            </fieldset>
          </form>
        </div>
      </section>
    </main>
  );
}
