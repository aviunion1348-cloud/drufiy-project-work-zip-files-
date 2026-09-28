# 07 — Auditor Cover Sheet

**Subject:** UI redesign planning package for Drufiy (drufiy.com,
lear.drufiy.com, prash.drufiy.com)
**Submitted as:** Sample documentation prior to executing the redesign
**Prepared:** 2026-09-28
**Method:** Black-box audit of the live public sites (no source code, backend,
or credentials were accessed). All figures, copy, links, and integration
names below were independently read off the live pages on the date above.

## What this package contains

| # | Document | Purpose |
|---|---|---|
| 1 | `01-current-site-audit.md` | Full as-is record of every page, section, sentence, number, link, form, and integration on the live site today. This is the baseline the redesign will be measured against. |
| 2 | `02-system-design-and-ia.md` | Target information architecture and component contracts for the redesign — defines what must functionally stay the same across all three properties. |
| 3 | `03-ui-redesign-directions.md` | Three concrete, distinct new visual directions to choose from for the "entry page" and overall site. |
| 4 | `04-core-preservation-guardrails.md` | The explicit "do not touch" list: routes, legal/commercial claims (e.g. the 15–20% pricing model), exact strings (emails, booking link, integrations list), and live integrations (lead form, Cal.com booking, savings calculator, GitHub App install). |
| 5 | `05-ai-redesign-prompt.md` | A single, ready-to-paste prompt (with one fill-in-the-blank section) to hand to an AI coding tool so it restyles the UI without altering the items in document 4. |
| 6 | `06-qa-acceptance-checklist.md` | Point-by-point verification checklist to confirm, after the redesign, that (a) the UI genuinely changed and (b) nothing in the core — content, numbers, links, forms, integrations — was altered. |
| — | `design-tokens.json`, `content-model.json` | Machine-readable companions summarizing the same information for direct use by developers/tools. |

## Why this approach

The live site currently combines marketing content with several pieces of
real, load-bearing logic and commitments: a lead-generation form, a live
Cal.com booking embed, two direct contact emails, a working savings
calculator with a disclosed formula, a "GitHub App install" OAuth entry
point, and specific commercial/safety claims (a 15–20% outcome-based pricing
model; explicit statements about what the product will and will not do
autonomously). A UI redesign that is not scoped carefully can easily and
silently break or misrepresent any of these. This package separates "what the
site says and does" (fixed, documented in full in §1) from "how it looks"
(open, three directions proposed in §3), and encodes that separation as an
explicit, auditable constraint set (§4) enforced through the actual prompt
used to generate the new UI (§5), with a sign-off checklist (§6).

## Known pre-existing gap (not introduced by this redesign)

`drufiy.com/privacy`, `/terms`, `/about`, and `/contact` currently return 404
on the live site — there is no published Privacy Policy or Terms of Service
on the parent domain today, despite the homepage collecting personal data via
a lead form. This is flagged here for the record; the redesign plan
explicitly instructs against fabricating legal text to fill this gap (see
`04-core-preservation-guardrails.md` §1), since that requires a real legal
decision by Drufiy, not a design decision.

## Sign-off

- [ ] Auditor has reviewed `01-current-site-audit.md` against the live site
      and confirms it is an accurate as-is record.
- [ ] Auditor has reviewed `04-core-preservation-guardrails.md` and confirms
      it captures all commercially/legally sensitive content correctly.
- [ ] Auditor approves proceeding to use `05-ai-redesign-prompt.md` to
      generate the new UI, to be verified against `06-qa-acceptance-checklist.md`
      once produced.

Prepared by: ___________________________  Date: ___________________
Reviewed by (auditor): __________________  Date: ___________________
