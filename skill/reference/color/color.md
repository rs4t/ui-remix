# Color (canonical)

Merged from better-colors. Rules first, then detail sections. Review/report format: `reference/workflows/review-report-format.md`. Palette data: `python scripts/search.py "<q>" --domain color`.

This skill builds and audits color systems. It generates ramps, maps their steps to roles and token names, converts notation and measures rendered contrast pairs.

Never report a contrast value you did not measure, and never estimate a color you could compute. Notation, a tinted neutral and a gradient's interpolation space are project choices, not findings. A broken role mapping, a failing pair and an out-of-gamut step are findings. Perceived lightness throughout means OKLCH `L`, from `0` to `1`.

Whether a pair is required to pass belongs to `accessibility.md`. Surfaces, shadows and icon color belong to `ui-polish.md`.

## Match the project's color system

Reuse the project's tokens and notation. A consistent hex system beats hex with `oklch()` scattered through it.

For a new system, `oklch()` is the best default, because its numbers behave the way the ramp rules below describe. Everywhere else, a color library produces the same ramp in the project's own notation ([color-formats.md](#color-formats)).

## A system is ramps, not colors

One neutral ramp, one accent ramp and only the status ramps the product actually renders. A `warning` ramp nothing imports is maintenance for zero pixels. A second accent hue earns its place only when two things must be distinguishable at a glance. Otherwise use more steps of the one accent ramp.

## Every step has a job

A ramp is not a gradient to pick from by eye. Each step exists because a role needs it: page background, component hover, border, solid fill, body text. Do not generate a step no role consumes. Both the Tailwind `50`–`950` and Radix `1`–`12` conventions map to those roles ([palette-structure.md](#palette-structure)).

## Name primitives by hue, semantics by role

Primitives name a value (`--blue-600`) and are never applied in a component. Semantic tokens name a job (`--color-text-secondary`), point at a primitive and are the only tier components reference. That seam is what lets a theme repoint colors without touching components ([token-naming.md](#token-naming)).

## Use a token only in its role

Never borrow a token because its value is right today. A separator used as a text color works until borders get lighter, and then the text goes with them. If a role has no token, add the token.

## Hold the hue across the ramp

A ramp holds one hue end to end, peaks in vividness mid-ramp and steps more finely at the light end. Build it with a color library, never by eye ([palette-generation.md](#palette-generation)).

## One color, one meaning

Use a color for one purpose across the whole interface, treating anything within `15°` of OKLCH hue as the same color ([color-usage.md](#color-usage)). Never let color be the only carrier of meaning. Pair it with an icon or a label, a requirement `accessibility.md` owns.

## Fill exactly one action per view

When filled color encodes primary emphasis, one primary action gets it and peers stay neutral. Put the color on the background, not the label. A filled button reads as primary across the room; accent-colored text on a neutral button reads as a link.

Keep an established hierarchy that already signals emphasis another way. Several colored backgrounds are fine when they encode distinct states or categories rather than competing as peers.

## Measure the rendered pair, then report

Measure a foreground against the background it actually renders on, not the page background. When a pair fails, report the pair, its measured value and the threshold it misses, then leave the colors alone. They are a design decision. Change them only when asked, and remeasure after ([contrast.md](#contrast)).

## Pick a gradient's interpolation space

The space is a look, not a correctness setting. Default to `in oklab`, and reach for `in oklch` when a two-hue gradient goes gray in the middle ([color-usage.md](#color-usage)).

## Before you finish

| Pattern | Fix |
| --- | --- |
| A hex, `rgb(` or `oklch(` literal in a component file where a token exists | Reuse or add the role token, in the project's notation |
| One `oklch(` value in a codebase otherwise written in hex | Write it in the established notation unless a migration is in scope |
| `var(--blue-600)` or `bg-blue-600` in a component file | Point a semantic token at the primitive and use that |
| A semantic name containing a hue or a component, as in `--color-blue-button` or `--color-sidebar-gray` | Rename it for its role: `--color-accent-solid`, `--color-bg-surface` |
| `--color-primary` and `--color-text-primary` both defined | Rename the brand token `accent` |
| A `border` or `separator` token inside `color:`, or a `text` token inside `background:` | Add a token for the missing role |
| `hsl(` ramp values that differ only in lightness | Rebuild with a constant perceived hue, in the project's notation |
| `50`–`200` stepping as far apart in OKLCH `L` as mid-ramp steps do | Tighten the light end to about `0.04`–`0.05` per step |
| One chroma or saturation number copied across every hue's ramp | Use the same proportion of each hue's own maximum |
| A status hue within `15°` of the accent hue | Move it at least `15°` away, or give the destructive action a distinct treatment |
| Dark tokens equal to the light ramp in reverse step order | Lower the accent's chroma, widen the dark end and remeasure every pair |
| Color tokens set under both `prefers-color-scheme` and a `.dark` class | Pick one switching mechanism and use it throughout |
| A contrast fix that changes hue and leaves lightness | Change lightness, the channel contrast responds to |
| `prefers-contrast: more` overriding a color for both appearances in one block | Give each appearance its own increased-contrast value |
| Text on a color with alpha, such as `/50`, `rgba(` or `color-mix(` with `transparent` | Measure the rendered result, or use a solid token |
| `text-white` on a Tailwind `500` fill | Measure it; white on most `500` hues fails 4.5:1, so move the fill to `600` |
| `oklch()` chroma beyond sRGB with no sRGB value declared before it | Declare the sRGB value first, then the vivid one inside `@media (color-gamut: p3)` |


---

## Palette structure

What a color system is made of, before any values exist. For computing the values see [palette-generation.md](#palette-generation); for what to call them see [token-naming.md](#token-naming).

### What a system needs

Most products need three kinds of ramp and nothing else:

| Ramp | How many | Notes |
| --- | --- | --- |
| Neutral | 1 | Carries 80–90% of the interface: backgrounds, borders, body text |
| Accent | 1 | The brand hue. Interactive and selected states |
| Status | 0–4 | `danger`, `warning`, `success`, `info`. Add one only when the product shows that state |

### Every step has a job

Each step maps to a role. Generate the steps the roles below call for and skip the rest.

| Role | Tailwind | Radix |
| --- | --- | --- |
| Page background | `50` | `1` |
| Subtle background | `50` | `2` |
| Component background | `100` | `3` |
| Component hover | `200` | `4` |
| Component active / selected | `200` | `5` |
| Subtle border, separator | `200` | `6` |
| Border, focus ring | `300` | `7` |
| Hovered border | `400` | `8` |
| Solid fill | `600` | `9` |
| Solid fill hover | `700` | `10` |
| Low-contrast text | `700` | `11` |
| High-contrast text | `900` | `12` |

The two conventions differ in kind, not only in numbering:

- **Radix defines its 12 steps by role.** Step 9 is "the solid fill" in every ramp and appearance. The dark scale is a separate ramp reusing the same numbers, so `--accent-9` is the fill in both and component CSS never changes.
- **Tailwind defines its 11 steps by lightness.** `50` is light, `950` is dark. The mapping above therefore holds in light mode and inverts in dark, with the page background at `950` and high-contrast text at `50`. Components either swap step numbers per appearance or read a semantic token that swaps once.

Match whichever the project uses. For a new system prefer Radix's model, because a role-defined step survives a theme change that a lightness-defined step does not. On Tailwind, keep `50`–`950` and put the role mapping in the semantic tier.

Solid fill sits on `600` because white text on most Tailwind `500` hues fails 4.5:1. Where the table repeats a step, those roles render identically. A design that needs, say, component hover and subtle border to differ needs a 12-step ramp.

### Neutrals

A pure gray ramp is a perfectly good default. It sits under any accent hue without competing and never needs revisiting when the brand color changes.

Tinting the neutral toward the accent hue is a stylistic option, not a correction. OKLCH chroma `0.005`–`0.02` at the accent's hue puts the grays in the accent's family. Enough to measure, not enough to name.

Warm neutrals, hue toward orange, read approachable and editorial; cool ones, toward blue, read technical and precise. Whichever you pick, including none, hold it across the whole ramp. A warm gray border on a cool gray background is visible even when neither color is nameable alone.

Neutrals carry the most roles, so they need the most steps. Never generate fewer neutral steps than accent steps.

### Status colors

Convention constrains status hues before taste does. Red reads as danger, amber as warning, green as success. See the cultural exceptions in [color-usage.md](#color-usage).

Two rules govern them:

- **Keep every status hue at least `15°` of OKLCH hue from the accent.** If the brand is red, danger cannot also be red. Where convention leaves nowhere to move, give the destructive action a distinct treatment, such as an outlined button with an icon, or it reads as the primary action.
- **Status ramps need fewer steps than the accent.** Most render four roles: a background, a border, a solid fill and text. Generate the full ramp only where the product styles status components across the whole range.

### Auditing an existing palette

Before restructuring a system, inventory it. Most codebases hold several times more colors than the design has decisions.

1. **Collect every literal.** Grep for hex, `rgb(`, `hsl(`, `oklch(` and the project's utility-class prefixes. Include SVG `fill` and `stroke`, chart configs and email templates.
2. **Sort by perceived lightness within each hue family.** Duplicates surface immediately as near-identical neighbors.
3. **Collapse near-duplicates.** Two colors within `0.02` of each other in OKLab ΔE are one color that drifted. Keep the one used most and retire the others. Never average them.
4. **Assign each survivor a role** from the table above. A color matching no role is a missing token or a mistake. Decide which, and say so in the finding.
5. **Count what is left.** More ramps than **What a system needs** lists means the palette outgrew its structure, not that the product needs more color.

Report the inventory before changing anything. Consolidating a palette changes rendered output on screens nobody asked you to touch, so it stays a proposal until the user accepts it.


---

## Palette generation

Producing the values once the structure is decided. For which ramps to build and what each step is for, see [palette-structure.md](#palette-structure).

### Start from the brand color

A brand color arrives as one value, usually a hex. Two decisions come before any ramp exists:

**Which step does it occupy?** A brand color meant for buttons and links belongs on the solid-fill step, `600` in Tailwind and `9` in Radix. Then the primary button renders the actual brand color, not an approximation.

**Is it pinned or snapped?** Pin a contractually fixed brand color. It stays exact, the ramp builds outward from it and that one step spaces slightly unevenly. Otherwise snap it onto the ramp so the spacing stays regular, which almost always looks better.

A brand color that fails contrast behind white text is still the brand color, just not the solid-fill step. Put it where it lands and use a darker step for interactive fills. Never quietly darken the brand. In the example below, `#3b82f6` lands on `500` and fills use `600`, because white on `#3b82f6` measures 3.68:1.

### What a correct ramp looks like

Properties of the finished ramp, checkable against any output in any notation:

- **Lightness changes steadily, measured in OKLCH `L`.** HSL lightness is not perceptual, and evenly spaced HSL values bunch at one end.
- **Hue is constant end to end.** Every step is recognisably the same color. A wandering hue reads as two colors blended and will not sit correctly against a neutral built on a different hue.
- **Vividness peaks in the middle and falls off at both ends.** The lightest and darkest steps are nearly neutral; the middle carries the color. Holding full vividness into the extremes gives a `50` that glows and a `950` like ink spilled on the brand.
- **Steps are finer at the light end.** Light backgrounds need finer distinctions than dark ones. Keep `50`–`200` about `0.04`–`0.05` apart in OKLCH `L` and mid-ramp steps about `0.07`–`0.10`. Even spacing across the whole range leaves too few pale steps, so `100` is already too dark for a subtle surface.
- **No two adjacent steps are indistinguishable.** Adjacent steps less than `0.03` apart in OKLCH `L` mean the ramp has more steps than decisions. Drop one.
- **Both ends stop short of pure black and white.** A ramp that reaches them loses its identity exactly where the page background lives.

### Use a color library

Never compute these by hand or by eye. `culori`, `colorjs.io` and `chroma.js` all convert between notations, measure perceived lightness and interpolate perceptually. Read the brand color in whatever format it arrives, do the math in a perceptual space and emit the project's notation:

```js
import { formatHex, interpolate, samples } from 'culori'

// Perceptual interpolation, hex in and hex out.
const ramp = interpolate(['#eff6ff', '#3b82f6', '#172554'], 'oklab')
const steps = samples(11).map((t) => formatHex(ramp(t)))
```

This is a starting point. Linear sampling spaces lightness evenly within each segment, so check the output against the properties above and tighten `50`–`200` by hand.

The output format is the project's choice. For a ramp the interpolation space is not, because sRGB interpolation produces muddy mid-steps. Decorative gradients are the opposite case, where the space is a deliberate look ([color-usage.md](#color-usage)).

For comparison, Tailwind's blue ramp has the finer light end the generated one lacks:

```css
:root {
  --blue-50: #eff6ff;
  --blue-100: #dbeafe;
  --blue-200: #bfdbfe;
  --blue-300: #93c5fd;
  --blue-400: #60a5fa;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;
  --blue-800: #1e40af;
  --blue-900: #1e3a8a;
  --blue-950: #172554;
}
```

### Several hues at once

With an accent plus status ramps, the ramps must agree step for step. `red-500` and `blue-500` should read as equally bright and vivid, or a red button looks heavier than a blue one at the same step.

- **Match perceived lightness exactly.** Same step, same brightness, across every hue.
- **Match vividness relatively, not absolutely.** Hues do not share a maximum vividness. A saturated yellow and a saturated blue are not equally far from gray, and no format makes them so. Set each ramp to the same *proportion* of what its own hue reaches.

Yellows and cyans are the usual casualties, peaking much lower than reds and blues. Copy the numbers across and the warning color looks weak beside the danger one.

### Dark mode

A dark palette is not the light one reversed. Reversal is the starting point, not the output.

Swap the semantic roles first, then tune the values:

```css
:root {
  --color-bg-page: var(--neutral-50);
  --color-text-primary: var(--neutral-950);
}

.dark {
  --color-bg-page: var(--neutral-950);
  --color-text-primary: var(--neutral-50);
}
```

Three things almost always need hand-tuning after the swap:

- **Vividness comes down.** A color that reads as confident on white reads as neon on near-black. Dark appearances need the accent a step or two less vivid.
- **The dark end needs more separation.** Steps distinguishable as pale backgrounds collapse into each other as dark surfaces.
- **Contrast does not survive the mirror.** APCA scores mirrored pairs differently, so recheck every pair in both appearances ([contrast.md](#contrast)).

#### Choosing the switching mechanism

Use one mechanism throughout:

- **`prefers-color-scheme` alone** is correct with no theme toggle. Nothing to persist, nothing to hydrate.
- **A `.dark` class** is required as soon as users can override the system setting. The media query then sets only the initial value.
- **`light-dark()`** collapses both values into one declaration. It needs `color-scheme: light dark` and reads that property rather than a class, so a class-based toggle must set `color-scheme` too.

```css
:root {
  color-scheme: light dark;
  --color-bg: light-dark(#ffffff, #172554);
}
```

A media query setting some tokens and a class setting others gives a half-themed interface the moment a user overrides their system preference.


---

## Token naming

Naming is what makes a palette usable by anyone who did not build it. For which ramps exist and what each step does, see [palette-structure.md](#palette-structure).

### Two tiers

**Primitives** name a value. They are the ramp, named by hue and step, as in `--blue-600` or `--neutral-200`. A primitive describes what the color *is*, so it never changes meaning between themes and is never applied directly in a component.

**Semantics** name a job. They point at a primitive and take the name of the role they fill, as in `--color-text-secondary` or `--color-border-subtle`. Components only ever reference this tier.

```css
:root {
  /* Tier 1: primitives, named by hue and step. Never used directly. */
  --blue-600: #2563eb;
  --neutral-200: #e5e7eb;
  --neutral-700: #374151;

  /* Tier 2: semantics, named by role. This is what components use. */
  --color-accent-solid: var(--blue-600);
  --color-border: var(--neutral-200);
  --color-text-secondary: var(--neutral-700);
}
```

The tiering is what makes theming possible. Dark mode, a white-label theme and an increased-contrast variant all repoint the semantic tier, leaving the primitives and every component untouched. A codebase applying `--blue-600` directly in components has no theming seam. Adding one later means auditing every usage to work out which meant "the accent" and which just wanted blue.

Add a third, component-level tier (`--color-button-danger-bg`) only where a component genuinely and intentionally diverges from the system. One component token is a documented exception; twenty mean the semantic tier is missing roles.

### The role inventory

A system is complete when every role below has a token. Build against this list rather than adding tokens as components demand them, or the palette ends up shaped like whichever screen came first.

| Group | Roles |
| --- | --- |
| Surfaces | page background, surface, raised (menus, popovers), sunken (inputs, wells), overlay scrim |
| Text | primary, secondary, disabled, inverse, on-accent |
| Borders | subtle, default, strong, focus ring, separator |
| Accent | subtle background, border, solid, solid hover, text |
| Status | per status shipped: subtle background, border, solid, text |

Separator and border are separate roles even when they share a value today. A separator divides content; a border encloses a control. They diverge the first time someone restyles inputs, and a system that conflated them gets untangled at that moment.

### Naming grammar

Use one shape and never deviate. Neutral roles lead with the property, as `--color-{bg|text|border}-{variant}-{state}`. Accent and status roles lead with the role, as `--color-{accent|danger|…}-{subtle|border|solid|text}-{state}`.

```css
--color-bg-surface
--color-text-secondary
--color-border-strong
--color-accent-solid-hover
--color-danger-subtle
--color-accent-text
```

Pick one word per concept and use only that word. Consistency matters more than the vocabulary. A reader who has seen `--color-text-primary` must be able to guess `--color-text-disabled` without looking:

| Concept | Pick one | Never mix in |
| --- | --- | --- |
| Foreground | `text` | `fg`, `foreground`, `content`, `ink` |
| Background | `bg` | `background`, `surface` as a synonym, `fill` |
| Edge | `border` | `stroke`, `outline`, `line` |
| Brand color | `accent` | `primary`, `brand`, `theme` used interchangeably |

Reserve `primary` for exactly one meaning. `--color-text-primary` for body text beside `--color-primary` for the brand is the most common naming collision there is, and it makes every `primary` token ambiguous until you open its definition. Use `accent` for the brand and let `primary` mean "the most prominent of its group".

### Anti-patterns

| Name | Problem | Instead |
| --- | --- | --- |
| `--color-blue-button` | Appearance at the semantic tier; lies the moment the brand changes | `--color-accent-solid` |
| `--color-sidebar-gray` | Named for where it was used first; the second usage makes it nonsense | `--color-bg-surface` |
| `--color-light-gray` | Lies in dark mode, where it is the dark one | `--neutral-200` as a primitive |
| `--color-text-2` | Numbered semantics carry no meaning; nobody can guess what `3` would be | `--color-text-secondary` |
| `--color-gray-hover` | Mixes a hue with a state and belongs to no tier | `--color-bg-surface-hover` |
| `--blue-600` used in a component | Skips the semantic tier and removes the theming seam | Point a semantic token at it |

### In Tailwind projects

Tailwind v4 generates utilities from `@theme`, so names declared there become the API. Declare primitives and semantics in the same block; the `--color-*` namespace is what produces `bg-*`, `text-*` and `border-*`:

```css
@theme {
  /* Primitives */
  --color-blue-50: #eff6ff;
  --color-blue-600: #2563eb;
  --color-blue-900: #1e3a8a;

  /* Semantics: what templates should use */
  --color-accent-solid: var(--color-blue-600);
  --color-text-secondary: var(--color-neutral-700);
}
```

That yields `bg-accent-solid` and `text-text-secondary` alongside `bg-blue-600`. Tailwind prefixes every `--color-*` name with the utility, so a `text-` token doubles. Accept the doubling, or follow the convention the project already uses. Both tiers are reachable, so the discipline is a convention rather than a constraint. Templates use the semantic utilities, and a raw `bg-blue-600` in a component is the thing to flag.

Repoint semantics for dark mode in a `.dark` block outside `@theme`. Leave the block without `inline`, so utilities read the semantic variable at render time.

Opacity modifiers work on either tier, as in `bg-accent-solid/50`. But a color carrying alpha cannot be contrast-checked against a static background, because what it renders depends on what sits behind it. Use solid tokens for anything with text on it.


---

## Color usage

Deploying color once the system exists: meaning, emphasis, gradients and appearance variants. For picking values see [palette-generation.md](#palette-generation), for naming them [token-naming.md](#token-naming), for checking pairs [contrast.md](#contrast).

### One color, one meaning

Users read a near-miss in hue as a slightly different shade, not as a different color.

```css
/* Bad: the accent means both "link" and "decorative heading" */
a { color: #3b82f6; }
.section-title { color: #4f8ef7; }

/* Good: interactive elements own the accent; headings stay neutral */
a { color: var(--color-accent-text); }
.section-title { color: var(--color-text-primary); }
```

The rule runs both ways. A color must not be *absent* where its meaning occurs. If the accent means interactive, an interactive element rendered neutral is just as misleading.

### Use tokens in their role

A value that happens to work in two roles stops working in both at the next theme change.

```css
/* Bad: separator token repurposed as a text color because it looked right */
.caption { color: var(--color-border); }

/* Bad: text token repurposed as a background */
.tag { background: var(--color-text-secondary); }
```

The role inventory in [token-naming.md](#token-naming) is the list of roles a system needs.

### One colored action per view

```html
<!-- Good: one filled primary action, neutral secondaries -->
<button class="bg-accent-solid text-text-on-accent">Save</button>
<button class="text-text-secondary">Cancel</button>

<!-- Bad: every action colored, so nothing is primary -->
<button class="bg-accent-solid text-text-on-accent">Save</button>
<button class="bg-accent-solid text-text-on-accent">Duplicate</button>
<button class="bg-accent-solid text-text-on-accent">Export</button>
```

Selected states may use the accent on the glyph and label. An active tab or a checked segment is state, not emphasis.

### Gradients

**The interpolation space is a look, not a correctness setting.** Three are worth knowing, and the difference between them is most visible in the middle of the gradient:

```css
/* sRGB: the default and the classic. Midpoint darkens and mutes. */
background: linear-gradient(#3b82f6, #ec4899);

/* oklab: even brightness across the transition. The best default. */
background: linear-gradient(in oklab, #3b82f6, #ec4899);

/* oklch: travels around the hue wheel, staying vivid throughout. */
background: linear-gradient(in oklch, #3b82f6, #ec4899);
```

`oklab` and sRGB are **rectangular**, interpolating in a straight line through the color space. `oklch` is **polar**, interpolating the hue angle, so it arcs around the wheel through every hue between the stops. That is why it stays saturated and why it can produce hues nobody asked for. A blue-to-pink gradient routes through purple, which is either the look or a surprise.

**The gray dead zone is a rectangular-space problem.** Two hues on opposite sides of the wheel sit either side of the neutral axis. A straight line between them passes near gray, and the middle goes lifeless. Either switch to a polar space, which routes around the axis, or add a third stop between the two and keep the space you have.

With a polar space you also control which way it goes around:

```css
/* The short way round, usually what you want */
background: linear-gradient(in oklch shorter hue, #3b82f6, #ec4899);

/* The long way, sweeps most of the spectrum */
background: linear-gradient(in oklch longer hue, #3b82f6, #ec4899);
```

**Banding shows up on large areas.** A gradient spanning a hero with little contrast between its stops steps visibly on 8-bit displays. Widen the contrast, shrink the area or overlay a subtle noise texture.

**Keep text off gradients where you can.** Contrast varies continuously across one, so a single measurement does not describe it. Where text must sit on a gradient, measure the worst region rather than the average, or put a scrim behind it.

### Color across cultures

Where a color carries meaning in finance, status or alerts, verify the meaning holds in every locale you ship to. Chinese financial UIs show gains in red and losses in green, the reverse of English ones. Where the product ships to such markets, make gain and loss per-locale tokens rather than hardcoded values.

### Light, dark and increased contrast

When the product ships a dark appearance, every custom color needs a dark variant, derived per [palette-generation.md](#palette-generation). Users who enable increased contrast expect visibly stronger differentiation in each appearance:

```css
:root {
  --color-accent-solid: var(--blue-600);
}

@media (prefers-contrast: more) {
  :root { --color-accent-solid: var(--blue-900); }
}

@media (prefers-color-scheme: dark) {
  :root { --color-accent-solid: var(--blue-400); }
}

@media (prefers-color-scheme: dark) and (prefers-contrast: more) {
  :root { --color-accent-solid: var(--blue-200); }
}
```

A single `prefers-contrast` block shared by both appearances darkens the color on a dark background too, lowering contrast there. The increased-contrast variant widens the gap to its background by at least `0.15` of OKLCH `L` over the default. Remeasure it, aiming for Lc 90 on body text. Widening the gap without remeasuring is not fixing it.


---

## Contrast

Contrast is measured between a **foreground color**, meaning text, an icon or a UI element, and the **background color** it actually renders against, usually the nearest ancestor that paints one. Identify that background first. Measuring against the page background when the element sits on a card gives the wrong answer.

`accessibility.md` decides which requirement applies to a pair. The thresholds below are what a measured pair is reported against. Where neither that skill nor the project names a standard, report the WCAG 2 result and add the APCA value.

### WCAG 2 thresholds

WCAG 2 is the standard formal conformance claims are made against.

| Content type | AA | AAA |
| --- | --- | --- |
| Text | 4.5:1 | 7:1 |
| Large text, at least `24px` or `18.67px` bold | 3:1 | 4.5:1 |
| UI components and graphical objects | 3:1 | n/a |

Disabled or inactive controls and logos are exempt.

### APCA thresholds

Lc, Lightness Contrast, is APCA's measure of perceived contrast. These levels simplify APCA's full font-size and weight lookup table:

| Content type | Minimum |
| --- | --- |
| Body text, columns or blocks of text | Lc 75, preferred Lc 90 |
| Non-body text such as labels and headlines | Lc 60 |
| Large text, at least `36px` regular or `24px` bold | Lc 45 |
| Fine-detail or outline icons | Lc 45 |
| Solid icons and UI components | Lc 30 |
| Non-text that only has to be discernible, such as dividers | Lc 15 |

Disabled and placeholder text are not covered by a requirement. Aim for Lc 30 so they stay legible.

Lc is signed. Positive means dark text on a light background, negative means light text on a dark background. Compare the absolute value against the threshold.

### Fix a failing pair only on request

**Change lightness first.** It is the channel contrast responds to. Hue and saturation move the measured value far less.

Move the foreground away from the background in perceived lightness, holding hue and saturation, then remeasure. Keeping hue fixed is what stops a contrast fix becoming a palette change.

```css
/* Failing: text too close to its background in lightness (Lc ≈ 50) */
color: #7d93b0;
background: #eef2f7;

/* Fixed: darker text, same hue (Lc ≈ 88) */
color: #2b3a4f;
background: #eef2f7;
```

Two constraints on the fix:

- **Mid-lightness backgrounds cap what is achievable.** On a background near OKLCH `L` `0.75`, even pure black text reaches only about Lc 60. Body text needs a background near one extreme, so a mid-range background is the thing that has to change.
- **Pushing lightness can push the color out of gamut.** Reduce saturation as needed to keep it renderable. See [color-formats.md](#color-formats).

Always remeasure after changing a value. Do not assume a fix landed.

### Pick text polarity from the background

Compare black and white using the project's required contrast metric. APCA and WCAG 2 can favor different text colors on the same background. A higher score does not by itself mean the pair passes.

WCAG 2's neutral crossover is near 56% OKLCH lightness. At `oklch(65% 0 0)`, black measures about `6.49:1` and white `3.23:1`. Only black passes AA for normal text. For colored backgrounds or other foregrounds, measure the actual pair rather than applying a crossover.

### What to check

- **Every pair, in every appearance.** APCA scores mirrored pairs differently, so a pair passing in light mode can fail in dark.
- **Translucent surfaces.** A color on a `backdrop-filter` header or an overlay shifts with whatever scrolls behind it. Test against the lightest and darkest content it can sit over, or make the surface opaque enough that the shift cannot break the pair.
- **Computed colors.** `color-mix()`, relative color syntax and opacity modifiers resolve at render time; measure the rendered result, not the declaration.
- **Text over images.** There is no single background color. Measure the worst region, or guarantee one with a scrim.


---

## Color formats

Which notation to write colors in, how to convert between them and what happens at the edges of a display's gamut. Every other rule in this skill is stated perceptually and holds whatever notation you write.

### Choosing a notation

| Notation | Good for | Weakness |
| --- | --- | --- |
| Hex | Universal support, compact, what design tools hand you | Opaque. No channel is readable or editable by hand |
| `rgb()` | Same reach as hex, readable alpha | Channels do not correspond to anything a designer thinks about |
| `hsl()` | Channels look like design controls | Its lightness is not perceptual and its hue drifts; a ramp built by varying lightness bunches at one end and shifts hue |
| `oklch()` | Perceptually uniform lightness, stable hue, predictable ramps | Baseline 2023, so very old browser matrices need a fallback |

**Match whatever the project already uses.** Notation is not a defect: a project on hex is not doing it wrong.

**For a genuinely new color system, `oklch()` is the best default.** Even lightness steps stay even, and a fixed hue stays fixed. See [palette-generation.md](#palette-generation).

```css
oklch(L C H)          /* lightness 0–1, chroma 0–~0.4, hue 0–360 */
oklch(L C H / alpha)  /* alpha uses a slash, never a comma */
```

### Converting

Convert when the user asks, when an agreed migration is in scope or when the project is standardizing on a notation and this value is the straggler. Never convert an isolated value in a project that deliberately uses something else and never because this skill happened to load.

When conversion is in scope, change the values and nothing else:

- Leave CSS keywords alone: `currentColor`, `inherit`, `transparent`, `initial`, `unset`.
- Leave gradient functions alone. Convert the color stops inside them; do not touch the interpolation method.
- Leave colors in third-party configs that expect a specific format.
- Preserve comments and formatting.

```css
/* Before */
color: #3b82f6;
border: 1px solid rgba(0, 0, 0, 0.1);

/* After */
color: oklch(0.623 0.188 259.815);
border: 1px solid oklch(0 0 0 / 0.1);
```

Bulk conversion is a migration, not cleanup. It shifts every rendered color by a rounding margin and touches files nobody asked about, so it has to be the task rather than a side effect.

### Gamut

Every sRGB color exists in Display P3, but not the reverse. The extra room is only at high chroma and varies by hue. At OKLCH `L` `0.65`, green gains about `0.07` of chroma while blue gains about `0.015`.

A color more vivid than its display can render gets gamut-mapped, which in current browsers mostly means clipped. It flattens neighbouring steps into one rendered color, so the top of a ramp can lose its distinctions on an sRGB screen. Maximum vividness varies by hue and lightness. Cyans top out far lower than reds and purples, so a clipping ramp clips at some steps and not others.

The fix is to reduce vividness while holding hue and lightness. Generate ramps against sRGB unless the product is display-restricted, and add P3 as an enhancement:

```css
.success {
  background: #11ad32; /* oklch(0.65 0.2 145), inside sRGB */
}

@media (color-gamut: p3) {
  .success {
    background: oklch(0.65 0.27 145);
  }
}
```

Order matters. The sRGB value comes first, so an sRGB screen shows a color you chose rather than one the browser clipped. The P3 rule overrides only where it will render.

For browser matrices predating `oklch()` support, the same layering works with `@supports`:

```css
.accent {
  background: #3b82f6;
}

@supports (color: oklch(0 0 0)) {
  .accent {
    background: oklch(0.62 0.19 259);
  }
}
```

Check the project's actual browser matrix before adding this. On a modern baseline it is dead weight.

### Modern CSS worth knowing

- **`color-mix()`** derives one color from another, as in `color-mix(in oklab, var(--color-accent-solid) 15%, white)` for a tinted background. Useful for states, but keep generated values out of the token layer, since a mixed color cannot be inspected in a design tool.
- **Relative color syntax** adjusts one channel of an existing color. `oklch(from var(--color-accent-solid) calc(l - 0.1) c h)` darkens the accent by hand. Powerful and easy to overuse, since a token defined by three chained derivations is unreadable.
- **`light-dark()`** puts both appearances in one declaration. See [palette-generation.md](#palette-generation).

All three resolve at render time. Compute the resolved value with a color library, or measure the rendered result, before reporting contrast.


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- ui-craft: color/ui-craft/color.md, color/ui-craft/themes.md
- impeccable: color/impeccable/colorize.md
