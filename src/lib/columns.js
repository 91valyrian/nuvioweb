import fs from "fs";
import path from "path";
import matter from "gray-matter";

const COLUMNS_DIR = path.join(process.cwd(), "content/columns");

export function getAllColumns() {
  const files = fs.readdirSync(COLUMNS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const base = file.replace(/\.mdx$/i, "");
    const raw = fs.readFileSync(path.join(COLUMNS_DIR, file), "utf-8");
    const { data } = matter(raw);

    // slug 정규화 (frontmatter에 .mdx가 들어와도 제거)
    const slug = (data.slug || base).replace(/\.mdx$/i, "");

    // categories/tags 정규화
    const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
    const categories = toArray(data.categories).map((s) => String(s).trim());
    const tags = toArray(data.tags).map((s) => String(s).trim());

    return { ...data, slug, categories, tags };
  });

  // 최신순
  return posts
    .filter((p) => p.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getColumnBySlug(slug) {
  const normalized = slug.replace(/\.mdx$/i, "");
  const file = path.join(COLUMNS_DIR, `${normalized}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);

  const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const categories = toArray(data.categories).map((s) => String(s).trim());
  const tags = toArray(data.tags).map((s) => String(s).trim());

  return { ...data, slug: normalized, categories, tags, content };
}
