# 05 — Ready-to-Paste AI Redesign Prompt

Copy everything in the fenced block below into your AI coding tool (Cursor,
Claude, ChatGPT, Copilot Workspace, etc.), **after** attaching/uploading (or
pasting the contents of) these companion files from this package so the model
has the full ground truth:

- `01-current-site-audit.md`
- `02-system-design-and-ia.md`
- `04-core-preservation-guardrails.md`
- `design-tokens.json`
- `content-model.json`

Then fill in the one bracketed section near the bottom,
`[[ENTRY PAGE / NEW UI DIRECTION]]`, with your chosen direction from
`03-ui-redesign-directions.md` (A, B, C, a blend, or your own reference
links/screenshots).

---

```
ROLE
You are a senior front-end/design engineer redesigning the visual layer (UI)
of the Drufiy web presence: drufiy.com (corporate/hub), lear.drufiy.com
(product site, 5 pages), and prash.drufiy.com (product site, 1 page). You have
been given an audit of the current live site, a target system design, and a
locked list of things that must never change. Treat those documents as ground
truth, not as suggestions.

OBJECTIVE
Redesign the UI — layout, visual style, typography, color, iconography,
motion, component chrome, and the overall "entry page" (homepage) concept —
for all three properties, as ONE coherent new design system with per-product
accents. Do not change what the site says, what it does, where its links and
forms go, or how its interactive logic behaves. This is a reskin + rebuild of
presentation, not a rewrite of the product, copy, pricing, or business logic.

HARD CONSTRAINTS (do not violate these under any circumstance; if a
requirement below conflicts with a constraint, stop and ask instead of
guessing):

1. Keep every route listed in the system design doc. Do not add, remove, merge,
   or rename pages/URLs. Keep drufiy.com, lear.drufiy.com, and prash.drufiy.com
   as three separate properties.
2. Keep every piece of copy's MEANING intact, including all numbers: the
   "15 to 20%" pricing claim, the free/read-only-trial condition, the
   "if we do not save you money, you do not pay us" guarantee, the explicit
   list of things Lear will never do autonomously (production databases/
   customer data, production networking/load balancers), the trust claims
   ("credentials never leave your environment," "a log the agent cannot
   edit," "nothing touches production without your yes," "five permission
   modes, default is 'ask'"), and the savings-calculator disclosure
   ("These are your numbers, not our customer results... conservatively,
   ignores avoided downtime revenue"). Light copy-editing for rhythm is fine;
   changing facts, numbers, or commitments is not.
3. Keep the exact integrations list (13 items: AWS, GCP, Azure, Kubernetes,
   GitHub, GitLab, Datadog, Grafana, Terraform, PagerDuty, Snyk, Vercel,
   Gitleaks + secrets) everywhere it appears, and keep the "13" / "Thirteen"
   references in sync with that list.
4. Keep these exact strings unchanged: founders@drufiy.com,
   drufiyinnovations@gmail.com, https://cal.com/drufiy-ejtkst/30min,
   https://lear.drufiy.com/, https://prash.drufiy.com/, and the page <title>
   values from the audit doc (unless I explicitly give you new ones).
5. Keep all forms and interactive logic real and functional, not decorative:
   - The drufiy.com lead form keeps fields Name, Email, "What are you working
     on?" (textarea), in that order, submit label "Send message." Use real
     <form>/<input>/<textarea>/<button> elements with working labels and
     accessible states; do not fabricate a new backend endpoint without
     telling me — wire it to the existing handler/endpoint if you can find or
     I provide one, otherwise leave a clearly marked TODO and a working
     client-side validation state.
   - lear.drufiy.com/contact keeps a real Cal.com embed for
     drufiy-ejtkst/30min and both mailto: links with their existing labels
     ("Founders & partnerships," "General inquiries").
   - lear.drufiy.com/savings stays a REAL, live-recalculating calculator: a
     region select (US/Europe/India/Other), four inputs/sliders (team size,
     incidents per week, hours per incident, engineers pulled in), two
     editable assumption inputs (loaded engineer cost/hour, SRE salary/year),
     and a fixed 0.6 coverage constant, producing the same category of outputs
     (recovered $/year, engineer-hours back, "hire you defer" framing). Verify
     your rebuilt formula reproduces the published example: 20 engineers ≈
     $62,400/yr ≈ 624 engineer-hours, referenced against a $180,000/yr,
     2,000-hr baseline SRE.
   - prash.drufiy.com keeps "Install the GitHub App" as a real, working link/
     flow to GitHub's App install screen in both places it appears (hero and
     closing CTA) — never a dead button.
6. Do not turn real form controls into non-semantic styled <div>s. Sliders,
   selects, and text inputs must remain real, labeled, keyboard-accessible
   controls even inside heavily restyled "terminal" widgets.
7. Preserve "Skip to content" links on every page (add one to drufiy.com if
   it's missing). Meet WCAG AA contrast (4.5:1 body text) regardless of the
   new palette. Keep descriptive alt text on the Lear product screenshots
   (dashboard, copilot, connect-your-infrastructure).
8. Do not fabricate new commercial claims: no invented testimonials, no
   invented "trusted by" logos, no invented review scores or customer counts
   that don't already exist on the live site. If the new layout wants a
   social-proof slot, leave it as an explicit, clearly labeled placeholder
   instead of inventing content.
9. Do not touch drufiy.com/robots.txt content or logic.
10. If completing a request in this prompt would require breaking any of the
    above, stop and tell me exactly what the conflict is instead of silently
    resolving it.

WHAT YOU SHOULD FEEL FREE TO CHANGE (this is the actual point of the project)
Layout and grid systems, color palette and theming (including moving away
from the current dark developer-tool look if the chosen direction calls for
it), typography (pairing, scale, rhythm — but keep a monospace family
available for terminal/code/log content, since that's a core brand device
across all three sites), iconography and illustration, the visual design of
the "terminal/log" widgets (keep their literal text content, restyle
everything about their container), card and section shapes, navigation
chrome, hero/entry-page concept and structure, motion and micro-interactions,
and how the numbered step-lists / stat call-outs / integration grid /
before-after diff / pricing band are visually presented.

DELIVERABLE FORMAT
1. A short written design rationale (5–10 sentences) explaining the new
   direction and how it maps onto the existing content model.
2. Updated design tokens (colors, type, spacing, radii, motion) as a
   structured file (e.g., design-tokens.json/.css variables/Tailwind config —
   match whatever stack this codebase uses).
3. Rebuilt components/templates for every component listed in
   "02-system-design-and-ia.md" §3 (SiteHeader, Hero, TerminalWidget,
   ProductCard, NumberedStepList, PrincipleGrid, IntegrationGrid, StatCallout,
   Calculator, PricingBand, LeadForm, BookingEmbed, ContactEmailList,
   GitHubInstallCTA, BeforeAfterDiff, SiteFooter), restyled per the new
   direction, with content still sourced from the existing content model/data
   (do not hardcode copy directly into presentational markup if the codebase
   already separates content from templates — preserve that separation; if it
   doesn't exist yet, introduce a simple content file per page as part of this
   redesign so future copy edits don't require touching layout code again).
4. Rebuilt pages for every route in the sitemap (02-system-design-and-ia.md
   §2), using the new components.
5. A short "what changed vs. what didn't" summary per page, so a non-technical
   reviewer can sanity-check that only presentation changed.
6. Do NOT delete or refactor away any working backend/API code, environment
   variables, analytics snippets, or third-party embeds you find in the
   existing codebase while doing this — if you must move them to accommodate
   new markup, keep them wired up exactly the same way.

[[ENTRY PAGE / NEW UI DIRECTION]]
<<< PASTE YOUR CHOSEN DIRECTION HERE, e.g.:
"Use Direction A — 'Signal Room' — from my UI redesign directions doc, for the
overall system. Make the drufiy.com homepage the flagship 'entry page': a
full-bleed hero with the 'Most tools tell you something broke. Ours help
explain why.' line set very large, with the Lear and Prash terminal widgets
streaming in live side-by-side right under the fold. Carry the amber/cyan/
violet accent system across drufiy.com/lear.drufiy.com/prash.drufiy.com
respectively. Use Direction B's calmer, light treatment specifically for
lear.drufiy.com/trust and /how-it-works, since those pages are about safety
rather than excitement."

(Replace this whole block with your real direction, reference links, or
uploaded screenshots before running this prompt.)
>>>

Before you write any code, restate in your own words: (a) the 3 properties and
their routes, (b) the exact integrations list, (c) the exact pricing claim,
(d) the exact emails and booking link, and (e) the calculator's inputs and
constant — to confirm you've internalized the constraints. Then proceed with
the redesign.
```

---

### Tips for using this prompt well

- If your AI tool has a smaller context window, paste `04-core-preservation-
  guardrails.md` in full even if you can't fit the others — that file alone
  prevents the worst "ruckus in core" outcomes.
- Run it **once per property** if the tool struggles with all three sites at
  once (`drufiy.com` first as the flagship entry page, then `lear.drufiy.com`,
  then `prash.drufiy.com`), reusing the same design tokens output from the
  first run so all three stay visually consistent.
- After the AI produces output, run it through `06-qa-acceptance-checklist.md`
  before you consider the task done.
