---
name: nuvio-portfolio-editor
description: Create or revise a nuvioweb portfolio from a user-provided completed website URL, inspecting desktop and mobile and creating fresh screenshot-based presentation layouts in the existing work MDX format. Use for nuvio portfolio, 제작 사례, and URL-to-portfolio requests; not for column writing or copying a website's code.
---

# Nuvio portfolio editor

Create the actual portfolio entry and its image assets in the nuvioweb repository. Read [references/work-format.md](references/work-format.md) for the current data/rendering contract and [references/capture-and-layout.md](references/capture-and-layout.md) before inspecting and presenting a site.

Locate the repository from the current working directory or this skill's resolved symlink location. Read its `AGENTS.md`. If invoked outside the project, work in the resolved nuvioweb repository rather than creating `content/work` in the unrelated current directory.

## Inspect the supplied website

Treat the user's supplied URL as the source of the case study. In an Orca session, use Orca's built-in browser through the `orca-cli` skill for site inspection, interaction, screenshots and local UI previews. Load that skill and its version-matched `references/browser.md` before driving a tab; follow its executable resolution and documented commands. Do not default to Chrome or the ChatGPT in-app browser in this environment. Honor an explicitly requested browser instead.

Inspect the public site, its desktop navigation and meaningful subpages, and its actual responsive mobile rendering. Follow the Orca workflow in [references/capture-and-layout.md](references/capture-and-layout.md). Outside Orca, use available authorized browser tools. Record the final source URL, inspection date, viewport dimensions and which pages/screens were actually observed. Use documented capture/viewport capabilities; do not invent APIs or bypass an access denial.

Read what the business offers, identify its public brand name, audience, main information structure and visible inquiry/reservation path. Describe observable design and usability choices. A user saying they made the site establishes it as their project, but does not establish a particular tech stack, project year, SEO implementation, division of work or measured results. Use supplied facts; omit unconfirmed optional details, and ask only if a missing fact materially blocks the requested entry.

A URL or site summary alone is insufficient evidence for a finished visual portfolio. If access, capture or genuine mobile inspection is unavailable, continue independent content preparation, identify the exact missing evidence, and leave the affected imagery incomplete. Never substitute a desktop crop or old portfolio image and claim the mobile site was checked.

## Keep the format; create new visuals

Inspect two existing work MDX files and the current renderers to learn fields, filenames and integration only. **Ignore all existing portfolio images as visual references and source material.** Do not open or reuse them to imitate their layouts. Do not recolor, crop, relabel or paste a previous project's portfolio image into the new work.

Keep the list thumbnail visually consistent with nuvio's portfolio grid: use one authentic product/brand photograph or the client's logo on a restrained background. Do not turn the thumbnail into an article cover or presentation board: no PC/mobile screenshot collage, device montage, added headline, slogan, badge or explanatory copy. Existing lettering within the genuine logo/product image is fine. Reserve the detailed screen composition for the cover and `portfolio.webp`; validate the list card's actual crop separately.

Build a fresh visual direction from the supplied website: its colors, type, composition, content density and responsive behavior. Create real screenshots of that site, then arrange them into a new portfolio presentation: a suitable cover, thumbnail, desktop view, mobile view, and selected subpage/detail views when they communicate something useful. Follow the capture/layout reference. A new presentation layout is expected; a single unchanged full-page screenshot is not the completed portfolio.

Use real source pixels for all website UI. Prefer deterministic HTML/CSS, SVG framing or an image compositor to assemble screenshot boards. Do not use generative AI to redraw website text, logos, layouts, responsive states or results. If additional decorative bitmap artwork is useful, apply the imagegen skill and keep it separate from the authentic screen captures.

## Write and integrate

Create `content/work/<slug>.mdx` and new assets under `public/images/work/<slug>/`. Preserve an existing entry's slug and original registration date when updating it; replace imagery non-destructively with versioned files when needed. Keep new entry dates accurate and its year factual.

Write Korean `seoTitle`, `seoDesc`, industry-appropriate `seoKeywords`, `client`, `summary`, a concise observed project overview, the source `href`, and the actual confirmed work scope. Never copy another project's metadata or keyword list. Distinguish design intent from measured outcomes. Match metadata to the real site rather than inserting generic conversion claims.

Respect the MDX image extraction and `portfolio.webp` API contract in the format reference. Link the case to relevant existing services/columns where the current integration supports it. The portfolio is hosted at `https://nuvio-web.com/work/<slug>`; the supplied client URL goes in `href`, not in the portfolio canonical. `nuvio.kr` is an unrelated third-party domain.

## Verify and deliver

Inspect the finished image files at useful scale: no stretched UI, clipped headlines, hidden mobile navigation, accidental duplicated screens, fabricated charts or unreadable all-page miniatures. Confirm that the visible mobile layout actually came from a mobile viewport. Save an evidence manifest without credentials or private data.

Run `npm run check:content` and `npm run build`, plus appropriate site checks when changing a renderer. Check the work list card, portfolio detail, cover crop, landing thumbnail and modal image, sitemap/RSS, metadata and related service links. In Orca, preview desktop/mobile UI through Orca CLI using the same inspection and capture workflow; outside Orca, use available authorized browser tools. Report any unavailable visual checks honestly.

Report the entry path, asset folder, inspected URL/viewports, visual direction, confirmed vs omitted facts, checks and deployment status. A URL-to-portfolio request authorizes local creation and preview, not automatically a live contact submission or production deployment. Preserve explicit authorization already given in the conversation.
