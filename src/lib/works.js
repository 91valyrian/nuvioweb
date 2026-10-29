import fs from "fs";
import path from "path";
import matter from "gray-matter";

const worksDir = path.join(process.cwd(), "content/work");

export function getAllWorks() {
  const files = fs
    .readdirSync(worksDir)
    .filter((file) => file.endsWith(".mdx"));
  return files.map((file) => {
    const fullPath = path.join(worksDir, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return { ...data, content, slug: data.slug };
  });
}

export function getWorkBySlug(slug) {
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return null;
  const fullPath = path.join(worksDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return { ...data, content, slug: data.slug };
}

// Alias for compatibility
export const getWorks = getAllWorks;
