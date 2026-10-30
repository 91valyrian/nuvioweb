# Work MDX and integration contract

Read the live implementation before using this reference; update the skill if that contract changes.

## Current consumers

- `src/lib/works.js` lists only MDX files from `content/work`; filename and `slug` must match.
- `src/components/CardList.js` uses `thumbnail` for the work/home cards, centered with `object-cover`. Keep essential screen/brand information safe under portrait-like cropping.
- `src/app/landing/page.js` uses `thumbnail2` first for its vertically scrolling portfolio shot, then `thumbnail` as fallback. For new entries use an appropriate user-supplied preview if available, otherwise omit `thumbnail2` to use the thumbnail fallback. Do not capture a new page image solely for this field. Preserve it on body-only updates.
- `src/app/work/[slug]/page.jsx` uses `cover` in a wide approximately 1920×720 region. It renders frontmatter overview and project information, and extracts body images using the Markdown pattern `![alt](src)`.
- `src/components/work/WorkMainSection.js` currently stacks all extracted images. It does not render arbitrary MDX prose, JSX figures or captions from a work entry. Do not promise body text/layout which this renderer cannot display.
- `src/app/api/works/[slug]/route.js` finds a body Markdown image whose URL includes `portfolio.webp` (or the old PNG fallback). That image supplies the current landing modal. Preserve this integration.
- Existing WorkSubSection/WorkExtraSection components are not automatically wired into the current work detail route. Do not assume naming an asset `mobile` will create a new section.

## New entry shape

```yaml
---
title: "실제 브랜드명 홈페이지 제작"
seoTitle: "실제 브랜드명 · 업종에 맞는 홈페이지 제작 사례"
seoDesc: "대상 사업과 관찰한 정보 구성, PC·모바일 사용 흐름을 구체적으로 설명하는 고유한 소개."
seoKeywords:
  - 실제 업종 홈페이지 제작
  - 사례에서 확인할 수 있는 주제
slug: "brand-project-slug"
client: "실제 브랜드명"
service:
  - Website # 구체적인 기획·디자인·개발·SEO 역할은 확인된 경우에만 기재
year: 2026 # 프로젝트 연도가 확인된 경우에만 기재, 현재 연도라고 추정하지 않기
summary: "실제 업종이나 서비스 유형"
overview: "관찰한 사업 목적과 정보 구성, 시각적 특징, 문의 경로를 간결하게 설명. 필요한 경우 안전한 br 태그만 사용."
href: "https://the-user-provided-client-site.example/"
thumbnail: "/images/work/brand-project-slug/thumb.webp"
thumbnail2: "/images/work/brand-project-slug/thumb-web.webp"
cover: "/images/work/brand-project-slug/cover.webp"
inputDate: "YYYY-MM-DD"
---

![사용자가 제공한 브랜드 프로젝트 상세 이미지](/images/work/brand-project-slug/portfolio.webp)
```

The example values are placeholders for authoring, never a publishable case. `inputDate` is registration date; `year` is the actual project year, not a copyright footer year. For missing project year, omit the optional field or ask if the user's desired output requires it. Keep unverified scope conservative instead of inferring Strategy/Development/SEO from a URL.

A plain Korean `title` is supported by the renderer and safer than constructing hidden keyword spans. Avoid arbitrary client HTML in frontmatter; escape special characters and serialize YAML correctly. `seoTitle`, `seoDesc`, alt text and structured-data names must be plain text. Copy no unrelated metadata from the sample entries.

## Image delivery

| File | Role | Starting dimensions, adapt after preview |
|---|---|---|
| `thumb.webp` | Work/home list: AI-generated industry/brand concept matching existing thumbnails; or user-selected photo/logo. Crop-safe, no UI collage or added copy | portrait around 1600×1900 |
| `thumb-web.webp` (optional) | User-supplied suitable landing preview; otherwise use thumbnail fallback | preserve supplied ratio |
| `cover.webp` | AI-generated wide hero coordinated with the thumbnail; conceptual brand imagery | 1920×720, keep important content centered |
| `portfolio.webp` | User-supplied body image and modal image only; no generated board | preserve supplied dimensions and ratio; rendered within the existing body cap |

When the user supplies a thumbnail, preserve that exact source image and prefer a new filename to avoid stale optimized/browser caches. For a tall transparent product/logo that must remain fully visible, set optional frontmatter `thumbnailFit: "contain"`; other entries retain the default cover crop. Optional `thumbnailBackground` sets the card background for transparent product/logo images; use the client brand color when requested without altering the supplied pixels.

Detail body images are supplied by the user. Preserve their original content, ratio and order without adding captures, concept artwork or framing. For a single file, encode an optimized versioned `portfolio.webp` copy using the image optimization reference and reference it once in MDX; the detail and modal then use the same content. Keep old assets without referencing them in the body.

For multiple supplied files, reference each once in the requested order. Use `portfolio.webp` for the user-designated main image (or the first supplied image) so the current modal API continues to work; use descriptive filenames for the others. The current modal displays only that main image: report this limitation instead of composing a new board or changing the shared modal silently. Extend the modal to a gallery only if requested.

Without user-supplied body images, omit body image references and report the missing detail/modal assets. Do not substitute generated imagery or old boards. Keep metadata/final wording honest about what was actually inspected or supplied.

## Evidence storage

Keep an audit manifest at `content/work-evidence/<slug>.json` with source URL, inspected pages, capture date, actual viewport width/height, the user-provided source filename and output path for every body image, factual unknowns and relevant user-supplied project facts. Save large raw captures in a task workspace outside `public` until clean final files are selected. Do not put a second JSON inside `content/work` as a portfolio entry.

Do not publish authenticated/admin screens, personal information, unfinished loading states or accidental consent overlays. Use only permitted publicly visible screens or explicitly supplied material; keep essential website text and logos authentic.
