# break-test (workflow, from break)

> Renders a component you choose under every scenario that can reach it on a temporary page and stress tests it.

This skill takes one component and renders it on a harness page under every scenario that can actually reach it. That page is the deliverable: a visual report the user scrolls through, every scenario side by side, with the breaks marked.

It observes rather than judges. A finding here is something that visibly broke on the page, named in the vocabulary of the domain skill that owns the fix. Reviewing code against a standard is `interface-review` and `workflows/interface-audit.md`; exploring design alternatives is `variant`; working through a component's product states one at a time is `state-machine`.

Where `variant` insists on the real page, this skill isolates on purpose. You are not judging how the component looks in context. You are checking whether it defends itself when the content is worst-case.

The whole run is build, look once, report: minutes, not a session. Nothing in it justifies instrumentation, browser debugging or a second pass.

## 1. Scope one component

One component per run. "The settings page" is not a component; the profile form's text input is. Where the request spans several, list the candidates and ask which one to test.

Restate what the component is in one sentence: what it accepts, what it renders and where it will live.

## 2. Infer the scenarios from the component

Stress only what varies. A scenario earns a slot when the component accepts something that can take that shape in production. So read the component first: its props, its slots, its states and the data it renders.

[scenarios.md](#scenarios) holds the axes, the values on each and the cue that says whether an axis applies. Walk it against the component and keep only the axes whose cue matches. A text input gets content length and states, never item quantity. A static icon button with a fixed label gets container and environment, never long text.

Write the kept scenarios down before building, one line each. Then say which axes you dropped and why, in one line, so a wrong inference is cheap to catch.

## 3. Build the harness page

The harness page renders the component once per scenario in a single column, with a short text label above each instance.

A scratch route inside the app holds the real component, imported from the project and untouched. The route inherits the app's layout, fonts, global styles and providers for free.

Where the framework splits server from client components, the page is client code, `"use client"` in Next. Otherwise fixture data can silently vanish crossing that boundary, and the page renders empty.

Labels, container widths and fixture props are everything the page adds. No fonts or styles of its own, no simulated themes or token swaps, no probes. A component observed under any of those is a different component.

Feed scenarios as props and fixture data. The harness never imports production state, never wires to live data and production never imports from the harness.

## 4. Look once

Load the page once in a browser already at hand, skim every scenario top to bottom and note what visibly broke. "Text escapes the field's right edge", never "spacing feels tight". A predicted failure is not a finding.

With no browser at hand, say so and hand the URL over for the user to check. Launching, window-wrangling or debugging a browser is out of budget. When you skipped the look, the report is the URL and the scenario list, with no findings table and no page notes.

Then mark each break you did see on the page, a one-line note under that scenario's label, in a single edit. The page has to read as the report on its own.

## 5. Report what broke and stop

Report findings as a table, broken scenarios first:

| Scenario | Observed | Owner |
| --- | --- | --- |
| One unbreakable 60-character string | Overflows the card, no wrap and no truncation | `typography.md` |
| Zero items | Blank region with no message | `writing.md` |

This skill owns no domain rules and issues no verdict.

"Everything survived" is a complete and useful report. Say which scenarios are on the page and where it is running, so the user can see every one themselves. End there rather than padding the result with preferences.

Do not fix anything unasked. On a request to fix, follow the owner skill's rules, then re-render the failing scenarios to confirm.

## 6. Leave the page up, delete it on request

The page is half the report, so it outlives the findings table. Leave it running. Delete it and its fixtures only when the user says they are done with it. Then search for the route and fixture names, and check the diff leaves nothing of the harness behind.

## Before you finish

| Mistake | Fix |
| --- | --- |
| Every axis run against every component | Keep only the axes whose cue matches, and say which you dropped |
| A predicted failure reported as observed | Render it, or leave it out |
| A scenario missing the content it was fed | The harness is broken, not the component; make the page client code and reload once |
| A rebuilt lookalike component in the harness | Import the real component from the project |
| The harness restyles or re-themes the component | The app's layout, fonts and tokens as they are; labels and widths are all the page adds |
| A browser launched, debugged or screenshotted per scenario | One load and one look, or hand the URL over and skip the look |
| Findings phrased as taste | Report what was visible on the page, or nothing |
| A break reported without an owner | Name the domain skill whose rules diagnose it |
| A clean run padded with suggestions | "Everything survived" plus the scenario list is the report |
| The viewport resized scenario by scenario | Widths are fixed containers on the page; one load shows them all |
| A break in the table but unmarked on the page | Note it under the scenario's label; the page reads as the report on its own |
| Page deleted in the same turn as the report | The page is half the report; delete only on the user's word |


---

## Scenario axes

The menu **Infer the scenarios from the component** in [SKILL.md](#SKILL) selects from. Each axis carries a cue: the property of the component that makes the axis worth running. Cue matches, axis stays; cue fails, axis is dropped and the drop is named in the plan.

An axis that stays contributes its scenarios as written here. Add any value the component's own props make obviously worse, such as the longest option in a real dataset, copied into a fixture.

### Content length

**Cue: the component renders text it does not author.** User input, CMS content, API data, translations. A fixed label the codebase controls fails the cue.

| Scenario | What it catches |
| --- | --- |
| Empty string | Collapsed boxes, floating labels with nothing to float over, placeholder-only inputs |
| One word | Buttons and badges sized to their longest expected content |
| Typical content | The baseline the others are judged against |
| Several sentences | Wrapping, line-height at multiple lines, containers that assumed one line |
| One unbreakable string | A long URL or `Donaudampfschiffahrtsgesellschaft`: overflow with no wrap opportunity |

Breaks land in `typography.md` for wrapping and truncation, `layout.md` where the container has no room and `writing.md` where the source copy is the problem.

### Content shape

**Cue: the text can come from users or locales the team does not write in.** Same sources as content length, minus content the codebase fully controls.

| Scenario | What it catches |
| --- | --- |
| Emoji, alone and mixed into text | Line-height jumps, broken vertical centering, truncation splitting a character |
| RTL text | Direction handling, punctuation landing on the wrong side |
| Mixed-direction text | An LTR product name inside an RTL sentence, and the reverse |
| Diacritics and tall scripts | Clipped ascenders and descenders in tight line boxes |
| Numbers where columns align | Proportional figures wobbling in tables and timers |

Breaks land in `typography.md`; spatial mirroring lands in `layout.md`.

### Quantity

**Cue: the component repeats over items.** Lists, tables, grids, tag rows, avatar stacks. A singular component fails the cue.

| Scenario | What it catches |
| --- | --- |
| Zero items | Blank regions, missing empty states |
| One item | Grids and layouts designed around plural content |
| The realistic count | The baseline |
| Ten times the realistic count | Missing scroll or pagination, performance collapse, sticky elements unsticking |

Zero-item breaks land in `writing.md` for the empty state and `layout.md` for the region; the rest land in `layout.md`.

### Container

**Cue: always.** Everything renders inside something, and the component does not choose its container's width. Each width is a fixed container on the page, never a viewport to resize.

| Scenario | What it catches |
| --- | --- |
| A 320px container | Clipping, horizontal scroll, controls escaping the box |
| Squeezed by a flex or grid sibling | Min-content blowout, the component refusing to shrink |
| A very wide container | Unbounded measure, stretched controls, content pinned to opposite edges |

Breaks land in `layout.md`.

### State

**Cue: the component has the state.** Read the props and the interaction model; render only the states that arrive as props. A static component fails the cue entirely.

| Scenario | What it catches |
| --- | --- |
| Loading | Layout shift when content arrives, spinners with no accessible name |
| Error | Messages that overflow, color as the only signal |
| Disabled | Contrast collapse, focus behavior on disabled controls |

Focus and hover are the user's to try while they view the page. Invite them to tab through the instances in the report rather than simulating focus in the harness.

Breaks land in `accessibility.md`; purely visual state polish lands in `ui-polish.md`.

### Environment

**Cue: the project supports the mode.** These are viewing modes, not page content, so the page renders nothing for them. Name them in the report for the user to toggle while viewing: OS dark mode where a dark theme exists, browser zoom, reduced motion. Simulating one on the page, such as re-declaring dark tokens under a class, observes a different component.

Dark-mode breaks land in `color.md`; zoom and motion land in `accessibility.md`.
