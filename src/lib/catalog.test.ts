import { describe, expect, it } from 'vitest'
import { normalizeCatalogItem } from './catalog'
import type { CatalogItemRaw } from '../types/catalog'

const baseItem: CatalogItemRaw = {
  id: 1,
  title: 'Compact Linen Lamp',
  brand: 'Sol & Stone',
  category: 'Lighting',
  tags: ['compact', 'linen'],
  price: 120,
  rating: 4.5,
  reviews: 42,
  inStock: true,
  releasedAt: '2026-07-04',
  image: null,
  imageWidth: null,
  imageHeight: null,
  description: null,
}

describe('normalizeCatalogItem', () => {
  it('coerces comma formatted prices', () => {
    const item = normalizeCatalogItem({ ...baseItem, price: '1,081.43' })

    expect(item.price).toBe(1081.43)
    expect(item.priceLabel).toBe('$1,081')
  })

  it('keeps missing price and description display safe', () => {
    const item = normalizeCatalogItem({ ...baseItem, price: null, description: null, rating: null })

    expect(item.price).toBeNull()
    expect(item.priceLabel).toBe('Price unavailable')
    expect(item.hasDescription).toBe(false)
    expect(item.description).toContain('Details are still being collected')
    expect(item.ratingLabel).toBe('No rating yet')
  })
})
