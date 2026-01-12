import { getWorkBySlug } from "@/lib/works";
import { NextResponse } from "next/server";

// portfolio.webp 또는 portfolio.png 이미지 경로 추출
function extractPortfolioImage(content) {
  if (!content) return null;
  
  // 먼저 portfolio.webp 찾기
  const webpRegex = /!\[[^\]]*\]\(([^)]*portfolio\.webp[^)]*)\)/i;
  const webpMatch = content.match(webpRegex);
  
  if (webpMatch) {
    return webpMatch[1];
  }
  
  // portfolio.webp가 없으면 portfolio.png 찾기
  const pngRegex = /!\[[^\]]*\]\(([^)]*portfolio\.png[^)]*)\)/i;
  const pngMatch = content.match(pngRegex);
  
  return pngMatch ? pngMatch[1] : null;
}

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const work = getWorkBySlug(slug);
    
    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    // portfolio.webp 이미지 경로 추출
    const portfolioImage = extractPortfolioImage(work.content);

    // 필요한 정보만 반환 (content는 제외)
    const { content, ...workData } = work;
    
    return NextResponse.json({
      ...workData,
      portfolioImage,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch work" }, { status: 500 });
  }
}
