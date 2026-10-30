---
name: nuvio-portfolio-editor
description: Create or revise nuvio portfolio entries from a completed website URL, generate coordinated thumbnail and cover images, and integrate only user-provided images into the detail body. Use for nuvio portfolio, 제작 사례, and portfolio image updates; not for columns or copying website code.
---

# Nuvio portfolio editor

Work in the resolved nuvioweb repository and read its `AGENTS.md`. Read [references/work-format.md](references/work-format.md) for the renderer contract and [references/capture-and-layout.md](references/capture-and-layout.md) for source inspection, concept images and user-supplied body integration.

## Default delivery: current SUNNY pattern

The user supplies a completed website URL and the final detail-body image(s). Deliver a repository-ready case: factual Korean metadata and overview, one newly generated list thumbnail, a coordinated wide cover, and optimized supplied body image(s). Use `content/work/sunnyrf.mdx` and its **current referenced assets** as an integration example, not its obsolete boards, historical evidence or literal copy. Match its delivery structure, while adapting content and visual direction to the supplied business.

Inspect the URL and supplied images before writing. Derive the brand name, audience, offering, visible information hierarchy, design character and inquiry path from observed evidence. Write a natural, specific title, concise summary, overview, SEO title/description/keywords and accurate image alt text. Explain what visitors can find and how the page supports the site's purpose. Avoid generic praise, keyword repetition and claims about unverified implementation or results. The current work renderer displays frontmatter and body images, not a long MDX article: put the introduction in the supported fields.

Complete routine choices autonomously when both inputs are present; do not ask for approval of every generated asset. Missing scope/year/results must stay omitted or conservative. Missing URL/body assets should only block the work that depends on them.

## Choose the requested scope

For a new case, inspect the user's completed website URL, write the work MDX and generate a project-specific thumbnail and coordinated wide cover. **The detail body uses only images supplied by the user.** Do not capture, generate, compose or insert extra body images, screenshot boards, mobile montages, decorative artwork or placeholders.

For an existing case's body-image update, use exactly the files and order requested. Preserve its slug, original registration date, thumbnail, cover and other unrelated metadata unless asked to change them. Do not re-inspect the source or generate concept art for a body-only replacement. Explicit limits such as “only this image” determine the final body image count.

If body images have not been supplied for a new case, finish independent copy and thumbnail/cover work, report the missing body assets and request them. Do not keep an old board or invent a substitute. Do not claim the case's body is complete until supplied files are integrated.

## Inspect the supplied website

Use the URL as the factual source: identify the public brand, audience, information structure, design and inquiry path. In Orca, load `orca-cli` and its version-matched `references/browser.md`, then use the built-in browser. Outside Orca, use available authorized browser tools; honor an explicitly requested browser.

Inspect actual desktop/mobile rendering where available and record final URL, date, observed pages and viewport sizes. This inspection informs copy and concept-image direction; it does not authorize publishing browser captures as body images. A desktop crop is not evidence of a mobile rendering. If access or mobile inspection is unavailable, report the exact limitation rather than implying verification.

Use supplied or verified work scope and project year. A URL does not establish a tech stack, SEO work, roles, client outcome or measured improvement. Preserve confirmed source facts during image-only updates. Never describe a supplied image as a public site capture if it shows something else.

## Generate thumbnail and cover

Inspect two work MDX files/current renderers for integration and 2–4 list thumbnails for photographic mood, scale, lighting and crop. Do not copy their pixels, branding or old board layouts.

Use `imagegen` for one new industry/brand-matched conceptual list thumbnail. Keep a coherent photographic image: no website/device collages, headlines, badges, invented client products or client locations. Honor a user-selected photo/logo instead of generation when requested.

Generate the coordinated wide cover using the approved thumbnail as reference: same subject family, palette and lighting, central crop-safe composition, no added headlines or UI collage. Record prompts and AI-concept provenance separately; concepts are not actual client or website evidence. Inspect final files and real card/hero crops. Save revised assets with versioned paths.

## Integrate user-provided body images

Inspect each supplied file. Copy it into `public/images/work/<slug>/` using a versioned directory when updating. Preserve its aspect ratio, content, order and original crop. Optimize file size as described in the image reference; do not redraw, crop, frame, composite, add labels or apply generative edits unless requested.

Use Markdown image references matching the live renderer. The main body and landing modal must show the supplied content, without appending previous boards or concept art. Preserve `portfolio.webp`/`portfolio.png` integration: for one image use an optimized versioned `portfolio.webp`; for multiple images see the format reference. Never compose multiple supplied files into a new board without permission.

Reject fully transparent, blank or corrupt inputs before replacing a working image. Ask for a valid source instead of publishing an empty body.

Keep existing list thumbnail, hero and `thumbnail2` unchanged for body-only updates. For new cases, `thumbnail2` may use the supplied appropriate image or fall back to `thumbnail`; do not create a screenshot asset just to fill that field.

Keep detail content within the current readable body widths (1200 physical pixels, prose 1000) with responsive gutters. Hero width follows the site's current layout.

## Write and verify

Use the established `content/work/<slug>.mdx` schema, factual Korean metadata and overview. Canonical portfolio origin is `https://nuvio-web.com`; source URL goes in `href`. Preserve `inputDate`, set `updated` only for a substantive edit. Do not infer project year from the current date.

Record original/output dimensions, byte sizes, encoding settings and source file alongside source inspection, unknown facts, concept-image provenance and supplied-body provenance in `content/work-evidence/<slug>.json`. Explicitly supplied admin/internal screenshots may be used as directed, but do not discover or publish additional private screens. Check supplied images for accidental credentials or personal data before publication.

Run `npm run check:content` and `npm run build`, plus relevant regression checks if a shared renderer changes. Validate the exact body image count/order, files, preserved image ratio and modal output. Preview local desktop/mobile UI through Orca CLI when in Orca; report unavailable checks honestly. Do not submit live inquiries.

Report entry/assets, what changed and stayed unchanged, missing source/body evidence, validation and deployment status. Local writing/preview does not independently authorize production deployment; preserve explicit authorization already given in the conversation.
