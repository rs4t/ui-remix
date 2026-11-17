# Motion (canonical)

Merged from: emil-design-eng (base philosophy and rules), animate (build sequence and recipes), design-motion-principles (three-designer weighting, gotchas, accessibility, performance), apple-design (physical/gesture motion), find-animation-opportunities (restraint filter). Code recipes are in `motion-recipes.md`, review/audit material in `motion-review.md`, the term glossary in `motion-vocabulary.md`, Apple's non-motion design principles in `apple-principles.md`.

Taste-layer motion rules (dials, "motion claimed = motion shown", GSAP skeletons, reduced motion above MOTION 3) are in `reference/taste-anti-slop/taste.md` section 8 and `recipes.md`. This file is the craft layer underneath them.

## 1. Philosophy

- Taste is trained, not innate. Study why the best interfaces feel good; reverse-engineer them.
- Unseen details compound. When a feature behaves exactly as assumed, users proceed without a second thought. That is the goal.
- Beauty is leverage. Good defaults and good motion differentiate when everything else is "good enough".
- The golden rule: the best animation is the one that goes unnoticed. If users say "nice animation!" on every interaction it is too prominent for production (exception: kids/playful contexts where delight is the goal).
- Motion is not a layer added after pixels. Design interaction and visuals together.
- Prototype interactively: a working prototype beats a million static designs. Review motion with fresh eyes the next day.

Never present motion options as a menu. Make the call, state the reasoning in one line, write the code. When the honest answer is "this should not animate", say so and offer the non-motion alternative (instant state change, static affordance).

## 2. Context weighting (three lenses)

| Lens | Key question | Best for |
|---|---|---|
| Emil Kowalski (Linear, ex-Vercel; Sonner, Vaul) | Should this animate at all? Restraint, speed | Productivity tools |
| Jakub Krehel | Is this subtle and polished enough for production? | Shipped consumer apps |
| Jhey Tompkins | What could this become? Playful, CSS innovation | Creative sites, kids apps, portfolios |

Use Emil to decide IF, Jakub for HOW in production, Jhey for exploration and delight. These are context-dependent, not universal: a kids' app weights Jakub + Jhey; a banking dashboard must not get elastic bounce.

| Project type | Primary | Secondary | Selective |
|---|---|---|---|
| Productivity tool (Linear, Raycast) | Emil | Jakub | Jhey (onboarding only) |
| Kids / educational | Jakub | Jhey | Emil (high-frequency game interactions) |
| Creative portfolio | Jakub | Jhey | Emil (high-frequency) |
| Marketing / landing | Jakub | Jhey | Emil (forms, nav) |
| SaaS dashboard | Emil | Jakub | Jhey (empty states) |
| Mobile app | Jakub | Emil | Jhey (delighters) |
| E-commerce | Jakub | Emil | Jhey (product showcase) |

Duration by lens: Emil under 300ms (180ms ideal); Jakub 200-500ms for smoothness; Jhey whatever serves the effect. Do not universally flag or cap durations before checking the weighting. Match existing codebase conventions (an app that animates with 500ms springs should not get a lone 150ms ease-out) unless the convention is the thing being fixed.

Jhey's philosophy for learning: make what brings joy, document every idea, "useless" CSS art teaches clip-path, layering and stacking contexts. For production switch to Jakub or Emil.

## 3. The decision gate (run in order before any animation)

### 3.1 Frequency
| Frequency | Decision |
|---|---|
| 100+ times/day (keyboard shortcuts, command palette toggle) | No animation. Ever. |
| Tens of times/day (hover, list navigation) | Near-imperceptible only, or nothing |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare / first-time (onboarding, success, celebration) | Delight budget lives here |

Keyboard-initiated actions are a disqualifier, not a judgment call (Raycast has no open/close animation, which is correct). Perceived speed matters: a 180ms select feels more responsive than 400ms; instant tooltips after the first open make a toolbar feel faster.

### 3.2 Purpose (name it in one word or do not build it)
Feedback (interface heard the user); Spatial consistency (where it came from/went); State indication; Preventing a jarring change (content that would teleport); Explanation (marketing/onboarding only); Delight (rare tier only). "It looks cool" on a frequently seen element means stop.

### 3.3 Function
Data the user reads or acts on should not move for style. A mouse-tracking effect is fine on a marketing page; on a banking graph, no animation is better. Decoration on dense functional UI hinders.

### 3.4 Speed budget
Press feedback 100-160ms; tooltips/small popovers 125-200ms; dropdowns/selects 150-250ms; modals/drawers 200-500ms; marketing can be longer. UI under 300ms unless the lens or content says otherwise. Smaller elements animate faster; do not use one duration for everything. Use asymmetric timing where the user is deciding: slow on the deliberate phase (hold-to-confirm 2s linear), snappy on the system response (release 200ms ease-out).

## 4. Build sequence

1. Gate (above). If it fails, write zero lines of code and say why.
2. Pick the cheapest tool that works:
   - Hover, press, color, class/attribute toggles -> CSS transition
   - Entry on mount without JS -> CSS `@starting-style`
   - Predetermined motion that must stay smooth while the page loads -> CSS animation (off main thread)
   - Programmatic control with CSS performance -> WAAPI `element.animate()`
   - Springs, layout animation, exit animation, gesture-driven values -> Motion (`motion.dev`)
   If the task needs a component (toast, drawer, command menu, dropdown) use a component library with focus management rather than hand-rolling (see `reference/design-systems/`).
3. Properties: `transform` and `opacity` only (plus `filter` and `clip-path`; `height` tolerated only for accordions). Never `scale(0)`; start `scale(0.9-0.97)` + `opacity: 0`. Percentages in `translate()` are relative to the element's own size (`translateY(100%)`), prefer over pixels. In Motion use the full `transform` string, not `x`/`y`/`scale` shorthands, under load. Never drive a child's transform from a CSS variable on the parent (style recalc for every child); set `transform` on the element directly.
4. Easing and duration or spring (section 5).
5. Interruption and exit (section 6).
6. Reduced motion and pointer gating ship in the same code (section 9).
7. Self-check against "never ship" (section 11), then tell the user: gate result, ingredients (tool, properties, curve, duration or spring), and what to feel-check.

## 5. Easing, duration and springs

Decision order: entering/exiting -> ease-out; moving/morphing on screen -> ease-in-out; hover/color -> ease; constant motion (marquee, progress) -> linear; default ease-out. Never ease-in on UI (it delays the exact moment the user is watching; ease-out at 200ms feels faster than ease-in at 200ms). Built-in CSS easings are too weak. Use:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);       /* strong ease-out for UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* iOS-like drawer (Ionic, Vaul) */
```
Never invent curves such as `cubic-bezier(0.4,0,0.2,1)`; extend the codebase's existing tokens or take curves from easing.dev or easings.co. Easing has personality: elastic is wrong for a bank and fine for a kids' site; no bouncy/elastic on enterprise, frequent, error or speed-critical UI. Easing table: ease-out = arriving, ease-in = departing (rarely), ease-in-out = state change while visible, linear = loops/progress, spring = interactive elements.

### Springs
Use when motion is drag with momentum, an element that should feel alive, an interruptible/reversible gesture, or decorative mouse-tracking (decorative only: use `useSpring` so values interpolate with momentum instead of snapping).

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }                 // Apple-style, easier to reason about
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }       // physics, more control
{ type: "spring", duration: 0.45, bounce: 0 }                  // production default (Jakub)
```
Bounce 0.1-0.3 only, and avoid bounce on utility UI (dropdowns, toggles, menus, modals, settings). Reserve it for drag-to-dismiss, flicks, celebration and playful brands. Apple model: damping ratio (1.0 = critically damped, no bounce; below 1 overshoots) and response (seconds to reach target; not a duration). Start most UI at damping 1.0; add bounce (~0.8) only when the gesture itself carried momentum. Apple values: move/reposition 1.0 / 0.4; rotation 0.8 / 0.4; drawer/sheet 0.8 / 0.3. Mouse-position spring example: stiffness 300, damping 30. Taste-layer default for Motion UIs: stiffness 100, damping 20.

## 6. Interruption, exit and symmetry

- Transitions, not keyframes, for anything triggered rapidly (toasts, toggles, anything fired twice a second). Transitions retarget from the current value; keyframes restart from zero. Test by clicking rapidly: animations should blend, not queue.
- Springs for gestures: they carry velocity through an interruption.
- Never lock out input during a transition. Always animate from the presentation (current on-screen) value, not the target; starting from the logical value causes a jump. A closing modal the user grabs should follow the finger.
- Exit the way it entered (toast from the bottom leaves through the bottom; panel in from the right dismisses right). Symmetric paths make swipe-to-dismiss obvious. Mirror easing on reversible transitions (inverse control points).
- Exits are subtler than enters (smaller translate, same blur/opacity) unless the exit itself is meaningful (user-initiated dismissal, error clearing, deletion, full-page directional transitions). Emil also wants exits faster than enters (e.g. enter 2s, exit 200ms for hold patterns).
- Stagger group entrances 30-80ms per item, only for lists the user sees occasionally; stagger is decorative and must never block interaction. Avoid stagger on utility lists (search results, settings, table rows).
- Hint toward the outcome: in-between frames should telegraph where things are going.
- Origin-aware: popovers, dropdowns, menus, tooltips scale from their trigger (`transform-origin: var(--transform-origin)` in Base UI; `--radix-dropdown-menu-content-transform-origin` in Radix). Modals are exempt and stay centered.

## 7. Gestures and physical feel (Apple)

Through-line: motion starts from the current on-screen value, inherits the user's velocity, projects momentum forward, and can be grabbed and reversed at any instant. Springs are the tool.

1. Response: respond on pointer-down, not release; kill every unneeded latency (debounces, timers, ~300ms tap delay); feedback is continuous during the interaction (drag/slider/drawer update 1:1), not only at the end.
2. Direct manipulation: content stays glued to the finger and respects the grab offset. Use Pointer Events with `setPointerCapture`; keep a short velocity/position history.
3. Decompose 2D motion into independent X and Y springs (one 2D spring desyncs).
4. Velocity handoff: pass release velocity as the spring's initial velocity. Relative form: `gestureVelocity / (target - current)`; Motion takes absolute px/s.
5. Momentum projection: do not snap to the nearest boundary from the release point. Project the resting position then choose the nearest snap point: `project(v, d=0.998) = (v/1000) * d / (1 - d)`. Use velocity sign, not position, to decide reverse vs commit.
6. Dismiss on velocity, not only distance: `velocity = |swipe| / elapsedMs`; dismiss if distance over threshold OR velocity > 0.11.
7. Rubber-banding: resistance grows past a boundary; hard stops read as frozen. `rubberband(o, dim, c=0.55) = (o * dim * c) / (dim + c * |o|)`. Friction, not a wall.
8. Gesture details: tap highlights on touch-down and commits on touch-up with ~10px hit padding and cancel-by-dragging-away; swipes need a ~10px hysteresis before committing direction; detect candidate gestures in parallel from the first move and cancel the losers (avoid recognizers that only report a final state); pay double-tap delay only where double-tap exists. Multi-touch protection (`if (isDragging) return`).
9. Frame-level: keep per-frame positional change below the strobing threshold; fast motion may use subtle motion blur/stretch; use rAF only for the display-synced clock and animate compositor properties with `will-change` where motion is imminent.
10. Multimodal feedback: causality (trigger on the true causal event), harmony (visual, sound, haptic on the same frame), utility (only meaningful moments: success, error, commit, snap).

## 8. Polish rules (Jakub)

- Enter recipe: opacity 0->1 + translateY ~8px->0 + blur 4px->0 ("materializing"), spring `duration .45 bounce 0`. Blur signals focus: blur to sharp = entering, sharp to blur = losing relevance. Use blur in moderation (see slop list).
- Icon swaps (copy -> check) animate opacity + scale + blur; instant swaps are jarring and missed.
- Hover transitions 150-200ms even for small changes; instant hover looks unfinished. Button press `scale(0.97)` (range 0.95-0.98) on `:active`.
- Shadows over borders on varied backgrounds (multi-layer transparent shadows; borders are fine in dark mode or for intentional hard edges). Gradients in `oklch`/`oklab` to avoid muddy midpoints (see `reference/color/color.md`).
- Optical alignment: trust eyes over math (icon buttons, play triangles, chevrons).
- Blur as a bridge: when a crossfade shows two overlapping objects and easing cannot fix it, add `filter: blur(2px)` (and opacity .7) during the transition. Keep blur under 20px (Safari cost).
- Opacity must work with height when list items enter/leave; no formula, tune and re-check next day.
- Cohesion: motion matches the component's personality (Sonner uses 400ms `ease`, slightly slower, because it fits the toast). Sonner/Vaul principles: great defaults beat options, handle edge cases invisibly (pause timers when the tab is hidden, fill gaps between stacked toasts, capture pointer during drag), transitions not keyframes for dynamic UI. Defaults: Sonner 4000ms duration, 400ms ease, bottom-right; Vaul 500ms `cubic-bezier(0.32,0.72,0,1)`.

## 9. Accessibility (mandatory, same code as the animation)

- Reduced motion means fewer and gentler, not zero. Keep opacity/color changes that aid comprehension; remove movement and position changes; drop elastic/overshoot; replace slide/spring/parallax with short cross-fades.
```css
@media (prefers-reduced-motion: reduce) { .element { animation: fade .2s ease; /* no transform motion */ } }
/* blunt global fallback, preserves final states: */
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; scroll-behavior:auto !important } }
```
```jsx
const reduce = useReducedMotion(); const closedX = reduce ? 0 : '-100%';
```
- Functional motion (state, orientation, spatial) needs a non-motion alternative (instant state change); decorative motion can be removed entirely. Test: does removing it break understanding?
- Also respond to `prefers-reduced-transparency: reduce` (frosted/solid surfaces, no blur) and `prefers-contrast: more` (near-solid backgrounds with a defined border).
- Avoid vestibular triggers (large zoom, spin, parallax, full-viewport moving backgrounds, slow looping near 0.2Hz) unless the design requires it and it is gated; make large moving objects semi-transparent while they travel; ease dark/light brightness jumps; looping/ambient animations need pause controls.
- Gate hover motion: `@media (hover: hover) and (pointer: fine)` (touch fires false hovers on tap). `:active` press needs no gating.
- Checklist: tested with reduce enabled; no vestibular triggers; loops pausable; functional animations have alternatives; all tasks completable with animation disabled.

## 10. Performance

- Only `transform` and `opacity` (and `filter`/`clip-path`) run on the GPU path; width, height, top, left, margin, padding, font-size trigger layout.
- `will-change` only on specific properties about to animate (transform, opacity, filter, clip-path, mask), never `*` or `all`, and never as a fix for jank. Budget: 0-3 elements fine, 4-10 careful, 10+ reconsider. Keep animated layers under ~10.
- Gradient animation: cheap = `background-position`, `background-size`, opacity; expensive = color stops, adding/removing layers, switching types. Animate a pseudo-element overlay or typed `@property` variables.
- CSS animations run off the main thread and beat JS under load (Vercel dashboard tab animation dropped frames with shared layout animations during page loads; switching to CSS fixed it). Use CSS for predetermined motion, JS for dynamic/interruptible. WAAPI gives JS control with CSS performance.
- CSS variables are inheritable: updating `--swipe-amount` on a container recalcs every child. Set `transform` on the element.
- Test on low-end devices; no continuous animation without purpose.

## 11. Never ship

| Never | Instead |
|---|---|
| `transition: all` | Name the properties |
| `scale(0)` entrance | `scale(0.95)` + `opacity: 0` |
| `ease-in` on UI | `ease-out` or a strong custom curve |
| Built-in `ease-out` on a deliberate animation | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Animation on keyboard shortcut or 100+/day action | None |
| UI duration over 300ms with no reason | 150-250ms |
| `transform-origin: center` on trigger-anchored popover | `var(--transform-origin)` (modals exempt) |
| Keyframes on toasts, toggles, rapid triggers | CSS transitions |
| Animating width/height/margin/padding/top/left | transform / opacity |
| Motion `x`/`y`/`scale` props under load | Full `transform` string |
| Ungated `:hover` motion | `@media (hover: hover) and (pointer: fine)` |
| Missing reduced-motion path | Gentler variant, not zero |
| Everything entering at once | 30-80ms stagger |
| Looping attention pulses (dots, glows, breathing CTAs) | Static treatment unless a real live state or requested |
| One duration for everything; equal enter and exit prominence | Size/context-based timing; subtler exits |
| Motion on headings, body copy, nav only to "announce" them | Instant |
| Global `will-change` | Targeted hint |
| Layout props animated or distance-only swipe thresholds | transform; velocity threshold |

## 12. Create workflow (when asked to build motion)
1. Light discovery: infer request, stack, existing tokens and conventions; state "Building X / Project context Y / Weighting Primary A, Secondary B" in one block. Confirm only for non-trivial components; for a small clear request state the inference in one line and proceed.
2. Load the weighted lens (sections 2, 8) and, for complex motion, section 10.
3. Generate: frequency gate, cookbook recipes (`motion-recipes.md`), reduced motion in the same code, transform/opacity/filter only, lens-appropriate timing.
4. Self-check against section 11 and the gotchas, then explain decisions in a few lines: which lens drove timing and easing, what was deliberately left unanimated.
5. Success: context stated, gate applied, recipes from the cookbook, reduced motion handled, only transform/opacity/filter animated, decisions explained.

## 13. Debugging motion
- Slow motion: set durations to 2-5x or use the DevTools animation inspector. Look for overlapping states in color transitions, abrupt starts/stops, wrong transform-origin, properties out of sync.
- Step frame by frame (Chrome Animations panel) to find timing mismatches between coordinated properties.
- Test gestures on real devices (USB phone to the local dev server by IP, Safari remote devtools; Simulator second best).
- Review again the next day with fresh eyes; keep notes on what you tried.

## 14. Conflicts resolved

| Topic | Disagreement | Resolution |
|---|---|---|
| Duration cap | Emil under 300ms vs Jakub 200-500ms vs Jhey any | Cap depends on the weighted lens (section 2) |
| Bounce | taste v1 spring with perpetual loops vs Emil/Jakub bounce 0 on utility | Bounce only for momentum/playful; production default `bounce: 0` |
| Pulse loops | taste "perpetual micro-interactions" vs anti-checklist "flag any pulse" | Only for genuinely live state; otherwise static |
| Exit prominence | Jakub subtler vs Emil faster | Both: subtler movement, shorter duration |
| Spring defaults | Apple damping 1.0, taste stiffness 100/damping 20, Emil stiffness 300/damping 30 | Apple for gestures, taste value for Motion UI defaults, Emil value for mouse-tracking springs |


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- ui-craft: motion/ui-craft/motion.md, motion/ui-craft/sound.md
- impeccable: motion/impeccable/animate.md, overdrive.md


---

## 15. Community checklist: 20 ways to make beautiful animations

Collected from short-form videos. Values that agree with this file are confirmed; items marked **new** add a rule; items marked **variant** differ slightly from another value in this skill (both are valid, pick by context).
1. Ease-out for entrances (section 5; confirmed).
2. Dropdowns 150-250ms (section 3.4; confirmed).
3. Stagger list rows by about 30ms (section 6 says 30-80ms; 30ms is the tight end for dense rows). **variant**
4. Scale to 0.97 on press (motion-recipes uses 0.97; `ui-polish.md` says 0.96; either, never below 0.95). **variant**
5. Stretch moving knobs about 12% along travel (squash and stretch for sliders, toggles, pills). **new** See `reference/ux-rules/ux-laws.md` A.1.
6. Stagger details as the animation settles (secondary elements arrive just after the main one). **new**
7. Arcs for object movement: split X and Y easing so the path curves. **new** (motion.md section 7 mentions decomposing X/Y springs; this applies it to path shape).
8. Pulse to confirm success (a single short scale/glow pulse on the confirmed element, not a loop). **new**
9. Ease-in-out for moves of elements already on screen (section 5; confirmed).
10. Start popovers at scale 0.95 (section 4 and recipes; confirmed).
11. Enter from the trigger: transform-origin at the trigger (section 6; confirmed).
12. Exit to the trigger: reverse path to where it came from (section 6; confirmed).
13. No bounce on everyday UI (section 5; confirmed).
14. Do not tween while the user is holding/dragging: tracking is 1:1, apply animation only on release (section 7; confirmed).
15. Make exits about 20% shorter than enters (e.g. enter 250ms, exit 200ms). **variant**: section 6 says exits shorter and subtler, ux-rules says about 60-70% of enter; use 60-80% depending on how much the exit matters.
16. Overlap old and new states during a swap (crossfade with partial overlap, do not wait for the old one to finish). **new** (extends the crossfade/blur rule in motion-recipes).
17. Use masks (clip-path) for reveals and colour changes (recipes: clip-path section; confirmed).
18. Crossfade icons with blur (ui-polish icon recipe; confirmed).
19. Rubber-band past bounds (section 7.7; confirmed).
20. Reuse the same `layoutId` so shared elements animate between states/screens instead of re-mounting (motion-recipes: layoutId/FLIP; confirmed, emphasis: one id per element, outside `AnimatePresence`).
