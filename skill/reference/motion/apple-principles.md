# Apple design foundations

From apple-design (sections 16-17; the motion, material and reduced-motion parts were merged into `motion.md` and `motion-recipes.md`; the typography part duplicated `reference/typography/typography.md`: size-specific tracking, leading inversely tied to size, hierarchy from weight + size + leading, `rem`/`em` spacing for Dynamic Type, system font by default).

Apple frames design as serving four human needs: safety/predictability, understanding, achievement, joy.

## Eight principles (WWDC "Principles of Great Design")
1. Purpose: make with intention; decide what not to build. Every feature spends the user's time, attention and trust.
2. Agency: keep people in control; offer choices. Back it with forgiveness: easy undo for slips, confirmation only for genuinely destructive irreversible actions (overuse trains click-through).
3. Responsibility: act in the user's interest. Ask for privacy-sensitive data at the right moment, only what is needed, transparently. Anticipate misuse and harm (especially with AI); add previews, confirmations, disclaimers; cut a feature whose risk outweighs value.
4. Familiarity: build on what people know. Metaphors neither too literal nor too abstract; consistency (same look, same behavior, same place); break a pattern only if you can show it is better, and test it.
5. Flexibility: different contexts, devices and abilities. Adapt to the platform, design inclusively (age, language, expertise, accessibility), allow personalization when no single layout fits.
6. Simplicity, not minimalism: strip the unnecessary so the core shines; burying everything in one place is not simple. Be concise (plain language, fewer steps) and clear (hierarchy via order, spacing, contrast). Sometimes adding context simplifies (a scrubber showing time remaining). Common path first, advanced one level deeper.
7. Craft: uncompromising detail builds trust. Nothing is random: every spacing, timing, alignment is a defensible choice. Jittery scroll, misaligned icons and layouts that break on rotation read as carelessness.
8. Delight: the result of getting the other seven right, not confetti. Decide the emotion (calm, confident, excited) and reinforce it in every decision.

## Tactical rules
- Feedback comes in four kinds: status, completion, warning, error. Confirm meaningful actions, expose ongoing status, warn before problems, validate inline (not only on submit).
- Wayfinding: every screen answers where am I, where can I go, what is there, how do I get out. Never trap the user.
- Grouping and mapping: proximity implies relationship; place a control near what it affects and arrange controls to mirror what they change. If a control needs a label to explain it, the mapping is weak.
- Direct, specific labels beat safe generic ones: name nav items for contents ("Progress", "Library"), not "Home".

## Process
- Prototype interactively; set a concrete bar that prevents a mediocre final implementation.
- Design interaction and visuals together ("you shouldn't be able to tell where one ends and the other begins").
- Test with real people in real context; review motion in slow motion and frame by frame.
