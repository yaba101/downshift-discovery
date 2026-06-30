import type { CatalogItem, PriceRange, RankedItem, SearchControls, SortMode } from '../types/catalog'

export const PAGE_SIZE = 12

type FilterResult = {
  items: RankedItem[]
  totalItems: number
  totalPages: number
}

function includesNeedle(value: string, needle: string) {
  return value.toLowerCase().includes(needle)
}

function scoreItem(item: CatalogItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    const availabilityScore = item.inStock ? 24 : 0
    const reviewScore = Math.min(item.reviews / 100, 18)
    const ratingScore = item.rating ? item.rating * 8 : 0
    const priceCompleteness = item.price === null ? 0 : 5
    return {
      score: availabilityScore + reviewScore + ratingScore + priceCompleteness,
      fields: [] as string[],
    }
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)
  const fields = new Set<string>()
  let score = 0

  for (const term of terms) {
    if (includesNeedle(item.title, term)) {
      score += item.title.toLowerCase() === normalizedQuery ? 120 : 56
      fields.add('title')
    }

    if (includesNeedle(item.brand, term)) {
      score += 34
      fields.add('brand')
    }

    if (item.tags.some((tag) => includesNeedle(tag, term))) {
      score += 32
      fields.add('tags')
    }

    if (includesNeedle(item.category, term)) {
      score += 20
      fields.add('category')
    }

    if (includesNeedle(item.description, term)) {
      score += 8
      fields.add('description')
    }
  }

  if (score > 0 && item.inStock) {
    score += 6
  }

  if (score > 0 && item.rating) {
    score += item.rating
  }

  return { score, fields: Array.from(fields) }
}

function sortRankedItems(items: RankedItem[], sortMode: SortMode, hasQuery: boolean) {
  return items.toSorted((a, b) => {
    if (sortMode === 'price-asc') {
      return (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY)
    }

    if (sortMode === 'price-desc') {
      return (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY)
    }

    if (sortMode === 'rating') {
      return (b.rating ?? 0) - (a.rating ?? 0) || b.reviews - a.reviews
    }

    if (hasQuery || sortMode === 'relevance') {
      return b.matchScore - a.matchScore || Number(b.inStock) - Number(a.inStock) || b.reviews - a.reviews
    }

    return b.matchScore - a.matchScore || b.reviews - a.reviews
  })
}

function matchesPriceRange(price: number | null, range: PriceRange) {
  if (range === 'all') {
    return true
  }

  if (price === null) {
    return false
  }

  if (range === 'under-250') {
    return price < 250
  }

  if (range === '250-750') {
    return price >= 250 && price < 750
  }

  if (range === '750-1500') {
    return price >= 750 && price < 1500
  }

  return price >= 1500
}

export function filterAndRankItems(items: CatalogItem[], controls: SearchControls): FilterResult {
  const query = controls.query.trim()
  const hasQuery = query.length > 0
  const ranked: RankedItem[] = []

  for (const item of items) {
    if (controls.category !== 'all' && item.category !== controls.category) {
      continue
    }

    if (controls.inStockOnly && !item.inStock) {
      continue
    }

    if (!matchesPriceRange(item.price, controls.priceRange)) {
      continue
    }

    if (controls.selectedTags.length > 0 && !controls.selectedTags.every((tag) => item.tags.includes(tag))) {
      continue
    }

    const { score, fields } = scoreItem(item, query)

    if (hasQuery && score === 0) {
      continue
    }

    ranked.push({ ...item, matchScore: score, matchedFields: fields })
  }

  const sorted = sortRankedItems(ranked, controls.sortMode, hasQuery)
  const totalItems = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, controls.page), totalPages)
  const start = (safePage - 1) * PAGE_SIZE

  return {
    items: sorted.slice(start, start + PAGE_SIZE),
    totalItems,
    totalPages,
  }
}

export function getCatalogFacets(items: CatalogItem[]) {
  const categories = Array.from(new Set(items.map((item) => item.category))).sort()
  const tagCounts = new Map<string, number>()

  for (const item of items) {
    for (const tag of item.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 14)
    .map(([tag]) => tag)

  return { categories, popularTags }
}
