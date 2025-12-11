import { getAllColumns } from "@/lib/columns";
import ColumnsList from "@/components/ColumnsList";
import SubVisual from "@/components/SubVisual";

// SEO metadata for Work list page (minimal override; rest inherits from layout)
export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";
  return {
    title: "홈페이지 제작 칼럼 - 브랜딩·SEO·웹 전략 인사이트",
    description:
      "홈페이지 제작 기획, 브랜딩 전략, SEO 최적화, IX·UX 구조 등 실무 중심 인사이트를 정리한 컬럼입니다. 실제 프로젝트 경험을 바탕으로 전환율을 높이는 웹 전략을 공유합니다.",
    keywords: [
      "홈페이지 제작 칼럼",
      "홈페이지 제작 팁",
      "홈페이지 기획",
      "SEO 칼럼",
      "브랜딩 전략",
      "웹사이트 기획",
      "홈페이지 운영 노하우",
      "기업 홈페이지 리뉴얼 전략",
    ],
    alternates: { canonical: `${base}/columns` },
    // 이미지 배열은 상속되지 않으므로(배열은 병합되지 않음) 페이지 전용 이미지만 지정
    openGraph: { images: [{ url: "/og/og-default.png" }] },
    twitter: { images: ["/og/og-default.png"] },
  };
}

export const revalidate = 3600;

export default function ColumnsPage() {
  const posts = getAllColumns();

  // 글들에서 사용된 카테고리 집합
  const usedSet = new Set();
  posts.forEach((p) => (p.categories || []).forEach((c) => usedSet.add(c)));

  // 기본 버튼 순서 우선 적용 + 나머지는 가나다 정렬
  const preferred = ["홈페이지 제작 팁", "SEO 인사이트"];
  const rest = [...usedSet]
    .filter((c) => !preferred.includes(c))
    .sort((a, b) => a.localeCompare(b, "ko"));
  const categories = [...preferred.filter((c) => usedSet.has(c)), ...rest];

  return (
    <main className="overflow-x-hidden">
      <SubVisual value="Columns" image="/images/columns/visual.webp" />

      <div className="container test pb-[120px] md:pb-[200px]">
        {/* 필터 + 목록 (클라이언트) */}
        <ColumnsList posts={posts} categories={categories} />
      </div>
    </main>
  );
}
