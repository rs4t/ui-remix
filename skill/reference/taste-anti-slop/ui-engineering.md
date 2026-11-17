# UI engineering patterns

From frontend-ui-engineering (source of truth for component architecture, state, a11y code). Goal: UI that looks built by a design-aware engineer at a top company, not generated. Style and anti-slop rules are in `taste.md`; deeper accessibility is in `reference/accessibility/`.

## Component architecture
Colocate everything: `TaskList/TaskList.tsx`, `TaskList.test.tsx`, `TaskList.stories.tsx`, `use-task-list.ts`, `types.ts`.

- Prefer composition over configuration: `<Card><CardHeader><CardTitle/></CardHeader><CardBody/></Card>` beats `<Card title headerVariant bodyPadding content/>`.
- Keep components focused (one job). Split any component over ~200 lines.
- Separate data fetching from presentation: a container handles `isLoading` (skeleton), `error` (ErrorState with retry), empty (EmptyState), then renders a presentational list.

## State management (simplest that works)
Local `useState` for component UI; lifted state for 2-3 siblings; Context for theme/auth/locale (read-heavy, write-rare); URL state (`searchParams`) for filters, pagination, shareable UI; server state (React Query, SWR) for remote data; global store (Zustand, Redux) for complex app-wide client state. Avoid prop drilling deeper than 3 levels.

## Design-system adherence (anti AI aesthetic)
| AI default | Problem | Do instead |
|---|---|---|
| Purple/indigo everything | every app looks identical | the project's real palette |
| Excessive gradients | noise, clashes with systems | flat or subtle, system-matched |
| `rounded-2xl` everywhere | ignores radius hierarchy | consistent radius from the system |
| Generic hero | no tie to content | content-first layouts |
| Lorem ipsum | hides wrapping/overflow | realistic content |
| Oversized padding everywhere | destroys hierarchy | consistent spacing scale |
| Stock card grids | ignores information priority | purpose-driven layouts |
| Shadow-heavy design | competes with content, slow on low-end | subtle or none unless the system specifies |

Spacing: use a scale, never invent values (`padding: 13px` and `margin-top: 2.3rem` are bad; 0.25rem increments are good).
Headings: `h1` page title (one per page), `h2` section, `h3` subsection; do not skip levels; do not use heading styles for non-headings.
Color: semantic tokens (`text-primary`, `bg-surface`, `border-default`), never raw hex; contrast 4.5:1 normal and 3:1 large; never color alone for state (add icon, text or pattern).

## Accessibility (WCAG 2.1 AA)
- Keyboard: use `<button>`, not `<div onClick>`. If a div must act as a button: `role="button"`, `tabIndex={0}`, Enter on keydown, Space on keyup (prevent default on Space keydown).
- Names: icon-only buttons get `aria-label`; inputs get `<label htmlFor>` or `aria-label`.
- Focus: move focus into a dialog on open (focus the close button), trap focus while open, restore on close.
- Empty and error states are meaningful: `role="status"`, icon, heading, one-line help, primary action. Never a blank screen.

## Responsive
Mobile first; Tailwind `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`. Test at 320, 768, 1024 and 1440px.

## Loading and transitions
Skeletons (not spinners) for content, with `aria-busy="true"` and an `aria-label`. Optimistic updates for perceived speed (React Query `onMutate`: cancel queries, snapshot previous, update cache; `onError`: restore snapshot).

## Rationalizations to reject
"Accessibility is nice-to-have" (it is a legal and quality requirement). "Responsive later" (3x harder to retrofit). "Design isn't final so skip styling" (use system defaults). "It's just a prototype" (prototypes become production). "The AI aesthetic is fine for now" (it signals low quality).

## Red flags
Components over 200 lines; inline styles or arbitrary pixel values; missing loading/error/empty states; no keyboard testing; color as the only state indicator; generic AI look.

## Verification
- [ ] Renders without console errors
- [ ] Everything interactive reachable and operable by keyboard (Tab through)
- [ ] Screen reader conveys content and structure
- [ ] Works at 320 / 768 / 1024 / 1440
- [ ] Loading, error and empty states handled
- [ ] Follows the project's design system (spacing, color, type)
- [ ] No axe-core or devtools accessibility warnings
