# Design systems, tokens, component libraries, icons (canonical)

Merged from design-system, ui-styling, pick-ui-library, better-icons. Detail files: `tokens/` (7 files: architecture, primitive/semantic/component tokens, component specs, states and variants, Tailwind integration) and `shadcn-tailwind/` (6 files: components, theming, accessibility, utilities, responsive, customization). The canvas/visual-poster philosophy that shipped inside ui-styling moved to `reference/brand/canvas-design-system.md`; the token-driven slide system moved to `reference/brand/slides-token-system.md`.

Related: color ramps and token naming `reference/color/color.md`; taste-level stack defaults and "one design system per project" `reference/taste-anti-slop/taste.md` section 2-3; official-system install map `reference/taste-anti-slop/recipes.md` section 1.

## 1. Token architecture (three layers)

```
Primitive (raw values)  ->  Semantic (purpose aliases)  ->  Component (component-specific)
--color-blue-600:#2563EB    --color-accent-solid: var(--color-blue-600)   --button-bg: var(--color-accent-solid)
```
- Never use raw hex or magic numbers in components; always reference tokens. The semantic layer enables theme switching (light/dark, white-label, increased contrast). Component tokens are for genuine, documented divergence only (one is an exception; twenty means the semantic tier lacks roles).
- Document every token's purpose. Use HSL/OKLCH channel formats when you need alpha control (`hsl(var(--primary) / .5)`).
- Component spec pattern (Property x Default/Hover/Active/Disabled): background primary / primary-dark / primary-darker / muted; text white / white / white / muted-fg; border none / none / none / muted-border; shadow sm / md / none / none. Full specs and states in `tokens/component-specs.md` and `tokens/states-and-variants.md`.
- Optional scripts from the source (not copied): `generate-tokens.cjs --config tokens.json -o tokens.css`, `validate-tokens.cjs --dir src/` (flags hardcoded values), starter `design-tokens-starter.json`.

### Naming conflict resolved
design-system and shadcn use `--primary`, `--background`, `--foreground`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius` (HSL channel triplets). `reference/color/color.md` forbids using `primary` for the brand because `--color-text-primary` collides, and prefers `accent`. Resolution: in a shadcn project keep shadcn's names (they are the library's API and its components read them); in a new bespoke system use color.md's role grammar (`--color-{bg|text|border}-{variant}`, `--color-accent-solid`, `--color-danger-subtle`). Either way keep exactly two tiers in components (semantic only) and never reference primitives directly.

## 2. Stack: shadcn/ui + Tailwind (ui-styling)

- shadcn/ui = accessible Radix primitives, copy-paste distribution (components live in your codebase), TypeScript-first, CLI: `npx shadcn@latest init`, `npx shadcn@latest add button card dialog form`. Tailwind = utility-first, build-time, mobile-first, tokens for color/spacing/type, dead-code elimination. Tailwind-only on Vite: `npm i -D tailwindcss @tailwindcss/vite`, plugin in `vite.config.ts`, `@import "tailwindcss";`.
- Never ship shadcn in default state (customize radii, colors, shadows, type; see taste.md).
- Catalog and patterns: `shadcn-tailwind/shadcn-components.md` (forms, layout/nav, overlays, feedback, display), `shadcn-theming.md` (next-themes dark mode, CSS variables, palettes, variants), `shadcn-accessibility.md` (Radix a11y, keyboard, focus, announcements, form validation), `tailwind-utilities.md`, `tailwind-responsive.md` (mobile-first, breakpoints, container queries, max-width queries, custom breakpoints), `tailwind-customization.md` (`@theme`, custom utilities/variants, `@layer`, `@apply`). Optional scripts (not copied): `shadcn_add.py`, `tailwind_config_gen.py`.
- Form with validation: `react-hook-form` + `zodResolver` + shadcn `Form/FormField/FormItem/FormLabel/FormControl/FormMessage`, `className="space-y-6"`, full-width submit.
- Practices: compose from primitives; utility-first (extract components only for real repetition); mobile-first; accessibility-first (Radix, focus states, semantic HTML); consistent spacing/color/type tokens; apply `dark:` to every themed element; avoid dynamic class names (purging); full TypeScript types.
- Caveat on the example in the source: it used `min-h-screen`; per taste.md use `min-h-[100dvh]` for full-height sections.

## 3. Picking a library (curated, opinionated; recommend one, do not present menus)
Procedure: identify the TASK (not the library named); check `package.json` first and reuse an installed library (flag a competitor, do not churn dependencies unasked); recommend one library with a one-sentence reason; if the task is not covered say so.

| Task | Library |
|---|---|
| Unstyled accessible primitives (dialogs, popovers, menus, selects) | base-ui |
| Command menu (cmd-K) | cmdk |
| Toasts | Sonner |
| OTP / verification inputs | input-otp |
| Control panels / GUIs | Leva (alt: dialkit) |
| General animation (springs, layout, enter/exit) | motion (plain CSS for simple hover/fade) |
| Animated numbers | NumberFlow |
| Animated text | torph |
| 3D globes | Cobe |
| Dynamic OG images | Satori |
| Syntax highlighting | shiki |
| Real-time streaming charts | Liveline |
| General charts | recharts |
| Drag and drop | dnd kit |
| Virtualization | Virtuoso |
| State | zustand |
| Conditional classNames | clsx |
| Variant-driven Tailwind styling | cva (clsx for ad-hoc) |
| Theme switching without flash | next-themes |

Catch these mismatches: hand-built toasts (Sonner); `<div>` dropdown/dialog with manual focus (base-ui); animating a number by re-rendering text (NumberFlow); rendering 1,000+ rows directly (Virtuoso); prop-web shared state (zustand); deep className ternaries (clsx/cva). Chart design rules: `reference/ux-rules/` chart data and the dataviz skill.

## 4. Icons
- Library priority and bans (Phosphor, HugeIcons, Radix, Tabler first; Lucide only if already used; never hand-rolled SVG paths; one family and one stroke weight per surface) are in taste.md section 3. Stroke/size/state/RTL details: `reference/ui-polish/ui-polish.md` (Icons).
- Finding and fetching icons (better-icons, Iconify, 200+ libraries): `npm i -g better-icons` (or `npx`/`bunx`), then
```bash
better-icons search <query> [--prefix <p>] [--limit <n>] [--json]
better-icons search <query> -d [dir] [--color <c>] [--size <px>]     # download all matches as SVG
better-icons get <prefix:name> [--color <c>] [--size <px>] [--json] > icon.svg
better-icons setup [-a cursor,claude-code] [-s global|project]       # MCP server for agents
```
IDs are `prefix:name` (`ph:house`, `tabler:home`, `lucide:home`). Popular prefixes: `lucide`, `mdi`, `heroicons`, `tabler`, `ph`, `ri`, `solar`, `iconamoon`. MCP tools: `search_icons`, `get_icon`, `get_icons` (max 20), `list_collections`, `recommend_icons` (use case + solid/outline/any), `find_similar_icons`, `sync_icon` (framework react/vue/svelte/solid/svg), `scan_project_icons`. API: `https://api.iconify.design`. Prefer `ph:` or `tabler:` here to stay inside taste.md's allowed set; set color to `currentColor` for state-driven recoloring.


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- ui-craft: design-systems/ui-craft/tokens.md, stack.md, modern-css.md


## 5. User bookmarks
Ready-made component and animation libraries the user saved (Magic UI, Watermelon, Skiper, SmoothUI, Animate UI, Uiverse, GSAP, Anime.js, Subframe Motion, etc.) are catalogued in `resources-catalog.md`. Check there before picking from the generic list in section 3.
