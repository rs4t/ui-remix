# UI REMIX

One design skill for Claude Code and other AI agents, remixed from 60+ design skills, plugins and community notes.

Instead of loading a dozen overlapping skills, UI REMIX gives the agent a small router (`SKILL.md`) and one canonical file per topic: taste and anti-slop, typography, color, layout, accessibility, motion, UI polish, UX writing, design systems, brand, styles, patterns, workflows and UX rules. Duplicated rules were merged into the better wording, conflicts were resolved and recorded, and everything else was kept. It also ships a searchable database (styles, palettes, font pairings, UX guidelines, charts, 22 stacks).

## Install

```bash
npx github:rs4t/ui-remix          # works now, straight from GitHub
npx ui-remix                      # once published to npm
```

Options: `--project` (this repo only), `--agents` (`~/.agents/skills`), `--dir <path>`, `--force`. Default target is `~/.claude/skills/ui-remix`. Restart your agent session after installing.

## Use

Just ask for UI work ("redesign this landing page", "audit this form", "pick a palette for a fintech app"). The skill routes to the right file. Search tool (Python 3, stdlib only):

```bash
python ~/.claude/skills/ui-remix/scripts/search.py "fintech dashboard" --design-system
```

## What's inside

`skill/reference/` topics: `taste-anti-slop`, `typography`, `color`, `layout`, `accessibility`, `motion`, `ui-polish`, `writing`, `design-systems`, `brand`, `styles`, `patterns`, `workflows`, `ux-rules`. `skill/SOURCES.md` records what came from where and every merge decision.

## Skills mixed into UI REMIX

**Taste and anti-slop:** design-taste-frontend (v1 and v2), anti-ui-slop, unslop, redesign-existing-projects, frontend-design, frontend-ui-engineering
**Fundamentals (better-* suite):** better-typography, better-colors, better-layout, better-accessibility, better-writing, better-ui, better-interface, better-icons
**Motion:** animate, animation-vocabulary, apple-design, design-motion-principles, emil-design-eng, find-animation-opportunities
**Polish and interface craft:** make-interfaces-feel-better, interface-design
**Design systems and libraries:** design-system, ui-styling (shadcn + Tailwind), pick-ui-library
**Brand and generation:** brand, brandkit, design (logo, CIP, banners, icons, social, slides)
**Style directions:** minimalist-ui, high-end-visual-design, industrial-brutalist-ui, gpt-taste, stitch-design-taste, gradientdeck
**Workflows:** interface-review, break, build-design, explain-interface, variant, image-to-code, imagegen-frontend-web, imagegen-frontend-mobile, teardown, web-design-guidelines
**Search database and rules:** ui-ux-pro-max
**Plugins:** ui-craft, impeccable, open-design (critique)
**Community notes:** short-form design checklists (UX laws, AI-slop indicators, unslop pass, animation tips) and a curated list of UI libraries and tools

## Credits and licences

UI REMIX is a derivative work. Each source keeps its own authorship and licence, for example unslop by Damir Sokolovsky (CC BY 4.0), the Emil Kowalski, Jakub Krehel and Jhey Tompkins motion lenses, claudekit's brand/design-system/ui-styling/design skills, and UIZZE's anti-ui-slop. See [NOTICE.md](NOTICE.md). Check the licences of the sources before redistributing.
