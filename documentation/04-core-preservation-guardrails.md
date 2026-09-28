# 04 — Core Preservation Guardrails ("Do Not Touch")

This is the contract that keeps a UI redesign from causing "ruckus in core."
Anything listed here is **content, data, logic, or a live integration** — never
presentation — and must survive a redesign byte-for-byte unless the client
(Drufiy) explicitly signs off on a change in writing.

## 1. Routes & domains
- Do not rename, merge, or remove any existing route listed in
  `02-system-design-and-ia.md` §2.
- Do not change `drufiy.com`, `lear.drufiy.com`, `prash.drufiy.com` as three
  separate hostnames unless explicitly instructed — this is an architecture
  decision, not a UI one.
- Do not add a `sitemap.xml` or change `robots.txt` content — `robots.txt`
  already contains a deliberate legal "content signals" policy; copy it as-is.

## 2. Copy meaning & commercial/legal claims
- Preserve the **meaning** of every sentence flagged in
  `01-current-site-audit.md`, especially:
  - Pricing: **"15 to 20%"** of measured savings; free, read-only trial;
    "if we do not save you money, you do not pay us."
  - Safety/limits: Lear "will not autonomously change production databases or
    customer data" and "will not reroute production networking or load
    balancers."
  - Trust claims: "credentials never leave your environment," "a log the agent
    cannot edit," "nothing touches production without your yes," "five
    permission modes, default is 'ask.'"
  - Savings calculator disclosure: "These are your numbers, not our customer
    results... The model counts only recovered engineer time, conservatively,
    and ignores avoided downtime revenue."
  - Prash demo honesty framing: "Lear has diagnosed and fixed real failures on
    real AWS and GCP machines, after approval. The full recording is on its
    way."
- Light copy-editing (grammar, rhythm, length) is allowed **only** if it does
  not change the factual/commercial meaning above. When in doubt, keep the
  original sentence.
- Do not invent new numeric claims (new percentages, new customer counts, new
  "trusted by" logos, testimonials, review scores) that are not already on the
  live site. If the new design "needs" social proof, leave a clearly marked
  placeholder rather than fabricating it.

## 3. Exact strings that must not change
- **Integrations list (13, exact names, exact order not required but set must
  match):** AWS, GCP, Azure, Kubernetes, GitHub, GitLab, Datadog, Grafana,
  Terraform, PagerDuty, Snyk, Vercel, Gitleaks + secrets.
- **Emails:** `founders@drufiy.com`, `drufiyinnovations@gmail.com`.
- **Booking link:** `https://cal.com/drufiy-ejtkst/30min` (and its parent
  `https://cal.com/drufiy-ejtkst`).
- **Cross-site links:** `https://lear.drufiy.com/`, `https://prash.drufiy.com/`.
- **Page `<title>` values** listed in audit §4.6, unless the client approves
  new SEO titles.
- Numeric example in the savings calculator: `20` engineers → `$62,400`/yr,
  `624` engineer-hours, `0.6` fixed coverage factor, `$180,000` reference SRE
  salary, `2,000` hrs/yr baseline. If you re-derive the calculator UI, the
  **formula** producing these outputs must be preserved (recompute the same
  numbers from the same example inputs as a regression test — see
  `06-qa-acceptance-checklist.md`).

## 4. Forms, embeds, and third-party flows
- `drufiy.com` lead form: keep fields **Name, Email, "What are you working
  on?"** in that order, same input types, same submit label "Send message."
  If the current submit target/handler is unknown, do not silently point it at
  a new endpoint without confirming with whoever owns the backend — a restyle
  should not break lead capture.
- `lear.drufiy.com/contact`: keep the live **Cal.com embed** functional (same
  handle/event), keep both **mailto:** links with their exact labels.
- `lear.drufiy.com/savings`: this is a **calculator, not a static graphic** —
  region select + 4 sliders + 2 numeric assumption inputs + fixed 0.6 constant
  must remain live/interactive and mathematically equivalent.
- `prash.drufiy.com`: the **"Install the GitHub App"** CTA must remain a real
  link/flow into GitHub's App install/OAuth screen, in both places it appears
  (hero and closing CTA). Never mock this as a plain styled button with no
  destination.

## 5. Accessibility & technical baselines
- Do not remove "Skip to content" links; add one to `drufiy.com` if the rebuild
  doesn't already include it.
- Do not drop below WCAG AA contrast on body text, regardless of the new
  palette chosen.
- Do not convert real form controls (sliders, selects, text inputs) into
  non-semantic `<div>`s for style reasons — restyle the real controls instead.
- Do not remove descriptive alt text from the three Lear product screenshots.

## 6. Brand assets
- Keep product names exactly as branded: **Drufiy** (company/parent, also
  styled "DrufiyAI" in the homepage `<title>`), **Lear**, **Prash**. Do not
  rename, pluralize, or genericize them ("the Drufiy platform," "our AI," etc.)
  in headings that currently use the product name.
- If a new logo/wordmark is designed, it should still clearly read as
  "Drufiy" and, on the product sites, as "Lear by Drufiy" / "Prash by Drufiy"
  (the `<title>` of `prash.drufiy.com` already uses this "by Drufiy" pattern —
  consider extending it to Lear for consistency, but this is a **content
  suggestion, not a requirement**, so mark it clearly if adopted, since it is a
  discretionary copy change, not a pure restyle).

## 7. What an AI redesign tool is explicitly *allowed* to change
For clarity (so the guardrails don't get over-applied and stall the actual
redesign): colors, typography, spacing, layout/grid, component shapes, icons,
illustrations, imagery treatment, motion/animation, navigation *presentation*
(not destinations), page background treatments, card/section ordering **within
a page only if content relationships are preserved** (e.g., don't separate the
0.6 constant from the calculator it belongs to), and the overall "entry page"
concept per `03-ui-redesign-directions.md`.

## 8. Escalation rule
If following an instruction in the new UI brief would require changing
anything in sections 1–6 above, the AI tool should **stop and flag it** rather
than silently comply — e.g., "You asked me to combine Lear and Prash into one
product page; that changes the site architecture and the '15–20% savings'
pricing claim's context — confirm before I proceed."
