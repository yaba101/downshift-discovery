import { describe, expect, it } from 'vitest'
import { filterAndRankItems } from './search'
import { normalizeCatalogItem } from './catalog'
import type { CatalogItemRaw, SearchControls } from '../types/catalog'

const rawItems: CatalogItemRaw[] = [
  {
    id: 1,
    title: 'Compact Linen Lamp',
    brand: 'Sol & Stone',
    category: 'Lighting',
    tags: ['linen', 'lamp'],
    price: 120,
    rating: 4.8,
    reviews: 100,
    inStock: true,
    releasedAt: '2026-12-01',
    image: null,
    imageWidth: null,
    imageHeight: null,
    description: 'A table lamp for a reading nook.',
  },
  {
    id: 2,
    title: 'Rattan Storage Crate',
    brand: 'Orla & Vine',
    category: 'Storage',
    tags: ['rattan', 'crate'],
    price: 80,
    rating: 4.1,
    reviews: 500,
    inStock: false,
    releasedAt: '2022-01-01',
    image: null,
    imageWidth: null,
    imageHeight: null,
    description: 'Woven storage.',
  },
]

const controls: SearchControls = {
  query: '',
  category: 'all',
  inStockOnly: false,
  priceRange: 'all',
  selectedTags: [],
  sortMode: 'relevance',
  page: 1,
}

describe('filterAndRankItems', () => {
  const items = rawItems.map(normalizeCatalogItem)

  it('finds title and tag matches', () => {
    const result = filterAndRankItems(items, { ...controls, query: 'linen' })

    expect(result.totalItems).toBe(1)
    expect(result.items[0].title).toBe('Compact Linen Lamp')
    expect(result.items[0].matchedFields).toContain('title')
    expect(result.items[0].matchedFields).toContain('tags')
  })

  it('combines category and stock filters', () => {
    const result = filterAndRankItems(items, {
      ...controls,
      category: 'Storage',
      inStockOnly: true,
    })

    expect(result.totalItems).toBe(0)
  })

  it('filters by selected tags and price range', () => {
    const result = filterAndRankItems(items, {
      ...controls,
      priceRange: 'under-250',
      selectedTags: ['rattan'],
    })

    expect(result.totalItems).toBe(1)
    expect(result.items[0].title).toBe('Rattan Storage Crate')
  })
})
