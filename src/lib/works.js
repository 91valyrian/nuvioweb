import fs from "fs";
import path from "path";
import matter from "gray-matter";

const worksDir = path.join(process.cwd(), "content/work");

export function getAllWorks() {
  const files = fs.readdirSync(worksDir);
  return files.map((file) => {
    const fullPath = path.join(worksDir, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return { ...data, content, slug: data.slug };
  });
}

export function getWorkBySlug(slug) {
  const fullPath = path.join(worksDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return { ...data, content, slug: data.slug };
}