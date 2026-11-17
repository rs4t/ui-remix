# Brand (canonical)

Merged from brand (identity, voice, messaging, assets, consistency), with the routing guidance from design/design-routing.md folded in (the other half of that file routed between sub-skills that are now merged here: tokens/stack in `reference/design-systems/`, brand-image generation in `brandkit.md`, generation studios in `design-studio.md`).

## Routing
| Question or task | Go to |
|---|---|
| Brand colors, typography, voice, "is this on-brand?", messaging, asset organization, approvals | this file + `identity/` |
| Tokens, CSS variables, component specs, Tailwind mapping | `reference/design-systems/design-systems.md` |
| shadcn/ui, Tailwind, dark mode, components | `reference/design-systems/` (shadcn-tailwind) |
| Brand-guidelines boards, logo systems, identity decks as generated images | `brandkit.md` |
| Logo, CIP mockups, banners, icons, social photos, slide decks (generation workflows) | `design-studio.md` + `studio/` |
| Token-driven slides | `slides-token-system.md` |
| Poster / museum-quality visual composition | `canvas-design-system.md` |
Typical flow for a new identity: brand (colors, type, voice) -> design-systems (semantic token layers) -> implementation (Tailwind/shadcn). Design-system migration: audit and extract brand colors/fonts -> formalize the three-layer tokens -> replace hardcoded values. Complete brand package: logo -> CIP -> presentation. Social presence: banners + brand. Custom icon set: icon design + tokens.

## Original brand skill (scripts not installed here)

Brand identity, voice, messaging, asset management, and consistency frameworks.

## When to Use

- Brand voice definition and content tone guidance
- Visual identity standards and style guide development
- Messaging framework creation
- Brand consistency review and audit
- Asset organization, naming, and approval
- Color palette management and typography specs

## Quick Start

**Inject brand context into prompts:**
```bash
node scripts/inject-brand-context.cjs
node scripts/inject-brand-context.cjs --json
```

**Validate an asset:**
```bash
node scripts/validate-asset.cjs <asset-path>
```

**Extract/compare colors:**
```bash
node scripts/extract-colors.cjs --palette
node scripts/extract-colors.cjs <image-path>
```

## Brand Sync Workflow

```bash
# 1. Edit docs/brand-guidelines.md (or use /brand update)
# 2. Sync to design tokens
node scripts/sync-brand-to-tokens.cjs
# 3. Verify
node scripts/inject-brand-context.cjs --json | head -20
```

**Files synced:**
- `docs/brand-guidelines.md` → Source of truth
- `assets/design-tokens.json` → Token definitions
- `assets/design-tokens.css` → CSS variables

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `update` | Update brand identity and sync to all design systems | `references/update.md` |

## References

| Topic | File |
|-------|------|
| Voice Framework | `references/voice-framework.md` |
| Visual Identity | `references/visual-identity.md` |
| Messaging | `references/messaging-framework.md` |
| Consistency | `references/consistency-checklist.md` |
| Guidelines Template | `references/brand-guideline-template.md` |
| Asset Organization | `references/asset-organization.md` |
| Color Management | `references/color-palette-management.md` |
| Typography | `references/typography-specifications.md` |
| Logo Usage | `references/logo-usage-rules.md` |
| Approval Checklist | `references/approval-checklist.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/inject-brand-context.cjs` | Extract brand context for prompt injection |
| `scripts/sync-brand-to-tokens.cjs` | Sync brand-guidelines.md → design-tokens.json/css |
| `scripts/validate-asset.cjs` | Validate asset naming, size, format |
| `scripts/extract-colors.cjs` | Extract and compare colors against palette |

## Templates

| Template | Purpose |
|----------|---------|
| `templates/brand-guidelines-starter.md` | Complete starter template for new brands |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
