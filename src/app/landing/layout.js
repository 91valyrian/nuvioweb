import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata({
  title: "직접 관리하는 홈페이지 제작 · 누비오 CMS",
  description:
    "텍스트와 이미지를 직접 수정할 수 있는 CMS 기반 홈페이지 제작. 제작 사례와 구성별 비용, 운영 기능을 확인하고 프로젝트에 맞는 상담을 받아보세요.",
  path: "/landing",
});
export default function LandingLayout({ children }) {
  return children;
}
