export function getRelatedColumns(post, posts, limit = 3) {
  const tags = new Set(post.tags || []);
  const score = (p) =>
    (p.tags || []).filter((t) => tags.has(t)).length * 3 +
    (p.categories || []).filter((c) => (post.categories || []).includes(c))
      .length;
  return posts
    .filter((p) => p.slug !== post.slug)
    .sort(
      (a, b) =>
        score(b) - score(a) ||
        (b.date || "").localeCompare(a.date || "") ||
        a.slug.localeCompare(b.slug),
    )
    .slice(0, limit);
}
