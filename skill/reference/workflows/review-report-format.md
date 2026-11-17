# Review report format (shared)

Used by every audit-style topic (typography, color, accessibility, layout, ui-polish, interface review). Deduplicated from the identical "Reporting" sections of better-typography and better-colors.

**Severity**
- `HIGH`: content unreadable, truncated with no way back, clipped at 320px width or 200% zoom, body/control text failing its required contrast, meaning carried by color alone, or a semantic color used against its meaning. These stay HIGH however minor the surface.
- `MEDIUM`: breaks the type system, the heading hierarchy, the token system, theme handling or gamut.
- `LOW`: isolated polish.

**Verification**
- Without a browser: check declared values (size, weight, line-height, units, measure, token values, both theme blocks, gamut of declared colors, contrast computed from declared token pairs) and truncation rules against realistic string lengths.
- With a browser: compare computed values, measure against the background actually rendered (including opacity and any image beneath, in light and dark), and resize the viewport with real content to catch wrapping, lone last-line words and truncation.
- Never report a number you did not measure. List every check you could not run as `Not verified`.

**Format**: group findings under the principle each violates, ordered by severity, one row per root cause listing every location it appears in.

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |

`Location` is `path/to/file:line`. `Why` names the principle and the user impact.

End with `Block` when any `HIGH` remains, `Approve` otherwise, leaving the rest in the table as work to do. Never `Approve` coverage you did not inspect. With nothing to report, state "No actionable <topic> findings" and report verification.
