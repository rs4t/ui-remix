# Typography (canonical)

Merged from better-typography. Rules first, then detail sections. Review/report format: `reference/workflows/review-report-format.md`. Data for font pairings: `python scripts/search.py "<q>" --domain typography`.

This skill sets and reviews how text renders, from the type scale and spacing to font loading, wrapping and punctuation. It writes every fix in the project's styling system, and the [cheat sheet](#css-cheat-sheet) maps each declaration to its Tailwind utility.

The words belong to `writing.md`, semantic heading structure to `accessibility.md` and spatial RTL layout to `layout.md`. Measure contrast with `color.md`; whether it passes is `accessibility.md`'s.

## Measured, not preferred

Some values here are exact. Unitless line-height, weight `400` or heavier below `18px`, a 60–75 character measure, `16px` inputs on iOS and `tabular-nums` on changing values are findings when missed.

Letter-spacing, pairing and scale ratios are heuristics. Report them only where they break the project's own scale. Never propose a new typeface, paid or free, unless the task asks for a type change.

## Fewer fonts, sizes and weights

Rarely use more than three fonts; marketing pages can carry more than apps. Weight and size carry hierarchy, so each extra one dilutes it. Pair for contrast. A serif headline over a sans body reads as deliberate, two near-identical sans-serifs read as a mistake.

Below `18px`, use weight `400` or heavier. Weights `100`–`300` belong at `28px` and up, checked against the background even there. Categories, `Display` and `Text` cuts, formats and fallback stacks are in [choosing-fonts.md](#choosing-fonts).

## Load the faces the design uses

Browsers synthesize a weight or style the family doesn't ship, distorting the face. Load every face the design uses. Disable synthesis only after verifying the fallback stack, and only the unwanted mode. The [synthesis longhands](#disable-synthesis-narrowly) show how.

## Properties over raw tags

When a CSS property exists, use it. `font-weight: 650`, not `font-variation-settings: "wght" 650`. `font-variant-numeric: tabular-nums`, not `font-feature-settings: "tnum" 1`. Properties keep working when a non-variable fallback renders.

Leave `font-optical-sizing` at its default `auto`. Hard-code `"opsz"` only when the design deliberately decouples optical size from font size. Reserve raw tags for custom axes like `"GRAD" 80` and features with no property, like `"ss01" 1`. Axes, features and variable versus static files are in [variable-fonts-and-opentype.md](#variable-fonts-and-opentype).

## Use a type scale with semantic names

Define a small set of sizes and deviate from it as little as possible. Pair each size with its line-height and weight, so a role is one decision instead of three.

Solo, default names like `text-sm` are fine when the usage rules are clear. On a team, name sizes by use (`text-body-sm`) so the rules survive other people. A [role-based starting scale](#type-scale) is in the reference.

## Heading sizes descend with level

Map heading levels to descending steps of the scale, so a subordinate heading never overpowers its parent. Deep levels may share a size where the scale runs out of steps, as long as weight or letter-spacing keeps them distinct. A heading is never smaller than body text unless it is a deliberate overline. See the [level mapping](#heading-hierarchy).

## Line-height by role

Display text `1.1`, headings `1.2`–`1.3`, body copy `1.5`–`1.6`. Use unitless values so line-height scales with the font size; a fixed `24px` does not.

Tight line-height is for short text. Anything that wraps to three or more lines needs at least `1.4`, even in a height-constrained row. See the [card description example](#line-height-for-wrapping-text).

## Letter-spacing by size

Headings at `24px` and up take `-0.01em` to `-0.02em`. Uppercase labels at `14px` or smaller take `0.05em`. Body copy stays at `0`. Use `em` so tracking scales with the size.

Kerning is built into the font and on by default. `font-kerning: none` is never a fix.

## Cap the measure

Cap long-form text at 60–75 characters per line. Any unit works, as long as a cap exists and the line length lands in range. See [unit choices and the pixel equivalents](#measure-line-length).

## Wrap deliberately

- `text-wrap: balance` evens out headings and short descriptions. Never on paragraphs, and Chromium ignores it past six lines.
- `text-wrap: pretty` keeps a lone word off the last line. Safe on any paragraph, long-form included.
- `overflow-wrap: break-word` where a long word, link or ID could escape the container.
- `white-space: nowrap` on labels and badges where a line break looks broken.

Keep interface text at `text-align: start`. `justify` belongs only in specific editorial layouts.

## Tabular numbers on changing values

Apply `font-variant-numeric: tabular-nums` to timers, counters, prices and numeric table columns, so every digit keeps one width and nothing shifts. Leave figures in prose proportional.

## Truncate with a way back

For one line, `overflow: hidden`, `text-overflow: ellipsis` and `white-space: nowrap`, which Tailwind's `truncate` sets together. For several, `display: -webkit-box`, `-webkit-box-orient: vertical`, `-webkit-line-clamp: 3` and `overflow: hidden`, which Tailwind's `line-clamp-3` emits.

A truncated value needs a way back to the full text, which `layout.md` owns.

## Natural case, typographic punctuation

Store text in natural case and set case with `text-transform`, so a redesign never means rewriting copy.

Rendered text uses typographic characters, never their keyboard stand-ins. Curly quotes, en dashes, the ellipsis character and non-breaking spaces are in the [substitution table](#smart-punctuation). Code keeps straight quotes.

## Underlines from the font

Set `text-underline-position: from-font` and `text-decoration-thickness: from-font`, or tune `text-underline-offset` and thickness by hand. A dotted `text-decoration-style` hints that a word carries extra information, such as an abbreviation or a defined term. See the [underline recipes](#underlines).

Color is the only part of a real underline that animates reliably. Any other underline animation needs a separate element, and its motion is `ui-polish.md`'s.

## Inputs at 16px on mobile

iOS Safari zooms the whole page when an input's text is smaller than `16px`. Two fixes hold `16px` and look different, so ask which one the design wants:

- Size the input up on mobile (`text-base sm:text-sm`). Changes how it looks on small screens.
- Keep `font-size: 16px` and render the intended size with `transform: scale()`. Identical at every viewport, more code to maintain.

Both recipes, plus placeholder and caret styling, are in [details-and-accessibility.md](#forms-and-editable-text).

## Size floors

Start long-form body text at `16px`, the browser default. Move off it only for a reason you can name, such as a typeface that runs small, a narrow measure or a dense professional tool.

UI text can go smaller. Start inputs and menus at `14px` and captions at `13px`, and rarely go below `12px`. Set `font-size` in [`rem`](#units) so the reader's browser font size still applies.

## Font smoothing on the root

Apply `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` once on the root, never per component. Tailwind's `antialiased` sets both.

## Language and bidi behavior

Set `lang` so browsers and assistive technology pick the right quotes, hyphenation and pronunciation. Set `dir` on the document and wherever direction changes. Wrap a mixed-direction value in `<bdi>` and never reorder digits by hand. How long paragraphs and numbers behave is in [wrapping-and-punctuation.md](#internationalization).

## Trim text boxes in tight containers

In buttons and badges, the space a font reserves above and below its letters makes text sit low. `text-box: trim-both cap alphabetic` trims it as a progressive enhancement. See the [edges, keywords and support](#text-trimming-with-text-box).

## Decorative text in CSS, not images

Build drop caps, gradient text, outlines and text shadows in CSS so the text stays selectable and searchable. The [properties and their support](#decorative-text) are in the reference.

## Keep useful text selectable

Keep text selectable by default. `::selection` can carry brand into the reading experience, as long as the selected combination stays legible. [Styling other ranges](#selection) such as search matches is in the reference.

`user-select: none` belongs on a draggable or gesture-driven surface where accidental selection interferes. Never across the interface and never because a button label can be highlighted.

## Before you finish

| Pattern | Fix |
| --- | --- |
| `font-weight` value with no matching weight in the loaded `@font-face` files | Load that face or use a weight the family ships |
| `font-synthesis: none` on body or interface text | Remove it; set only the unwanted longhand after checking the fallback stack |
| `font-variation-settings: "wght"` or `"opsz"` | `font-weight`; drop `"opsz"` so `font-optical-sizing: auto` applies |
| `font-feature-settings: "tnum"` or `"zero"` | `font-variant-numeric: tabular-nums` or `slashed-zero` |
| `line-height` in `px` or `rem` | A unitless value |
| `leading-none` or `leading-tight` on a description, card body or anything that can wrap | `1.4` or more |
| `letter-spacing` in `px` | The same value in `em` |
| Body `font-size` in `px` | `rem` |
| Weight `100`–`300` or `font-thin`, `font-light` on text under `18px` | `400` or heavier |
| `text-wrap: balance` on a paragraph | `text-wrap: pretty` |
| `text-align: justify` in application UI | `text-align: start` |
| `-webkit-line-clamp` without `display: -webkit-box` | Add `display: -webkit-box` and `-webkit-box-orient: vertical` |
| A timer, counter, price or numeric column without `tabular-nums` | `font-variant-numeric: tabular-nums` |
| `...`, `--` or a hyphenated range in rendered strings | `…`, an em dash or an en dash |
| `text-decoration-skip-ink: none` | Remove it; set `text-underline-offset` or `from-font` instead |
| `<input>` with `text-sm` or `14px` and no mobile override | One of the **Inputs at 16px on mobile** fixes |
| `-webkit-font-smoothing` or `antialiased` inside a component | Move it to the root |
| Mixed-direction value such as a name, number or URL without `<bdi>` or `dir` | Wrap it in `<bdi>` |
| `user-select: none` or `select-none` on a layout root or text container | Remove it; keep it only on a drag or gesture surface |


---

## Choosing fonts

Font categories, fallback stacks for a type change, file formats and why fonts look the way they do.

### Choosing a typeface

| Category | Traits | Use for |
| --- | --- | --- |
| Serif | Small strokes at the ends of letters guide the eye along a line | Long passages, editorial reading |
| Sans-serif | Clean, even shapes that stay crisp at small sizes | Default for most interfaces (Helvetica, Inter, Geist) |
| Monospace | Every glyph the same width | Code and fixed-width identifiers; numeric columns use `tabular-nums` instead |
| Display | Drawn for large headlines | Marketing headlines, hero text |
| Script | Mimics handwriting | Rare, decorative moments |

"Display" in a font's name does not make it a display font. SF Pro and Heldane ship a `Display` variant for large sizes and a `Text` variant for small ones. Use the variant matching the size you are setting.

### Fallback stacks for a type change

When a type change is asked for, two routes. `system-ui` gives each operating system's own interface face. A commercial face such as Helvetica Now is a brand decision and still needs a fallback stack.

```css
/* The platform's native interface face */
html {
  font-family: system-ui, sans-serif;
}

/* Commercial brand face with safe fallbacks */
html {
  font-family: "Helvetica Now", "Helvetica Neue", Arial, sans-serif;
}
```

### Formats

| Format | Notes |
| --- | --- |
| `.woff2` | Brotli compression, broadly supported. Use this on the web. |
| `.woff` | Older compression. Fallback only for very old browsers. |
| `.ttf` / `.otf` | Desktop formats with no built-in compression, so larger files. Only when there is no other option. |

How the files load is the project's concern.

### Anatomy of a typeface

| Term | Meaning |
| --- | --- |
| x-height | Height of a lowercase `x` |
| Cap height | Height of uppercase letters |
| Baseline | The invisible line letters sit on |
| Ascender | Part of a letter rising above the x-height |
| Descender | Part dropping below the baseline |

These measurements are why two fonts at the same `font-size` look like different sizes. A large x-height looks bigger.


---

## Spacing and sizing

Units, a starting type scale, the heading mapping, line-height for wrapping text and text trimming.

### Units

| Unit | Behavior |
| --- | --- |
| `px` | Fixed |
| `em` | Scales with the current font size |
| `rem` | Scales with the root font size |
| `%` on `font-size` | Relative to the parent's font size, behaves like `em` |

### Type scale

Pick an existing scale or define one. Tailwind's `text-xs` through `text-9xl`, each pairing a size with a line height, is a solid ready-made choice.

A starting point for a product interface, named by role:

```css
:root {
  --text-caption: 0.8125rem;
  --text-body: 1rem;
  --text-heading: 1.125rem;
  --text-title: 1.5rem;
  --text-display: 2.25rem;
}
```

| Role | Size | Line-height | Weight |
| --- | --- | --- | --- |
| Display | `2.25rem` (36px) | `1.1` | `600` |
| Title | `1.5rem` (24px) | `1.2` | `600` |
| Heading | `1.125rem` (18px) | `1.3` | `600` |
| Body | `1rem` (16px) | `1.5` | `400` |
| Caption | `0.8125rem` (13px) | `1.4` | `400` |

Emphasis within a role is one weight step up (`400` → `500`), not a size change.

### Heading hierarchy

```css
h1 { font-size: var(--text-display); }
h2 { font-size: var(--text-title); }
h3 { font-size: var(--text-heading); }
```

In Tailwind, centralize the per-level classes in a component or `@layer base` rather than repeating them inline.

### Line-height for wrapping text

```css
/* Bad: card description at heading leading */
.card-description { line-height: 1.1; }

/* Good: it wraps to 3 lines, so it reads as body text */
.card-description { line-height: 1.4; }
```

### Text trimming with text-box

`text-box` takes which edges to trim (`trim-both`, `trim-start`, `trim-end`) and where:

| Keyword | Trims at |
| --- | --- |
| `cap` | The cap height (top) |
| `alphabetic` | The baseline (bottom) |
| `text` | The font's own text edge, keeping room for descenders |

```css
/* trim top and bottom */
.badge {
  text-box: trim-both cap alphabetic;
}

/* trim only the top */
.heading {
  text-box: trim-start cap;
}

/* trim only the bottom */
.label {
  text-box: trim-end alphabetic;
}
```

Supported in Chromium 133+ and Safari 18.2+, not yet Firefox. Unsupported browsers keep the default leading.


---

## Variable fonts and OpenType

What a font file can do beyond drawing letters and how to reach those abilities from CSS.

### Static vs variable

- **Static font:** one weight and one style per file. Regular, medium and bold is three files.
- **Variable font:** a whole range in one file. Any value in it works, such as `font-weight: 589`.

A variable font is not automatically better. At one or two weights, static files can be smaller. At several weights, optical sizes or custom axes, a variable font usually wins.

### Disable synthesis narrowly

`font-synthesis: none` disables weight, style, small-cap and position synthesis together. Scope it to an isolated treatment you have verified across the fallback stack:

```css
.brand-wordmark {
  font-synthesis: none;
}
```

To disable one mode, use its longhand: `font-synthesis-weight`, `font-synthesis-style`, `font-synthesis-small-caps` or `font-synthesis-position`.

### Axes

Variable-font controls, each with a four-letter tag. A font supports only the axes its designer included.

| Axis | Tag | Controls |
| --- | --- | --- |
| Weight | `wght` | Stroke thickness (like `font-weight`) |
| Optical size | `opsz` | Details and spacing tuned for the display size |
| Width | `wdth` | Glyph width |
| Slant | `slnt` | Slant angle |
| Custom | e.g. `GRAD` (Roboto Flex) | Whatever the designer built |

Inter's variable file exposes only `wght` and `opsz`.

Optical sizes predate variable fonts. Many families still ship them as separate `Text` and `Display` files instead of an `opsz` axis.

### Raw tags only for custom axes

`font-variation-settings` silently does nothing on a non-variable fallback, where `font-weight` still picks the nearest face:

```css
/* Good: common axes use the properties */
.heading {
  font-weight: 650;
}

/* Good: custom axis with no property of its own */
.heading-grade {
  font-variation-settings: "GRAD" 80;
}

/* Bad: weight via raw tag breaks on fallback fonts */
.heading {
  font-variation-settings: "wght" 650;
}
```

### OpenType features

Unlike axes, features work the same on static and variable fonts. A font ships only the features its designer included.

| Tag | Feature |
| --- | --- |
| `tnum` | Tabular numbers: every digit the same width |
| `zero` | Slashed zero: `0` distinct from `O` |
| `liga` | Ligatures: joins pairs like "fi" into one shape |
| `ss01`–`ss20` | Stylistic sets (numbered slots) |
| `cv01`–`cv99` | Character variants (numbered slots) |

Common features have a `font-variant-*` property, and `font-feature-settings` is for the rest:

```css
/* Good: common features use the properties */
.price {
  font-variant-numeric: tabular-nums;
}

.id {
  font-variant-numeric: slashed-zero;
}

/* Good: niche feature with no property of its own */
.logo {
  font-feature-settings: "ss01" 1;
}
```

### Small caps, superscripts, subscripts

- **Small capitals:** uppercase letters drawn at a smaller size. Enable real ones with `font-variant-caps`.
- **Superscripts** sit above the normal line, the 2 in x², and **subscripts** below it, as in H₂O. Enable proper glyphs with `font-variant-position`.

Both require the font to include the glyphs.

### Stylistic sets and character variants

`ss01` = stylistic set, slot 01. `cv11` = character variant, slot 11. What each slot does differs font to font, which is why they are numbered, not named. Check the font's docs. In Inter, `ss01` switches to open digits and `cv11` swaps in a single-story `a`.


---

## Wrapping and punctuation

Line length, typographic characters and mixed-direction text.

### Measure (line length)

Any unit works. `65ch` measures characters directly, one `ch` being the width of the `0` in the current font, and a pixel or rem cap is just as good. At a `16px` body size the 60–75 character range lands roughly between `560px` and `680px` depending on the font. Tailwind's `max-w-xl` (`576px`), `max-w-2xl` (`672px`) and `max-w-prose` (`65ch`) all fit. Recheck the cap if the body font size changes.

### Smart punctuation

| Instead of | Use |
| --- | --- |
| Straight quotes `"..."` | Curly quotes that curve around the text (keep straight quotes in code) |
| Hyphen in ranges | En dash: `2010–2020` |
| Two hyphens for an aside | Em dash character |
| Three periods `...` | The single ellipsis character `…` |
| Regular space in `10 km` | `&nbsp;` so the value never breaks apart |
| Uncontrolled word breaks | `&shy;` to mark where a word may break, or `hyphens: auto` with the correct `lang` |

### Internationalization

- **Long paragraphs align by their own language.** A one- or two-line snippet follows the surrounding UI's direction. A paragraph of three or more lines aligns to its own script instead, so an English paragraph stays start-aligned LTR even inside an RTL interface. `text-align: start` with the correct `lang` and `dir` on the paragraph element handles this.
- **Digits keep their order.** A phone number or "541" reads identically in RTL, because the Unicode bidi algorithm keeps digit runs left to right. `<bdi>` repairs a value whose order adjacent RTL text disturbs.


---

## Details and accessibility

Underlines, selection, form text and decorative text.

### Underlines

From the font's own metrics:

```css
a {
  text-underline-position: from-font;
  text-decoration-thickness: from-font;
}
```

A dotted underline on an abbreviation:

```css
abbr {
  text-decoration: underline dotted;
}
```

Or tune manually:

```css
a {
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: var(--color-gray-1000);
  transition: text-decoration-color 200ms ease-out;
}

a:hover {
  text-decoration-color: var(--color-gray-1200);
}
```

### Selection

- `::target-text` styles the phrase a shared link scrolls to.
- The Custom Highlight API styles ranges you pick yourself, like search matches, without extra markup.

### Forms and editable text

- `::placeholder` styles the hint in an empty field.
- `caret-color` colors the blinking insertion bar. A fully custom caret is hard to build and rarely worth it.

#### iOS input zoom

**Size up on mobile.** The input renders at `16px` on small screens and drops to the design size from the `sm` breakpoint up. Nothing to compensate, but the mobile input no longer matches the desktop one.

```tsx
<input className="text-base sm:text-sm" type="email" />
```

**Scale the text down.** Keep `font-size` at `16px` so Safari never zooms, then render at the intended size with a transform. Widen the element by the inverse of the scale so it still fills its container once shrunk. Divide `line-height` by the same factor so the intended leading survives. `origin-left` pins the text to the start edge, `origin-right` under RTL. Above the breakpoint, drop the transform and set the real size.

```tsx
// 13px rendered from a 16px font-size: 13 / 16 = 0.8125
<div className="flex h-10 items-center overflow-hidden rounded-[10px] bg-gray-300 px-2.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500">
  <input
    className="h-full w-[calc(100%/0.8125)] shrink-0 origin-left rtl:origin-right scale-[0.8125] bg-transparent text-base leading-[calc(1.125/0.8125)] outline-none sm:w-full sm:scale-100 sm:text-[13px]"
    type="email"
  />
</div>
```

`shrink-0` preserves the compensated width inside the flex wrapper. The wrapper clips the oversized layout box and draws an unscaled focus outline. Use the project's focus color and verify its contrast against the surrounding surface.

The transform shrinks the whole box, not only the glyphs, so let a wrapper draw the field's surface and keep the input transparent. A background, border or ring on the scaled element shrinks with the text and misses the intended hit area.

### Decorative text

| Property | Effect |
| --- | --- |
| `::first-letter` | Drop cap, widely supported |
| `::first-line` | Styles only the first line |
| `initial-letter` | Sizes the drop cap; Safari needs `-webkit-initial-letter`, no Firefox yet |
| `background-clip: text` | Clips a background or gradient to the letter shapes |
| `-webkit-text-stroke` | Outlines the letters; works across modern browsers despite the prefix |
| `text-shadow` | Like `box-shadow` but follows the character shapes |

If `-webkit-text-stroke` draws lines inside the letters, the font has overlapping contours. Variable fonts often keep them unmerged, so use the static cut for stroked text.


---

## CSS cheat sheet

One-line lookup for every typography CSS declaration covered by this skill, with the Tailwind 4 equivalent. Where no utility exists, the arbitrary-value form is shown. Pick the column that matches the project: the declaration in plain CSS, CSS Modules, styled-components or StyleX codebases, the utility in Tailwind codebases.

### Font

| Declaration | What it does | Tailwind |
| --- | --- | --- |
| `font-family: sans-serif` | The sans family | `font-sans` |
| `font-family: serif` | The serif family | `font-serif` |
| `font-family: monospace` | The monospace family | `font-mono` |
| `font-size` | Size from the type scale | `text-*` |
| `font-weight` | Any value from 1 to 1000 | `font-*` |
| `font-style: italic` | Switch to italic style | `italic` |
| `-webkit-font-smoothing` + `-moz-osx-font-smoothing` | Smooth macOS font rendering; apply once at the root | `antialiased` |
| `font-synthesis: none` | Disable all synthesized forms after verifying fallbacks and emphasis | `[font-synthesis:none]` |
| `font-feature-settings` | Toggle OpenType features | `[font-feature-settings:"ss01"]` |
| `font-variation-settings` | Tune variable font axes | `[font-variation-settings:"GRAD"_80]` |
| `font-optical-sizing: auto` | Optical size follows font size; the default, so leave it | none needed |
| `font-variant-caps` | Real small capitals | `[font-variant-caps:small-caps]` |
| `font-variant-position` | Real super and subscripts | `[font-variant-position:super]` |
| `font-variant-numeric: tabular-nums` | Equal-width digits | `tabular-nums` |
| `font-variant-numeric: slashed-zero` | Tell 0 from O | `slashed-zero` |

### Spacing and layout

| Declaration | What it does | Tailwind |
| --- | --- | --- |
| `letter-spacing` | Space between letters | `tracking-*` |
| `line-height` | Space between lines | `leading-*` |
| `font-kerning` | Kerning on or off | `[font-kerning:none]` |
| `text-box: trim-both` | Trim space above and below | `[text-box:trim-both_cap_alphabetic]` |
| `max-width` on text columns | Cap at ~60–75 characters per line | `max-w-xl` / `max-w-2xl` / `max-w-prose` |
| `text-align` | Where lines start and end | `text-start` / `text-center` |

### Wrapping and overflow

| Declaration | What it does | Tailwind |
| --- | --- | --- |
| `text-wrap: balance` | Even out heading lines | `text-balance` |
| `text-wrap: pretty` | Keep a lone word off the last line | `text-pretty` |
| `text-overflow: ellipsis` | Ellipsis for clipped text | `text-ellipsis` |
| `overflow: hidden` + `text-overflow: ellipsis` + `white-space: nowrap` | Single-line truncation | `truncate` |
| `-webkit-line-clamp` + `display: -webkit-box` + `-webkit-box-orient: vertical` + `overflow: hidden` | Cut off after N lines | `line-clamp-*` |
| `overflow-wrap: break-word` | Break long strings | `break-words` |
| `white-space: nowrap` | Stop wrapping | `whitespace-nowrap` |
| `text-transform` | Change the casing | `uppercase` / `capitalize` |
| `hyphens: auto` | Hyphenate by the element's `lang` | `hyphens-auto` |

### Decoration and interaction

| Declaration | What it does | Tailwind |
| --- | --- | --- |
| `text-decoration-line: underline` | Draw an underline | `underline` |
| `text-decoration-color` | Underline color | `decoration-*` |
| `text-decoration-thickness` | Underline thickness | `decoration-1` / `decoration-2` |
| `text-underline-offset` | Push the line down | `underline-offset-*` |
| `text-underline-position: from-font` | Underline position from the font | `[text-underline-position:from-font]` |
| `text-decoration-style` | Dotted, dashed or wavy | `decoration-dotted` / `decoration-wavy` |
| `text-decoration-thickness: from-font` | Underline set by the font | `decoration-from-font` |
| `text-decoration-skip-ink` | Gaps around descenders; `auto` is the default | `[text-decoration-skip-ink:auto]` |
| `caret-color` | Tint the text cursor | `caret-*` |
| `user-select: none` | Suppress selection on a verified drag/gesture conflict only | `select-none` |
| `text-shadow` | Shadow behind the letters | `text-shadow-*` |
| `-webkit-text-stroke` | Outline the letters | `[-webkit-text-stroke:1px_black]` |
| `background-clip: text` | Clip a background to the letters | `bg-clip-text` |
| `initial-letter` | Size a drop cap | `[initial-letter:3]` |


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- ui-craft: typography/ui-craft/typography.md
- impeccable: typography/impeccable/typeset.md
