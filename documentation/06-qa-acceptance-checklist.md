# 06 — QA & Acceptance Checklist

Use this after the AI/dev produces the redesign, and hand the same list to
your auditor. Every row should be checked against the **live redesigned site**,
compared to `01-current-site-audit.md` (the as-is record) and
`04-core-preservation-guardrails.md` (the do-not-touch list).

## A. Routes & navigation
- [ ] `drufiy.com/` loads and contains all 5 original sections (Hero, Products,
      How we build, What we believe, Contact).
- [ ] `lear.drufiy.com/`, `/how-it-works`, `/trust`, `/savings`, `/contact` all
      resolve and contain their original sections.
- [ ] `prash.drufiy.com/` resolves and contains all 7 original sections.
- [ ] "Visit Lear →" on drufiy.com still points to `https://lear.drufiy.com/`.
- [ ] "Explore Prash →" on drufiy.com still points to `https://prash.drufiy.com/`.
- [ ] No previously-working route now 404s.
- [ ] `robots.txt` content is byte-for-byte unchanged.

## B. Copy & commercial claims
- [ ] Pricing still reads "15 to 20%" of measured savings, free read-only
      trial, "if we do not save you money, you do not pay us."
- [ ] Lear's "will not" safety limits (no autonomous prod DB/customer data
      changes, no autonomous networking/load-balancer changes) still present,
      on both `/how-it-works` and `/trust`.
- [ ] Savings-calculator disclosure paragraph ("These are your numbers, not
      our customer results...") still present, unedited in meaning.
- [ ] No new testimonials, "trusted by" logos, review scores, or customer
      counts have been invented.
- [ ] All 13 integrations still listed, spelled identically, on both
      `lear.drufiy.com/` and `/how-it-works`.

## C. Forms, embeds & flows
- [ ] drufiy.com lead form has exactly 3 fields — Name, Email, "What are you
      working on?" — in that order, with a "Send message" submit button, and
      actually submits (check network tab / success state).
- [ ] lear.drufiy.com/contact shows a working Cal.com booking embed for
      `drufiy-ejtkst/30min`.
- [ ] lear.drufiy.com/contact lists both `founders@drufiy.com` and
      `drufiyinnovations@gmail.com` as live `mailto:` links with their original
      labels.
- [ ] lear.drufiy.com/savings: moving the region select and all four sliders
      recalculates the output numbers live (not static).
- [ ] Plugging the documented example inputs (20 engineers, defaults) still
      produces ≈ $62,400/yr and ≈ 624 engineer-hours.
- [ ] prash.drufiy.com "Install the GitHub App" (both instances) links to a
      real GitHub App install/OAuth destination, not a dead button or `#`.

## D. Accessibility
- [ ] "Skip to content" link present and functional on all pages, including
      drufiy.com.
- [ ] Body text contrast ratio ≥ 4.5:1 against its background in the new
      palette (spot-check with a contrast checker).
- [ ] Calculator sliders/selects are real, labeled, keyboard-operable form
      controls (tab to them, operate with arrow keys).
- [ ] Product screenshots (dashboard, copilot, connect) retain descriptive alt
      text.
- [ ] All CTAs have real, readable link text or an `aria-label` (no bare
      icon-only arrows).

## E. Visual/UI change verification (confirming the redesign actually happened)
- [ ] New color palette/theme is visibly different from the original dark
      theme (or matches the chosen direction from `03-ui-redesign-directions.md`
      deliberately, if that direction is also dark).
- [ ] Typography has changed (new family/scale/rhythm), not just recolored.
- [ ] Layout/grid of at least the entry page (drufiy.com home) is structurally
      different from the current one-column stack (per the chosen direction).
- [ ] Terminal/log widgets still show the exact original log content
      (`root cause: failed migration`, `missing await in auth.ts:142`, etc.)
      but in new visual chrome.

## F. Cross-property consistency
- [ ] drufiy.com, lear.drufiy.com, and prash.drufiy.com feel like one design
      system (shared type/spacing/components) with distinguishable per-product
      accents, not three unrelated redesigns.
- [ ] Design tokens file (`design-tokens.json` or equivalent in the final repo)
      is the single source of truth for color/type/spacing — spot check that
      components reference it rather than one-off hardcoded values.

## G. Regression / sign-off
- [ ] A written "what changed vs. what didn't" summary exists per page (per the
      prompt's deliverable #5) and matches what you observe.
- [ ] Nothing in `04-core-preservation-guardrails.md` was flagged as violated.
- [ ] Auditor has been given: this checklist (filled in), `01-current-site-
      audit.md`, and before/after screenshots of each page.
