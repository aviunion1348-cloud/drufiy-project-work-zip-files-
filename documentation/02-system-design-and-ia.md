# 02 — Target System Design & Information Architecture

This section describes how the **redesigned** Drufiy web presence should be
structured so the three properties stay one coherent system, and so a UI
restyle can never quietly break a route, a form, or a cross-site link. This is
the spec your developer / AI tool should build against.

## 1. System overview

```
                         ┌───────────────────────────────┐
                         │        Shared Design System     │
                         │  (design-tokens.json + a shared  │
                         │   component library: Header,     │
                         │   TerminalWidget, StepList,       │
                         │   IntegrationGrid, StatBand,      │
                         │   PricingBand, LeadForm,          │
                         │   Calculator, Footer)             │
                         └───────────────┬─────────────────┘
                                          │ consumed by
             ┌────────────────────────────┼────────────────────────────┐
             │                            │                            │
   ┌─────────▼─────────┐        ┌────────▼─────────┐        ┌─────────▼─────────┐
   │   drufiy.com       │        │ lear.drufiy.com   │        │ prash.drufiy.com   │
   │  Corporate / hub    │───────▶  Product site      │        │  Product site       │
   │  1 page today        │ links │  5 pages           │        │  1 page today        │
   └─────────┬───────────┘        └────────┬──────────┘        └──────────┬──────────┘
             │                              │                              │
        Lead form  ─────▶ [backend TBD]     ├─ Cal.com booking embed       ├─ GitHub App OAuth install
                                             ├─ mailto: founders@ / general │
                                             └─ Savings calculator (client-side formula)
```

Key design decision to carry into the rebuild: **keep the 3-site split**
(`drufiy.com` as the brand/hub, `lear.` and `prash.` as dedicated product
sites). Do not collapse them into one app/one domain during a *UI* redesign —
that is an information-architecture change, not a visual one, and is out of
scope unless the client explicitly asks for it separately.

## 2. Sitemap for the redesign (must resolve to the same or better set of routes)

### `drufiy.com`
| Route | Status today | Redesign requirement |
|---|---|---|
| `/` | Live | Rebuild visually; keep all 5 sections (Hero, Products, How we build, What we believe, Contact) and their content contracts (§3). |
| `/privacy` | 404 | Not required by this UI redesign. If client supplies real legal copy, add the route using the same shared layout shell; otherwise leave as-is and flag to auditor — **do not fabricate legal text**. |
| `/terms` | 404 | Same as above. |
| `/robots.txt` | Live, content-signals policy | Copy byte-for-byte into the new build. Do not regenerate with a generic `Disallow:` file. |

### `lear.drufiy.com`
| Route | Redesign requirement |
|---|---|
| `/` | Rebuild visually; keep all 10 sections listed in audit §2.2, in the same order, with the same CTAs pointing to the same destinations. |
| `/how-it-works` | Keep the 6-step loop content and the "honest limits" block verbatim in meaning. |
| `/trust` | Keep the 5 trust pillars + deliberate limits block verbatim in meaning. |
| `/savings` | Keep the calculator's inputs, the 0.6 constant, the output formulas, and the methodology disclaimer. Only the chrome (cards, sliders' skin, typography) may change. |
| `/contact` | Keep the Cal.com embed (`drufiy-ejtkst` / `30min`) and both email addresses, exactly as published. |

### `prash.drufiy.com`
| Route | Redesign requirement |
|---|---|
| `/` | Rebuild visually; keep all 7 sections in the same order, the CI-log/diff content, the 3-agent breakdown, the 4-step flow, the stat band, and the "Install the GitHub App" CTA as a real, working link. |

## 3. Component contracts (what must stay functionally identical)

Treat each of the following as a **component with a fixed "props" contract** —
the redesign may restyle the component entirely (new colors, new shape, new
animation) but must not remove or rename the data it displays or the actions
it triggers.

| Component | Used on | Fixed contract |
|---|---|---|
| `SiteHeader` | All 3 sites | Brand mark, link(s) to the other Drufiy product(s), primary CTA. |
| `Hero` | All home pages | Eyebrow text, H1, supporting paragraph, 1–2 CTAs with their real `href`s. |
| `TerminalWidget` | drufiy.com home (×2), lear home (×2 screenshots), prash home (CI simulation) | A code/log-styled panel showing literal, specific product output (not lorem ipsum). Content is data, not layout. |
| `ProductCard` | drufiy.com home | Badge, name, description, capability tags, CTA link, embedded `TerminalWidget`. |
| `NumberedStepList` | drufiy.com ("How we build"), lear (`/`, `/how-it-works`), prash (`/`) | Ordered list, each item = number + title + description. Count of steps is content-defined (3, 5, 6, or 4 depending on page) — **do not force a uniform count across pages**. |
| `PrincipleGrid` | drufiy.com ("What we believe") | 4 cards: title + one-line description. |
| `IntegrationGrid` | lear.drufiy.com (`/`, `/how-it-works`) | Exactly the 13 named integrations; must read from a single shared list so the two pages never drift apart. |
| `StatCallout` | lear `/savings`, prash `/` | Big number + label, values computed or content-supplied, not hardcoded into markup as an image. |
| `Calculator` | lear `/savings` | Region select + 4 sliders + 2 numeric assumption fields + fixed constant (0.6) → live-recomputed outputs. This is logic, not just a component — reimplement the formula, don't just theme the old one if it's being replaced. |
| `PricingBand` | lear `/` | "15 to 20%" commercial claim, free/read-only trial condition, money-back-style guarantee line. |
| `LeadForm` | drufiy.com `/` | Fields: Name, Email, "What are you working on?" (textarea). Submit label "Send message". Preserve field order, labels, and (if known) `name`/`id` attributes used by any existing backend/analytics. |
| `BookingEmbed` | lear `/contact` | Cal.com iframe/embed pointing at `drufiy-ejtkst/30min`. |
| `ContactEmailList` | lear `/contact` | `founders@drufiy.com` (Founders & partnerships), `drufiyinnovations@gmail.com` (General inquiries). |
| `GitHubInstallCTA` | prash `/` (×2) | Real link/flow to the GitHub App install page — never a dead `<button>`. |
| `BeforeAfterDiff` | prash `/` | Two-pane failing-test vs. fixed-diff comparison; content is realistic code, not generic. |
| `SiteFooter` | All 3 sites | Cross-links between `drufiy.com`, `lear.drufiy.com`, `prash.drufiy.com`; contact email(s); (future) legal links once real Privacy/Terms exist. |

## 4. Content model (see also `content-model.json`)

Every text/number block above should be pulled from a small content object per
page rather than hand-typed into markup, so that:

1. A new UI can be swapped in by only changing components/templates, never the
   content file.
2. Anyone (including a non-technical auditor) can diff the *content* file
   before/after a redesign and see that nothing changed — only the presentation
   layer.

`content-model.json` in this package gives a starting schema:
`hero`, `products[]`, `steps[]`, `principles[]`, `integrations[]`,
`calculator`, `pricing`, `leadForm`, `contact`, `bookingEmbed`.

## 5. Design tokens (see also `design-tokens.json`)

Rather than hardcoding colors/fonts per component, define once:

- `color.background.*`, `color.surface.*`, `color.text.*`, `color.accent.*`
  (one accent per product is fine: e.g. Drufiy = neutral, Lear = one hue, Prash
  = a second hue — this is *new*, not from the current site, and is exactly the
  kind of change this redesign is for).
- `type.family.sans`, `type.family.mono` (mono is load-bearing — the terminal
  widgets are a core brand device; keep a monospace family even in a new
  direction).
- `space.*` (4/8pt spacing scale), `radius.*`, `shadow.*`, `motion.duration.*`,
  `motion.easing.*`.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536` (standard,
  adjust to your framework's defaults).

## 6. Accessibility requirements (baseline to preserve/raise, not lower)

- Keep "Skip to content" links on every page (already present on `lear.*` and
  `prash.*`; add to `drufiy.com`).
- All interactive widgets that currently render as styled `<div>`s (calculator
  sliders, region select, terminal panels) must use real form controls
  (`<input type="range">`, `<select>`, etc.) with labels, not divs styled to
  look like inputs.
- Color contrast: whatever new palette is chosen, body text must meet WCAG AA
  (4.5:1) against its background; this is a hard constraint regardless of
  visual direction.
- Every CTA must have discernible link/button text (avoid icon-only arrows with
  no `aria-label`).

## 7. Performance & SEO preservation checklist

- Keep the exact `<title>` values listed in audit §4.6 unless the client
  explicitly approves new ones (titles are indexed; changing them resets
  search history).
- Keep all existing outbound/cross-site links as absolute URLs to the live
  subdomains.
- Preserve `robots.txt` as-is.
- If migrating framework/host, set up 301s for any route that changes (none
  should change per this spec).
- Preserve image alt text equivalents for the three product screenshots
  (`dashboard.webp`, `copilot.webp`, `connect.png`) — the current alt text is
  descriptive and should be kept or improved, never removed.

## 8. What genuinely *is* in scope for "diff UI" (the fun part)

Everything visual is fair game:
- Layout system (grid vs. asymmetric, card-based vs. editorial long-form).
- Color system and theme (dark developer theme is not mandatory — see
  `03-ui-redesign-directions.md` for alternatives, including light/hybrid).
- Typography pairing, scale, and rhythm.
- Iconography and illustration style.
- Motion/microinteractions (scroll reveals, hover states, animated counters for
  the stat bands, animated terminal "typing").
- The specific look of the terminal/log widgets (as long as they keep showing
  the same literal content).
- Navigation chrome (sticky header, mega-menu, sidebar, whatever fits the new
  direction) as long as it still links to the same destinations.
- The homepage/"entry page" concept as a whole (this is explicitly what you'll
  brief in `05-ai-redesign-prompt.md`).
