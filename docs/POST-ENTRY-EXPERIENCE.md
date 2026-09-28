# DrufiyAI Post-Entry Ultra-Immersive Experience

**Version:** 2.0.0

**Date:** 2026-09-28

## Overview

The primary DrufiyAI route now continues beyond the Mostar-inspired cinematic entry into a complete, multi-chapter systems experience. The implementation remains vanilla HTML, CSS, and JavaScript, but it can be installed, served, tested, and packaged through standard npm commands.

The post-entry layer is intentionally cinematic without hiding product meaning. Film, depth, cursor motion, procedural sound, canvas fields, terminal sequences, and transitions communicate system state. Core DrufiyAI product names, descriptions, principles, navigation concepts, legal identity, and copyright remain visible.

## Primary journey

1. **Cinematic threshold** — supplied layered landscape composition, 3,700px scroll choreography, pointer parallax, story panels, and infinite card rail.
2. **Reasoning field** — high-technology film backdrop, radar instrument, chapter rail, and primary positioning statement.
3. **Model deck** — full-height Lear and Prash film cards with dedicated routes.
4. **Signal theatre** — animated network canvas, selectable source signals, reasoning core, output models, and investigation terminal.
5. **How we build** — live network film, three-step method sequence, and dedicated method route.
6. **Principles vault** — orbital film, four interactive boundary tiles, and deep-linked principle route.
7. **Open channel** — rocket-launch film and functional contact UI.
8. **Design-system specimen** — U-01 token, typography, motion, and accessibility reference remains available below the public journey.

## Dedicated pages

### `lear.html`

- Live orbit-film hero.
- Protected Lear description and status.
- Runs locally, connects your stack, and acts with approval capability surfaces.
- Replayable Lear investigation terminal.
- Trust-boundary content.
- Cinematic route into Prash.

### `prash.html`

- Live digital-field hero.
- Protected Prash model history.
- CI/CD, repository-context, and verification surfaces.
- Replayable Prash repair terminal using the supplied sequence.
- Cinematic route into Lear.

### `method.html`

- Live technology-network hero.
- Complete three-step build sequence.
- Protected How We Build content.
- Route into Principles.

### `principles.html`

- Live orbital hero.
- Deep links for approval, proof, local operation, and honest boundaries.
- All four protected principle statements.
- Route into signal architecture.

### `signal-map.html`

- Live cyberspace hero.
- Interactive CI/code, cloud, observability, DrufiyAI, Lear, and Prash nodes.
- Animated SVG signal paths.
- Dynamic node detail readout.

## Live film architecture

Films are remote and are never committed into the repository. Non-hero films begin with `preload="none"`; an IntersectionObserver attaches the source only near the viewport, starts playback while relevant, and pauses playback after exit. Every film includes a remote poster. Reduced-motion mode removes decorative film playback.

Current film sources:

- Cyberspace field: `https://cdn.pixabay.com/video/2025/04/07/270341_large.mp4`
- Futuristic model deck: `https://cdn.pixabay.com/video/2020/08/30/48566-454914159_large.mp4`
- Earth orbit / Lear: `https://cdn.pixabay.com/video/2023/10/05/183651-871678756_large.mp4`
- Digital lines / Prash: `https://cdn.pixabay.com/video/2016/08/22/4760-179739327_large.mp4`
- Technology network / Method: `https://cdn.pixabay.com/video/2017/11/02/12716-241674181_large.mp4`
- Orbital Earth / Principles: `https://cdn.pixabay.com/video/2024/08/30/228835_large.mp4`
- Rocket launch / Contact: `https://cdn.pixabay.com/video/2019/05/22/23882-338327769_large.mp4`

All film surfaces have contrast scrims. Failed video requests leave complete CSS compositions rather than empty black blocks.

## Interaction systems

### Motion catalog

The U-01 runtime now exposes **1,200 deterministic recipes**:

- 10 families: reveal, drift, signal, focus, cinematic, orbit, scan, glitch, magnetic, parallax
- 8 directions: up, down, left, right, forward, backward, in, out
- 5 depths: near, mid, far, deep, orbital
- 3 tempos: instant, swift, steady

Formula: `10 × 8 × 5 × 3 = 1,200`.

Existing recipe identifiers remain compatible.

### Procedural sound

The existing **128-recipe** Web Audio catalog remains opt-in. No sound autoplays. Visitors enable sound through an explicit control, after which navigation, scan, confirmation, error, and launch cues can play.

### Canvas systems

- Starfield canvas in the post-entry threshold.
- Network canvas in the signal theatre.
- Device pixel ratio capped at 1.5 for performance.
- Animation runs only when the canvas is near the viewport and the document is visible.
- Canvas animation is disabled by reduced-motion preferences.

### Pointer systems

Desktop fine-pointer experiences include:

- Interpolated custom cursor and cursor dot.
- Magnetic controls.
- Three-dimensional card tilt.
- Pointer-position glow on principles.
- Radar and hero field parallax.

All pointer-only treatments disappear on touch/coarse pointers and under reduced motion.

## Contact development endpoint

The npm server implements `POST /api/contact` so the form can be tested end to end.

Validation:

- `name` required
- `email` required and pattern checked
- `message` required
- 32 KiB maximum JSON body

The development server does not persist personally identifiable information. A production email provider must be connected before production deployment; the UI endpoint shape can remain unchanged.

## npm workflow

```bash
npm install
npm run dev
npm test
npm run build
```

Scripts:

- `npm run dev` — dependency-free server at `0.0.0.0:4173`.
- `npm start` — same server for local production-style testing.
- `npm test` — syntax, route, anchor, catalog, package, legal-copy, and workspace checks.
- `npm run build` — creates the distributable ZIP and SHA-256 checksum.
- `npm run package` — alias for the ZIP build.
- `npm run context` — regenerates the exact 7 MiB handoff.

## Distributable ZIP

Output:

- `releases/drufiyai-ultra-immersive.zip`
- `releases/SHA256SUMS.txt`

The archive has a single `drufiyai-ultra-immersive/` root folder and includes the npm workflow. A recipient can extract it and run:

```bash
npm install
npm run dev
```

No framework or package dependency is required.

## Accessibility and performance

- Semantic page landmarks and heading structure.
- Skip links on every route.
- Visible focus states.
- Keyboard-operable signal nodes and terminals.
- Form labels and live status feedback.
- Muted decorative videos with `aria-hidden`.
- `prefers-reduced-motion` support across video, CSS animation, canvas, parallax, and route transitions.
- `forced-colors` fallbacks from the U-01 foundation.
- Lazy video source attachment and viewport pause/resume behavior.
- Passive pointer and scroll listeners.
- No local image, video, audio, or font binary payloads.

## Files introduced

```text
experience.css
post-entry.js
interior.css
interior.js
lear.html
prash.html
method.html
principles.html
signal-map.html
package.json
package-lock.json
scripts/dev-server.mjs
scripts/package-release.mjs
scripts/verify-experience.mjs
docs/POST-ENTRY-EXPERIENCE.md
releases/drufiyai-ultra-immersive.zip
releases/SHA256SUMS.txt
```
