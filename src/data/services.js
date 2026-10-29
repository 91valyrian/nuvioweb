export const services = [
  {
    slug: "corporate",
    title: "기업 홈페이지 제작",
    summary:
      "고객과 파트너가 사업과 제품을 이해하고 문의할 수 있는 기업 웹사이트를 설계합니다.",
    needs: [
      "제품·솔루션이 많아 메뉴와 자료 구분이 필요한 기업",
      "회사 소개서를 웹사이트로 정리하고 싶은 담당자",
      "자료 요청·견적 문의 경로를 정리하려는 B2B 기업",
    ],
    scope: [
      "회사·사업·제품 소개와 자료실의 정보 구조",
      "제품 특성과 구매 과정에 맞춘 문의 폼",
      "담당자가 공지와 제품 정보를 수정하는 CMS",
    ],
    work: ["hyundai-autonics", "addplan"],
    columns: ["corporate-website", "homepage-cost-guide"],
  },
  {
    slug: "hospital",
    title: "병원 홈페이지 제작",
    summary:
      "진료 정보를 쉽게 찾고 예약·상담 경로를 확인할 수 있도록 병원 웹사이트를 기획합니다.",
    needs: [
      "진료 항목과 의료진 정보를 정리하려는 병원",
      "모바일 예약·전화 동선을 개선하고 싶은 담당자",
      "개원 또는 리뉴얼을 준비 중인 의료기관",
    ],
    scope: [
      "진료 과목·의료진·진료 시간·오시는 길 구성",
      "전화·상담·외부 예약 서비스 연결 범위 협의",
      "의료기관이 검토한 콘텐츠를 반영하는 운영 구조",
    ],
    work: [],
    columns: ["hospital-conversion", "hospital-website-how-to-build"],
    note: "진료 및 광고 관련 문구와 이미지의 적합성은 의료기관의 검토를 거쳐 확정합니다.",
  },
  {
    slug: "law",
    title: "법률사무소 홈페이지 제작",
    summary:
      "업무 분야와 변호사 소개를 이해하기 쉽게 정리하고 상담까지의 이동 경로를 설계합니다.",
    needs: [
      "전문 분야와 상담 절차를 명확히 알리고 싶은 사무소",
      "법률 용어 중심의 기존 페이지를 개선하려는 담당자",
      "모바일 상담과 문의 관리를 정리하려는 로펌",
    ],
    scope: [
      "업무 분야·구성원·상담 절차의 정보 구조",
      "상담에 필요한 최소 정보를 받는 문의 구성",
      "공개가 가능한 소개 자료와 콘텐츠 운영 기능",
    ],
    work: ["kim-gunhyo-law-office"],
    columns: ["law-website", "lawfirm-trust-centered-website"],
  },
  {
    slug: "franchise",
    title: "프랜차이즈 홈페이지 제작",
    summary:
      "브랜드 소개와 가맹 검토 정보를 구분하고 가맹 문의까지 이어지는 웹사이트를 제작합니다.",
    needs: [
      "소비자와 예비 점주의 정보가 섞여 있는 브랜드",
      "가맹 절차와 상담 경로를 정리하려는 본사",
      "매장 소식과 브랜드 콘텐츠를 직접 관리하려는 담당자",
    ],
    scope: [
      "브랜드·메뉴·매장 정보와 가맹 정보의 구분",
      "가맹 절차·상담 요청·자주 묻는 질문 구성",
      "본사에서 소식과 매장 정보를 갱신하는 CMS",
    ],
    work: ["hanzzim"],
    columns: ["franchise-no-call-reason", "homepage-cost-guide"],
  },
  {
    slug: "landing-page",
    title: "랜딩페이지 제작",
    summary:
      "캠페인의 고객과 제안에 맞춰 핵심 설명, 검토 정보, 문의 행동을 한 페이지로 연결합니다.",
    needs: [
      "광고와 연결할 독립적인 소개 페이지가 필요한 팀",
      "새 서비스의 상담·신청을 받으려는 담당자",
      "기존 랜딩의 메시지와 문의 경로를 개선하려는 팀",
    ],
    scope: [
      "광고 메시지와 일치하는 첫 화면과 콘텐츠 순서",
      "서비스 비교·자주 묻는 질문·문의 폼 구성",
      "상담 완료 등 합의된 전환 이벤트 설정",
    ],
    work: ["addplan"],
    columns: ["landingpage-agency", "landing-page-conversion"],
  },
  {
    slug: "renewal",
    title: "홈페이지 리뉴얼",
    summary:
      "기존 페이지와 운영 방식을 점검하고, URL과 콘텐츠 이전까지 고려해 웹사이트를 개편합니다.",
    needs: [
      "모바일 사용성과 운영 기능을 개선하려는 담당자",
      "기존 검색 유입과 URL을 유지하며 개편하려는 팀",
      "페이지 추가·수정에 반복 비용이 발생하는 기업",
    ],
    scope: [
      "기존 메뉴·URL·콘텐츠 목록과 이전 범위 정리",
      "필요한 URL 리디렉션·메타 정보·사이트맵 점검",
      "새 CMS 운영 안내와 오픈 후 확인 항목 협의",
    ],
    work: [],
    columns: ["website-renewal-seo-checklist", "old-homepage-problems"],
  },
];
export function matchingServices(title = "", tags = []) {
  const text = [title, ...tags].join(" ");
  const selected = services.filter((s) =>
    ({
      hospital: /병원|치과/,
      law: /법률|로펌|변호사/,
      franchise: /프랜차이즈|가맹/,
      "landing-page": /랜딩/,
      renewal: /리뉴얼|검색|SEO|운영|유지보수/,
      corporate: /기업|회사|B2B/,
    })[s.slug].test(text),
  );
  return (
    selected.length
      ? selected
      : services.filter((s) => ["corporate", "renewal"].includes(s.slug))
  ).slice(0, 2);
}
