"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setPolicyOpen(false);
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
                  <span className="block text-[28px] md:text-[20px] text-neutral-500 mt-[10px] font-medium">
                    중복 선택 가능
                  </span>
                </legend>
              </h3>
              <div className="w-full flex flex-wrap gap-[20px]">
                {BUDGET_OPTIONS.map((label) => (
                  <Checkbox
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

                <div className="mt-[50px] mb-[10px] flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none rotate-x-up">
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

                {ok && (
                  <p style={{ color: "green" }}>
                    메일이 성공적으로 발송되었습니다!
                  </p>
                )}

                <div className="flex justify-end mt-[50px] rotate-x-up">
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

      {policyOpen && (
        <div
          id="policy-dialog"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] flex items-center justify-center"
          onClick={(e) => {
            // 배경 클릭 시 닫기 (모달 바깥)
            if (e.target === e.currentTarget) setPolicyOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Dialog */}
          <div className="relative z-[1] w-[min(920px,92vw)] max-h-[80vh] bg-neutral-950 text-white border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10">
              <h4 className="text-[34px] md:text-[24px] font-bold">
                개인정보 처리방침
              </h4>
              <button
                type="button"
                onClick={() => setPolicyOpen(false)}
                className="text-white/80 hover:text-white text-[40px] leading-none cursor-pointer"
                aria-label="닫기"
                autoFocus
              >
                ×
              </button>
            </div>

            {/* Content (scrollable) */}
            <div className="px-6 md:px-8 py-5 overflow-y-auto max-h-[calc(80vh-70px)] text-white/80 text-[26px] md:text-[16px] scrollbar-dark">
              <p className="mb-4">
                nuvio(이하 ‘회사’라 한다)는 개인정보 보호법 제30조에 따라 정보
                주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게
                처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을
                수립·공개합니다.
              </p>

              <h5 className="mt-6 font-bold text-white">
                제1조 (개인정보의 처리목적)
              </h5>
              <p className="mt-2">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
                개인정보는 아래 목적 이외의 용도로는 이용되지 않으며, 이용
                목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의
                동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ol className="list-decimal pl-5 space-y-2 mt-3">
                <li>
                  <b>홈페이지 회원 가입 및 관리</b>: 회원 가입 의사 확인, 회원제
                  서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적
                  본인확인제 시행에 따른 본인확인, 서비스 부정 이용 방지, 만
                  14세 미만 아동의 개인정보 처리 시 법정대리인의 동의 여부 확인,
                  각종 고지·통지, 고충 처리 등.
                </li>
                <li>
                  <b>재화 또는 서비스 제공</b>: 물품 배송, 서비스 제공, 계약서
                  및 청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증,
                  연령인증, 요금 결제 및 정산, 채권추심 등.
                </li>
                <li>
                  <b>고충 처리</b>: 민원인의 신원 확인, 민원사항 확인,
                  사실조사를 위한 연락·통지, 처리 결과 통보 등.
                </li>
              </ol>

              <h5 className="mt-6 font-bold text-white">
                제2조 (개인정보의 처리 및 보유기간)
              </h5>
              <p className="mt-2">
                ① 회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터
                개인정보를 수집 시에 동의 받은 개인정보 보유·이용 기간 내에서
                개인정보를 처리·보유합니다.
              </p>
              <p className="mt-1">
                ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
              </p>
              <ol className="list-decimal pl-5 space-y-2 mt-3">
                <li>
                  <b>홈페이지 회원 가입 및 관리</b>: 사업자/단체 홈페이지 탈퇴
                  시까지.
                  <br />
                  다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
                  <br />
                  1) 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우: 해당
                  수사·조사 종료 시까지
                  <br />
                  2) 홈페이지 이용에 따른 채권 및 채무관계 잔존 시: 해당
                  채권·채무 관계 정산 시까지
                </li>
                <li>
                  <b>재화 또는 서비스 제공</b>: 재화·서비스 공급 완료 및 요금
                  결제·정산 완료 시까지.
                  <br />
                  다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지
                  <br />
                  1) 「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른
                  표시·광고, 계약 및 이행 등 거래에 관한 기록
                  <br />
                  - 표시·광고에 관한 기록: 6개월
                  <br />
                  - 계약 또는 청약철회, 대금결제, 재화 등의 공급기록: 5년
                  <br />
                  - 소비자 불만 또는 분쟁 처리에 관한 기록: 3년
                  <br />
                  2) 「통신비밀보호법」 제41조에 따른 통신사실확인자료 보관
                  <br />
                  - 가입자 전기통신일시, 개시·종료 시간, 상대방 가입자 번호,
                  사용도수, 발신기지국 위치추적자료: 1년
                  <br />- 컴퓨터 통신, 인터넷 로그 기록자료, 접속지 추적자료:
                  3개월
                </li>
              </ol>

              <h5 className="mt-6 font-bold text-white">
                제3조 (개인정보의 제3자 제공)
              </h5>
              <p className="mt-2">
                ① 회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만
                처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법
                제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게
                제공합니다.
              </p>
              <p className="mt-1">
                ② 회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지
                않습니다. 부득이하게 제공이 필요한 경우에는 개인정보보호법에
                따라 필요한 사항을 고지하고 사전 동의를 받겠습니다.
              </p>

              <h5 className="mt-6 font-bold text-white">
                제4조 (개인정보처리의 위탁)
              </h5>
              <p className="mt-2">
                회사는 이용자의 개인정보를 외부 업체에 위탁하여 처리하지
                않습니다. 향후 위탁이 필요한 경우, 개인정보 보호법 제25조에 따라
                위탁 대상자와 위탁 업무 내용을 명확히 하고, 이용자에게 사전
                동의를 받거나 본 방침을 통해 지체 없이 공개하겠습니다.
              </p>

              <h5 className="mt-6 font-bold text-white">
                제5조 (정보주체 및 법정대리인의 권리와 그 행사 방법)
              </h5>
              <ol className="list-decimal pl-5 space-y-2 mt-3">
                <li>
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호
                  관련 권리를 행사할 수 있습니다.
                  <br />
                  1) 개인정보 열람 요구
                  <br />
                  2) 오류 등이 있을 경우 정정 요구
                  <br />
                  3) 삭제 요구
                  <br />
                  4) 처리정지 요구
                </li>
                <li>
                  위 권리는 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여
                  행사할 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
                </li>
                <li>
                  정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한
                  경우 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를
                  이용하거나 제공하지 않습니다.
                </li>
                <li>
                  권리는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을
                  통하여 행사할 수 있으며, 이 경우 개인정보 보호법 시행규칙 별지
                  제11호 서식에 따른 위임장을 제출하셔야 합니다.
                </li>
                <li>
                  정보주체는 개인정보 보호법 등 관계 법령을 위반하여 회사가
                  처리하고 있는 정보주체 본인이나 타인의 개인정보 및 사생활을
                  침해하여서는 아니 됩니다.
                </li>
              </ol>

              <h5 className="mt-6 font-bold text-white">
                제6조 (처리하는 개인정보 항목)
              </h5>
              <ol className="list-decimal pl-5 space-y-2 mt-3">
                <li>
                  <b>홈페이지 회원 가입 및 관리</b>
                  <br />
                  - 필수항목: 성명, 생년월일, 아이디, 비밀번호, 주소, 전화번호,
                  이메일 주소, 아이핀번호
                  <br />- 선택항목: 결혼 여부, 관심 분야
                </li>
                <li>
                  <b>재화 또는 서비스 제공</b>
                  <br />
                  - 필수항목: 성명, 생년월일, 아이디, 비밀번호, 주소, 전화번호,
                  이메일 주소, 아이핀번호, 신용카드번호, 은행계좌정보 등
                  결제정보
                  <br />- 선택항목: 관심 분야, 과거 구매내역
                </li>
              </ol>

              <h5 className="mt-6 font-bold text-white">
                제7조 (개인정보의 파기)
              </h5>
              <ol className="list-decimal pl-5 space-y-2 mt-3">
                <li>
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
                  불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
                </li>
                <li>
                  동의받은 보유기간이 경과하거나 처리목적이 달성되었음에도 다른
                  법령에 따라 개인정보를 계속 보존하여야 하는 경우에는 해당
                  개인정보를 별도의 DB로 옮기거나 보관장소를 달리하여
                  보존합니다.
                </li>
                <li>
                  개인정보 파기의 절차 및 방법은 다음과 같습니다.
                  <br />
                  - 파기 절차: 파기 사유가 발생한 개인정보를 선정하고, 회사의
                  개인정보 보호책임자의 승인을 받아 파기합니다.
                  <br />- 파기 방법: 전자적 파일은 복구 불가능한 방법으로 삭제,
                  종이 문서는 분쇄 또는 소각
                </li>
              </ol>

              <h5 className="mt-6 font-bold text-white">
                제8조 (개인정보의 안전성 확보조치)
              </h5>
              <p className="mt-2">
                회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를
                시행합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  관리적 조치: 내부관리계획 수립 및 시행, 정기적 직원 교육 등
                </li>
                <li>
                  기술적 조치: 접근 권한 관리, 접근통제시스템 설치, 고유식별정보
                  등의 암호화, 보안프로그램 설치
                </li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근 통제</li>
              </ul>

              <h5 className="mt-6 font-bold text-white">
                제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부)
              </h5>
              <ol className="list-decimal pl-5 space-y-2 mt-3">
                <li>
                  회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해
                  쿠키(cookie)를 사용합니다.
                </li>
                <li>
                  쿠키는 웹사이트를 운영하는 서버가 이용자의 브라우저에 보내는
                  소량의 정보로, 이용자의 PC 또는 모바일에 저장됩니다.
                </li>
                <li>
                  정보주체는 브라우저 설정을 통해 쿠키 허용·차단 등을 설정할 수
                  있으며, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이
                  있을 수 있습니다.
                </li>
              </ol>
              <p className="mt-2">
                ▶ 웹 브라우저에서 쿠키 허용/차단
                <br />
                - 크롬(Chrome): 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷
                사용기록 삭제
                <br />- 엣지(Edge): 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및
                사이트 데이터 관리 및 삭제
              </p>
              <p className="mt-2">
                ▶ 모바일 브라우저에서 쿠키 허용/차단
                <br />
                - 크롬(Chrome): 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷
                사용기록 삭제
                <br />
                - 사파리(Safari): 기기 설정 &gt; 사파리 &gt; 고급 &gt; 모든 쿠키
                차단
                <br />- 삼성 인터넷: 설정 &gt; 인터넷 사용 기록 &gt; 인터넷 사용
                기록 삭제
              </p>
              <p className="mt-2">
                ④ 회사는 서비스 이용과정에서 방문 및 이용형태, 인기 검색어,
                보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해
                수집·이용하고 있습니다.
              </p>

              <h5 className="mt-6 font-bold text-white">
                제10조 (개인정보 보호책임자)
              </h5>
              <p className="mt-2">
                회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 개인정보
                처리와 관련한 불만 처리 및 피해구제 등을 위하여 아래와 같이
                개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <p className="mt-2">
                ▶ 개인정보 보호책임자
                <br />
                성명: OOO / 직책: OOO / 연락처: &lt;전화번호&gt;,
                &lt;이메일&gt;, &lt;팩스번호&gt;
                <br />※ 개인정보 보호 담당부서로 연결됩니다.
              </p>
              <p className="mt-2">
                ▶ 개인정보 보호 담당부서
                <br />
                부서명: OOO 팀 / 연락처: &lt;전화번호&gt;, &lt;이메일&gt;,
                &lt;팩스번호&gt;
              </p>

              <h5 className="mt-6 font-bold text-white">
                제11조 (개인정보 열람청구)
              </h5>
              <p className="mt-2">
                정보주체는 개인정보 보호법 제35조에 따라 개인정보의 열람을 아래
                부서에 청구할 수 있습니다. 회사는 열람 청구가 신속하게
                처리되도록 노력하겠습니다.
              </p>
              <p className="mt-2">
                ▶ 개인정보 열람청구 접수·처리 부서
                <br />
                부서명: OOO / 연락처: &lt;전화번호&gt;, &lt;이메일&gt;,
                &lt;팩스번호&gt;
              </p>

              <h5 className="mt-6 font-bold text-white">
                제12조 (권익침해 구제 방법)
              </h5>
              <p className="mt-2">
                정보주체는 아래 기관에 대해 개인정보 침해에 대한 피해구제, 상담
                등을 문의하실 수 있습니다.
              </p>
              <ol className="list-decimal pl-5 space-y-1 mt-3">
                <li>
                  개인정보 분쟁조정위원회: (국번없이) 1833-6972
                  (www.kopico.go.kr)
                </li>
                <li>
                  개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)
                </li>
                <li>대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
                <li>경찰청: (국번없이) 182 (ecrm.police.go.kr/minwon/main)</li>
              </ol>

              <h5 className="mt-6 font-bold text-white">
                제13조 (개인정보 처리방침 시행 및 변경)
              </h5>
              <p className="mt-2">
                이 개인정보 처리방침은 <b>20XX. X. X.</b>부터 적용됩니다.
              </p>

              <p className="mt-6 text-white/60 text-[24px] md:text-[14px]">
                ※ 본 방침은 서비스 정책에 따라 변경될 수 있으며, 변경 시
                홈페이지를 통해 공지합니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
