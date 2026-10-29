---
name: nuvio-column-editor
description: Create or revise nuvioweb Korean MDX columns with the existing editorial design, search intent, verified sources, internal links, generated thumbnails and article images. Use for nuvio column writing, publishing preparation, and column image requests in this repository.
---

# Nuvio column editor

Work in the nuvioweb repository. Read `references/editorial-style.md` before writing or substantially revising a column. Inspect the current renderer (`src/app/columns/[slug]/page.js`), `.column-article` CSS, two nearby MDX posts and their images; repository implementations take precedence over a stale reference.

## Select the topic

Inventory `content/columns/*.mdx` and `src/data/services.js`. Define one primary reader question and its relevant service. If an existing article answers the same question, improve that article and preserve its URL instead of adding a near duplicate. When Search Console data is available, use page/query impressions to prioritize. Without data, call the topic a reasoned opportunity, not a proven high-volume keyword.

Write a useful answer early, then provide specific decisions, steps, a comparison or a checklist. Explain scope, cost factors, risks and preparation when relevant. Link naturally to useful related columns, the appropriate real `/service/...` route, a relevant genuine `/work/...` case if one exists, and a contextual consultation action. Never imply the company has hospital or other industry work absent from `content/work`.

Verify current technical guidance against primary sources; put source links beside the corresponding claims. Distinguish illustrative examples from actual results. Do not invent traffic, success rates, testimonials, rankings, prices, certifications or client outcomes. Do not present dwell time, GA bounce rate, meta keywords or a sitemap as a direct ranking guarantee. Keep the article readable rather than repeating sales slogans.

## Create article and image assets together

Use the documented MDX frontmatter and Figure/Img/Figcaption format in the reference. For a new article, create a topic-specific thumbnail plus supporting body images that clarify the discussion (normally two; adapt to the topic). Use the available imagegen skill and built-in image generation for raster artwork; do not silently use a paid API or replace requested artwork with placeholders. Inspect an existing thumbnail and at least one body image to match the current style.

Persist selected images under `public/images/columns/<slug>/` in WebP with accurate 16:9 dimensions. Inspect every image, Korean spelling and crop. A typical thumbnail is 1600×900, navy/indigo, bold white Korean headline, small nuvio wordmark, outlined topic pills and relevant 3D objects. Body images use uncluttered illustrations and captions; never depict made-up analytics as proof. Asset names and alt descriptions should describe the content, not list keywords.

If generation is unavailable, complete independent writing work but report missing images clearly. Do not claim the post is publication-ready until the referenced images exist.

## Verify and deliver

Run `npm run check:content` and `npm run build`. Preview the real article and list with a browser at desktop and mobile widths when available. Check the image crop, white card, type hierarchy, inline links, captions, tables, CTA, related services and recommendation links. Check title/canonical/Article JSON-LD and that the new slug is in sitemap and RSS. Set `updated` only for a substantive edit, preserve `date`, and never change an established slug just for SEO.

Report the article path, image folder, primary intent, source links, validation result and deployment status. The user's writing request permits local creation and preview; it does not automatically authorize production deployment or sending messages to third parties. Avoid promising traffic or automatic indexing.
