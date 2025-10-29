import fs from "fs";
import path from "path";
import matter from "gray-matter";

const COLUMNS_DIR = path.join(process.cwd(), "content/columns");

function normalizeToArray(value) {
  if (!value) return [];
  if (Array.isArray(value))
    return value.flatMap((item) =>
      item
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  if (typeof value === "string")
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export function getAllColumns() {
  const files = fs.readdirSync(COLUMNS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const base = file.replace(/\.mdx$/i, "");
    const raw = fs.readFileSync(path.join(COLUMNS_DIR, file), "utf-8");
    const { data } = matter(raw);

    // slug 정규화 (frontmatter에 .mdx가 들어와도 제거)
    const slug = (data.slug || base).replace(/\.mdx$/i, "");

    // categories/tags 정규화 및 쉼표 분리
    const categories = normalizeToArray(data.categories);
    const tags = normalizeToArray(data.tags);

    return {
      ...data,
      slug,
      categories,
      tags,
      summary: data.summary || "",
      thumbnail: data.thumbnail || "",
      thumbnailAlt: data.thumbnailAlt || "",
    };
  });

  // 최신순 (날짜가 없으면 뒤로)
  return posts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  });
}

export function getColumnBySlug(slug) {
  const normalized = slug.replace(/\.mdx$/i, "");
  const file = path.join(COLUMNS_DIR, `${normalized}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);

  const categories = normalizeToArray(data.categories);
  const tags = normalizeToArray(data.tags);

  return {
    ...data,
    slug: normalized,
    categories,
    tags,
    summary: data.summary || "",
    thumbnail: data.thumbnail || "",
    thumbnailAlt: data.thumbnailAlt || "",
    content,
  };
}
