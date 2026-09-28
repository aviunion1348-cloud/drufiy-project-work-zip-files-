# DrufiyAI — Precision Engineering UI

U-01 establishes the design-system foundation and cinematic entry experience for DrufiyAI.

## Run locally

No install or build step is required.

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`.

## Included in U-01

- Cinematic 3,700px sticky-scroll entry adapted to DrufiyAI
- Responsive color, typography, spacing, radius, elevation, motion, and focus tokens
- Live remote rocket-film background with accessible fallback
- Infinite keyboard-operable principle rail
- 320 deterministic motion recipes
- 128 opt-in procedural sound recipes
- W3C-style machine-readable token JSON
- Safe cross-repository foundation adapter
- Reduced-motion and forced-colors support

## Scope

This branch implements **U-01 only**. It deliberately does not implement:

- U-02 Sidebar redesign
- U-03 Dashboard redesign
- U-04 Component library

See [`docs/U-01-DESIGN-SYSTEM.md`](docs/U-01-DESIGN-SYSTEM.md) for the complete architecture and handoff.

## Portable installation

Dry run against another checkout:

```bash
node scripts/apply-u01.mjs --target /path/to/project
```

Apply the foundation:

```bash
node scripts/apply-u01.mjs --target /path/to/project --write
```

The adapter is intentionally explicit and does not alter business logic or push Git changes.
