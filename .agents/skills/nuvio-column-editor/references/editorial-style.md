# Current nuvio editorial contract

## Files and visual system

- Route: `src/app/columns/[slug]/page.js`; data: `src/lib/columns.js`.
- White `#f8f8f8` rounded card (max width 1000px) against the dark site/column background.
- Black body text, generous paragraph rhythm, blue `#1f4fff` inline links and pale blue `#E7EBFC` callouts/table headings.
- `.column-article`: desktop 20px body / 28px H2 / 24px H3; mobile 18px body / 25px H2 / 22px H3. The global PostCSS config converts lowercase px to rem against a viewport-scaled root. Editorial selectors are excluded from conversion in `postcss.config.js` to preserve readable physical font sizes. Keep this exclusion and check generated CSS if the PostCSS config changes. Do not add article-specific global CSS just to alter typography.
- Renderer supplies H1, publication date, thumbnail, author CTA, related services/cases, related posts and Article/Breadcrumb JSON-LD. Start MDX body with H2, not a second H1. Do not duplicate global widgets or keyword badges in the article.
- Use natural paragraphs; avoid placing a `<br />` on every sentence. Markdown `---` provides the existing subtle separators. Tables may scroll on mobile. Links in prose are inline; do not make every source link a large button.

## Frontmatter

```yaml
---
title: "검색자의 질문에 직접 답하는 제목"
seoTitle: "선택 사항: 검색 결과용 간결한 제목"
subTitle: "선택 사항: 본문의 범위를 설명하는 부제"
slug: "lowercase-hyphenated-filename"
date: "YYYY-MM-DD"
# updated: "YYYY-MM-DD" # 실제 수정 시에만 사용
author: "nuvio"
summary: "독자가 얻을 답과 다루는 범위를 구체적으로 요약하는 고유한 설명."
thumbnail: "/images/columns/<slug>/thumbnail.webp"
thumbnailAlt: "이미지가 전달하는 내용을 자연스럽게 설명"
categories:
  - SEO 인사이트 # 또는 홈페이지 제작 팁, 기존 분류 우선
tags:
  - 관련 검색 주제
  - 실제 본문에서 다루는 용어
---
```

파일명과 slug는 같아야 한다. 일반적인 주제 분류를 제목 앞에 반복해서 붙이지 않는다. 날짜를 갱신하기 위한 재발행은 하지 않는다.

## Body image contract

```mdx
<Figure>
  <Img
    src="/images/columns/<slug>/url-map.webp"
    alt="이전 페이지와 새 페이지의 연결 관계를 보여주는 설명용 일러스트"
    width="1600"
    height="900"
  />
  <Figcaption>
    이미지와 본문이 연결되는 설명. 구성 예시라면 그 사실을 명시합니다.
  </Figcaption>
</Figure>
```

Use `thumbnail.webp`, then descriptive body names. Target thumbnail ≤300KB and body image ≤250KB where quality allows; optimize without damaging Korean text. Keep essential text within generous margins. Do not use a different article's thumbnail as a new article's own identity. Save image prompts in a supporting project reference when needed for reproducibility, outside public article prose.

## Evidence and internal links

A helpful article normally includes a concise answer, actionable details, a concrete example or checklist, limitations, relevant sources and a suitable next step. This is a flexible writing pattern, not mandatory repeated section titles.

Existing service routes: `/service/corporate`, `/service/hospital`, `/service/law`, `/service/franchise`, `/service/landing-page`, `/service/renewal`.

Only link real portfolios from `content/work`. For example Hyundai Autonics is an industrial company site, Hanzzim a franchise, Kim Gunhyo a law office. A link to a design case does not establish a measured SEO improvement; describe only what the underlying case supports.

For site moves and crawling use Google Search Central / Google crawling documentation; for Naver use Search Advisor. Link the precise official supporting page. No fabricated examples passed off as company experience and no undocumented numerical growth claims.
