# Resources catalog (user's Raindrop bookmarks)

Source: the user's Raindrop collections "ui libraries" (id 75431578, 17 items) and "Tools" (id 74722747, 11 items), imported 2026-11-17 from titles and URLs only (page contents were not fetched, so descriptions are what the titles say plus well-known facts, marked where unverified). Use this as the first place to look for ready-made components, motion examples, icons and inspiration before writing UI from scratch. It is the user's own taste, so prefer these over the generic picks in `design-systems.md` section 3 when they fit.

How to use: identify the need, open the closest library, copy or adapt a component (check licence and `package.json` first), then customize radii/colors/type so it does not ship in default state (`reference/taste-anti-slop/taste.md`). Do not mix several component libraries in one tree (one design system per project).

## Component libraries (React / Tailwind / shadcn-flavored)
| Name | URL | Notes |
|---|---|---|
| shadcn/ui | https://ui.shadcn.com/ | Foundation: copy-paste components on Radix + Tailwind; CLI `npx shadcn@latest add <name>`. An MCP server (`shadcn`) is available in this environment. |
| Magic UI | https://magicui.design/ | Animated components for shadcn/Tailwind; an MCP server (`magicui`) is available here (search/list/get registry items). |
| Watermelon UI | https://ui.watermelon.sh/ | Premium components, dashboards and blocks; MCP server (`watermelon`) available here (search, get_component, compose_page, get_inspiration). |
| Skiper UI | https://skiper-ui.com/ | "Un-common" components for shadcn/ui. |
| SmoothUI | https://smoothui.dev/ | Animated React components for shadcn/ui. |
| Animate UI | https://animate-ui.com/ | Animated component set. |
| Vengeance UI | https://www.vengenceui.com/ | Animated React components. |
| unlumen UI | https://ui.unlumen.com/ | Designed React components. |
| ForgeUI | https://forgeui.in/ | React + Tailwind components, blocks, templates. |
| Forever | https://forevercomponents.com/ | Creative web assets ready to build. |
| Uiverse | https://uiverse.io/ | Largest open-source library of UI elements (buttons, toggles, loaders, cards; copy HTML/CSS or Tailwind). Good for single fancy elements. |
| Oversight Supply | https://supply.madebyoversight.com/ | Website templates and Claude video skills. |

## Animation / motion
| Name | URL | Notes |
|---|---|---|
| GSAP | https://gsap.com/ | Industry-standard animation engine (ScrollTrigger, timelines). Isolate in leaf components with cleanup; never mix with Motion in one tree (`reference/taste-anti-slop/recipes.md`). |
| Anime.js | https://animejs.com/ | Lightweight JS animation engine. |
| Subframe Motion | https://www.subframe.com/motion | Open-source React animation examples; MCP server (`subframe-motion`) available here: `search_motion_examples`, `get_motion_example`, `get_motion_guidance` (its guidance: animate only to explain origin, confirm input, show change, suggest what comes next; 100-200ms hover/press, 150-250ms tooltips/menus, 200-350ms dialogs/toasts, 300-500ms page transitions; exits about a third faster; 4-12px travel; start scale 0.95-0.98; respect reduced motion). Consistent with `reference/motion/motion.md`. |
| Motion principles reference | `reference/motion/` | Apple, Emil Kowalski, Jakub, Jhey lenses. |

## Design inspiration and DESIGN.md libraries
| Name | URL | Notes |
|---|---|---|
| GradientDeck UI | https://ui.gradientdeck.com/ | 1,270 real-site DESIGN.md files; lookup procedure in `reference/styles/styles.md` section F. |
| Curate Gallery | https://curate.gallery/ | Website design inspiration gallery. |
| open-design-agent-kit | https://github.com/feimacode/open-design-agent-kit | 270+ design skills, 150+ brand design systems, 160+ remixable examples as files in a repo. Already installed as the open-design plugin; only its critique skill was merged into this skill (`reference/workflows/open-design/critique.md`). The rest is a template/design-system library you can query through its own skills or MCP. |
| Reference products by category | `reference/styles/inspiration-references.md` | Apple, Duolingo, Linear, Pentagram, Muji, Aesop, Notion, Stripe, Framer. |

## Generators and small tools
| Name | URL | Notes |
|---|---|---|
| CSS Gradient | https://cssgradient.io/ | Gradient generator. Prefer `in oklab`/`in oklch` interpolation (`reference/color/color.md` gradients). |
| CSS Grid Generator | https://cssgridgenerator.io/ | Visual grid builder; use CSS Grid over flex math (taste.md section 3). |
| Iconsax | https://iconsax.io/ | Icon set (check licence). Note: taste.md allows Phosphor, HugeIcons, Radix, Tabler first; Iconsax is fine when the user asks or the project already uses it; keep one icon family per project. |
| TAAG (Text to ASCII Art) | https://patorjk.com/software/taag/ | ASCII banner generator. Caution: ASCII art as decoration is an AI-slop indicator (`taste.md` section 15 item 15); use only inside brutalist/terminal directions or genuine terminal products. |

## Saved but not design resources (kept for completeness, purpose from title only)
| Name | URL | Notes |
|---|---|---|
| Halation | https://ar13x3.github.io/halation/ | Purpose not verified (title only). |
| Hitodama | https://hitodama.in/ | "Give your computer a soul." Likely a desktop-companion/aesthetic tool; not verified. |
| Bible Strong Avatar Lab | https://bible-strong-avatar-lab.vercel.app/ | A user project/tool; not verified. |
| rovyl | https://github.com/HenryCauan/rovyl | Radial launcher for Windows (hold middle mouse, aim, release). Reference for radial-menu interaction (see "Contextual Radial Menu" in `reference/taste-anti-slop/recipes.md`). |
| Railway | https://railway.com/ | Hosting/cloud platform. |
| uv | https://docs.astral.sh/uv/ | Python package and project manager (use for the scripts in this skill if Python deps are ever needed). |

## Maintenance
Re-sync by listing the two Raindrop collections (ids above) with the Raindrop connector and updating the tables; add a tag/notes per item there so descriptions here can improve. Regenerate the index with `python scripts/build_index.py`.
