# Observe the site; design a new presentation

## Orca browser workflow

In an Orca session, load `orca-cli` and its version-matched browser reference first. Resolve the executable as that skill directs; `ORCA` below is a placeholder for that executable.

1. Create a source tab with `ORCA tab create --url <source-url> --json`. Keep the returned `browserPageId` and pass it as `--page <browserPageId>` on later commands so inspection stays on the intended page.
2. Use `ORCA snapshot --page <browserPageId> --json` to read the page and obtain current element refs. Inspect navigation with documented `click`, `scroll` and other interaction commands. Re-snapshot after navigation, tab switches or page-changing clicks; never reuse stale refs.
3. Use `ORCA screenshot` or `ORCA full-screenshot` with the page id to capture real source pixels. Consult the selected CLI's `--help` or documented `exec` help for viewport/device controls and capture output options before using them. Set a genuine desktop/mobile viewport, then verify the rendered dimensions with documented page evaluation (for example, `window.innerWidth`, `window.innerHeight` and `window.devicePixelRatio`) and record them with the capture provenance. A CSS resize or screenshot crop alone is not device emulation.
4. Verify control from an observed effect, such as a changed scroll position or a visible navigation state, rather than relying only on command acceptance. Use the same workflow for the local portfolio preview.

If Orca reports a connection error, follow the `orca-cli` recovery instructions and report the exact failing command/error if recovery fails. A failure from Chrome or the ChatGPT browser tool does not establish that Orca's built-in browser is unavailable. Do not bypass a site access denial; if genuine mobile rendering or capture remains unavailable, apply the evidence limitations below.

## Desktop and mobile evidence

1. Open the provided URL and record the actual final URL. Inspect the homepage plus the pages that explain the business and its main conversion path. Do not silently replace the supplied site with an unrelated search result. Follow the available browser tool's normal access rules.
2. Capture a genuine desktop viewport, commonly 1440×900 or 1920×1080, and a genuine mobile viewport, commonly 390×844 or 375×812. These are starting choices, not invented capture metadata. Record the dimensions actually supported/used. Inspect any important navigation difference, stacking, image crop, calls to action and forms on mobile without submitting a live form.
3. Scroll through the public pages so lazy-loaded sections and fonts settle. Capture meaningful sections/full-page views using documented tool support. Avoid capturing skeletons or a hero that failed to load. An open mobile menu can be a useful separate detail; it must not obscure the only main mobile screenshot.
4. Use documented viewport/device emulation when the tool provides it. If no authorized tool can render at a real mobile width, report the limitation and request the missing capture only if needed to complete the portfolio. A narrow crop of a desktop capture does not count as responsive mobile evidence. Do not bypass denied browser access through another surface.

## List thumbnail

Inspect 2–4 representative existing list thumbnails for style only: photographic versus illustrative treatment, contrast, lighting, physical texture, focal-subject scale and crop. Keep their pixels and branding out of the new image. Existing detailed portfolio boards are not visual references.

Use the imagegen skill to create one new image that connects the supplied site's actual industry and brand colors with that observed grid style. Prefer a coherent editorial photograph/concept to a flat product-on-color poster when the grid is photographic. A fitting symbolic subject or setting is allowed; the actual product need not appear. Avoid UI/device collages, added headings, slogans, badges, invented logos or fake result graphics. Record the image as an AI-generated concept, never an actual client location/product photograph or site evidence. If the user specifically chooses their own photo/logo instead, honor that choice.

Save the prompt and generation provenance. Preview the image in the real desktop/mobile card crop and choose a restrained crop-safe composition; optimize the asset without changing its art direction through deterministic redraws. Keep generated concept pixels out of the authentic screen areas of `portfolio.webp`.

## A site-specific art direction

For the detailed case board, read the new website's visual language rather than old case-board images; use the thumbnail references only for list consistency. Choose a background palette, spacing rhythm, hierarchy and composition that frame this project's screens. Keep the website UI exactly as observed while varying its surrounding presentation.

Useful directions include:

- **Editorial gallery:** spacious desktop panels, large navigation/content details and an orderly mobile strip. Appropriate when photography or content hierarchy does most of the work.
- **Responsive comparison:** a wide desktop hero followed by paired desktop/mobile views of the same task. Useful when responsive behavior is an important feature.
- **Brand presentation:** a color-led opening, one large browser view, staggered mobile screens and a few enlarged UI details. Use the site's own observed brand palette, never a previous project's assets.
- **Task sequence:** service discovery, detail, inquiry/reservation path as a readable screen progression, with labels grounded in observed page titles. Do not claim unmeasured improvements or produce a fictitious before/after.

Choose and adapt a direction, rather than rotating templates mechanically. PC/mobile views need enough space that they can be understood at the actual page width. Avoid scaling an entire 10000px page to a tiny card as the only proof of the interface.

## Composition boundaries

- Use genuine captures as image layers. Preserve their aspect ratios; crop intentionally without warping text or controls. Framing may use browser/device outlines or abstract panels, but must not fabricate content inside the screen.
- A mobile screenshot inside a phone outline is still only as genuine as the underlying mobile capture. Device decoration does not replace inspecting the mobile site.
- Assemble with an available deterministic compositor, SVG/HTML/CSS or equivalent. Image optimization and screenshot placement are not reasons to ask generative AI to reconstruct a UI.
- If requested decorative AI bitmap assets are added, use the imagegen skill and keep them outside the screenshot area. Do not apply a generative edit over authentic UI pixels.
- Default sequence can be cover → desktop overview → meaningful page/detail → mobile overview → selected interaction/detail. Adjust to what was actually observed. Include only useful screens rather than filling a fixed number of slots.
- Read the current `AGENTS.md` for CSS rules. Circular/pill shapes in this project use `rounded-[9999px]`, not the full-radius utility.

## Review before calling the case complete

Check card crops, wide cover crop, the full board at its rendered width, mobile page legibility, and the modal's long image. All `src` paths must exist and image dimensions must match the actual files. No old portfolio imagery, stretched screen text, invented logos, unsupported metrics, unverified work scope or fake mobile states.

Record the chosen direction and original capture provenance in the evidence manifest. If a user supplies revised captures later, use them to replace the corresponding evidence and boards without losing the entry's established URL.
