export const PAGE_SIZE = 10;
export function columnListUrl(page = 1, category = "") {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  return "/columns" + (params.size ? `?${params}` : "");
}
export function paginateColumns(posts, search = {}) {
  const category = typeof search.category === "string" ? search.category : "";
  const filtered = category
    ? posts.filter((p) => p.categories.includes(category))
    : posts;
  const raw = search.page === undefined ? "1" : search.page;
  const page =
    typeof raw === "string" && /^[1-9]\d*$/.test(raw) ? Number(raw) : 0;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  return {
    category,
    page,
    totalPages,
    valid:
      page >= 1 && page <= totalPages && (!category || filtered.length > 0),
    visible: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  };
}
