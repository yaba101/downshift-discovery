# Downshift Product Discovery

A small product discovery page for the Downshift founding engineer build task. The app helps someone search and browse about 4,000 home goods products without trying to become a full ecommerce store.

The prompt emphasized that the decisions around search matter more than search complexity, so this project focuses on a polished, fast, explainable discovery flow: browse first, search when needed, refine with lightweight filters, and keep imperfect catalog data from breaking the experience.

## What Was Built

- A standalone Vite, React, TypeScript, Tailwind CSS, shadcn-style UI, TanStack Query, and nuqs app.
- A catalog page with a bold editorial home-goods visual direction.
- Client-side catalog fetching and caching through TanStack Query.
- Client-side search across title, brand, category, tags, and description.
- Filter controls for search, category, availability, price ranges, custom price, and popular tags.
- Sort controls for best selling, relevance, price low to high, price high to low, and top rated.
- Client-side pagination with adjacent-page and hover/page-input prefetching.
- URL-driven filter state with nuqs so filtered views are refresh-safe and shareable.
- Desktop filter rail and a mobile filter drawer so mobile users see products before filters.
- Product cards with image fallback, price fallback, rating/review display, brand/category context, and accessible interactions.

## Why This Scope

The task asked for a small product discovery page, not a full store. I intentionally kept the surface area focused:

- No cart, checkout, authentication, or product detail pages.
- No backend search service because 4,000 products is small enough for fast local filtering.
- No complex ranking model because the search behavior should be easy to reason about in a short walkthrough.
- Enough polish to make the results feel useful and production-minded.

This let me spend the time on the important product decisions: how users start browsing, how search ranks matches, how filters combine, how mobile behaves, and how messy data is handled.

## Search And Discovery Decisions

Search is local, fast, and deliberately explainable.

- Title matches rank highest because they usually represent direct user intent.
- Brand and tag matches rank next because shoppers often search by maker, material, style, or product attribute.
- Category matches are useful, but less specific than direct title/tag matches.
- Description matches are included as a softer recall signal.
- In-stock status, rating, and review volume help default browsing feel curated without making release date recency the main signal.

When there is no query, the page behaves like a catalog browse experience instead of an empty search tool. Users can immediately scan products, sort the catalog, paginate, or open filters to narrow by category, availability, price, and tags.

## Data Handling

The incoming catalog data is normalized before rendering so the UI can tolerate imperfect product records.

- Number, string, and comma-formatted prices are coerced into nullable numbers.
- Missing prices render safely instead of breaking sorting or cards.
- Missing images use a designed placeholder.
- Missing descriptions fall back to neutral display copy.
- Missing ratings are handled without pretending every product has a score.
- Future `releasedAt` values are preserved but are not treated as the primary ranking signal.

The provided catalog is mirrored into `public/items.json` for reliable local/static app loading, then fetched client-side through TanStack Query.

## State, Caching, And Performance

- TanStack Query caches the catalog payload.
- Derived result pages are cached by search/filter/sort/page query keys.
- Adjacent result pages are prefetched after page load.
- Pagination buttons prefetch on hover/focus.
- Page-jump input prefetches valid typed pages before the user clicks Go.
- Filter state lives in the URL through nuqs rather than localStorage, avoiding competing persistence sources.

## Mobile Experience

On desktop, the filter rail stays visible because there is enough room for browsing and refinement side-by-side.

On mobile, the product grid comes first. Filters move into a floating button and native dialog drawer, so the first screen is not dominated by the full filter panel. This keeps mobile discovery closer to how a real shopper would browse.

## Run Locally

```bash
pnpm install
pnpm dev
```

The dev server can be run on a specific port with:

```bash
pnpm dev -- --host 127.0.0.1 --port 3003
```

## Verify

```bash
pnpm test
pnpm lint
pnpm build
```

## Walkthrough Outline

Use this order for the 10-minute max recording requested in the prompt:

1. Open by restating the prompt: build a small product discovery page for 4,000 home goods items, not a full store.
2. Explain the main product decision: optimize for useful discovery and explainable search decisions.
3. Show the default catalog state and why users can browse immediately.
4. Demo a search, such as `linen`, `folding`, `rattan`, or `lamp`.
5. Explain weighted matching across title, brand, category, tags, and description.
6. Demo filters: category, availability, price, custom price validation, and tags.
7. Demo active filter chips and clear/reset behavior.
8. Demo sorting and pagination.
9. Point out TanStack Query caching, page prefetching, and URL state via nuqs.
10. Show mobile mode and the filter drawer.
11. Explain data normalization and fallback handling.
12. Close with the next step and tradeoff below.

## Next Step

The next step would be adding lightweight search analytics: track zero-result queries, common refinements, and which filters users remove. That would show whether the ranking and filter model matches real shopper behavior before making the search algorithm more complex.

## Tradeoff To Watch

The main tradeoff is client-side search and filtering. For about 4,000 items, it keeps the app fast, simple, and easy to reason about. If the catalog grew much larger, I would move filtering/ranking/pagination server-side or use a dedicated search service with typo tolerance and synonym support.
