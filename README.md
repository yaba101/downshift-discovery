# Downshift Product Discovery

A focused product discovery page for the Downshift founding engineer build task. It fetches the provided home goods catalog, normalizes the imperfect data, and gives shoppers a fast way to search, browse, filter, and compare products without trying to become a full store.

## What I Built

- A Vite, React, TypeScript, Tailwind CSS, shadcn-style UI, and TanStack Query app.
- Client-side catalog fetching and caching from a local mirror of the provided JSON file.
- TanStack Query Devtools for inspecting catalog cache state during development.
- A default discovery state with curated category and popular tag entry points.
- Search across product title, brand, category, tags, and description.
- Lightweight filters for category and availability, plus sort controls for featured, relevance, price, and rating.
- Client-side pagination after filtering and ranking.
- Product cards with image, stock state, brand, category, tags, rating, reviews, price, and matched-field hints.
- Graceful fallbacks for missing prices, images, descriptions, and ratings.

## Why This Scope

The prompt emphasized decisions around search more than the search implementation itself. For 4,000 items, a local client-side search is fast, understandable, and avoids unnecessary backend complexity. I kept the experience small but complete: one page, one prominent search path, useful browsing defaults, and enough refinement controls to help real users recover from vague searches.

See `DESIGN.md` for the visual and UX rules used by the current interface.

## Search And Discovery Decisions

The ranking is intentionally simple and explainable:

- Title matches are weighted highest because they usually represent direct intent.
- Brand and tag matches come next because users often search by maker, material, or style.
- Category matches are useful for browsing, but less specific than title or tag matches.
- Description matches help with recall, but carry the lowest weight.
- In-stock and rating signals lightly improve ranked results without overpowering the query.

When there is no query, the app behaves like a discovery surface instead of showing a blank search page. It highlights categories, popular tags, and strong in-stock items so a user can start browsing immediately.

## Handling Imperfect Data

The provided catalog URL is reachable from the command line, but the response does not include a browser CORS allow header. To keep the submitted app reliable on localhost or static hosting, I mirrored the file into `public/items.json` and still fetch it client-side through TanStack Query.

The catalog has mixed price formats, missing images, missing descriptions, missing ratings, and future release dates. I normalize the data before rendering:

- Number, string, and comma-formatted prices become a nullable number.
- Missing prices render as `Price unavailable`.
- Missing descriptions get a neutral fallback.
- Missing images render a designed placeholder.
- Missing ratings render as `No rating yet`.
- Future release dates are preserved but not used as a primary ranking signal.

## Run Locally

```bash
pnpm install
pnpm dev
```

## Verify

```bash
pnpm test
pnpm lint
pnpm build
```

## Walkthrough Outline

1. Open with the interpretation: this is a product discovery task, not a full store.
2. Show the default browse state and explain why it is useful before someone searches.
3. Search for examples like `linen lamp`, `rattan`, and a brand name.
4. Toggle category, in-stock, and sort controls to show how refinement feels.
5. Point out data fallbacks: missing image, missing price, and missing rating behavior.
6. Close with the next step and tradeoff.

## What I Would Do Next

The next step would be adding lightweight query analytics so we can see where users get zero results, which categories they expect, and whether filters are helping or hurting discovery.

The tradeoff I would watch is ranking complexity. It is tempting to keep adding scoring rules, but the better long-term answer might be learning from real usage before making the search feel too clever.

## Submission Reply Draft

Hi Manuel,

Thanks again for the build task. I built a focused product discovery page around the catalog, with an emphasis on fast search, guided browsing, and resilient handling of imperfect product data.

Links:

- Code: [GitHub repo link]
- Walkthrough: [Loom or Drive link]

The README covers what I built, the decisions I made, and the main tradeoff I would watch next.

Best,
Yeabsira
