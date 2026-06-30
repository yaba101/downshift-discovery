import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { normalizeCatalogItem } from '../lib/catalog'
import { catalogResultsQueryKey, prefetchCatalogResults } from './useCatalogResults'
import type { CatalogItemRaw, SearchControls } from '../types/catalog'

const controls: SearchControls = {
  page: 3,
  query: '',
  category: 'all',
  inStockOnly: false,
  priceRange: 'all',
  customPriceMin: 0,
  customPriceMax: 1500,
  selectedTags: [],
  sortMode: 'featured',
}

const rawItem: CatalogItemRaw = {
  id: 1,
  title: 'Hand-thrown Brass Bin',
  brand: 'Tundra',
  category: 'Storage',
  tags: ['brass', 'storage'],
  price: 1424,
  rating: 4.9,
  reviews: 84,
  inStock: true,
  releasedAt: '2024-01-01',
  image: null,
  imageWidth: null,
  imageHeight: null,
  description: 'A sculptural storage bin.',
}

describe('catalog result caching', () => {
  it('puts page in the first query-key object for easier Devtools scanning', () => {
    expect(catalogResultsQueryKey(controls)).toEqual([
      'catalog-results',
      { page: 3 },
      {
        category: 'all',
        customPriceMax: 1500,
        customPriceMin: 0,
        inStockOnly: false,
        priceRange: 'all',
        query: '',
        selectedTags: [],
        sortMode: 'featured',
      },
    ])
  })

  it('prefetches a requested page into the TanStack Query cache', async () => {
    const queryClient = new QueryClient()
    const items = [normalizeCatalogItem(rawItem)]

    await prefetchCatalogResults(queryClient, items, controls)

    expect(queryClient.getQueryData(catalogResultsQueryKey(controls))).toMatchObject({
      totalItems: 1,
      totalPages: 1,
    })
  })
})
