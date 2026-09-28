# 03 — UI Redesign Directions (pick one, or brief your own)

The current site is a competent but very "default YC dev-tool" look: near-black
background, single accent, monospace terminal cards, numbered steps, arrow
CTAs. Below are three distinct directions that keep every content contract from
`02-system-design-and-ia.md` intact but genuinely change the UI. Pick one as the
"entry page" (homepage) direction and it should cascade to the rest of the
site for consistency — or mix-and-match elements and describe your own in the
same format.

---

## Direction A — "Signal Room" (evolved dark, more editorial)

- **Mood:** mission control, but warmer and more human than a generic dark SaaS
  template — think a NASA ops room crossed with a well-typeset engineering blog.
- **Background:** near-black `#0B0D10` with a very subtle warm noise/grain
  texture instead of flat color.
- **Accent system:** amber/signal-orange for Drufiy-level content, shifting to
  a cool cyan for Lear and a violet for Prash — so a visitor always knows which
  product's "gravity" they're in, without changing layout.
- **Type:** a humanist sans for headings (e.g., a Söhne/General Sans-style
  grotesk) at a large, confident scale; keep a monospace (e.g., JetBrains Mono
  / Berkeley Mono style) strictly for terminal widgets, code, and numbers —
  this reinforces "we build for engineers" without making the whole site feel
  like a code editor.
- **Terminal widgets:** redesign as real "glass panel" cards with soft inner
  shadow, animated cursor blink, and a colored left-rail status dot instead of
  plain text `● connected` — keep the literal log lines unchanged.
- **Entry page (Hero) idea:** full-bleed hero with the "Most tools tell you
  something broke. Ours help explain why." line set very large, and the two
  product terminal widgets animate in as if streaming live, side-by-side,
  immediately under the fold — turning "Our products" into part of the hero
  rather than a separate scroll section.
- **Motion:** scroll-linked reveal of each numbered step, animated counters for
  stat call-outs ($62,400, 13 integrations, 15–20%).

## Direction B — "Field Notes" (light, editorial, trust-forward)

- **Mood:** the opposite bet from most AI dev-tool sites — a light,
  high-trust, almost publication-like feel (paper-white surfaces, generous
  margins, restrained color), aimed at buyers who are tired of dark "AI hacker"
  aesthetics and want something that reads as mature and safe to give
  infrastructure credentials to.
- **Background:** off-white `#FAFAF7`, ink-near-black text `#12140F`, one
  restrained accent (deep forest green or oxblood) used sparingly for links and
  the "approval" motif.
- **Type:** a serif or slab-serif for H1/H2 (signals editorial authority),
  paired with a clean grotesk for body and UI chrome, and monospace kept only
  for actual code/log content.
- **Terminal widgets:** reimagined as inset "receipt"-style panels with a
  dotted border, like a printed audit log — visually reinforces the "a log the
  agent can't edit" trust message.
- **Entry page (Hero) idea:** headline as a pull-quote in large serif type,
  the two terminal widgets rendered small and monochrome to the side like
  footnotes/evidence, with a single strong CTA. The "What we believe" 4
  principles become the visual anchor of the page (trust-first framing),
  moved up higher on the page than today.
- **Motion:** minimal — fades only; this direction is about calm confidence,
  not spectacle.

## Direction C — "Console Native" (leans further into the dev-tool identity)

- **Mood:** doubles down on "this is a tool built by engineers, for engineers"
  — closer to a real terminal/IDE than the current site, but cleaner and more
  deliberate than the current default dark theme.
- **Background:** true black `#000000` with a visible, consistent 8px grid and
  hairline borders (1px, low-opacity white) delineating every section like
  panes in a terminal multiplexer (tmux-style).
- **Accent system:** single accent, a saturated green (`#39FF88`-family)
  reminiscent of classic terminal phosphor, used only for status/positive
  states (`connected`, `verified`, `✓ checks passed`) — everything else stays
  grayscale so the accent keeps its meaning as "status," which doubles as a
  usability improvement.
- **Type:** monospace everywhere, including headings (a well-hinted mono like
  Berkeley Mono, IBM Plex Mono, or Departure Mono), sized aggressively for
  hierarchy since mono fonts need more size contrast to read as headings.
- **Terminal widgets:** become the literal layout grid of the page, not just a
  decorative card — e.g., the whole "Our products" section is laid out like a
  split-pane terminal session with Lear on the left pane and Prash on the
  right, connected by a thin "process tree" line.
- **Entry page (Hero) idea:** the hero itself boots up like a CLI ("$ drufiy
  status" → prints the tagline, then the two product statuses) using a short,
  skippable animation, then settles into the static page.
- **Motion:** typewriter/boot-sequence intro on first load (skippable, respects
  `prefers-reduced-motion`), otherwise minimal.

---

## How to brief this to the AI tool

When you fill in `05-ai-redesign-prompt.md`, name the direction (A, B, or C),
or describe your own blend, e.g.:

> "Use Direction A for the overall system, but the light-background trust
> framing from Direction B specifically for the `/trust` and `/how-it-works`
> pages on lear.drufiy.com, since those pages are about safety, not
> excitement."

You can also paste **reference links/screenshots** from other sites you like —
the guardrails in `04-core-preservation-guardrails.md` and the prompt's
constraints will keep those references from ever overwriting content, copy,
routes, or functionality, no matter how different the visual reference is.
