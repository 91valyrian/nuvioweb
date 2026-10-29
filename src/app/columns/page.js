import { notFound } from "next/navigation";
import { getAllColumns } from "@/lib/columns";
import ColumnsList from "@/components/ColumnsList";
import SubVisual from "@/components/SubVisual";
import { pageMetadata } from "@/lib/site";
import { paginateColumns, columnListUrl } from "@/lib/column-pagination";
export async function generateMetadata({ searchParams }) {
  const state = paginateColumns(getAllColumns(), await searchParams);
  if (!state.valid) notFound();
  return {
    ...pageMetadata({
      title: `홈페이지 제작 칼럼${state.category ? ` · ${state.category}` : ""}${state.page > 1 ? ` · ${state.page}페이지` : ""}`,
      description:
        "홈페이지 제작 비용, 업체 비교, 리뉴얼과 검색 최적화까지. 프로젝트를 준비하는 담당자를 위한 누비오의 실무 가이드입니다.",
      path: columnListUrl(state.page, state.category),
    }),
    ...(state.category
      ? {
          robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          },
        }
      : {}),
  };
}
export default async function ColumnsPage({ searchParams }) {
  const posts = getAllColumns();
  const state = paginateColumns(posts, await searchParams);
  if (!state.valid) notFound();
  const categories = [...new Set(posts.flatMap((p) => p.categories))];
  return (
    <main className="overflow-x-hidden">
      <SubVisual value="Columns" image="/images/columns/visual.webp" />
      <div className="columns-index container pb-[120px] md:pb-[200px]">
        <ColumnsList {...state} categories={categories} />
      </div>
    </main>
  );
}
