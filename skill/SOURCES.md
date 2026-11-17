# Sources and merge status

Originals in `~/.claude/skills/` are untouched. `data/` and `scripts/search.py|core.py|design_system.py|reasoning_contract.py` come from ui-ux-pro-max (tests and large upstream JSON dropped). `scripts/build_index.py` regenerates `reference/INDEX.md`.

Rule used: remove only duplicates; where two sources said the same thing, merge into the better wording; where they conflicted, pick one and record it in the conflicts table of the canonical file.

| Topic | Sources | Result |
|---|---|---|
| taste-anti-slop | design-taste-frontend (v2), design-taste-frontend-v1, anti-ui-slop, redesign-existing-projects, frontend-design, frontend-ui-engineering, unslop (overlaps only) | `taste.md`, `recipes.md`, `ui-engineering.md`. Conflicts: taste.md section 13. `unslop/` kept whole (unique 9-pass method; its story-video scripts not copied). |
| typography | better-typography | `typography.md` (rules + 6 detail sections). Tracking/leading caveat vs taste.md recorded in taste.md. |
| color | better-colors | `color.md`. Shared report format moved to `workflows/review-report-format.md`. |
| layout | better-layout | `layout.md` |
| accessibility | better-accessibility | `accessibility.md` |
| writing | better-writing | `writing.md` |
| motion | animate, animation-vocabulary, apple-design, design-motion-principles, emil-design-eng, find-animation-opportunities | `motion.md`, `motion-recipes.md`, `motion-review.md`, `motion-vocabulary.md` (verbatim), `apple-principles.md`; `audit-tooling/` kept. Conflicts: motion.md section 14. |
| ui-polish | better-ui (base), make-interfaces-feel-better (near-duplicate, unique parts added), interface-design | `ui-polish.md` (value conflicts table at its end), `interface-design.md` (unchanged, flattened) |
| design-systems | design-system, ui-styling, pick-ui-library, better-icons | `design-systems.md` + `tokens/` + `shadcn-tailwind/`. `canvas-design-system.md` moved to brand; slide system moved to brand. Naming conflict (`primary` vs `accent`) resolved in the file. |
| brand | brand, brandkit, design (+ design-routing, redundant, deleted), canvas part of ui-styling, slide part of design-system | `brand.md`, `brandkit.md`, `design-studio.md`, `canvas-design-system.md`, `slides-token-system.md`, `identity/`, `studio/`. Generation scripts (Gemini logo/CIP/icon, brand sync/validate) not copied. |
| styles | minimalist-ui, high-end-visual-design, industrial-brutalist-ui, gpt-taste, stitch-design-taste, gradientdeck | `styles.md` (6 directions + conflicts table). Shared anti-slop rules deduplicated into taste.md. |
| workflows | better-interface, interface-review, break, build-design, explain-interface, variant, image-to-code, imagegen-frontend-web/mobile, teardown, web-design-guidelines | One file per workflow (preserved whole, sub-files appended), `workflows.md` index, shared `review-report-format.md`. No duplicates found between them. |
| ux-rules | ui-ux-pro-max | `ux-rules.md` (rule index, CLI contract, app checklists, differences table) + `data/` + `scripts/` |

## Plugin additions (added verbatim, NOT line-merged)
| Plugin | What was copied | Where | Skipped |
|---|---|---|---|
| ui-craft 1.0.0 | skills/ui-craft SKILL + 34 references, 3 style variants, 25 commands | `<topic>/ui-craft/`, `patterns/ui-craft/`, `styles/ui-craft/`, `workflows/ui-craft/` | coverage.md, metadata.md, agents.md (tool data), cli/, evals/, per-agent copies (.gemini, .codex, ...) |
| impeccable 4.5.0 | SKILL + 30 design reference files | `<topic>/impeccable/`, `workflows/impeccable/` | hooks, live, live-setup, doctor, init, generate, visualize, document, degraded/, agents (tooling for its CLI/live server) |
| open-design 0.3.2 | critique skill | `workflows/open-design/critique.md` | main skill, remixable examples, campaign/poster/deck/publish/etc. (MCP workflows and template library, not design rules); design-critic agent deleted as 57% duplicate of critique.md |
Verbatim overlap with canonical files was low (only the critic duplicate exceeded 0.5 on a 6-word-shingle test); semantic overlap is expected to be higher and has not been merged. Each canonical file now ends with a "See also" list pointing at its matching plugin files.

## Community additions (user-supplied, from short-form design videos)
Four 20-item lists and a category-to-reference mapping were added: UX laws and animation principles -> `ux-rules/ux-laws.md` (definitions are standard summaries added by Claude); AI slop indicators and unslop quick pass -> `taste.md` sections 15-16; beautiful animations -> `motion.md` section 15 (marked confirmed/new/variant against existing values); inspiration mapping -> `styles/inspiration-references.md` and `taste.md` section 17.

## Raindrop import
`design-systems/resources-catalog.md` lists the 28 bookmarks from the user's Raindrop collections "ui libraries" (75431578) and "Tools" (74722747), from titles/URLs only. Notes mark which have MCP servers available in the environment (shadcn, magicui, watermelon, subframe-motion).

## Known limits
- Merging of layout, accessibility, writing, typography, color, workflows and ux-rules was mostly mechanical (assembled, links rewritten, shared sections deduplicated); taste, motion, ui-polish, design-systems, brand and styles were read and rewritten. No automated line-by-line diff against sources was run, so some wording may be lost.
- Sibling skills named in the sources but not installed here were left as plain mentions: ai-artist, ai-multimodal, chrome-devtools (design-studio), animate-expo, improve-animations, review-animations.
- The unslop references and audit-tooling files still contain their original internal links.

## Not yet included
canva, figma and design plugin skills, hallmark, take-one, huashu-*, rossark-motion, reanimate, state-machine, mobile-android-design, slides, Roblox GUI. Add on request.
