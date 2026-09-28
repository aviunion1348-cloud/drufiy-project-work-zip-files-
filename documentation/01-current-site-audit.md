# 01 — Current Site Audit (As-Is)

**Audited:** 2026-09-28, live production sites, black-box (public pages only).
**Properties covered:**

| Property | Role | Status seen |
|---|---|---|
| `drufiy.com` | Corporate / parent brand site | Live, single main page + 404s on guessed routes |
| `lear.drufiy.com` | Product marketing site — "Lear" (AI on-call/DevOps agent) | Live, multi-page |
| `prash.drufiy.com` | Product marketing site — "Prash" (CI auto-fix agent) | Live, single main page |

Robots policy: `drufiy.com/robots.txt` publishes an **IETF "content-signals"** policy
(the emerging `search` / `ai-input` / `ai-train` opt-in/opt-out standard), not a
classic disallow list. **This file and its intent must be preserved as-is** in any
redesign — it is a legal/rights statement, not styling.

---

## 1. `drufiy.com` — Corporate site

### 1.1 Sitemap (observed)

- `/` — Home (only page that resolves; `/about`, `/contact`, `/privacy`, `/terms`
  all currently return the framework's default **404** page). This is a real gap —
  see §4 "Findings & risks" below. It must be flagged to the auditor, and a
  redesign **must not silently invent new legal claims** on these routes without
  the client supplying real Privacy/Terms text.
- No `sitemap.xml` (404).

### 1.2 Home page — full content & structure (top to bottom)

1. **Hero**
   - Tagline line: *"Most tools tell you something broke."* → bold pay-off:
     *"Ours help explain why."*
   - Implicit brand line (page `<title>`): **"DrufiyAI | AI systems for difficult
     operations."**
2. **"Our products" — Lear & Prash showcase** (section heading: *"Lear and Prash,
   built from the same belief."*)
   - Intro line: "We choose a hard operational problem and stay with it until the
     work becomes simpler for the people doing it."
   - **Card 1 — Lear** (badge: "Available for early access")
     - Heading: **Lear**
     - Body: "A local DevOps agent for small engineering teams. Lear reads your
       real infrastructure signals, finds what actually broke, and proposes a fix
       that waits for your approval."
     - 3 inline capability tags: **Runs** locally / **Connects** your stack /
       **Acts** with approval
     - CTA: **"Visit Lear →"** → links to `https://lear.drufiy.com/`
     - Embedded **live terminal/status widget** (decorative, product-accurate):
       ```
       lear / investigation                         ● connected
       > reading cluster and CI signals
       > correlating 4 related events
       ! root cause: failed migration
       proposed: roll back deployment
       > waiting for your approval_
       ```
   - **Card 2 — Prash** (badge: "The model that came first")
     - Heading: **Prash**
     - Body: "Prash was our first model for CI and CD failures. It taught us how
       much context a narrow problem demands, and became the foundation for Lear."
     - 2 inline capability tags: **Focus** CI failures / **Built** in real repos
     - CTA: **"Explore Prash →"** → links to `https://prash.drufiy.com/`
     - Embedded terminal widget:
       ```
       prash / run #4827                              verified
       > GitHub Actions build failed
       > tracing cause through repository
       ! missing await in auth.ts:142
       > fix PR opened for review
       ✓ checks passed after fix
       ```
3. **"How we build"** (heading: *"We go deep before we go wide."*)
   - Sub-line: "The work starts with a real pain point, not a broad category and a
     polished demo."
   - 3-step numbered list:
     1. **Find the unresolved problem** — "Talk to the people carrying the
        operational load and study the failure in context."
     2. **Build a dedicated model** — "Design the reasoning, data, and
        evaluations around one job."
     3. **Test it in real systems** — "Put it in front of the people who need it
        and learn from what happens."
4. **"What we believe"** (heading: *"Useful systems know their boundaries."*)
   - Sub-line: "Trust is designed into the way our models observe, decide, and
     act."
   - 4 principle cards (icon + title + one-line description):
     1. **Asks before it acts** — "People stay in control of consequential
        changes."
     2. **Proves every fix** — "A suggestion is not a solution until the system
        confirms it."
     3. **Runs close to the work** — "Local operation keeps sensitive context
        where it belongs."
     4. **Knows where it stops** — "When the evidence is incomplete, the model
        says so."
5. **Contact / lead-capture form** (heading: *"Working on a problem generic AI
   keeps missing?"*)
   - Sub-line: "Tell us what the system is doing, what you have tried, and where
     the usual tools stop helping."
   - Fields (in order): **Name** (text), **Email** (email), **What are you
     working on?** (long text / textarea)
   - Submit button: **"Send message"**

### 1.3 Global chrome

- No separate footer content was exposed distinctly from the contact section in
  the rendered text — treat nav/footer as **minimal**: primarily brand mark +
  the two product links (Lear, Prash) surfaced inline in the products section.
  When rebuilding, keep a persistent header with the **Drufiy wordmark** and the
  two outbound product links, since these are the only primary navigation
  affordances the current site relies on.

### 1.4 Brand & voice notes (for the redesign brief, not styling instructions)

- Short, declarative sentences. Confident, slightly terse, engineer-to-engineer
  tone ("Ours help explain why.").
- Recurring motif: **numbered process steps** (01/02/03…) used on every property.
- Recurring motif: **terminal/console readouts** used as literal product proof,
  not generic decoration — copy inside them is specific (real-looking file paths,
  line numbers, statuses like `connected`, `verified`, `waiting for your
  approval_`).
- Recurring motif: **plain-language trust claims** ("nothing touches production
  without your yes", "you don't pay us if we don't save you money").

---

## 2. `lear.drufiy.com` — Product site (multi-page)

### 2.1 Sitemap (observed, all resolving)

- `/` — Home
- `/how-it-works` — "The Loop"
- `/trust` — "On Your Infra"
- `/savings` — Savings calculator
- `/contact` — Talk to us (booking + email)

### 2.2 `/` Home — structure

1. **Hero**
   - Eyebrow: "Autonomous on-call · runs on your infra"
   - H1: *"The AI on-call engineer for teams too small to have one."*
   - Body: "Lear watches your CI, cloud, and Kubernetes from inside your own
     infrastructure. When something breaks, it finds the cause and writes the fix
     in plain English. Nothing touches production until you approve."
   - CTAs: **"See what Lear saves you →"** (`/savings`), **"Talk to us"**
     (`/contact`)
   - 3 stat/feature chips: "Runs on your infra", "Approval by default", "13
     integrations live"
   - Hero product screenshot: `screens/dashboard.webp` — *"mission-control
     dashboard showing 86% infrastructure health, 10 of 13 connectors active, and
     live telemetry across AWS, GCP, and Kubernetes."*
2. **Integrations strip** — "Works with the stack you already run": AWS, GCP,
   Azure, Kubernetes, GitHub, GitLab, Datadog, Grafana, Terraform, PagerDuty,
   Snyk, Vercel, Gitleaks + secrets. **(13 items — must stay exactly 13 and
   exactly these names; copy elsewhere on the site references "13 integrations
   live" and "Thirteen integrations, live today.")**
3. **Problem framing** — *"When production breaks at 3am, a big company pages
   its on-call rotation. You page your one exhausted engineer."* + supporting
   paragraph about AI writing more code than ever breaking more than ever.
4. **"The loop" — 5-step process** (links out to `/how-it-works`):
   01 Watches → 02 Diagnoses → 03 Proposes → 04 You approve → 05 Fixes &
   verifies. Each has a 1-line description.
5. **"See it run" — live demo section**
   - Heading: *"A real recovery, start to finish."*
   - Copy about asking Lear "what just happened", pulling live telemetry,
     reasoning about cause.
   - Disclosed status line: "Lear has diagnosed and fixed real failures on real
     AWS and GCP machines, after approval. The full recording is on its way."
     **(Keep this exact honesty framing — do not upgrade it to a stronger claim.)**
   - Screenshot: `screens/copilot.webp` — Lear Copilot answering "check what
     happened to AWS" with ap-south-1 status + EC2 inventory.
6. **"On your infra" section** (links to `/trust`)
   - Heading: *"It runs on your infrastructure. Not ours."*
   - Copy: "Connect any of thirteen integrations with your own credentials...
     Your credentials never leave your environment. Every action is proposed,
     approved, and written to a log the agent cannot edit."
   - Screenshot: `screens/connect.png` — "Connect Your Infrastructure" screen.
7. **Positioning section** — *"Everyone else built this for enterprises. We built
   it for you."* — differentiation paragraph re: small teams without a
   dedicated SRE.
8. **Savings teaser** — heading *"Find out what firefighting is costing your
   team."*, sub-copy "Move a few sliders. See your number. It is your math, not
   our marketing.", CTA **"Open the calculator →"** (`/savings`), example stat:
   "$62,400 / year ≈ 624 engineer-hours pulled back from firefighting."
9. **Pricing section**
   - Heading: *"You only pay a slice of what we save you."*
   - Copy: "Start with a free, read-only trial. When you are ready, Lear earns
     the right to act. Pricing is **15 to 20%** of the savings we measure
     together. If we do not save you money, you do not pay us."
     **(These numbers — 15–20% — are a real commercial claim. Treat as legally
     load-bearing text: do not let an AI redesign tool paraphrase/round it.)**
10. **Closing CTA band** — *"See what Lear could save your team."* → **"Open the
    calculator →"** / **"Talk to us"**.

### 2.3 `/how-it-works` — "The Loop"

- Eyebrow "The loop", H1 *"One agent. It watches, reasons, asks, then fixes."*
- Intro: differentiates Lear from a chatbot/script — "runs unattended... only
  comes to you when a decision is genuinely yours."
- **6-step loop** (note: home page teaser shows 5 steps, this page shows the
  canonical 6): 01 Read, 02 Diagnose, 03 Propose, 04 Approve, 05 Execute, 06
  Verify — each with a longer description than the homepage teaser.
- "Proactive, with full context. Not reactive, with a prompt." explainer block.
- "It remembers what worked." — replay of known-good fixes for repeat incidents.
- "Trust is earned one approved fix at a time." — explains the **permission
  ladder**: read-only → approval-gated → full autonomy (opt-in, never default).
- **Honest limits block** — "What Lear will not do on its own": will not
  autonomously change production databases/customer data; will not reroute
  production networking/load balancers. **(This is a safety/liability claim —
  must be preserved verbatim in meaning.)**
- Integrations list repeated (same 13).
- CTA: "See what Lear saves you →" (`/savings`).

### 2.4 `/trust` — "On Your Infra"

- Eyebrow "On your infra", H1 *"Lear runs on your infrastructure, not ours."*
- Sub: "The whole product is built so you never have to hand your production
  over to a stranger."
- **5 numbered trust pillars:**
  1. Your infra, your credentials
  2. Approval by default — "Five permission modes, and the default is 'ask.'"
  3. A log the agent can't edit — append-only audit trail
  4. Dry-run anything
  5. A circuit breaker — self-stop on anomalous loops
- **Deliberate limits block** — same "no autonomous prod DB / no network or LB
  changes" claim repeated. **(Keep consistent with `/how-it-works`.)**
- CTA: "See what Lear saves you →" (`/savings`).

### 2.5 `/savings` — Savings calculator (interactive)

- Eyebrow "What you'll save", H1 *"See what Lear saves your team."*
- Intro paragraph re: small teams absorbing outage cost personally.
- **Headline computed example:** "Lear could save your 20-engineer team roughly
  **$62,400** a year." + "Lear costs 15–20% of what it saves you. You keep the
  rest."
- **Interactive inputs (must remain functionally identical — this is the core
  logic of the page):**
  - Region selector: **US / Europe / India / Other**
  - Team size slider (example default: 20)
  - Production incidents per week slider (example default: 5)
  - Hours to resolve one incident today slider (example default: 2 hrs)
  - Engineers pulled into each incident slider (example default: 2)
  - "Assumptions (edit these)" — advanced/editable inputs:
    - Loaded engineer cost / hour ($)
    - Dedicated SRE salary / year ($)
  - Disclosed fixed constant: "Conservative coverage factor fixed at 0.6: the
    model assumes Lear meaningfully reduces effort on ~60% of routine
    incidents, not 100%."
- **Outputs:**
  - "Firefighting recovered / year" — computed $ figure
  - "N engineer-hours back"
  - "The hire you defer" explainer: "624 hrs is 31% of a full-time SRE (2,000
    hrs/yr), worth about $X against a $180,000 salary." (numbers scale with
    inputs)
  - Expandable "+ see the math" section
- **Methodology disclosure (important, must be preserved verbatim in meaning):**
  "These are your numbers, not our customer results. We're pre-launch and
  showing the math in the open so you can check it. The model counts only
  recovered engineer time, conservatively, and ignores avoided downtime
  revenue."
- CTA: "Want us to run this against a real incident of yours? talk to us and
  we'll show you live." → `/contact`. Plus a repeated "Talk to us" button.

### 2.6 `/contact` — "Talk to us"

- H1 *"Let's talk."*
- Copy: "Want to see Lear running on your own infrastructure, or just have a
  question? Book a 30-minute call with a founder, or email us directly."
- **Embedded scheduling widget: Cal.com**, booking link
  `https://cal.com/drufiy-ejtkst/30min` (org handle **`drufiy-ejtkst`**, 30-minute
  event type). Shows calendar (Sept/Oct 2026 in the crawl) and time slots.
  **This exact booking link/handle must be preserved — it is a live scheduling
  integration, not a decorative image.**
- **Direct emails published (must be preserved exactly, character-for-character):**
  - Founders & partnerships: **`founders@drufiy.com`**
  - General inquiries: **`drufiyinnovations@gmail.com`**

---

## 3. `prash.drufiy.com` — Product site (single page)

### 3.1 Sitemap (observed)

- `/` — Home (single long-scroll page with anchored sections; no other routes
  were discovered).

### 3.2 Home — structure

1. **Hero**
   - Eyebrow: "Early access · onboarding design partners"
   - H1: *"CI that fixes itself."*
   - Body: "Prash watches your GitHub Actions, diagnoses failures, and ships a
     verified PR automatically."
   - CTAs: **"Install the GitHub App"** (primary — this is a real OAuth/GitHub
     App install action, must remain a functional link/flow, not just styled
     text), **"Watch 60s demo →"**
2. **Live-looking CI run simulation widget** (decorative but product-accurate):
   - Repo label `Aradhya648/Iris`, "3 minutes ago"
   - Status pipeline: **Detected → Diagnosing → Fix Ready → Applying →
     Verified**
   - CI log panel with a real-looking stack trace:
     `Error: Cannot read property 'status' of undefined at handleWebhook
     (src/api.ts:45)`
   - "AI Analysis" live-typing panel ("Prash is analyzing...")
3. **"Before / After" section** — heading *"See the difference"*
   - **Failed CI panel:** `$ npm run test`, failing Jest output
     (`src/__tests__/api.spec.ts`, `should handle webhook_pending`,
     `TypeError: Cannot read property 'status' of undefined`).
   - **Prash Fix panel:** a realistic unified diff fixing `handleWebhook`,
     ending "✓ All checks passed · Ready to merge".
4. **"Three specialized agents" section**
   1. **Failure Diagnosis** — "Analyzes CI logs and pinpoints root causes
      automatically within seconds of a failure." (trigger: On CI failure)
   2. **Automated Fixes** — "Generates validated fixes and opens a
      ready-to-merge pull request automatically." (trigger: Automatic) + a
      second example diff.
   3. **PR Verification** — "Runs the full CI pipeline on every fix before
      marking it verified and complete." (trigger: On every run)
5. **"From failure to fix in four steps"**
   - Includes a GitHub OAuth setup mini-transcript: `$ authorize GitHub App`
     → `✓ workflows: read` / `✓ pull-requests: write` / `✓ checks: write`.
   - 4 numbered steps: **01 Connect your repo** (Install via GitHub App in 30
     seconds), **02 Detect & diagnose**, **03 Fix & create PR**, **04 Verify &
     ship**.
6. **"Why Prash" stat band** — "Built for the 2am CI failure":
   - `~0s` Sub-5 minute diagnosis
   - `0%`→ "Automated fixes that work" (verified through full CI pipeline)
   - `0` Zero config overhead
7. **Closing CTA** — *"Stop debugging CI"*, "Free during early access. No credit
   card.", button **"Install the GitHub App"**.

---

## 4. Cross-cutting technical/content observations

### 4.1 Shared design system across all 3 properties
- All three sites share the **same visual language**: dark, developer-tool
  aesthetic; monospace "terminal window" widgets used as literal product
  screenshots/simulations; numbered (`01 02 03…`) step sequences; short eyebrow
  labels above every H1; arrow-suffixed link CTAs (`→`); stat/metric call-outs
  reduced to a single bold number.
- This shared language is why the redesign should ship as **one design system
  with per-product accents**, not three unrelated skins (see `02-system-design`).

### 4.2 Forms & integrations inventory (functional — do not break)

| Surface | Type | Fields / Action | Notes |
|---|---|---|---|
| `drufiy.com` home | Lead form | Name, Email, "What are you working on?" (textarea), Send message | Destination endpoint unknown (backend not exposed to black-box audit) — **preserve field names, order, and required-ness**; ask the client/dev team for the real submit handler before wiring a new UI to it. |
| `lear.drufiy.com/contact` | Scheduling | Cal.com embed, handle `drufiy-ejtkst`, `/30min` event | Live third-party embed — keep the exact booking link. |
| `lear.drufiy.com/contact` | Static contact | `mailto:founders@drufiy.com`, `mailto:drufiyinnovations@gmail.com` | Preserve exact addresses and their labels ("Founders & partnerships" vs "General inquiries"). |
| `lear.drufiy.com/savings` | Interactive calculator | Region select (US/Europe/India/Other), 4 sliders, 2 editable assumption inputs, fixed 0.6 coverage constant | This is a **calculation engine**, not decoration — the formula/behavior must be re-implemented identically, only the visual chrome should change. |
| `prash.drufiy.com` | External auth flow | "Install the GitHub App" (GitHub App OAuth install) | Must remain a real link/flow to GitHub's install screen — never replace with a fake button. |
| `drufiy.com` → `lear.drufiy.com` / `prash.drufiy.com` | Cross-site nav | "Visit Lear →", "Explore Prash →" | Absolute links to the live subdomains — must not be turned into anchors/relative paths. |

### 4.3 Integrations list (exact, 13 items — appears on `lear.drufiy.com` home and `/how-it-works`)
AWS, GCP, Azure, Kubernetes, GitHub, GitLab, Datadog, Grafana, Terraform,
PagerDuty, Snyk, Vercel, **Gitleaks + secrets**.

### 4.4 Numeric/commercial claims that must not drift in a redesign
- "13 integrations live" / "Thirteen integrations, live today." → tied to the
  list above; if the list ever changes, this number must be updated everywhere
  it appears, in lockstep.
- Pricing: **"15 to 20%"** of measured savings, free read-only trial.
- Example savings model: 20 engineers → **$62,400/yr**, **624 engineer-hours**,
  **0.6** fixed coverage factor, **$180,000** reference SRE salary, **2,000**
  hrs/yr full-time baseline.
- "5 permission modes", default is "ask".
- Prash: "sub-5 minute diagnosis" framing (shown as "~0s" stat placeholder on
  the live site — likely an unanimated counter — treat the **destination**
  values/labels as content, not the animation technique).

### 4.5 Legal / compliance status (flag to auditor)
- `drufiy.com/privacy`, `drufiy.com/terms`, `drufiy.com/about`, `drufiy.com/contact`
  all currently 404. There is **no visible privacy policy or terms of service**
  on the parent domain at the time of this audit, despite the site collecting
  personal data via a lead form. **This is a pre-existing gap, not something
  introduced by the redesign** — call it out explicitly to the auditor and to
  Drufiy, and do not let an AI tool invent legal text to fill the gap; that
  needs a human/legal decision.
- `robots.txt` on `drufiy.com` publishes a formal **content-signals** opt-out
  policy for search / ai-input / ai-train — preserve this file exactly.

### 4.6 SEO metadata observed
- `drufiy.com` `<title>`: **"DrufiyAI | AI systems for difficult operations"**
- `lear.drufiy.com` `<title>`: **"Lear | The AI on-call engineer for small teams"**
- `lear.drufiy.com/how-it-works` `<title>`: **"The Loop | How Lear works"**
- `lear.drufiy.com/trust` `<title>`: **"On Your Infra | Trust & control"**
- `lear.drufiy.com/savings` `<title>`: **"What You'll Save | Lear savings calculator"**
- `lear.drufiy.com/contact` `<title>`: **"Talk to us | Lear"**
- `prash.drufiy.com` `<title>`: **"Prash by Drufiy - CI that fixes itself"**
- All pages expose a "Skip to content" / "Skip to main content" link before the
  main landmark — an accessibility affordance already in place on `lear.*` and
  `prash.*`. **Keep this pattern; extend it to `drufiy.com` if missing.**

---

## 5. Summary judgement (what a redesign is really touching)

The current build is a clean, intentional **dark developer-tool marketing
system**: three coordinated sites, one visual grammar, a handful of real
interactive surfaces (lead form, savings calculator, Cal.com booking, GitHub
App install), and copy that doubles as legal/commercial commitment (pricing
percentages, safety guarantees, integration counts). A redesign should treat
**all copy, all numbers, all links, all field names, and all third-party
integrations as fixed data**, and treat **only** layout, color, type,
imagery, motion, and component chrome as changeable. Sections 2–4 of this
package operationalize exactly that split.
