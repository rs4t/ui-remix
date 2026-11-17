# Motion recipes (code)

Merged from animate/RECIPES.md, emil-design-eng, design-motion-principles/motion-cookbook.md. Curves `--ease-out`, `--ease-in-out`, `--ease-drawer` are defined in `motion.md` section 5. Start from the recipe, adapt, do not rebuild.

## Press, popover, tooltip, modal, drawer, toast

```css
/* Button press: any pressable (scale also scales children, which reads as a physical press) */
.button { transition: transform 160ms var(--ease-out); }
.button:active { transform: scale(0.97); }          /* range 0.95-0.98; no hover gating needed */

/* Dropdown / popover / menu / select: scales out of its trigger */
.popover { transform-origin: var(--transform-origin);
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out); }
.popover[data-starting-style], .popover[data-ending-style] { opacity: 0; transform: scale(0.95); }

/* Tooltip: faster; neighbours open instantly once one is open */
.tooltip { transform-origin: var(--transform-origin); transition: transform 125ms var(--ease-out), opacity 125ms var(--ease-out); }
.tooltip[data-starting-style], .tooltip[data-ending-style] { opacity: 0; transform: scale(0.97); }
.tooltip[data-instant] { transition-duration: 0ms; }

/* Modal: stays centered, backdrop fades with it */
.modal { transform-origin: center; transition: opacity 250ms var(--ease-out), transform 250ms var(--ease-out); }
.modal[data-starting-style], .modal[data-ending-style] { opacity: 0; transform: scale(0.96); }
.backdrop { transition: opacity 250ms var(--ease-out); }

/* Drawer / sheet (Vaul hides it with translateY(100%) before animating in) */
.drawer { transform: translateY(0); transition: transform 500ms var(--ease-drawer); }
.drawer[data-closed] { transform: translateY(100%); }

/* Toast: enter with @starting-style; ease (not ease-out), 400ms, tuned to the component's personality */
.toast { opacity: 1; transform: translateY(0); transition: opacity 400ms ease, transform 400ms ease;
  @starting-style { opacity: 0; transform: translateY(100%); } }
```
Without `@starting-style`: `useEffect(() => setMounted(true), [])` and style `[data-mounted]`. Toast lists that reflow: tune opacity against height by feel.

## Accordion, stagger, hold-to-confirm, tabs, scroll reveal

```css
/* Accordion: one of the few animations costing layout per frame, keep short; measure height in JS, do not animate to auto */
.content { overflow: hidden; transition: height 200ms var(--ease-out), opacity 200ms var(--ease-out); }

/* Stagger (occasional lists only, 30-80ms steps, never blocks interaction) */
.item { opacity: 0; transform: translateY(8px); animation: fadeIn 300ms var(--ease-out) forwards; }
.item:nth-child(2){animation-delay:50ms} .item:nth-child(3){animation-delay:100ms} .item:nth-child(4){animation-delay:150ms}
@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }

/* Hold to confirm: release snappy, press slow and linear (it is a progress indicator) */
.overlay { clip-path: inset(0 100% 0 0); transition: clip-path 200ms var(--ease-out); }
.button:active .overlay { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; }
.button:active { transform: scale(0.97); }

/* Tab indicator with a color change: duplicate the tab list, style the copy as active, clip it to the active tab */
.tabs-active-copy { clip-path: inset(0 60% 0 20%); /* driven by active tab position */ transition: clip-path 250ms var(--ease-in-out); }

/* Scroll reveal (marketing only, fire once) */
.reveal { clip-path: inset(0 0 100% 0); transition: clip-path 600ms var(--ease-in-out); }
.reveal[data-visible] { clip-path: inset(0 0 0 0); }
```
Trigger with IntersectionObserver or Motion `useInView({ once: true, margin: "-100px" })`. Re-animating on every scroll-by fights the reader.

## Drag to dismiss (gesture recipe, springs not durations)
```js
const velocity = Math.abs(swipeAmount) / (Date.now() - dragStartTime.current);
if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) dismiss();
element.style.transform = `translateY(${distance}px)`;   // not a CSS variable on the parent
// settle: { type: "spring", duration: 0.5, bounce: 0.2 }
```
Details: pointer capture once drag starts; multi-touch protection (`if (isDragging) return`); damping past boundaries; friction not a wall. Momentum projection and rubber-band functions are in `motion.md` section 7.

## Crossfade that will not settle, WAAPI, clip-path toolkit
```css
.content { transition: filter 200ms ease, opacity 200ms ease; }
.content.transitioning { filter: blur(2px); opacity: 0.7; }   /* under 20px blur */
```
```js
element.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  { duration: 1000, fill: 'forwards', easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
```
clip-path: hardware accelerated, no layout shift, no extra DOM. `inset(top right bottom left)`, `circle(r at x y)`, `polygon()`. Uses: image reveal, tab color transitions, comparison sliders (overlay two images, clip the top one `inset(0 50% 0 0)`, adjust the right inset by drag), text mask (stack `inset(0 0 50% 0)` over `inset(50% 0 0 0)`), scroll-driven (`useTransform(scrollYProgress,[0,1],["100%","0%"])` + `useMotionTemplate\`inset(0 0 ${y} 0)\``).

## Enter / exit and state recipes (Jakub)
```jsx
initial={{ opacity: 0, translateY: "calc(-100% - 4px)", filter: "blur(4px)" }}
animate={{ opacity: 1, translateY: 0, filter: "blur(0px)" }}
transition={{ type: "spring", duration: 0.45, bounce: 0 }}
exit={{ translateY: "-12px", opacity: 0, filter: "blur(4px)" }}   // subtler than the enter
```
Icon swap in `<AnimatePresence mode="wait">`: initial/exit `{ opacity: 0, scale: 0.8, filter: "blur(4px)" }`, animate `{ opacity: 1, scale: 1, filter: "blur(0px)" }`.
`animation-fill-mode`: `backwards` stops delayed fade-ins flashing at full opacity before they start; `forwards` keeps the end state; `both` does both.
Shared layout via `layoutId` (FLIP) between different components (card -> modal). Keep `layoutId` elements outside `AnimatePresence` (inside, initial/exit fire during the layout animation). Each element needs a unique `layoutId`.
Shadows instead of borders:
```css
.card { box-shadow: 0 0 0 1px rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06), 0 2px 4px 0 rgba(0,0,0,.04); }
.card:hover { box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 1px 2px -1px rgba(0,0,0,.08), 0 2px 4px 0 rgba(0,0,0,.06); }
```
Gradients: `linear-gradient(in oklch, blue, red)`; color hints move the blend midpoint; layer with `background-blend-mode`.

## Playful CSS (Jhey)
- `linear()` easing for pure-CSS bounce/elastic/spring (generate with Jake Archibald's linear-easing-generator):
```css
:root { --bounce-easing: linear(0,.004,.016,.035,.063,.098,.141 13.6%,.25,.391,.563,.765,1,.891 40.9%,.848,.813,.785,.766,.754,.75,.754,.766,.785,.813,.848,.891 68.2%,1 72.7%,.973,.953,.941,.938,.941,.953,.973,1,.988,.984,.988,1); }
```
- Stagger: `animation-delay` applies once (not per iteration). Use finite iterations with different delays, pad keyframes (`0%,50% {...} 100% {...}`), or negative delays for "already in progress": `animation-delay: calc(var(--index) * -0.2s)`. Scoped variables: `.item{--delay:0; animation-delay:calc(var(--delay)*100ms)} .item:nth-child(2){--delay:1}`.
- `@property` makes custom properties animatable (types: length, number, percentage, color, angle, time, integer, transform-list):
```css
@property --hue { syntax:'<number>'; initial-value:0; inherits:false; }
@keyframes rainbow { to { --hue: 360; } }
/* decompose a transform to get curved paths */
@property --x { syntax:'<percentage>'; initial-value:0%; inherits:false; }
@property --y { syntax:'<percentage>'; initial-value:0%; inherits:false; }
.ball { transform: translateX(var(--x)) translateY(var(--y)); animation: throw 1s; }
@keyframes throw { 0%{--x:-500%} 50%{--y:-250%} 100%{--x:500%} }
```
- 3D CSS: think in cuboids. `.scene{transform-style:preserve-3d;perspective:1000px}`; responsive dimensions `--size:10vmin`. Orbit: `translate(-50%,-50%) rotateY(0) translateZ(72px) rotateY(360deg)` to `rotateY(360deg) ... rotateY(0)`. `rotateX/rotateY` for coin flips and depth. Transform-origin is the anchor of every transform; set it to the trigger.
- Scroll-driven animation: tied to scroll speed by default (slow scroll = slow animation), which feels wrong for most UI. Pattern: a scroll-driven trigger toggles a custom property when the element enters view; a duration-based main animation runs via a Style Query, so timing is independent of scroll speed. Fallback: `if (!CSS.supports('animation-timeline','scroll()')) { /* IntersectionObserver */ }`.
- Spring for mouse tracking: `useSpring(mouseX, { stiffness: 300, damping: 30 })`. For 3D/rotation use `{ stiffness: 100, damping: 10 }`.

## Materials (Apple, web translation)
```css
.toolbar { background: rgba(255,255,255,.6); backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255,255,255,.4); /* bright top edge = light catching the material */ }
@media (prefers-reduced-transparency: reduce) { .toolbar { background: white; backdrop-filter: none; } }
```
Rules: nav/toolbars/sheets are translucent layers with content scrolling underneath; material weight encodes hierarchy (heavier separates structure, lighter highlights controls); never stack a light translucent surface on another; bigger surfaces read thicker (stronger blur and shadow); dim to focus (modal scrim) vs separate to keep flow (parallel panel, no scrim); vibrancy: over blur use higher-contrast, slightly heavier text with a small tracking bump and put color on a solid layer; scroll-edge fade masks instead of hard 1px dividers where floating chrome overlaps content; materialize by animating blur radius and scale together on enter/exit. CSS glass skeleton: `reference/taste-anti-slop/recipes.md` section 3.
