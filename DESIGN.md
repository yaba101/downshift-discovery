# Downshift Discovery Design Spec

## Product Intent

Downshift Discovery is a premium home-goods catalog search experience. The interface should feel like a serious retail discovery tool, not a landing page or generic card grid. Search is the primary action, filters are supporting actions, and product imagery should carry the merchandising story.

## Design Principles

- Search-first: the search input is the main CTA and must be visible above the fold on mobile and desktop.
- Catalog-first: results, filtering, and product metadata matter more than marketing copy.
- Editorial but efficient: use refined typography and spacing without hiding the catalog behind decorative layout.
- Resilient data: missing price, image, rating, or description should look intentional.
- No dead ends: empty states must suggest recovery paths.
- Accessible craft: visible focus states, semantic structure, keyboard-friendly controls, and strong contrast.

## Visual Direction

- Style: premium editorial marketplace.
- Mood: composed, trustworthy, curated, tactile.
- Avoid: playful gradients, dark-mode dominance, purple defaults, oversized hero sections, nested cards, and low-density marketing layouts.
- Imagery: product photos should be large enough to scan, cropped consistently, and treated as catalog assets rather than decoration.

## Tokens

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Ink | `--color-ink` | `#1c1917` | primary text, primary buttons |
| Paper | `--color-paper` | `#fffdf8` | cards, header, inputs |
| Background | `--color-porcelain` | `#fafaf9` | page background |
| Muted | `--color-muted` | `#64748b` | secondary text |
| Line | `--color-line` | `#d6d3d1` | borders and dividers |
| Mist | `--color-mist` | `#e8ecf0` | icon wells, subtle panels |
| Gold | `--color-honey` | `#a16207` | premium accent, price emphasis |
| Sage | `--color-sage` | `#2e725f` | stock/positive states |
| Clay | `--color-clay` | `#a3482f` | unavailable/destructive states |
| Cobalt | `--color-cobalt` | `#1e3a5f` | links, search metadata |

## Typography

- Heading: `Playfair Display`, used for brand-level titles, result headings, and product names.
- Body: `Inter`, used for controls, metadata, descriptions, and counts.
- Rules:
  - Keep letter spacing at `0`.
  - Use uppercase only for short metadata labels.
  - Keep product titles readable at card size.
  - Avoid viewport-based font scaling.

## Layout

- Mobile: stacked search, filters, stats, and products with touch-friendly controls.
- Desktop: search/header on top, stats strip, left filter rail, right product results.
- Result cards: 3-column max at wide desktop, 2-column tablet, 1-column mobile.
- Fixed card media ratio: `4 / 3`.
- Avoid nested cards. Repeated product items can be cards; page sections should be bands or panels.

## Interaction

- Search should debounce locally.
- Show query suggestions while typing so users can recover quickly.
- Filters reset pagination.
- Active filters should be visible near result counts.
- Pagination should be explicit and keyboard reachable.
- Loading uses skeletons, not blank space.
- TanStack Query Devtools should remain available during development.

## Component Rules

- Buttons: use icon+text for navigation or actions where meaning benefits from the icon.
- Badges: use for product metadata, not primary controls.
- Selects: category and sort only.
- Checkbox: binary in-stock filter only.
- Cards: product cards only, plus compact stat panels.
- `mark`: only for query highlighting.

## Review Checklist

- Search input visible above fold at 375px, 768px, 1024px, and 1440px.
- Product grid has no text overlap.
- Cards do not resize unexpectedly on hover.
- Missing image/price/rating states look designed.
- Empty search offers a next action.
- Keyboard focus is visible on interactive controls.
- React Doctor is clean.
- `pnpm test`, `pnpm lint`, and `pnpm build` pass.
