# DrufiyAI — Ultra Immersive Systems Experience

A build-free cinematic, multi-page DrufiyAI experience with a precision-engineering design system, the supplied Mostar-inspired opening sequence, live high-technology film surfaces, dedicated Lear and Prash routes, and an npm-powered local test server.

## Downloadable package

A ready-to-send archive is committed at:

[`releases/drufiyai-ultra-immersive.zip`](releases/drufiyai-ultra-immersive.zip)

The archive includes the full runnable source, documentation, agent handoff, integrity manifest, and npm commands. Remote images, fonts, and films remain remote so the package stays lightweight.

## Run with npm

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:4173`.

Production-style local start:

```bash
npm start
```

Use a custom port:

```bash
npm run dev -- --port 8080
```

## Test and package

```bash
npm test
npm run build
```

`npm run build` regenerates the shareable ZIP and `releases/SHA256SUMS.txt`.

## Routes

| Route | Experience |
|---|---|
| `/` | Mostar-inspired cinematic entry plus the full post-entry systems journey |
| `/lear.html` | Lear local DevOps model experience |
| `/prash.html` | Prash CI/CD failure-analysis experience |
| `/method.html` | How DrufiyAI builds dedicated models |
| `/principles.html` | Trust and system-boundary principles |
| `/signal-map.html` | Interactive signal architecture |

## Included

- 3,700px sticky-scroll entry with pointer parallax and infinite card rail
- Seven live remote film surfaces across the primary experience
- Dedicated live-film hero treatment for every detail page
- Lazy video activation, pause/resume behavior, poster fallbacks, and reduced-motion fallbacks
- Interactive signal theatre and signal architecture
- Lear and Prash animated terminal sequences
- Luxury magnetic controls, 3D tilt surfaces, custom cursor, radar, orbit, network, and starfield systems
- Functional development contact endpoint with field and email validation; no PII persistence
- Responsive color, typography, spacing, radius, elevation, focus, and motion tokens
- **1,200 deterministic motion recipes**
- **128 opt-in procedural sound recipes**
- W3C-style machine-readable design tokens
- Safe cross-repository foundation adapter
- Exact 7 MiB agent handoff document
- Dependency-free runtime and server

## Design-system portability

Dry run against another checkout:

```bash
node scripts/apply-u01.mjs --target /path/to/project
```

Apply the portable foundation:

```bash
node scripts/apply-u01.mjs --target /path/to/project --write
```

The adapter is intentionally explicit. It does not rewrite unknown business logic or push Git changes.

## Documentation

- [`docs/POST-ENTRY-EXPERIENCE.md`](docs/POST-ENTRY-EXPERIENCE.md)
- [`docs/U-01-DESIGN-SYSTEM.md`](docs/U-01-DESIGN-SYSTEM.md)
- [`docs/7 MB context doc.txt`](docs/7%20MB%20context%20doc.txt)
