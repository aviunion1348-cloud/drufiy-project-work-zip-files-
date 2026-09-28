# U-01 — DrufiyAI Precision Engineering Design System

**Status:** Complete

**Version:** 1.0.0

**Date:** 2026-09-28

**Scope boundary:** This document covers the U-01 foundation. The subsequent post-entry multi-page experience is documented separately in `POST-ENTRY-EXPERIENCE.md`; U-02 Sidebar, U-03 Dashboard, and U-04 Component Library remain intentionally separate.

## 1. Outcome

U-01 establishes a framework-agnostic visual and interaction foundation for the future DrufiyAI application. It includes:

- A responsive cinematic entry experience adapted to DrufiyAI content.
- Centralized CSS custom properties for color, type, spacing, shape, elevation, blur, motion, focus, and z-index.
- A machine-readable W3C-style token file (`design-system/tokens.json`).
- A portable global reset/accessibility foundation.
- A deterministic catalog expanded to **1,200 motion recipes** while retaining the original recipe identifiers.
- A procedural, opt-in catalog expanded to **256 sound recipes**, generated with Web Audio and shipped without binary audio assets.
- A catalog of **1,024 executable human-intent experience ideas** across interface surfaces and cognitive modes.
- A live rocket-film backdrop after the cinematic entry, with a poster fallback and reduced-motion fallback.
- A safe, idempotent adapter that can install the U-01 foundation into common vanilla, React, Vite, Next, Remix, Astro, Vue, or Svelte project layouts.
- A live style specimen for color, typography, motion, and product principles.

The implementation is vanilla HTML/CSS/JavaScript. It has no package manager, no framework, no compilation, and no local media files.

## 2. Protected DrufiyAI content

The implementation preserves the identity and content meaning supplied in the brief:

- Brand: **DrufiyAI**
- Products: **Lear** and **Prash**
- Primary navigation concepts: Products, How we build, Principles, Talk to us
- Product and principle language is drawn from the supplied protected copy
- Company GitHub destination: `https://github.com/Drufiy`
- Canonical URL: `https://drufiy.com`

No fictional product, testimonial, customer, performance claim, or integration was added.

U-01 does not invent or replace an application backend. Contact submission, authentication, product routes, and existing business logic are outside this phase and must be connected when the application repository is available.

## 3. Visual direction

### Precision Engineering

The design combines two deliberate modes:

1. **Cinematic entry** — warm paper typography over a layered, parallax image composition. It creates an emotional threshold before the operational product UI.
2. **Operational field** — near-black surfaces, thin instrument lines, glass layers, an emerald-to-cyan signal gradient, and a restrained live-film layer.

The bridge between both modes is the Ogg Medium display face. It provides editorial warmth while system sans and monospace faces keep dense UI legible.

### Core palette

| Role | Token | Value |
|---|---|---|
| Canvas | `--color-bg-canvas` | `#08090A` |
| Raised | `--color-bg-raised` | `#0F1114` |
| Card | `--color-bg-card` | `#151820` |
| Primary text | `--color-text-primary` | `#F0F2F5` |
| Secondary text | `--color-text-secondary` | `#A0A8B8` |
| Muted text | `--color-text-muted` | `#6E778D` |
| Emerald | `--color-accent-start` | `#34D399` |
| Mint | `--color-accent-solid` | `#3BE8B0` |
| Cyan | `--color-accent-end` | `#06B6D4` |
| Cinematic paper | `--brand-paper` | `#FDF1E1` |
| Warning | `--color-status-warning` | `#FBBF24` |
| Error | `--color-status-error` | `#F87171` |

### Color use rules

- Emerald communicates live state, primary action, or success. It is not general decoration.
- Cyan communicates information, flow, and downstream state.
- Warm paper is primarily for the cinematic layer and occasional high-emphasis inverse surfaces.
- Error and warning colors are always paired with text or a symbol; color is never the only signal.
- Main body text uses `--color-text-secondary`; muted text is reserved for metadata above 12px.

## 4. Typography

| Layer | Stack | Intended use |
|---|---|---|
| Display | Ogg Medium → Iowan Old Style → Baskerville → Georgia | Hero, section titles, editorial statements |
| Body | Inter → Satoshi → system UI | Body, controls, navigation |
| Mono | IBM Plex Mono → SFMono-Regular → Consolas | Status, code, terminal, metadata |

Only Ogg Medium is remotely loaded because it was explicitly supplied. Body and mono use local system fallbacks, avoiding additional network dependencies.

### Type behavior

- Display headings use tight line height and negative tracking.
- UI text never uses the display face.
- Monospace labels are uppercase with wide tracking.
- Fluid type uses `clamp()` at large display sizes to prevent breakpoint cliffs.

## 5. Spatial system

A 4px/8px base grid is encoded from `--space-1` through `--space-40`. Layout-level spacing uses fluid tokens:

- `--layout-max: 87.5rem`
- `--layout-gutter: clamp(1.25rem, 4vw, 4rem)`
- `--layout-section: clamp(5rem, 11vw, 10rem)`
- `--layout-column-gap: clamp(1.5rem, 4vw, 4rem)`

These values should be consumed by U-02, U-03, and U-04 rather than recreated.

## 6. Motion system

`design-system/motion-catalog.js` creates 1,200 distinct, deterministic recipes at runtime:

- 10 families: reveal, drift, signal, focus, cinematic, orbit, scan, glitch, magnetic, parallax
- 8 directions: up, down, left, right, forward, backward, in, out
- 5 depths: near, mid, far, deep, orbital
- 3 tempos: instant, swift, steady

Formula: `10 × 8 × 5 × 3 = 1,200`.

Use:

```js
DrufiyMotion.run(element, "signal:up:near:swift");
```

Every recipe has a stable ID and exposes duration, easing, keyframes, family, direction, depth, and tempo. When `prefers-reduced-motion: reduce` is active, the runtime applies the final state without animation.

### Motion rules

- **Reveal:** first appearance of content.
- **Drift:** atmospheric/non-critical ambient movement.
- **Signal:** state changes or newly available data.
- **Focus:** selection and hierarchy.
- **Cinematic:** large scene transitions only.
- Do not combine more than two motion families on one element.
- Do not use perpetual motion for actionable UI except status indicators.

## 7. Sound system

`design-system/sound-catalog.js` creates 256 procedural recipes:

- 16 families: ui, navigation, confirm, caution, error, pulse, scan, launch, hover, select, open, close, transmit, resolve, boundary, orbit
- 4 pitch registers: low, lowMid, highMid, high
- 4 intensities: subtle, soft, firm, peak

Formula: `16 × 4 × 4 = 256`.

`design-system/experience-catalog.js` adds 1,024 executable experience ideas:

- 16 human intents
- 8 interface surfaces
- 8 cognitive modes

Formula: `16 × 8 × 8 = 1,024`.

Use:

```js
await DrufiySound.setEnabled(true); // must follow a user gesture
DrufiySound.play("confirm:highMid:soft");
```

No sound autoplays. The visitor must enable the audio field. The implementation uses short oscillator envelopes, filtered noise, and conservative gain. It does not download or store audio binaries.

### Sound rules

- UI controls use subtle intensity by default.
- Firm/peak intensities are reserved for consequential or cinematic transitions.
- Error sounds are never the only error signal.
- Sound state is represented by text and `aria-pressed`.
- U-02/U-03 should persist the preference only after privacy requirements are confirmed.

## 8. Cinematic choreography

The entry uses a 3,700px scroll rig and sticky 100vh stage. The animation engine reproduces the supplied timing model:

- 0–650px: title and intro move upward and fade.
- 560–1,620px: bridge and split-frame transition, river close-up, blue blur shade, Lear story.
- 1,760–2,700px: second story panel and saturated background phase.
- 2,760–3,560px: card rail enters from the right.
- 3,360–3,660px: rail controls become visible and interactive.

The scene uses requestAnimationFrame, scroll interpolation, pointer interpolation, and CSS custom-property writes. Scroll and pointer listeners are passive. Reduced motion removes inertia and pointer parallax while preserving readable scroll states.

The infinite rail creates three cloned sets and normalizes back into the middle set after each CSS transition. Cards work with pointer, Enter, and Space.

## 9. Live film treatment

The design specimen after the entry uses a remote NASA-imagery rocket film from Pixabay:

`https://cdn.pixabay.com/video/2015/08/10/236-135863777_large.mp4`

The poster is:

`https://cdn.pixabay.com/video/2015/08/10/236-135863777_tiny.jpg`

The film is muted, looped, plays inline, and is treated as decorative. A layered scrim guarantees text contrast. If video loading fails, the section remains fully usable on the canvas background. Under reduced motion, the video is hidden.

The repository stores no video or image payload, keeping the workspace well below the requested 80 MB ceiling.

## 10. Accessibility foundation

Implemented:

- Semantic landmarks and headings.
- Skip link to the design-system content.
- Visible keyboard focus.
- Keyboard-compatible slider cards.
- Text equivalents for stateful controls.
- `aria-live` system-status announcements.
- Decorative images and video hidden from assistive technology.
- `prefers-reduced-motion` behavior in CSS and JavaScript.
- High-contrast forced-colors fallback.
- Text scrims over imagery.
- No sound before a user gesture.

U-02 through U-04 must maintain these rules and add focus management where overlays, menus, or dialogs are introduced.

## 11. Portable adapter

The repository includes `scripts/apply-u01.mjs`.

Dry run:

```bash
node scripts/apply-u01.mjs --target /path/to/another/project
```

Install:

```bash
node scripts/apply-u01.mjs --target /path/to/another/project --write
```

The adapter:

1. Detects common package stacks.
2. Finds a known global CSS or HTML entry.
3. Copies the portable U-01 foundation into `.drufiy/design-system/`.
4. Adds idempotent CSS imports or an HTML stylesheet link.
5. Leaves all application markup and business logic untouched.

It intentionally does **not** push Git commits, execute package scripts, rewrite unknown components, or alter backend code. Automatic modification without explicit execution would be unsafe. U-04 can later extend the adapter with framework-specific component wrappers.

## 12. Repository map

```text
.
├── index.html                         # cinematic entry + U-01 live specimen
├── styles.css                         # page composition and responsive treatment
├── script.js                          # exact scroll rig + slider + demo behavior
├── design-system/
│   ├── tokens.css                     # canonical CSS custom properties
│   ├── tokens.json                    # machine-readable token mirror
│   ├── foundation.css                 # reset, accessibility, portable primitives
│   ├── motion-catalog.js              # 1,200 motion recipes
│   ├── sound-catalog.js               # 256 procedural audio recipes
│   ├── experience-catalog.js          # 1,024 executable experience ideas
│   └── performance.js                 # adaptive high-refresh scheduler
├── scripts/
│   └── apply-u01.mjs                  # safe cross-repository installer
└── docs/
    ├── U-01-DESIGN-SYSTEM.md          # this document
    └── 7 MB context doc.txt           # exact-size agent handoff
```

## 13. Local use

No installation is required.

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Open `http://localhost:4173` locally or the provided preview URL in Arena.

## 14. Verification performed

- JavaScript syntax checks for all runtime files.
- Catalog cardinality checks: motion = 1,200; sound = 256; experience ideas = 1,024.
- HTML parsing check and duplicate-ID check.
- CSS brace balance check.
- Portable adapter dry run and fixture install test.
- Workspace size check.
- Repository diff inspection.

A browser-based visual regression suite is not included because U-01 has no package/build stack. It should be introduced with the application stack during U-02 or U-03.

## 15. Next phase

The next agent should ask the user which task to begin:

1. **U-02 — Sidebar redesign**
2. **U-03 — Dashboard redesign**
3. **U-04 — Component library**

Recommended order is U-02, then U-03, then U-04 consolidation. Do not start any of them without user confirmation, because this request explicitly scoped the work to U-01.
