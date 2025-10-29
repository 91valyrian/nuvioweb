import fs from "fs";
import path from "path";

export function getRelatedKeywords(title, content) {
  const filePath = path.join(
    process.cwd(),
    "content/keywords/nuvio-keywords.md"
  );
  const data = fs.readFileSync(filePath, "utf-8");

  const allKeywords = data
    .split("\n")
    // 실제 키워드 라인만 추출
    .filter(
      (line) =>
        line.trim().startsWith("- ") &&
        !/(카테고리명|키워드|날짜별|기록|설명|예시)/.test(line)
    )
    // 앞뒤 기호 및 불필요한 문자를 한 번에 정리
    .map((line) =>
      line
        .replace(/^[-#\s]+/, "") // 앞쪽 -, #, 공백 제거
        .replace(/\s*#.*$/, "") // 줄 끝에 남은 # 제거
        .trim()
    )
    // 한글, 영어, 숫자 포함만 유지
    .filter((kw) => /[가-힣A-Za-z0-9]/.test(kw))
    .filter((kw) => kw.length > 1);

  const related = allKeywords.filter((kw) =>
    (title + content).includes(kw.replace(/#/g, "").trim())
  );

  // 최소 6개 이상 유지
  let finalKeywords = [...related];
  if (finalKeywords.length < 6) {
    const remaining = allKeywords.filter((kw) => !finalKeywords.includes(kw));
    const extra = remaining.slice(0, 6 - finalKeywords.length);
    finalKeywords = [...finalKeywords, ...extra];
  }

  return finalKeywords.slice(0, 10);
}
