# variants (workflow, from variant)

> Builds multiple variants of a component you're working on and helps you iterate and pick one.

This skill takes one described piece of UI and builds three versions that differ on purpose. They go behind a picker in the real page, so you can flip between them and choose.

It produces candidates and never ranks them. Reviewing existing UI is `interface-review` and `workflows/interface-audit.md`, stress testing one component is `break` and working through a component's states is `state-machine`.

## Different answers, not different tints

Each variant is a different answer to the same brief, on an axis this collection owns:

| Axis | Owner | What varies |
| --- | --- | --- |
| Structure | `layout.md` | Grouping, order, column count, what collapses |
| Density | `layout.md` | Spacing scale, how much fits |
| Emphasis | `color.md` | Where filled color goes, what recedes |
| Type | `typography.md` | Scale steps, weight contrast, measure |
| Voice | `writing.md` | Labels, tone, how much copy |

Pick **one primary axis** and give each variant a different position on it. The axis names the picker's group heading. Secondary choices follow from it rather than varying on their own. A dense variant may need a smaller type step, and that is coherence, not a second axis.

## The floor every variant clears

Before a variant enters the picker it clears `workflows/interface-audit.md`'s escalation triggers, which are:

- Every control has an accessible name and a visible focus indicator.
- Keyboard reaches everything a pointer does.
- Motion and auto-playing content respect `prefers-reduced-motion`.
- Nothing clips, overlaps or becomes unreachable at 320px width or 200% zoom.
- Body and control text pass their required contrast ratio.
- No state or meaning rides on color alone, and no state change on motion alone.
- A destructive action has a confirmation, an undo or a distinct treatment.
- Truncated content has a way to reach the full value.
- Nothing hides past a scroll edge or behind a disclosure with no visible cue.
- Every error names a way to recover.
- No semantic color is used against its meaning, such as the danger hue on a non-destructive action.

That floor is identical across variants. It is not an axis and never trades against one. Where a direction can only work by breaking it, say so and drop the direction.

## 1. Scope one piece

One piece of UI per run. "The dashboard" is not a piece; the metric card is. Where the request spans several, list the candidates and ask which one to explore.

Restate the brief in one sentence: what the thing is, where it renders, what it has to do.

## 2. Learn the ground

Variants have to look like they could ship tomorrow, so read what they stand on:

- The styling system, the component library and any motion library.
- The tokens: color, spacing, radius, type scale, easing.
- The product's density and voice. A dense professional tool bounds how far the boldest variant may go.
- Where the piece renders: against what background, beside which neighbours, at which widths.

With no project to read, use neutral grays, one accent and the system font stack, and say that is what you did.

## 3. Name the axis before writing code

Default to three variants. Go to five only when asked.

Write the set down first, a name and an axis position each. Names say what the direction is, so `Quiet`, `Editorial`, `Dense`, never `Option A`.

This step is done when no two variants share a position and you can state each one's axis in a phrase.

## 4. Build it into the real page

Host the variants on the page that will actually contain the piece, with the real chrome, the real neighbours and realistic data.

Select with a URL search param such as `?__variant=quiet`, so every variant is a link you can send someone. A grouped list beside the piece sets it. Where there is no room beside the piece, it moves above it as a select with the same groups. [picker.md](#picker) holds the spec.

Render one variant at a time, full size. Thumbnails distort spacing and scale, and spacing is usually the thing you are choosing between.

Variant files may import production components. Only the hosting page imports a variant, and nothing else imports from the harness.

Where no page can host it, build one self-contained HTML file and keep the same picker.

Give every variant real content: product-shaped copy, plausible names and the number of items the page will really carry. Lorem ipsum and three rows make every structure look good.

## 5. Present the tradeoffs and stop

Load the page once in a browser already at hand and flip through every variant. Each one renders, each interaction responds and the console is clean. With no browser at hand, say so and hand the URL over for the user to check.

Then hand the decision over:

| Variant | Axis position | Right when | Costs |
| --- | --- | --- | --- |
| Quiet | Lowest visual weight | The page is used daily | Least memorable |
| Editorial | Largest type, most space | The moment deserves weight | Eats vertical space |

Say where the picker is running, which key flips it and which width you judged at. The answer can change between 375px and 1440px.

Never mark a favourite in the table. Asked directly, answer from how often the piece is seen and from the product's personality, not from which one you enjoyed building.

## 6. Promote one, delete the rest

On a choice, build that variant properly where it belongs, following the project's own conventions. Then delete the other variants, the picker and the hosting page's import of the variants. Search for the variant names and the `__variant` param, and check the diff leaves nothing of the harness behind.

Asked for another round instead, keep the harness and run **Name the axis before writing code** again, taking new positions around the direction you leaned toward.

## Before you finish

| Mistake | Fix |
| --- | --- |
| Variants differ only in accent color or copy | Move one to a different position on the primary axis, or cut it |
| Every axis varies at once | Vary one; let the rest follow from it |
| Judged on a blank route | Host them on the page that will contain the piece |
| Lorem ipsum, three rows, "Jane Doe" | Real copy and the item count the page will really carry |
| The boldest variant skips keyboard or focus | Clear the floor or drop the direction |
| A favourite marked in the table | State each variant's cost and let the user choose |
| Picker restyled with the project's tokens | Keep it visibly outside the design system |
| One long row of tabs, one per variant | A grouped list beside the piece that scrolls on its own; a select above it where the list does not fit |
| Harness left behind after promotion | Delete it and search for the names and the param |


---

## The picker

The control that switches variants. It sits beside the thing being judged, so build the spec below and leave it alone.

### Deliberately outside the design system

Never style the picker with the project's tokens, fonts or colors. One that looks native to the product becomes part of what you are looking at.

One dark neutral surface, the system font stack and no project variables. It does not follow the theme, because dark reads as chrome over both light and dark pages.

### A grouped list, so it scales

Variants sit in a vertical list under the group headings from **Name the axis before writing code**. A row of tabs runs off the screen past about seven variants; a grouped list stays scannable at thirty.

- Every group has a heading, even when there is only one, and every heading carries the same small arrow icon.
- Variants and groups keep the order they were written down in.

### Behavior

- It sets a `__variant` search param and reads the active variant back from it. The URL is the source of truth, so every variant is a link.
- The arrow keys, up and down or left and right, step through every variant in list order, across groups.
- `H` hides and shows the picker, list and select alike, for screenshots and screen recordings.
- Key handling ignores events with a modifier key, events already `defaultPrevented` and events from inputs, textareas, selects and contenteditable elements.
- The active button carries `aria-pressed="true"` and scrolls into view inside the list. The list carries a label, and each group is a `role="group"` labelled by its heading.
- The piece switches instantly and keeps the scroll position. Only the active label eases its font weight.
- The list and the select are both always rendered, and a container query shows one, so the active variant survives a resize.

### Structure

```html
<div class="variant-page">
  <div class="variant-layout">
    <nav class="variant-picker" aria-label="Variants">
      <!-- one group per heading -->
      <div class="variant-picker-group" role="group" aria-labelledby="variants-density">
        <span class="variant-picker-heading" id="variants-density">
          <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v4a3 3 0 0 0 3 3h7" /><path d="m10 7 3 3-3 3" /></svg>
          Density
        </span>
        <button type="button" data-variant="quiet" aria-pressed="true">Quiet</button>
        <button type="button" data-variant="dense" aria-pressed="false">Dense</button>
      </div>
    </nav>

    <div class="variant-picker-select">
      <select aria-label="Variant">
        <optgroup label="Density">
          <option value="quiet" selected>Quiet</option>
          <option value="dense">Dense</option>
        </optgroup>
      </select>
      <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4" /></svg>
    </div>

    <div class="variant-stage">
      <!-- the piece, in a container as wide as it is in production -->
    </div>
  </div>
</div>
```

### Placement and styling

A container query on the page picks the layout:

- **Room for the list beside the piece:** two columns, the list then the piece at its production width. The list is sticky and scrolls inside itself once it outgrows the viewport, so it stays put while you flip variants.
- **No room:** the select sits above the piece, in the page flow. A phone opens its native menu for it, which suits a long list.

The page spans the full viewport width, because an app's layout often caps content near the piece's own width. The query measures the page inside its padding, so the breakpoint is the list and the gap plus the piece, which is 232px plus the production width. The CSS below uses a 644px piece. Put the production width in `max-width` and the grid column, and set the query to 232px plus it.

The list's 6px padding keeps its own scrolling from clipping focus rings. The reset strips the select's native arrow, so the chevron is what shows it opens.

```css
.variant-page {
  container: variant-page / inline-size;
  margin-inline: calc(50% - 50vw);
  padding: 24px;
}

.variant-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 644px;
  margin-inline: auto;
}

.variant-picker {
  all: unset;
  display: none;
  flex-direction: column;
  gap: 16px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  scrollbar-width: none;
  padding: 6px;
  border-radius: 14px;
  background: rgb(20 20 20 / 0.92);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
  font: 13px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  user-select: none;
}

.variant-picker-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.variant-picker-heading {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 6px;
  font-size: 11px;
  font-weight: 500;
  color: rgb(255 255 255 / 0.45);
}

.variant-picker button {
  all: unset;
  flex: none;
  padding: 8px 10px;
  border-radius: 8px;
  font: inherit;
  color: rgb(255 255 255 / 0.6);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 200ms ease-out, font-weight 200ms ease-out;
}

.variant-picker button:hover {
  color: rgb(255 255 255 / 0.85);
}

.variant-picker button[aria-pressed="true"] {
  background: rgb(255 255 255 / 0.14);
  color: rgb(255 255 255);
  font-weight: 500;
}

.variant-picker button:focus-visible {
  outline: 2px solid rgb(255 255 255 / 0.7);
  outline-offset: 2px;
}

.variant-picker-select {
  position: relative;
  align-self: flex-start;
  max-width: 100%;
  color: rgb(255 255 255);
}

.variant-picker-select select {
  all: unset;
  box-sizing: border-box;
  max-width: 100%;
  padding: 10px 36px 10px 16px;
  border-radius: 999px;
  background: rgb(20 20 20 / 0.92);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
  font: 500 13px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  cursor: pointer;
}

.variant-picker-select select:focus-visible {
  outline: 2px solid rgb(255 255 255 / 0.7);
  outline-offset: 2px;
}

.variant-picker-select svg {
  position: absolute;
  top: 50%;
  right: 14px;
  translate: 0 -50%;
  pointer-events: none;
  color: rgb(255 255 255 / 0.6);
}

/* 208px list + 24px gap + 644px piece */
@container variant-page (min-width: 876px) {
  .variant-layout {
    display: grid;
    grid-template-columns: 208px 644px;
    justify-content: center;
    gap: 24px;
    align-items: start;
    max-width: none;
  }

  .variant-picker {
    display: flex;
    position: sticky;
    top: 24px;
  }

  .variant-picker-select {
    display: none;
  }
}
```

`all: unset` keeps the project's global button, nav and select styles out. In a framework, keep the class names and the structure and change only the rendering syntax.
