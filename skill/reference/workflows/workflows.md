# Workflows index

Procedures for reviewing, auditing, reproducing and visualizing interfaces. Each was a standalone skill; they are preserved whole (their sub-files appended as sections where small) because they are procedures, not overlapping rules. Severity/report table shared by audits: `review-report-format.md`. Rules they enforce live in the topic files (typography, color, layout, accessibility, ui-polish, motion, taste).

| File | Use when | Summary |
|---|---|---|
| `interface-audit.md` | interface-audit | Reviews a screen, flow or whole interface across accessibility, layout, writing, typography, color and UI polish, and returns one ranked report. |
| `interface-review.md` | interface-review | Reviews a branch, pull request or uncommitted change for the interface problems it introduced or regressed, across accessibility, layout, writing, typography, color and UI. |
| `break-test.md` | break-test | Renders a component you choose under every scenario that can reach it on a temporary page and stress tests it. |
| `build-from-design.md` | build-from-design | Builds UI from a Figma file or a design image so it matches the design, using the project's existing tokens and components. |
| `explain-interface.md` | explain-interface | Explains how a website, a visual effect or an animation was built, from a live URL or a screenshot. |
| `variants.md` | variants | Builds multiple variants of a component you're working on and helps you iterate and pick one. |
| `image-to-code.md` | image-to-code | Elite website image-to-code skill for Codex. For visually important web tasks, it must first generate the design image(s) itself, deeply analyze them, then implement the website to match them as closely as possible. In Codex, it must prefer large, readable, section-specific images instead of tiny co... |
| `imagegen-frontend-web.md` | imagegen-frontend-web | Elite frontend image-direction skill for generating premium, conversion-aware website design references. CRITICAL OUTPUT RULE — generate ONE separate horizontal image FOR EVERY section. A landing page with 8 sections produces 8 images. Never compress multiple sections into one image. Enforces compos... |
| `imagegen-frontend-mobile.md` | imagegen-frontend-mobile | Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows. Designed for iOS, Android, and cross-platform mobile products. Prioritizes clean hierarchy, comfortably readable text, strong multi-screen consistency, controlled color palettes, non-generic creative ... |
| `web-design-guidelines.md` | web-design-guidelines | Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices". |
| `teardown/teardown.md` | teardown | Creates technical illustrations of physical objects and of how things work, such as display pixels or interface layers, with coherent views, fine linework and part fills. |

Also in this folder: `review-report-format.md`.


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- ui-craft: workflows/ui-craft/ (SKILL.md, commands/, principles-catalog, heuristics, personas, craft-intent, brief, spec, finish-bar, review, inspiration, loops)
- impeccable: workflows/impeccable/ (SKILL.md, critique, audit, shape, new-work, onboard, operate, modes, routing, ios, android); workflows/open-design/critique.md
