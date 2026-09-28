# AVI Design System — U-01 (Foundation Layer)

**Status:** ✅ Complete · v1.0.0 · "Precision Engineering"
**Scope of this deliverable:** design tokens, typography, color, spacing,
motion, and primitive components ONLY. Sidebar (U-02), Dashboard (U-03),
and the full Component Library (U-04) are **separate, upcoming** work
items — see `/CONTEXT-DOC.txt` at the repo root for the full roadmap and
hand-off notes.

---

## What's in this folder

```
design-system/
├── avi-tokens.css     ← the entire design system (tokens + base + primitives)
├── showcase.html      ← living style guide — open this to see everything rendered
└── README.md          ← this file
```

There is **no build step**. `avi-tokens.css` is plain CSS custom properties
plus a handful of utility classes. Any page — the cinematic entry page,
the console dashboard, a future admin panel, or a completely different
host app after a fork — includes this one file and gets the whole system.

## How to use it

1. Add `data-avi` to your root element (`<body data-avi>` or a wrapper
   `<div data-avi>`). This scopes the base reset/typography so the design
   system never leaks into a host page's existing styles when embedded.
2. Link the stylesheet:
   ```html
   <link rel="stylesheet" href="/design-system/avi-tokens.css" />
   ```
3. Load the three type families (self-hosted or Google Fonts CDN — both
   work since font requests happen in the visitor's browser, not the
   build environment):
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
   ```
4. Consume tokens — never hard-code a hex value:
   ```css
   .my-card {
     background: var(--avi-bg-card);
     border: 1px solid var(--avi-border-default);
     border-radius: var(--avi-radius-xl);
     box-shadow: var(--avi-shadow-lg);
   }
   ```
5. Reach for the primitive classes before writing new CSS:
   `.avi-glass`, `.avi-btn--gradient`, `.avi-btn--outline`, `.avi-tag`,
   `.avi-label`, `.avi-dot`, `.avi-field` / `.avi-input` / `.avi-textarea`,
   `.avi-terminal`, `.avi-divider`, `.avi-text-gradient`, `.avi-backdrop`.

## Token categories (naming convention)

`--avi-{category}-{name}[-{variant}]`

| Category | Examples | Purpose |
|---|---|---|
| `bg` | `--avi-bg-base`, `--avi-bg-card`, `--avi-bg-sink` | Surface fills |
| `text` | `--avi-text-primary`, `--avi-text-muted` | Copy colors |
| `accent` | `--avi-accent-solid`, `--avi-accent-glow` | Brand emerald→cyan |
| `status` | `--avi-status-live`, `--avi-status-error` | State indicators |
| `term` | `--avi-term-bg`, `--avi-term-success` | Terminal/console UI |
| `border` | `--avi-border-subtle` → `--avi-border-strong` | Dividers, outlines |
| `shadow` | `--avi-shadow-md`, `--avi-shadow-glow` | Elevation & glow |
| `space` | `--avi-space-1` → `--avi-space-40` | 8px base grid |
| `radius` | `--avi-radius-md` → `--avi-radius-full` | Corner rounding |
| `dur` / `ease` | `--avi-dur-normal`, `--avi-ease-spring` | Motion timing |
| `z` | `--avi-z-nav`, `--avi-z-modal` | Stacking order |
| `font` / `text-*` | `--avi-font-serif`, `--avi-text-6xl` | Typography |

## Why this matters for the "self-redesigning on fork" requirement

Every visual value in the app is a variable that lives in **one file**.
The forthcoming `avi-adapt.js` (part of a later work item) will detect a
new host repository/brand context at runtime and rewrite the handful of
top-level tokens (`--avi-accent-start`, `--avi-brand-hue-rotate`,
`--avi-brand-name`, etc.) so the entire UI re-skins itself automatically
— without touching a single component. That's why **no component or
page may hard-code a color, spacing value, radius, or duration**: they
must all resolve through `var(--avi-...)`. This rule is the load-bearing
constraint for everything built on top of U-01.

## Accessibility & resilience built into the foundation

- WCAG AA contrast verified for all text/background token pairs.
- `prefers-reduced-motion: reduce` kills all animation/transition
  durations globally via one media query.
- `@supports not (backdrop-filter)` fallback swaps glass transparency
  for solid dark fills.
- Visible focus rings (`:focus-visible`) using the accent color.
- Scoped via `[data-avi]` so this system can be dropped into any host
  app without CSS collisions.

## Next up (not part of this delivery)

- **U-02** — Sidebar redesign (consumes these tokens)
- **U-03** — Dashboard redesign (consumes these tokens)
- **U-04** — Full component library (buttons, cards, nav, forms, etc. as
  reusable framework-agnostic partials, built strictly from `avi-tokens.css`)
- Cinematic entry page (Mostar-style scroll engine, re-skinned as a
  deep-space/sci-fi sequence) + live video backdrops + sound effects +
  animation library + fork-time self-redesign script

See `/CONTEXT-DOC.txt` for full detail, current status, and the exact
question to ask the user before starting the next item.
