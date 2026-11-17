# Accessibility (canonical)

Merged from better-accessibility. Rules first, then detail sections. Review/report format: `reference/workflows/review-report-format.md`.

This skill reviews and fixes semantics, keyboard and focus behavior, accessible names, forms, announcements, motion and zoom. It reports each failure against the WCAG criterion it breaks and writes the fix in the project's styling system.

Reviewing means two walks. Keyboard-only, where every flow completes without a mouse. Then screen-reader, where every control announces a name, a role and its state. When unsure, take the platform default over a custom rebuild, and remove ARIA rather than add it.

Contrast measurement and color fixes belong to `color.md`. Text sizing, iOS input zoom and language metadata belong to `typography.md`. Spacing between targets and spatial RTL belong to `layout.md`. Label, error and alt-text wording belong to `writing.md`. Animation recipes, hover styling and scroll containment belong to `ui-polish.md`.

## Criteria, not conventions

A finding cites a WCAG 2.2 Level A or AA criterion by number, or a concrete task an assistive-technology user cannot complete. Everything else is a recommendation and never `HIGH`. That covers AAA criteria, APG conventions, the one-`<h1>` and no-skipped-levels outline and the 44px and 40px targets. The criterion thresholds below are exact. The larger targets are heuristics, so keep an established, usable density.

## Native elements first

The first rule of ARIA: don't use ARIA when a native element exists. `<button>` for actions, `<a href>` for navigation, never `<div onClick>`. A real link must support Cmd/Ctrl/middle-click. See [semantics-and-aria.md](#semantics-and-aria) for landmarks and button-vs-link.

## Disabled means unavailable

Use native `disabled` when a control is genuinely unavailable. Reach for `aria-disabled="true"` only when it should stay focusable, then block pointer, keyboard and form behavior in code and style the state explicitly. The rules are in [semantics-and-aria.md](#semantics-and-aria).

## Visible focus rings

Style `:focus-visible`, not bare `:focus`. Keyboard users get a ring and mouse users usually don't. Prefer the browser's unmodified indicator.

A custom ring needs a project focus token or another explicit color. It must reach 3:1 against every adjacent color it crosses, `currentColor` included, under 1.4.11. A `2px` solid perimeter with a 3:1 change of contrast is the 2.4.13 AAA target. Never use `outline: none` without a verified replacement, and preserve system colors in forced-colors mode.

A focused element must never sit fully hidden behind a sticky header, footer or banner (2.4.11). Pad the scroller by the sticky chrome's height, a fix `layout.md` owns. Recipes are in [focus-and-keyboard.md](#focus-and-keyboard).

## Full keyboard support

Every pointer interaction needs a keyboard path. Follow the ARIA APG patterns: Escape closes overlays, arrow keys move within composite widgets, Tab moves between widgets, Enter and Space activate buttons.

Use only `tabindex="0"` to join the natural tab order and `tabindex="-1"` for programmatic focus. Positive values break that order. Composite widgets use roving tabindex, where the active item is `0` and every other is `-1`. Where focus must stay in an input, as in a combobox, use `aria-activedescendant` instead. Key maps per widget are in [focus-and-keyboard.md](#focus-and-keyboard).

## Trap and restore focus

Prefer `<dialog>` opened with `showModal()`, which makes the background inert and handles Escape. A custom overlay sets `inert` on the background, `role="dialog"` and `aria-modal="true"` on itself. Either way, move focus inside on open and return it to the trigger on close.

Client-side route changes reset nothing. Update `document.title` and move focus to the new view's `<h1>` or `<main>`. Both recipes are in [focus-and-keyboard.md](#focus-and-keyboard).

## Minimum hit area

WCAG 2.5.8's Level AA baseline is a 24×24 CSS-pixel target, or one of its exceptions. Aim for 44×44px on touch and 40×40px on desktop where density permits. Extend with a pseudo-element when the visible element should stay smaller.

Never let extended hit areas overlap. Give decorative layers `pointer-events: none`, so a glow never swallows the clicks meant for the control beneath it.

Every drag interaction needs a single-pointer alternative, such as buttons or a menu that reorder or move the same item (2.5.7). Sizes, exceptions and collision rules are in [hit-areas.md](#hit-areas).

## Label and type every control

Every input gets a `<label for>` or a wrapping `<label>`. A placeholder is never a label. Label and control share one hit target, with no dead zone between a checkbox and its text.

Add a valid `autocomplete` token and a descriptive `name` attribute, plus the `type` and `inputmode` that summon the right keyboard. Never block paste; users paste passwords and one-time codes. See [forms.md](#forms).

## Errors that announce

Validate on submit, never by disabling submit until the form is valid. Mark failing fields `aria-invalid="true"`, point `aria-describedby` at the inline error text and focus the first invalid field. Submit behavior while the request runs is in [forms.md](#forms).

## Accessible names everywhere

Icon-only buttons need a descriptive `aria-label`. Visible label text must appear in the accessible name. Decorative elements get `aria-hidden="true"`, never on a focusable element.

## Pair color with a second cue

Status needs a redundant cue: an icon, text or an underline alongside the color (1.4.1).

This skill decides which contrast requirement applies:

| Criterion | Applies to | Minimum |
| --- | --- | --- |
| 1.4.3 AA | Text | 4.5:1 |
| 1.4.3 AA | Large text, at least `24px` or `18.67px` bold | 3:1 |
| 1.4.11 AA | UI component boundaries, states and meaningful graphics | 3:1 |

Inactive controls and logos are exempt. Use `color.md` to measure the rendered pair. When it fails, report the pair and the criterion it misses, and leave the colors alone unless asked.

## Honor prefers-reduced-motion

Wrap motion in `@media (prefers-reduced-motion: no-preference)` so it is opt-in. Under reduced motion, replace slides and scales with opacity cross-fades, and kill parallax and autoplay entirely. See [motion-and-zoom.md](#motion-and-zoom).

## Nothing the user needs runs on a timer

Anything moving, blinking or updating on its own for more than 5 seconds needs a visible pause control (2.2.2). Toasts carrying an action or an error stay until dismissed. The rules are in [motion-and-zoom.md](#motion-and-zoom).

## Announce dynamic content

Three mechanisms, three jobs. `aria-describedby` carries field-specific validation. A polite live region (`role="status"`) carries non-urgent updates not tied to a control, such as toasts and result counts. `role="alert"` carries urgent untied errors and nothing else.

Repeated polite announcements need a stable empty region rendered before its text updates. Dynamically inserted alerts vary in support, so test them on the screen readers you target. See [screen-readers.md](#screen-readers).

## Alt text by purpose

Decorative images get `alt=""`. Informative images describe the meaning. Functional images describe the action, never the picture. The full table is in [screen-readers.md](#screen-readers).

## Structure is navigation

Use headings that describe their sections and form a coherent outline. Expose one visible primary `<main>` landmark. When repeated navigation or chrome precedes it, make a "Skip to content" link the first focusable element. Anchored headings get `scroll-margin-block-start`.

## Survive zoom and text resize

Text must survive 200% resize (1.4.4), and the page must reflow at 320px width without horizontal scrolling (1.4.10). Text containers take `min-height`, not `height`, and `layout.md` owns the rest of that fix. Never set `maximum-scale=1` or `user-scalable=no` in the viewport meta. iOS input zoom is fixed with `typography.md`'s `16px` rule instead.

## Before you finish

| Pattern | Fix |
| --- | --- |
| `outline: none` or `outline-none` with no `focus-visible` replacement nearby | Restore the browser ring or add a verified custom one |
| `<div onClick` or `<span onClick` | Use `<button>`, or `<a href>` when it navigates |
| `role="button"` or `role="tab"` with no `onKeyDown` | Use the native element, or implement the APG key map |
| `tabIndex={1}` or any positive `tabindex` | Fix the DOM order and use `0` |
| `disabled={!isValid}` on a submit button | Keep it enabled and validate on submit |
| `{msg && <div role="status">`, region mounted with its text | Render the empty region first and update its text |
| `aria-live="assertive"` on a success toast | `role="status"` |
| `<img` with no `alt` attribute | `alt=""` if decorative, otherwise describe the purpose |
| `aria-label` whose text omits the visible label | Start the name with the visible text |
| `aria-hidden` on an ancestor of a button, link or input | Remove it, or make the subtree inert |
| `maximum-scale=1` or `user-scalable=no` | Remove it |
| Tooltip on a natively `disabled` control | Text beside it, or `aria-disabled` so it stays focusable |
| `onDragStart` or a drag library with no button alternative | Add a single-pointer path to the same result |


---

## Focus and keyboard

Focus rings, skip links, tabindex, focus trapping and the APG keyboard patterns.

### Focus rings

The browser shows `:focus-visible` for keyboard and assistive-tech focus. It suppresses it for mouse clicks on buttons and links but still shows it in text inputs. An `outline: none` or `focus:outline-none` with no visible replacement leaves sighted keyboard users with no way to see where they are.

The browser's unmodified indicator adapts to platform and forced-color settings without the author predicting every background. Adding only `outline-offset` preserves it. A custom `outline: 2px solid` with no color renders `currentColor`, which may fail against the colors the outline crosses. The preference order:

```css
/* Best: keep the browser ring, just give it breathing room */
:focus-visible {
  outline-offset: 2px;
}

/* Custom ring when the design requires one: use the project's verified token */
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

```tsx
// Tailwind: use the project's focus token or established focus-ring utility
<button className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]">
  Save
</button>
```

Check the whole perimeter of a custom indicator against every adjacent color it crosses. That means component fills, page surfaces, images, gradients and hover and selected states. A token, brand color or `currentColor` passes only when that rendered check does.

In `forced-colors: active` (Windows High Contrast), keep the default color adjustment or name a system color such as `Highlight`. `forced-color-adjust: none` freezes the authored color, so use it only where you have checked the control stays perceivable.

Group focus styles with `:focus-within` when a wrapper should light up while an inner input has focus, such as a search box with an icon inside the border.

### Focus not obscured

Sticky chrome hides whatever scrolls under it, including the element that just received focus. Pad the scroll container by the sticky element's height with `scroll-padding-block-start`, and by a sticky footer or cookie banner's height with `scroll-padding-block-end`. The recipe is `layout.md`'s.

### Skip link

Target `<main id="main">` and visually hide the link until focused:

```css
.skip-link {
  position: absolute;
  inset-inline-start: -999px;
}
.skip-link:focus {
  inset-inline-start: 16px;
  inset-block-start: 16px;
}
```

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header>…</header>
  <main id="main">…</main>
</body>
```

Give in-page anchor targets `scroll-margin-block-start`, such as `80px` under a sticky header, so the target isn't hidden when jumped to.

### tabindex rules

- `tabindex="0"`: adds an element to the natural tab order. Only for custom interactive elements that aren't natively focusable.
- `tabindex="-1"`: focusable via JavaScript only (`el.focus()`). Use for headings you move focus to, modal containers and roving-tabindex members.
- Positive `tabindex`: never. It hijacks the tab order for the whole page. Fix the DOM order instead.

#### Roving tabindex

Composite widgets, meaning tabs, menus, toolbars and radio groups, occupy one Tab stop. The active item has `tabindex="0"`, all others `tabindex="-1"`, and arrow keys move both focus and the `0`:

```tsx
<div role="tablist">
  {tabs.map((tab, i) => (
    <button
      role="tab"
      tabIndex={i === activeIndex ? 0 : -1}
      aria-selected={i === activeIndex}
      onKeyDown={handleArrowKeys} // ArrowLeft/ArrowRight move activeIndex, wrapping
    >
      {tab.label}
    </button>
  ))}
</div>
```

A combobox keeps DOM focus in its input instead. Point `aria-activedescendant` on the input at the `id` of the highlighted option and update it on arrow keys.

### Focus trapping and restoration

Native `<dialog>` with `showModal()` makes everything behind it inert and closes on Escape:

```tsx
dialogRef.current.showModal(); // on open
dialogRef.current.close(); // on close
triggerRef.current?.focus(); // return focus to the element that opened it
```

A custom overlay that can't use `<dialog>` needs `role="dialog"`, `aria-modal="true"` and an accessible name via `aria-labelledby`. Put `inert` on everything behind it, which removes background content from the tab order and from assistive tech in one move:

```tsx
// On open
document.getElementById("app-content").inert = true;
const dialog = dialogRef.current;
(dialog.querySelector("[autofocus]") ??
  dialog.querySelector("button, [href], input, select, textarea"))?.focus();

// On close
document.getElementById("app-content").inert = false;
triggerRef.current?.focus();
```

Either way:

- On open, focus the first focusable element. For destructive confirmations, focus the least destructive action instead.
- On close, return focus to the trigger, or to the nearest logical container if the trigger is gone.

### Keyboard patterns (ARIA APG)

Native elements come with these behaviors; custom widgets must implement them.

| Widget | Keys |
| --- | --- |
| Dialog | Tab/Shift+Tab cycle inside (wrap at ends); Escape closes |
| Tabs | Arrow keys move between tabs (wrapping); Tab exits to the panel; Home/End jump to first/last |
| Menu button | Enter/Space/ArrowDown opens and focuses first item; ArrowUp opens and focuses last; arrows navigate; Escape closes and refocuses the button |
| Disclosure / accordion | Header is a `<button aria-expanded>`; Enter and Space toggle |
| Combobox | ArrowDown opens/moves into the list; Enter accepts; Escape closes and returns to the input; typing filters |
| Listbox / radio group | Arrow keys move selection; one Tab stop for the whole group |

Universal rules:

- Escape dismisses whatever opened last: tooltip, then menu, then dialog.
- Tabs choose activation mode: automatic (panel switches on arrow focus) when panels render instantly, manual (Enter/Space to activate) when switching is expensive.
- Enter in a single-line text input submits its form natively. In `<textarea>`, Enter inserts a newline, and ⌘/Ctrl+Enter submits only if you implement it.

### SPA route changes

Client-side navigation doesn't reset focus or announce anything. On route change, update `document.title` to match the new context, then move focus to the new view's `<h1>` (given `tabindex="-1"`) or to `<main>`. Restore scroll position on history traversal with back and forward, and scroll to top on a new navigation.


---

## Semantics and ARIA

Native elements first, landmarks, accessible names and the ARIA rules that keep custom widgets honest.

### The rules of ARIA

1. If a native HTML element with the semantics and behavior you need exists, use it instead of repurposing another element with ARIA.
2. Don't change native semantics unless you really have to.
3. Every interactive ARIA control must be keyboard-operable; a role is a promise of the full keyboard model, states and behavior.
4. All interactive elements must have an accessible name.

No ARIA is better than bad ARIA. A screen reader trusts your roles, so a wrong one is worse than none.

### Button vs link vs div

| Element | Use for | Why |
| --- | --- | --- |
| `<a href>` | Navigation: anything that goes somewhere or changes the URL | Free Cmd/Ctrl/middle-click, right-click → copy link, Enter activation |
| `<button>` | Actions: submit, toggle, open, delete | Free focus, Enter *and* Space activation, form semantics |
| `<div onClick>` | Nothing | No role, no focus, no keyboard; screen readers see plain text |

```tsx
// Bad: invisible to keyboard and screen readers
<div onClick={openSettings}>Settings</div>

// Good: focus, Enter/Space activation and semantics for free
<button onClick={openSettings}>Settings</button>
```

A "button" that navigates is a styled `<a>`, and a "link" that performs an action is a styled `<button>`.

Where a native element is truly impossible, the full polyfill is `role="button"` plus `tabindex="0"` plus Enter and Space handlers, which is why the native element is always less code.

### Landmarks and headings

- `<header>`, `<nav>`, `<aside>` and `<footer>` map to landmarks screen-reader users jump between.
- Multiple landmarks of the same type need distinguishing labels: `<nav aria-label="Primary">`, `<nav aria-label="Breadcrumbs">`.
- Headings are structure, not styling. Style a heading level with CSS instead of picking the tag by size.
- `<title>` matches the current context, most specific first: `Billing · Settings · Acme` (2.4.2).

### Accessible names

Name precedence: `aria-labelledby` > `aria-label` > native label (`<label>`, text content, `alt`) > `title` attribute.

- Prefer visible text or `aria-labelledby` over `aria-label`, which is invisible, drifts out of sync with the UI and is handled inconsistently by translation tools.
- Icon-only buttons always need a name: `<button aria-label="Close">` with the icon `aria-hidden="true"`.
- WCAG 2.5.3 Label in Name: a button showing "Send" with `aria-label="Submit message"` breaks voice control users who say "click Send".

```tsx
// Good: name from visible text, icon hidden
<button>
  <TrashIcon aria-hidden="true" /> Delete
</button>

// Good: icon-only, explicit name
<button aria-label="Delete">
  <TrashIcon aria-hidden="true" />
</button>
```

Keeping brand names and code tokens out of auto-translation with `translate="no"` belongs to `typography.md`.

### Common ARIA mistakes

| Mistake | Why it fails |
| --- | --- |
| `aria-label` on a plain `<div>` or `<span>` | ARIA 1.2 prohibits naming the `generic` role, and most screen readers ignore it |
| `<button role="button">` | Redundant role; adds noise, no benefit |
| `aria-labelledby`/`aria-describedby` pointing at a missing ID | Silently produces no name or description |
| `role="menu"` on a nav list | `menu` promises app-style arrow-key behavior; site navigation is `<nav>` with a list |

### Disabled states

Native `disabled` supplies the platform's complete disabled behavior. It removes the control from the tab order, suppresses activation, applies `:disabled` and excludes form controls from submission. `aria-disabled="true"` only announces the state, changing neither focusability, nor behavior, nor styling.

- Never disable submit to gate validation. Validate on submit instead ([forms.md](#forms)).
- A natively `disabled` control suppresses pointer events and leaves the tab order, so a tooltip on it never opens for keyboard or touch users. Put the reason in visible text beside the control, or switch to `aria-disabled="true"`, which keeps it focusable and hoverable.
- Use `aria-disabled="true"` where keeping a control discoverable in the tab order is intentional, or where a custom control cannot use native `disabled`.
- With `aria-disabled="true"`, block pointer and keyboard activation in the handler and prevent form submission where applicable. Add explicit styling, including forced-colors support, and explain nearby why the action is unavailable.
- Never set both `disabled` and `aria-disabled` on the same element.
- Disabled controls are exempt from contrast minimums.


---

## Forms

Labels, autocomplete, error messaging, input types and submit behavior.

### Labels

Every control needs a programmatic label: `<label for>` pointing at the input's `id`, or a wrapping `<label>`. A placeholder disappears the moment the user types and usually fails contrast, so it never stands in for a label.

```html
<!-- Good: explicit association -->
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" />

<!-- Good: wrapping label, so label and control share one hit target -->
<label>
  <input type="checkbox" /> Send me updates
</label>
```

Clicking "Send me updates" toggles the checkbox, with no dead zone between them. Mark required fields with native `required` plus a visible indicator explained once per form ("* required").

### Error messaging

The complete pattern:

```html
<label for="email">Email</label>
<input
  id="email"
  type="email"
  autocomplete="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error">Enter a valid email address.</p>
```

- `aria-invalid="true"` on the failing field, removed once fixed.
- `aria-describedby` links the field to its inline error so screen readers announce it with the field.
- Errors render inline beside their fields, with an icon or text. Never a red border alone, which is a color-only cue.
- On submit, focus the first invalid field.
- Accept free text and validate after. Never block typing or filter characters as the user types. Trim values before validating, because autocomplete and text expansion add trailing spaces.

### Autocomplete and input types

A valid `autocomplete` token on fields about the user is a WCAG requirement (1.3.5). Pair it with a descriptive `name` attribute, a real `<form>` and no fake inputs, so password managers and 2FA autofill work. The common tokens:

| Field | `autocomplete` |
| --- | --- |
| Name | `name` (or `given-name` / `family-name`) |
| Email | `email` |
| Phone | `tel` |
| Address | `street-address`, `address-line1`, `postal-code`, `country` |
| Card | `cc-number`, `cc-exp`, `cc-csc`, `cc-name` |
| Login | `username`, `current-password` |
| Signup / reset | `username`, `new-password` |
| 2FA code | `one-time-code` |

Prefix with a section where relevant: `autocomplete="shipping street-address"`.

Correct `type` and `inputmode` pick the right mobile keyboard:

| Input | Use |
| --- | --- |
| Email, URL, phone | `type="email"`, `type="url"`, `type="tel"` |
| OTP / PIN / card number | `type="text" inputmode="numeric"` (keeps text semantics, no spinner) |
| Money, decimals | `type="text" inputmode="decimal"` |
| True numeric quantity | `type="number"` |

Disable spellcheck on emails, codes and usernames: `spellcheck="false"`.

### Submit behavior

- Keep submit enabled until the request starts. While it runs, show a spinner *beside the original label*: "Save" with a spinner, not a bare spinner. The label is what tells assistive tech which button is busy.
- Mark the pending button `aria-disabled="true"` and ignore repeat clicks in the handler. Native `disabled` on the focused button drops focus to `<body>`.
- Announce results. Success goes through a polite live region. On failure, focus the first invalid field, which is itself the announcement. Reserve `role="alert"` for form-level errors not tied to a field ([screen-readers.md](#screen-readers)).
- Warn on unsaved changes before navigation. A re-render or hydration must never reset a field's typed value or move focus out of it.


---

## Hit areas

Target sizes, expanding hit areas without changing visual size, collision rules and drag alternatives.

### Target sizes

| Standard | Minimum |
| --- | --- |
| WCAG 2.5.8 (AA) | 24×24px, with exceptions |
| WCAG 2.5.5 (AAA) | 44×44px |
| Apple HIG | 44×44pt |
| Material Design | 48×48dp |

Before reporting an undersized target, check the spacing, equivalent-control, inline, user-agent and essential exceptions.

Under the spacing exception, an undersized target passes when a 24px circle centered on its bounding box intersects no other target and no other undersized target's circle. In the simple case, 20px targets need a 4px gap.

The visible element can stay small; the hit area is what must be big. Anything that looks clickable must be clickable across its whole visual extent.

### Expanding the hit area

Where the visible element is smaller, say a 20×20 checkbox, extend the hit area with a pseudo-element. Put it on a wrapping element or the `<button>`, never on the `<input>`, because form controls don't render `::before`/`::after` reliably.

#### CSS example

```css
/* 20px checkbox with a 44px hit area, on the wrapper around the input */
.checkbox-control {
  position: relative;
  width: 20px;
  height: 20px;
}

.checkbox-control::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%; /* physical centering: direction-independent */
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
}
```

#### Tailwind example

```tsx
<button
  aria-label="Mark done"
  className="relative size-5 after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2"
>
  <CheckIcon aria-hidden="true" />
</button>
```

#### Layout alternative

Where the element can afford real box size, skip the pseudo-element and let the box be the target:

```css
.icon-button {
  min-width: 44px;
  min-height: 44px;
  display: inline-grid;
  place-items: center;
}
```

### Collision rule

Where the extended hit area overlaps another interactive element, shrink the pseudo-element to the largest size that does not collide.

### Decorative layers

A decorative layer painted over interactive content absorbs every pointer event its box covers: a gradient scrim, a glow, a blurred sheen, a full-bleed `::after`. The control underneath looks live and does nothing, and no hit-area sizing fixes it.

Give each one `pointer-events: none` (Tailwind `pointer-events-none`) so events reach the control below. A layer that is an element rather than a pseudo-element also gets `aria-hidden="true"`:

```css
.card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
```

Keep pointer events on any layer the user is meant to hit: a modal scrim that dismisses on click is a control, not decoration.

### Gestures and dragging

- Every drag needs a single-pointer alternative under 2.5.7, such as move-up and move-down buttons on a sortable row, or a menu on a kanban card.
- Every multipoint or path-based gesture, such as a pinch or a swipe, needs a single-pointer alternative under 2.5.1.
- Set `touch-action: none` on a surface implementing its own pan, zoom or drag gestures, so the browser stops claiming them for scrolling and pinch-zoom. Scope it to that surface; at page level it removes scrolling.


---

## Screen readers

Visually hidden content, live regions, toasts, alt text and SVG.

### Visually hidden content

The canonical `.sr-only` pattern hides content visually while keeping it in the accessibility tree:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

Use `1px` boxes, not `0`, because some screen readers skip zero-sized elements. `white-space: nowrap` stops words being read as one run-together string. Never `display: none` or `visibility: hidden`, which remove the content from assistive tech entirely.

Tailwind ships this as `sr-only`. The skip-link recipe is in [focus-and-keyboard.md](#focus-and-keyboard).

Use it for context sighted users get visually: `<span class="sr-only">Opens in new tab</span>`, table captions or an icon-only control's label where `aria-label` isn't an option.

### Choosing how to announce a change

Work down this list and stop at the first match:

1. **Focus moves there anyway**, as with an opened modal or the first invalid field. Nothing extra needed; the focus move is the announcement.
2. **Tied to a specific control**, such as a field error or character count: `aria-describedby` on the control, announced with the field.
3. **Non-urgent, not tied to a control**, such as a toast, "Saved", a result count or a loading state: a polite live region, `role="status"`.
4. **Urgent and not tied to a control**, such as a form-level failure or session expiry: `role="alert"`.

### Live regions

| Mechanism | Politeness | Use for |
| --- | --- | --- |
| `role="status"` (= `aria-live="polite"` + `aria-atomic="true"`) | Waits for a pause | Toasts, "Saved", result counts, loading updates |
| `role="alert"` (= `aria-live="assertive"` + `aria-atomic="true"`) | Interrupts immediately | Errors and urgent problems only |

Rules for reliable announcements:

- For repeated polite updates, keep a stable empty region in the DOM before changing its text. Inserting a new polite region with its content is announced inconsistently.
- Dynamically inserted `role="alert"` content is usually announced, but behavior varies. Test the target browser and screen-reader combinations.
- Default to polite. `assertive` interrupts whatever the user was reading.
- Keep messages short and self-contained. `aria-atomic="true"` re-reads the whole region on change.
- Never move focus to a toast. Announce it and leave focus where the user is working.

```tsx
// Region rendered from the start, message injected later
<div role="status" className="sr-only">
  {statusMessage}
</div>
```

For loading states: set `aria-busy="true"` on the updating region, announce "Loading…" politely, then announce the outcome ("Loaded, 12 results").

### aria-hidden

`aria-hidden="true"` removes an element and its whole subtree from assistive tech. Use it for decorative icons and content duplicated for visual effect. Never put it on or above a focusable element, which creates stops you can Tab to that do not exist for a screen reader. Hiding something interactive means removing it from the tab order too.

### Alt text

Choose by purpose, not by what the image looks like:

| Purpose | Alt | Example |
| --- | --- | --- |
| Decorative, or redundant with adjacent text | `alt=""` (empty, but present) | Logo next to the company name in text |
| Informative | Describe the meaning it adds | `alt="Ticket QR code"` |
| Functional (image is the link/button) | Describe the action or destination | Search icon → `alt="Search"`, not `alt="magnifying glass"` |
| Image of text | The exact text (better: use real text) | `alt="50% off everything"` |
| Complex (chart, diagram) | Short summary in `alt`, full data as a table or text nearby | `alt="Revenue by quarter, described below"` |

A missing `alt` is worse than an empty one, because screen readers fall back to reading the file name.

### SVG

- Decorative SVG: `aria-hidden="true"`. No title needed.
- Meaningful inline SVG: `role="img"` plus `aria-label="…"`, or a `<title>` as the first child referenced by `aria-labelledby`.
- Simple cases: `<img src="icon.svg" alt="…">` is the most reliable delivery.

```tsx
// Decorative icon inside a labeled button
<button aria-label="Close">
  <svg aria-hidden="true">…</svg>
</button>

// Standalone meaningful icon
<svg role="img" aria-label="Verified account">…</svg>
```

### Video and audio

Prerecorded video needs captions (1.2.2), and prerecorded audio needs a transcript (1.2.1). Never autoplay with sound (1.4.2), and always render controls.


---

## Motion and zoom

`prefers-reduced-motion`, timed UI, zoom and reflow.

### prefers-reduced-motion

Wrap animations in `@media (prefers-reduced-motion: no-preference)`, so users who asked for reduced motion get the static version without an override per animation.

```css
/* Good: motion is opt-in */
.card {
  /* static styles */
}
@media (prefers-reduced-motion: no-preference) {
  .card {
    transition: transform 200ms ease-out;
  }
}
```

```tsx
// Tailwind: motion-safe / motion-reduce variants
<div className="motion-safe:transition-transform motion-safe:hover:-translate-y-1" />
```

#### What to disable vs reduce

Reduced motion targets vestibular triggers, not feedback.

| Disable entirely | Replace | Keep |
| --- | --- | --- |
| Parallax scrolling | Slide/scale/zoom transitions → opacity cross-fade | Loading spinners and progress |
| Autoplaying video, GIFs, looping decoration | Smooth scrolling → instant jump | Instant state changes (hover color, focus ring) |
| Spinning, large-scale movement across the screen | Auto-rotating carousels → start paused | Brief functional feedback (button press) |

### Autoplay and timed UI

- **Visible controls on anything that moves on its own** (2.2.2). Anything moving, blinking or updating on its own for more than 5 seconds needs a visible pause or stop control, muted looping hero videos included.
- **Explicit dismissal over timers.** Auto-dismissal suits low-stakes confirmations and nothing else. A toast carrying an action, an error or information the user may need stays until dismissed.
- **Pause on attention.** Where a toast must time out, give it at least 5 seconds, and pause the timer while it is hovered or focused.
- **Never put critical information only in a timed element.** A vanished toast with the only link to an undo action is data loss on a schedule.

### Zoom and reflow

- **200% text resize** (1.4.4). All content and functionality survives text scaled to 200%.
- **Reflow at 320px** (1.4.10). At 400% zoom on a 1280px viewport, equivalent to a 320px one, the page must work with vertical scrolling alone. Genuinely 2D content is the exception: tables, maps and code blocks scroll inside their own container.

Write media queries in `rem` or `em` where the codebase allows. At a larger browser font size such a query switches to the narrow layout when the text needs it, and a `px` query does not. Breakpoint placement belongs to `layout.md`.


---

## See also: additions from the ui-craft and impeccable plugins (not line-merged)

These were added verbatim as detail files. They overlap this topic in subject but not in wording, so they were kept rather than merged. Where they disagree with this file, this file wins.
- ui-craft: accessibility/ui-craft/accessibility.md
