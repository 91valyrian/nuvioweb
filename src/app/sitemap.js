// src/app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://nuvio-web.com";

  // 워크/칼럼 등 슬러그 기반 페이지 가져오기
  // (정적 콘텐츠가 MDX면 별도 lib 함수에서 불러올 수 있음)
  const works = []; // ex) getAllWorks().map((w) => `${baseUrl}/work/${w.slug}`)
  const columns = []; // ex) getAllColumns().map((c) => `${baseUrl}/columns/${c.slug}`)

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/columns`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // 동적 콘텐츠 병합
    ...works.map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...columns.map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
