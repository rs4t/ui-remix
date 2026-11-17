# interface-review (workflow, from interface-review)

> Reviews a branch, pull request or uncommitted change for the interface problems it introduced or regressed, across accessibility, layout, writing, typography, color and UI.

This skill reviews a change rather than a screen. It resolves the scope, expands the changed files to the surfaces they affect, reads both sides of the diff and classifies every finding.

It owns the scope, the classification and the change-scoped report. Domain rules belong to the `better-*` skills. Severity, consolidation, coverage, the cap and the verdict belong to `workflows/interface-audit.md`, which this skill hands the review to.

Correctness, tests, security and performance belong to the project's general code review. Name such a concern once, point at that review and drop it.

## The change, not the codebase

The author is asking "did I make this worse?". Report what the change caused and stay mostly quiet about what it merely touched. Three pre-existing findings is a courtesy; thirty is a different review and one nobody asked for.

Read the whole diff before forming an opinion of it. A skimmed diff produces findings about code the next hunk already fixed.

## 1. Resolve the change scope first

The whole invocation is the target, so `/interface-review pr 482` reviews pull request 482. [Scope resolution](#scope-resolution) holds the accepted targets and how each resolves.

With no target supplied, resolve in this order and stop at the first match:

1. `HEAD` is ahead of `git merge-base origin/<default-branch> HEAD`. Review that range **plus** any uncommitted changes, stating the commit count and the uncommitted file count separately.
2. The working tree is dirty. Review the uncommitted changes.
3. Neither. There is no change to review, so follow **With no change, ask rather than invent one**.

Record the base commit of the resolved range as `$BASE` and name it in the scope block. Every command in this skill and its references uses it.

Exclude lockfiles, snapshots, generated output, vendored code and binaries per [Excluded paths](#excluded-paths), and name what you excluded. If nothing survives the exclusions, treat it as no change.

## 2. With no change, ask rather than invent one

A clean tree with nothing ahead of the merge base means there is no change to review. Never fall back to `HEAD~1..HEAD` on your own. The last commit is whatever happened to land, often a merge or someone else's work.

Gather the facts in [Nothing to review](#nothing-to-review), state them, then offer these routes and wait:

- **The open pull request** on the current branch, first when there is one. A branch whose commits already landed resolves to no change, while its pull request is still exactly what the user meant.
- **The last commit**, `HEAD~1..HEAD`, named by short SHA and subject so the user sees what they would get.
- **A target they name**, such as `pr <n>`, a branch, a ref or a range.
- **A whole-repository interface audit**, which is not a change review. Hand it to `workflows/interface-audit.md` as a repository-scope review, without this skill's scope block, statuses or pre-existing section.

Where exclusions emptied the scope, name the excluded files in the offer. Never report a review of nothing as `Approve`.

## 3. A diff is not a surface

A changed file is evidence, not the review subject. Its **blast radius** is the set of surfaces it renders in; review those.

Expand one hop by default, to the direct importers and callers. Expand a second hop only for design tokens, theme values and shared primitives, where one line reaches the whole product.

Review at most five consumers in total across both hops, ordered by [the rule in Scope resolution](#expanding-to-consumers). State how many you did not expand, since an unstated cutoff reads as completeness.

## 4. Read the removed lines

Regressions are invisible in the post-change state. Read the `-` side of every hunk against [Removed signals](#removed-signals).

A signal is a lead, not a finding. A removal is a regression only when nothing in the change replaces it, and the domain skill owns that judgement. Route each unmatched removal to its owner, report only what that skill confirms and status it `Regression`.

## 5. Classify every finding

Give every finding one status:

- `Introduced`: the change created it.
- `Regression`: the change weakened something previously correct.
- `Pre-existing`: present before the change and not made worse by it.

Status by cause, not by location. A finding a changed line causes is `Introduced` or `Regression` wherever it surfaces, including an untouched consumer of a changed token. A finding the change neither created nor worsened is `Pre-existing`, even three lines from a hunk.

To check whether a line predates the change, blame the reviewed range. A `^` prefix marks a line unchanged since the base:

```bash
git blame -L <line>,<line> "$BASE"..<head-ref> -- path/to/file
```

For uncommitted work, drop the range. A line marked `Not Committed Yet` or blamed on a commit inside `$BASE..HEAD` belongs to the change.

## 6. Hold the change to its stated intent

Read the pull request title and body, the linked issue and the commit messages, then review whether the interface delivers what they claim.

This is how you find the **incomplete** change, which a surface review misses because it inspects only the states that exist. Look for the absent ones:

- A new variant, size or theme applied to some states but not all of hover, focus, active, disabled, loading and selected.
- A new user-facing string with no entry in the translation catalogue the project maintains.
- A new component with no empty, loading, error, disabled or narrow-width state.
- A control added to one surface but not to the siblings that already carry its peers.

Do not report scope creep. Whether a change does too much is a process question, not an interface one.

## 7. Hand the review to `workflows/interface-audit.md`

Hand `workflows/interface-audit.md` the scope block, the affected surfaces and a status on every finding, and report in the format below.

If `workflows/interface-audit.md` is unavailable, report the resolved scope and the file inventory, name it as the missing skill and stop. Do not invent a severity scale, a cap or a verdict.

## Never mutate the working tree

A change review is read-only, including the checkout. `git fetch` writes only to `.git` and is permitted. `gh pr checkout`, `git checkout`, `git switch` and `git stash` rewrite the files the author has open, so they are never permitted. Fetch pull request refs and read them in place.

Rendered verification is opt-in here, in place of `workflows/interface-audit.md`'s **Verify what can be verified**. Mark visual and runtime claims **Not verified** unless the project exposes a cheap preview or the user asks for a rendered review. For `working` and `branch`, the checkout already is the head, so render it in place. For any other target, render an isolated worktree such as `git worktree add /tmp/review-<n> refs/remotes/pr/<n>` and remove it when done.

## Before you finish

| Mistake | Fix |
| --- | --- |
| The scope block counts only uncommitted files while `HEAD` is ahead of the merge base | Review the branch range plus the uncommitted changes, with both counts |
| A report on `HEAD~1..HEAD` the user never chose | State the facts and offer the routes in **With no change, ask rather than invent one** |
| A changed shared component with no consumer under `Surfaces expanded` | Expand to its consumers and name the ones you skipped |
| A deleted `aria-label`, `outline` or `prefers-reduced-motion` with no finding and no note | Route it to its owner through [Removed signals](#removed-signals) |
| A `Regression` whose removed attribute reappears elsewhere in the diff | Check the [equivalent replacements](#equivalent-replacements) first |
| A finding on an untouched consumer of a changed token statused `Pre-existing` | The change caused it, so it is `Introduced` or `Regression` |
| A line outside every hunk statused `Introduced` with no causing change named | Blame it against the reviewed range |
| `gh pr checkout` or `git switch` in the command log | Fetch the ref and read files with `git show` |
| A cited line that does not match `git show <head-ref>:path` | Cite against the head ref named in the scope block |

## Review output format

Open with the scope block:

| Field | Value |
| --- | --- |
| Target | `branch`, `working`, `staged`, `pr 482` or the range as entered |
| Base ref | `origin/main` at `a1b2c3d` |
| Head ref | `refs/remotes/pr/482` at `e4f5g6h` |
| Commits | 7 committed, 2 files uncommitted |
| Files in scope | 12 after exclusions |
| Excluded | `pnpm-lock.yaml`, `src/__snapshots__/`, lockfile and snapshots |
| Surfaces expanded | `CheckoutPage`, `SettingsPanel`; 3 further `Button` consumers not expanded |

The coverage table from `workflows/interface-audit.md` follows it. A domain with no evidence in the change scope is `Not reviewed: no evidence in the change scope`, which is a coverage statement rather than a gap.

Then the findings, with a `Status` column per **Classify every finding**:

| Severity | Domain | Status | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |
| HIGH | Accessibility | Regression | `src/Dialog.tsx:42` | `aria-label="Close"` removed in this change | Restore `aria-label="Close"` on the icon-only control | The close control had an accessible name before this change and no longer does |

With no `Introduced` or `Regression` findings, omit the table and state "No actionable interface findings in this change."

Then `Pre-existing` findings, at most three, highest severity first, stated plainly as not this change's responsibility. Omit the section when there are none.

| Severity | Domain | Location | Issue |
| --- | --- | --- | --- |
| MEDIUM | Typography | `src/Toolbar.tsx:7` | Numeric badges use proportional figures; predates this change |

Verification and the verdict follow in `workflows/interface-audit.md`'s format.


---

## Removed signals

What to look for on the `-` side of a hunk and which skill owns the judgement.

| Removed from the `-` side | Owner | What to check |
| --- | --- | --- |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `role=` | `accessibility.md` | The control or region lost its accessible name, description or announcement |
| `alt=`, `<label`, `for=`, `htmlFor`, `scope=` | `accessibility.md` | Image, field or table cell lost its programmatic association |
| `<button>`, `<a>`, `<nav>`, `<main>`, `<ul>` replaced by `div` or `span` | `accessibility.md` | Keyboard and assistive-technology behavior was traded for styling |
| `:focus-visible`, `:focus`, `outline`, `tabindex` | `accessibility.md` | Keyboard users lost the focus indicator or the element left the tab order |
| `prefers-reduced-motion` | `accessibility.md` | Motion now ignores the user's system preference |
| `prefers-contrast` | `color.md` | Colors now ignore the user's contrast preference |
| Logical properties swapped for `left` / `right` | `layout.md` | Direction-aware layout was dropped |
| `lang=`, `dir=` | `typography.md` | Language metadata or text direction was dropped |
| `text-wrap`, `line-clamp`, `overflow-wrap`, `tabular-nums`, `font-feature-settings` | `typography.md` | Text rendering, wrapping or numeral alignment silently changed |
| A color token swapped for a literal, or a token swapped for a lighter one | `color.md` | The rendered contrast pair may now fail; measure it |
| A user-facing string deleted or shortened | `writing.md` | A label, error or empty state lost the information it carried |

### Equivalent replacements

These clear the signal. Drop a removal one of them explains before routing anything:

- `aria-label` giving way to `aria-labelledby` pointing at visible text.
- An explicit `role` dropped because the element became the native equivalent, such as `role="button"` going when a `div` becomes a `<button>`.
- `outline` replaced by a `box-shadow` ring on the same `:focus-visible` selector.
- `tabindex="0"` dropped from an element that is now natively focusable.
- A color literal replaced by a token with the same value.
- A physical property replaced by its logical counterpart, which is the fix rather than the regression.
- A string moved into the translation catalogue rather than deleted.

### Searching the removed side

Restrict the search to deleted lines so additions do not mask a removal. Pass the exclusion pathspecs from [Excluded paths](#excluded-paths) after `--`:

```bash
git diff -U0 "$BASE" <head-ref> -- . <exclusions> \
  | grep -E '^-' | grep -vE '^--- (a/|/dev/null)' \
  | grep -E 'aria-|role=|alt=|htmlFor|for=|scope=|focus|outline|tabindex|prefers-|lang=|dir=|text-wrap|line-clamp|overflow-wrap|tabular-nums|font-feature|inset-|-inline|-block'
```

Leave `<head-ref>` off for a target that includes uncommitted work, so the diff runs against the working tree. Removed strings and swapped color tokens have no pattern; read those hunks.

Read the surrounding hunk before deciding. A removed attribute is meaningless without the element it came from, and `-U0` deliberately hides that context.


---

## Scope resolution

How a review target becomes a file list, and the traps that fail quietly and leave the scope block claiming a count it never delivered.

### Default branch

Try `refs/remotes/origin/HEAD`, then `gh repo view --json defaultBranchRef`. If the ref is missing, ask the remote with `git remote set-head origin --auto` rather than guessing. It needs the network and writes only a ref under `.git`, so it is permitted; note it in Verification. With no remote at all, fall back to a local `main` or `master` and state which base you assumed.

### Targets

Accepted targets are `working`, `staged`, `branch`, `pr <n>`, a bare `<ref>` and an explicit `<a>..<b>` or `<a>...<b>` range. Anything else in the invocation is a `<ref>`.

Diff a branch against the **merge base**, with three dots. Two dots reports every upstream commit that landed on the base branch as part of the change.

But use the dots the user wrote when they wrote a range. `<a>..<b>` compares the endpoints; `<a>...<b>` compares `merge-base(<a>, <b>)` with `<b>`. Rewriting `release..feature` to three dots drops everything between `release` and the merge base, which is often exactly what was asked for. State the resolved range in the scope block.

`git diff HEAD` reports tracked changes only. Any target including uncommitted work must pair it with `git ls-files --others --exclude-standard`. Otherwise a newly added component is silently dropped from a scope the report claims to cover in full.

### Pull requests

Fetch the head into a remote-tracking ref, `git fetch origin "pull/<n>/head:refs/remotes/pr/<n>"`, and review it in place. This works for forks, which `origin/<branch>` does not.

Diff against the pull request's own base, never the default branch by assumption. Read it from `gh pr view <n> --json baseRefName,baseRefOid` and fetch it if it is not local. A pull request into `release/2.0` diffed against `main` picks up every commit between the two.

Read files at the head ref with `git show refs/remotes/pr/<n>:path/to/file`. Never open the working-tree copy, which is a different revision.

`gh pr diff <n>` is a fine shortcut for the patch text. It gives no way to read unchanged context or expand to consumers, so fetch the ref as well.

**Citations.** Line numbers from a fetched ref need not match the working tree. Cite against the head ref and declare that ref and its SHA in the scope block so the numbers resolve.

**Intent.** The `title` and `body` from `gh pr view` are the stated intent for **Hold the change to its stated intent**. Add the commit subjects when the body is empty.

### Awkward repository states

Three worth handling. Everything else fails loudly at `merge-base`: unrelated histories, a repo with no commits, a moved submodule pointer. Say the base is unresolvable and stop. Never review a range you cannot name.

**Detached HEAD.** Use the merge base against the default branch and name the SHA, not a branch, in the scope block.

**Shallow clone**, the CI default, where `merge-base` returns nothing. Fetch `--deepen=50`, retry, then `--deepen=200`, then report the scope as unresolvable. Deepening writes to `.git` and not to the working tree, so it is permitted; note it in Verification.

**Mid-rebase or mid-merge**, the one that does not fail loudly. `git diff` succeeds and returns something that is not the change, so the review looks fine and is wrong. Detect it with `git rev-parse --git-path` against `rebase-merge`, `rebase-apply`, `MERGE_HEAD` and `CHERRY_PICK_HEAD`. Do not test `.git/` paths directly, because they are not directories inside a linked worktree. Stop and say the tree is mid-operation.

### Nothing to review

The tree is clean and `HEAD` is not ahead of the merge base. Gather the facts before asking, so the offer is accurate rather than a guess. They are the current branch, the count ahead of the base, the last commit's SHA and subject and any open pull request from `gh pr status`.

`gh pr status` succeeds when no pull request is open. It omits `currentBranch`, so an empty result is an answer, not an error. It fails outright without `gh`, without authentication and on a repository with no GitHub remote. Treat any failure as "no pull request found", say so and offer the remaining routes rather than stopping.

### Renames

Rename detection is on by default in `git diff`, and `--name-status` reports `R100 old/path new/path`. Lower the similarity threshold with `--find-renames=40%` when a file was moved and edited in the same change.

Review a rename as a move, not a delete plus an add. Everything that survived the move is unchanged code, and only the genuine edits are in scope.

### Excluded paths

Exclude these and name what you excluded in the scope block. They are machine-authored and carry no interface rules.

| Category | Patterns |
| --- | --- |
| Lockfiles | `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `bun.lockb`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `poetry.lock`, `uv.lock` |
| Snapshots and fixtures | `__snapshots__/`, `*.snap`, `*.approved.*`, `test-results/`, `playwright-report/` |
| Generated output | `dist/`, `build/`, `out/`, `.next/`, `.turbo/`, `.svelte-kit/`, `coverage/`, `storybook-static/`, `*.min.js`, `*.min.css`, `*.map` |
| Generated sources | `*.gen.ts`, `*.generated.*`, `*.d.ts` emitted by a build, GraphQL and Prisma client output |
| Vendored code | `vendor/`, `third_party/`, `node_modules/` |
| Binaries and media | `*.png`, `*.jpg`, `*.webp`, `*.avif`, `*.woff2`, `*.mp4`, `*.pdf` |

Two exceptions stay in scope. A **font file** added or swapped is a `typography.md` change. An **image** added to a component is a `ui-polish.md` and `accessibility.md` change, through its outline and its `alt` text. Review the code that references them, not the bytes.

Apply the exclusions as pathspecs so the file count in the scope block is the reviewed count:

```bash
git diff --name-only "$BASE" <head-ref> -- . ':(exclude)pnpm-lock.yaml' ':(glob,exclude)**/dist/**'
```

Two traps under-exclude silently. `*.lock` catches `yarn.lock` and `Cargo.lock` but not `package-lock.json` or `pnpm-lock.yaml`, so cover every suffix in the table. And without `glob` magic, `**/dist/**` needs a literal `/` before `dist`, so it misses a root-level `dist/`. Run the diff with and without the pathspecs and confirm the count dropped by exactly the files you named.

### Expanding to consumers

Use the project's own resolver where one exists, otherwise import paths.

`git grep` searches the working tree by default. Pass the reviewed ref after the pattern, or on a pull request you search a different revision and miss importers the change itself added. Results come back as `<rev>:path/to/file`; read them with `git show`, never the working-tree copy. Pass `-e` when the pattern starts with a dash, such as a `--color-*` token, or git parses it as an option.

For a changed token or theme value, search the token name rather than the file, since consumers reference the name and never import it.

Order the consumers by a rule you can evaluate, so the cutoff is reproducible instead of a guess:

1. **Route and layout entry points first**, whatever the framework treats as a rendered surface: `app/**/page.*`, `app/**/layout.*`, `pages/**`, `routes/**`, `src/views/**`, `*.astro` pages. Everything else only appears inside one.
2. **Then by importer count**, since a component pulled in by twenty files carries more of the change than one pulled in by two.
3. **Break ties by proximity**, same package or feature directory first.

Say plainly if the ordering was arbitrary past a point.
