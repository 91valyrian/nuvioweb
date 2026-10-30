# Source inspection, concept images and supplied body images

## Orca browser inspection and local preview

Load `orca-cli` and its version-matched `references/browser.md` before using the built-in browser. Resolve the executable once according to that skill. Create a source/local tab with `tab create --url <url> --json`; keep its `browserPageId` and pass `--page` thereafter. Read a fresh `snapshot` after navigation or interaction and use current refs. Follow documented CLI recovery on connection errors; do not assume a Chrome failure means Orca is unavailable.

Inspect the supplied site's public desktop/mobile rendering to ground the case copy and thumbnail/cover art direction. Consult CLI help for real viewport/device controls and verify `window.innerWidth`, `window.innerHeight` and device pixel ratio. Record only observed dimensions/pages. Do not crop a desktop view and call it mobile. Do not submit forms or bypass denied access.

Inspection captures may be kept privately as evidence, but **do not publish them as detail body images**. The default output from a URL is metadata, generated thumbnail and generated cover. Body images come from the user, including user-provided screenshots. A body-only replacement does not require revisiting the client URL.

## Thumbnail and cover direction

Inspect 2–4 list thumbnails for mood and crop, not old detailed boards. Create a single coherent industry/brand concept with `imagegen`, or use a photo/logo explicitly selected by the user. Match photographic treatment, restrained lighting and crop-safe subject scale. Do not copy an existing project's pixels or branding, invent a real client product/location, or add explanatory copy, badges or UI collages.

Generate a coordinated wide hero from the approved thumbnail reference. Keep brand palette, lighting and subject family while composing for approximately 1920×720. Save versioned assets and generation prompts. Mark both generated assets as concepts, not source UI evidence.

## Supplied detail body

- Use only user-provided image files and their requested order/count.
- Inspect each image's actual content; alt/provenance must not misidentify unrelated or internal UI as a public project screen.
- Preserve image content, aspect ratio and crop. Optimize supplied files using the guidance below; do not redesign them.
- Never create a board, montage, browser/device framing, extra screenshots or supporting concept artwork by default.
- If the user says one image only, replace all body image references with that one file. Keep original source assets on disk non-destructively, but do not display them.
- Existing thumbnail, cover and landing preview are outside a body-only replacement unless the user includes them.
- Without supplied body images, complete independent work and report that the body/modal imagery remains missing. Do not silently reuse an old board.

## Optimize supplied images

Inspect metadata and actual content before conversion, including alpha: a fully transparent or blank file is not a valid capture. Do not replace the existing body with it; request a corrected file. Preserve the user's source file unchanged outside public output.

Use Sharp or an equivalent encoder. Compare a lossless WebP with a high-quality lossy WebP (approximately quality 85–92) when the source is large. Pick a materially smaller result after checking text edges, logos, fine lines and gradients at actual display size. Routine visual compression is part of delivery; honor explicit lossless/original-pixel requirements. Keep original dimensions by default, especially tall page captures with small text. Resize only when the supplied resolution is excessive for the actual render and readability survives; never crop or alter the ratio to save bytes. If WebP is not smaller, keep a suitable original format supported by the renderer.

The current SUNNY example retained 2241×11152 pixels and converted a 6,314,435-byte PNG to a 642,356-byte WebP at quality 88 (about 90% smaller). This illustrates a decision, not a universal size target or encoder setting. Do not force every case to that resolution or byte budget.

Reference the new versioned file once in MDX; confirm the modal API resolves it. Remove obsolete body references. Delete previous assets only when explicitly requested and after checking that thumbnail, cover, landing preview and other content do not reference them. Record input/output bytes, dimensions, encoding and visual verification. Report the actual reduction to the user.

## Review

Check the actual detail page and API/modal image, correct body count/order, original image proportions and readable text at the renderer's body width. Confirm no old board is still referenced. Keep source inspection evidence, AI concept provenance and supplied-image provenance separate in the manifest. No new imagegen call is needed when only importing supplied body files.
