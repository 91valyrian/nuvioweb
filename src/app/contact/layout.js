import { pageMetadata } from "@/lib/site";
export function generateMetadata() {
  return pageMetadata({
    title: "홈페이지 제작 문의 - 맞춤 견적·리뉴얼·SEO 상담",
    description:
      "홈페이지 제작·리뉴얼·랜딩페이지·쇼핑몰·SEO 컨설팅까지 프로젝트 정보를 남겨주시면 예산에 맞는 현실적인 견적과 진행 방향을 안내드립니다. 카카오톡을 포함한 빠른 상담을 제공합니다.",
    path: "/contact",
  });
}

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
