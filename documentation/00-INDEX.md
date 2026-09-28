# Drufiy — UI Redesign Documentation Package

**Prepared for:** Drufiy (DrufiyAI) — corporate site + product sites (Lear, Prash)
**Prepared as:** Pre-redesign audit, system design spec, and AI redesign brief
**Purpose:** Give you (and your auditor) a complete, written record of how the current
live site is built and behaves, a target system design for the redesign, a locked
list of things that must never change ("core"), and a ready-to-paste prompt you can
hand to any AI coding tool to reskin the UI without breaking anything underneath.

> Everything in this package was produced by reading the **live, public** site at
> `drufiy.com`, `lear.drufiy.com`, and `prash.drufiy.com` on **2026-09-28**. No
> private source code, credentials, or backend systems were accessed — this is a
> black-box audit of what a visitor and the auditor can independently verify.

## How to use this package

1. Read **01-current-site-audit.md** first. This is the ground truth of what
   exists today — every page, every section, every word of copy, every link,
   every form field, every integration name. This is what the auditor will
   check the redesign against.
2. Read **02-system-design-and-ia.md** for the target technical/information
   architecture — how the redesigned site should be structured so it stays a
   single coherent system across the 3 properties (`drufiy.com`, `lear.drufiy.com`,
   `prash.drufiy.com`).
3. Read **03-ui-redesign-directions.md** to pick (or brief someone to pick) a new
   visual direction for the "entry page" (homepage) and the rest of the site.
4. Read **04-core-preservation-guardrails.md** — this is the "do not touch"
   contract. It exists specifically so that an AI redesign tool changes **only**
   the visual layer and never the routes, copy meaning, legal claims, form
   fields, integrations list, links, or booking/contact flows.
5. Copy **05-ai-redesign-prompt.md** into whatever AI tool you use to regenerate
   the UI. Fill in the one bracketed section (`[[ENTRY PAGE / NEW UI DIRECTION]]`)
   with the direction you picked in step 3, or paste your own reference
   screenshots/links there.
6. Use **06-qa-acceptance-checklist.md** to verify the output before you ship it,
   and hand the same checklist to your auditor.
7. **07-auditor-cover-sheet.md** is a one-page summary you can print/attach as
   the cover of your audit submission.
8. `design-tokens.json` and `content-model.json` are machine-readable companions
   your AI tool or a developer can load directly instead of re-typing values
   from the prose documents.
9. `index.html` is a single-file, print-ready rendering of this whole package
   (open it in a browser and print to PDF) for a clean auditor hand-off.

## File map

```
documentation/
├── 00-INDEX.md                        ← you are here
├── 01-current-site-audit.md           ← full as-is inventory of drufiy.com, lear.*, prash.*
├── 02-system-design-and-ia.md         ← target architecture, sitemap, component contracts
├── 03-ui-redesign-directions.md       ← 3 creative directions for the new UI / entry page
├── 04-core-preservation-guardrails.md ← the "do not touch" list
├── 05-ai-redesign-prompt.md           ← the ready-to-paste prompt for your AI tool
├── 06-qa-acceptance-checklist.md      ← test/verification checklist (for you + auditor)
├── 07-auditor-cover-sheet.md          ← 1-page summary for the audit submission
├── design-tokens.json                 ← machine-readable design token starter set
├── content-model.json                 ← machine-readable content schema (CMS-agnostic)
└── index.html                         ← printable, single-file version of this package
```
