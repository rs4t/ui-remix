# Taste recipes: code, catalogs and system map

Companion to `taste.md`. Merged from design-taste-frontend (v2 sections 2, 5, 10, 12 and appendices), design-taste-frontend-v1 (sections 8-9), and redesign-existing-projects (upgrade techniques).

## 1. Brief to design system map

| Brief reads as | Use | Notes |
|---|---|---|
| Microsoft / enterprise SaaS / dashboards | `@fluentui/react-components` or `@fluentui/web-components` | Official Fluent tokens |
| Google-ish / Material product | `@material/web` + Material 3 tokens | Theme via Material Theming |
| IBM-style B2B analytics | `@carbon/react` + `@carbon/styles` | Mature data-density patterns |
| Shopify app surfaces | Polaris web components / Polaris React | Required for Shopify admin UI |
| Atlassian / Jira-style | `@atlaskit/*` + `@atlaskit/tokens` | |
| GitHub-style devtool | `@primer/css` or `@primer/react-brand` | Brand variant for marketing |
| UK public service | `govuk-frontend` | Regulatorily expected |
| US public sector | `uswds` | Same |
| Fast local-business / agency MVP | Bootstrap 5.3 | Boring, works |
| Accessible React foundation | `@radix-ui/themes` | Primitives + theme |
| SaaS where you own the components | shadcn/ui | Never ship default state |
| Tailwind SaaS / AI marketing | Tailwind v4 + `dark:` | Indie default |

Honesty rule: use the official package; do not rebuild its CSS; do not import tokens then override most of them. One system per project.

Aesthetics with no official package: glassmorphism (`backdrop-filter`, layered borders, highlight overlays, solid fallback for `prefers-reduced-transparency`), bento (CSS Grid, mixed cells), brutalism (native CSS, mono, raw borders), editorial (serif, asymmetric grid, whitespace), dark tech (mono + accent, terminal motifs), aurora/mesh (SVG or layered radial gradients), kinetic type (CSS animations, scroll-driven animations, GSAP for hijacks).

### Install commands
```bash
npm install @material/web                                  # Material Web
npm install @fluentui/react-components                     # Fluent v9
npm install @fluentui/web-components @fluentui/tokens      # Fluent framework-free
npm install @carbon/react @carbon/styles                   # Carbon
npm install @radix-ui/themes                               # Radix Themes
npx shadcn@latest init && npx shadcn@latest add button card badge separator input
npm install --save @primer/css                             # Primer product UI
npm install @primer/react-brand                            # Primer marketing UI
npm install govuk-frontend
npm install uswds
yarn add @atlaskit/css-reset @atlaskit/tokens @atlaskit/button @atlaskit/badge @atlaskit/section-message @atlaskit/card
npm install bootstrap
# Shopify Polaris (Shopify apps only), in the HTML head:
#   <meta name="shopify-api-key" content="%SHOPIFY_API_KEY%" />
#   <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
```

### Canonical docs (read before reinventing)
Material Web: github.com/material-components/material-web, material-web.dev/theming/material-theming, m3.material.io/develop/web. Fluent: fluent2.microsoft.design/get-started/develop, github.com/microsoft/fluentui. Carbon: carbondesignsystem.com, github.com/carbon-design-system/carbon. Polaris: shopify.dev/docs/api/app-home/web-components, polaris-react.shopify.com/components. Atlassian: atlassian.design/get-started/develop, atlassian.design/tokens/design-tokens. Primer: primer.style, github.com/primer/css, github.com/primer/brand. GOV.UK: design-system.service.gov.uk. USWDS: designsystem.digital.gov. Bootstrap: getbootstrap.com/docs/5.3. Tailwind: tailwindcss.com/docs/dark-mode, tailwindcss.com/blog/tailwindcss-v4. Radix: radix-ui.com/themes/docs. shadcn: ui.shadcn.com/docs. MDN: backdrop-filter, prefers-color-scheme, prefers-reduced-motion, CSS Grid, scroll-driven animations; drafts.csswg.org/scroll-animations-1. Apple Liquid Glass (Apple platforms only): developer.apple.com/design/human-interface-guidelines/materials, developer.apple.com/documentation/TechnologyOverviews/liquid-glass.

## 2. GSAP and Motion skeletons

Use GSAP only for real pin/scrub work (isolated leaf, cleanup via `gsap.context().revert()`). Use Motion `whileInView` for simple reveals. Common failure for both pinned patterns: wrong `start`. Always `start: "top top"`.

### Sticky stack
```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(".stack-card");
      els.forEach((card, i) => {
        if (i === els.length - 1) return;
        ScrollTrigger.create({ trigger: card, start: "top top", endTrigger: els[els.length - 1], end: "top top", pin: true, pinSpacing: false });
        gsap.to(card, { scale: 0.92, opacity: 0.55, ease: "none",
          scrollTrigger: { trigger: els[i + 1], start: "top bottom", end: "top top", scrub: true } });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);
  return (
    <div ref={ref} className="relative">
      {cards.map((c, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center">{c}</div>
      ))}
    </div>
  );
}
```
Every card except the last is pinned; the shrink/fade of the previous card is driven by the NEXT card's trigger.

### Horizontal pan
```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, { x: -distance, ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top top", end: () => `+=${distance}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);
  return (
    <section ref={wrap} className="relative overflow-hidden">
      <div ref={track} className="flex h-[100dvh] items-center">{children}</div>
    </section>
  );
}
```
Pin the wrapper, scrub the inner track, scroll length equals horizontal travel.

### Scroll-reveal stagger (lighter alternative, no GSAP)
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
export function RevealStagger({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-6">
      {items.map((item, i) => (
        <motion.li key={item}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}>{item}</motion.li>
      ))}
    </ul>
  );
}
```
Library choice: Motion for UI/bento/state change; GSAP + ScrollTrigger for full-page scrolltelling and hijacks; Three.js/WebGL for canvas backgrounds. Isolate GSAP/Three in leaf components with cleanup. Never mix with Motion in one tree.

### Magnetic hover (outside React render)
Use `useMotionValue` + `useTransform` (or `useSpring`) from Motion. Never `useState` for pointer coordinates.

## 3. Glass and materials

Honest Apple Liquid Glass approximation (label it as an approximation in comments):
```css
.liquid-glass-web-approx{position:relative;isolation:isolate;overflow:hidden;border-radius:999px;
  border:1px solid rgb(255 255 255/.32);
  background:linear-gradient(135deg,rgb(255 255 255/.30),rgb(255 255 255/.08)),rgb(255 255 255/.12);
  backdrop-filter:blur(24px) saturate(180%) contrast(1.05);-webkit-backdrop-filter:blur(24px) saturate(180%) contrast(1.05);
  box-shadow:inset 0 1px 0 rgb(255 255 255/.48),inset 0 -1px 0 rgb(255 255 255/.12),0 18px 60px rgb(0 0 0/.18)}
.liquid-glass-web-approx::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;
  background:radial-gradient(circle at 20% 0%,rgb(255 255 255/.55),transparent 34%),linear-gradient(90deg,rgb(255 255 255/.18),transparent 42%,rgb(255 255 255/.14))}
.liquid-glass-web-approx::after{content:"";position:absolute;inset:1px;border-radius:inherit;border:1px solid rgb(255 255 255/.14);pointer-events:none}
@media (prefers-color-scheme:dark){.liquid-glass-web-approx{border-color:rgb(255 255 255/.18);
  background:linear-gradient(135deg,rgb(255 255 255/.16),rgb(255 255 255/.04)),rgb(15 23 42/.42);
  box-shadow:inset 0 1px 0 rgb(255 255 255/.22),0 18px 60px rgb(0 0 0/.42)}}
@media (prefers-reduced-transparency:reduce){.liquid-glass-web-approx{background:rgb(255 255 255/.96);backdrop-filter:none;-webkit-backdrop-filter:none}}
```
Quick glass: `backdrop-blur` + `border-white/10` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`. `prefers-reduced-transparency` support is uneven, so keep contrast without the blur. Glass suits premium consumer, Apple-adjacent, luxury, media overlays; not dashboards, public sector or plain B2B.

Other surface upgrades: spotlight borders (border lights up under cursor), fixed grain/noise overlay (`fixed inset-0 z-[60] pointer-events-none`), tinted shadows carrying the background hue, diffusion shadow (`shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`).

## 4. Pattern vocabulary (name them, reach for them when the design read calls)

Hero: Asymmetric Split, Editorial Manifesto, Video/Media Mask (type as mask over video), Kinetic-Type, Curtain-Reveal, Scroll-Pinned.
Navigation: Mac Dock magnification, Magnetic Button, Gooey Menu, Dynamic Island (morphing pill), Contextual Radial Menu, Floating Speed Dial, Mega Menu Reveal (stagger-fade).
Layout and grids: Bento Grid, Masonry, Chroma Grid (animated gradient borders/tiles), Split-Screen Scroll (halves slide opposite ways), Sticky-Stack Sections, Curtain Reveal, broken grid / asymmetry (overlap, bleed off-screen, calculated offsets), whitespace maximization, parallax card stacks.
Cards: Parallax Tilt, Spotlight Border, Glassmorphism Panel, Holographic Foil, Tinder Swipe Stack, Morphing Modal (button expands into dialog).
Scroll: Sticky Scroll Stack, Horizontal Scroll Hijack, Sequence Scroll (video/3D framerate tied to scroll), Zoom Parallax, Scroll Progress Path (SVG draws itself), Liquid Swipe transition, scroll-driven mask/wipe reveals, smooth scroll with inertia.
Galleries and media: Dome Gallery, Coverflow Carousel, Drag-to-Pan Grid, Accordion Image Slider, Hover Image Trail, Glitch Effect (RGB shift).
Type and text: Kinetic Marquee, Text Mask Reveal, Text Scramble, Circular Text Path, Gradient Stroke Animation, Kinetic Typography Grid, variable font weight/width animation on scroll or hover, outlined-to-fill text transitions.
Micro-interactions: Particle Explosion Button, Liquid Pull-to-Refresh, Skeleton Shimmer, Directional Hover-Aware Button (fill from entry side), Ripple Click, Animated SVG Line Drawing, Mesh Gradient Background, Lens Blur Depth.

Each is a vocabulary item, not a default. None fires automatically; each needs a motivated reason (taste.md section 8).

## 5. Bento 2.0 motion-engine spec (for SaaS feature sections and dashboards)

Aesthetic: "Vercel-core meets Dribbble-clean", high-end, minimal, functional.
- Palette: background `#f9fafb`, cards pure white with `border-slate-200/50`. (Honors the off-white rule loosely; prefer a tinted white if the page uses off-white.)
- Surfaces: `rounded-[2.5rem]` major containers, diffusion shadow, generous `p-8`/`p-10`.
- Type: Geist, Satoshi or Cabinet Grotesk, `tracking-tight` headers.
- Labels and descriptions sit OUTSIDE and BELOW cards, gallery style.
- Animation: spring physics (`stiffness:100, damping:20`), `layout`/`layoutId`, `AnimatePresence` for dynamic lists, 60fps. Perpetual loops only where an element is genuinely live; any loop is memoized and isolated in its own tiny client component.
- Five card archetypes (e.g. row 1: 3 cols, row 2: 70/30 split):
  1. Intelligent List: vertical stack auto-sorting in a loop with `layoutId` swaps (AI prioritizing tasks).
  2. Command Input: search/AI bar with multi-step typewriter cycling prompts, blinking cursor and a shimmering "processing" gradient.
  3. Live Status: scheduling UI with breathing status dots and a notification badge that pops with an overshoot spring, stays 3s, then vanishes.
  4. Wide Data Stream: seamless infinite horizontal carousel of metric cards (`x: ["0%", "-100%"]`), effortless speed.
  5. Contextual Focus Mode: document view with a staggered text-block highlight, then a floating action toolbar with micro-icons floating in.

## 6. Block library contract (for future reusable blocks)

One block per file, standalone, passes the pre-flight check. Path: `blocks/<category>/<name>.md` (categories: hero, feature, social-proof, pricing, cta, footer, navigation, portfolio, transition); system-specific blocks `<name>--<system>.md`.

Frontmatter: `name`, `category`, `dial_compatibility` (variance/motion/density ranges), `when_to_use`, `not_for`, `stack`.
Body sections: visual sketch, props API, code sketch (Server Component default, client island for motion), mobile fallback (`<768px`), motion variants per MOTION band (1-3, 4-7, 8-10) with explicit reduced-motion fallback, dark-mode notes, anti-patterns, references.

## 7. Redesign upgrade techniques

Typography: variable-font weight/width interpolation, outlined-to-fill transitions, text mask reveals.
Layout: broken grid, whitespace maximization, parallax card stacks, split-screen scroll.
Motion: smooth scroll with inertia, staggered entry (Y translate + opacity, never all at once), spring physics, scroll-driven reveals (expanding masks, wipes, draw-on SVG paths).
Surface: true glassmorphism (inner border + inner shadow), spotlight borders, grain overlays, tinted shadows.

## 8. Engineering-quality checks that came with the taste skills
- Dependency, Tailwind-version and `'use client'` isolation rules: taste.md section 3.
- Component, state and a11y code patterns: `ui-engineering.md`.
