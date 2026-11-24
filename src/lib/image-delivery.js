// Match the rendered grid at the same breakpoints; sources stay full-resolution
// for article heroes, while cards can use a smaller, more compressed candidate.
export const imageSizes = {
  homeColumn: "(min-width: 768px) calc((100vw - 64px - 5rem) / 3), calc(100vw - 32px)",
  columnList: "(min-width: 1600px) 760px, (min-width: 768px) calc((100vw - 72px) / 2), calc(100vw - 40px)",
  article: "(min-width: 1064px) 920px, (min-width: 768px) calc(100vw - 112px), calc(100vw - 64px)",
  relatedColumn: "(min-width: 1024px) 306px, (min-width: 768px) calc((100vw - 120px) / 2), calc(100vw - 64px)",
};

export function workCardSizes(cols = "cols-3", horizontalOnMobile = false) {
  const count = { "cols-2": 2, "cols-3": 3, "cols-4": 4 }[cols] || 3;
  const gap = horizontalOnMobile ? 1.5 : 2.5;
  const grid = (columns, scale) => `calc((100vw - 64px - ${(columns - 1) * gap * scale}vw) / ${columns})`;
  const tabletCount = count === 4 ? 2 : count;
  const mobile = horizontalOnMobile ? "calc((100vw - 32px) * 0.6)" : "calc(100vw - 32px)";
  // sizes rem/em lengths use the initial font size, whereas this legacy layout's
  // root is viewport-scaled. Express the matching cover height in vw instead.
  const desktop = `calc((100vw - 64px - ${(count - 1) * gap * 16}px) / ${count})`;
  return `(min-width: 1601px) max(${desktop}, 498px), (min-width: 1281px) max(${grid(count, 0.8889)}, 27.63vw), (min-width: 1024px) max(${grid(count, 1.25)}, 38.85vw), (min-width: 769px) max(${grid(tabletCount, 1.25)}, 38.85vw), (min-width: 768px) max(${grid(tabletCount, 2.0833)}, 64.8vw), max(${mobile}, 55.4vw)`;
}
