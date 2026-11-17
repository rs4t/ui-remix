# UX laws and the 20 UX and animation principles

Source: user-collected short-form video lists ("20 Principles of UX & Animation"). The names are the user's list; the one-line definitions are standard summaries added here. Motion application detail lives in `reference/motion/motion.md`.

## A. The 12 animation principles (Disney) applied to UI
1. **Squash and stretch**: deform slightly with speed or impact to convey weight/flexibility. UI: stretch a fast-moving knob or pill about 12% along its travel, never squash text.
2. **Anticipation (wind-up)**: a small opposite movement before the main move. UI: a tiny pull-back before a drawer launches; keep under 100ms.
3. **Staging (focus)**: direct attention to the one thing that matters; dim, blur or still everything else (dim-to-focus in modals).
4. **Pose to pose**: define key states first (closed, open), let the system interpolate between them; design states before easing.
5. **Follow through / overlapping action**: parts keep moving and settle after the main motion stops (a toast settles, a sheet's content lags the sheet slightly).
6. **Slow in and slow out**: ease at both ends for things already on screen (ease-in-out); arrivals use ease-out.
7. **Moving in arcs**: natural motion follows curves; move objects along arcs (split X and Y easing) instead of straight lines.
8. **Secondary action**: supporting motion that reinforces the main one (a check mark draws after the button morphs), never competes.
9. **Snappy timing**: UI timing is short (150-250ms for most things); slower reads as lag.
10. **Exaggerated feedback**: confirm important actions clearly (a pulse on success), but keep exaggeration for rare moments.
11. **Solid drawing in 3D**: keep perspective, light and shadow consistent so surfaces feel like real volumes (one light source, consistent elevation scale).
12. **Overall appeal**: the sum of cohesion; the motion personality matches the product (see motion.md section 2 and 8).

## B. UX laws
13. **Fitts's law**: time to hit a target grows with distance and shrinks with size. Make primary targets large and near the pointer; put destructive ones far from common ones; screen edges/corners are effectively infinite targets.
14. **Bigger hit areas**: extend hit areas beyond the visible glyph (44x44pt touch, 40px dense desktop, 24px WCAG 2.2 minimum); never let hit areas overlap. See `reference/accessibility/accessibility.md`.
15. **Hick's law**: decision time grows with the number and complexity of choices. Reduce options, group and chunk them, progressively disclose, highlight a recommended default.
16. **Miller's law**: people hold about 7 plus or minus 2 items in working memory. Chunk long content (phone numbers, forms, nav groups), do not use it to justify limits on lists that are scanned, not memorized.
17. **Doherty threshold**: productivity jumps when the system responds within about 400ms. Give feedback inside 100ms, use skeletons/optimistic updates and progress for anything longer.
18. **Postel's law (robustness)**: be liberal in what you accept, conservative in what you send. Accept spaces/dashes in phone numbers, any casing in emails, paste into OTP/password fields; normalize on submit.
19. **Jakob's law**: users spend most of their time on other products, so they expect yours to work the same. Reuse familiar patterns (logo top-left links home, cart top-right); innovate only where the payoff is proven.
20. **Frequency of use**: the more often an interaction happens, the less animation, ceremony and friction it should have (the Emil/Raycast rule). Frequent = instant and quiet; rare = room for delight. See motion.md section 3.1.

Related laws worth pairing with the above (standard, not on the list): Law of proximity/common region (grouping, layout.md), Von Restorff (one primary action stands out), Peak-end rule (polish the success and error moments), Tesler's law (complexity has to live somewhere; absorb it for the user), Zeigarnik effect (show progress to encourage completion).
