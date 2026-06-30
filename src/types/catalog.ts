export type CatalogItemRaw = {
  id: number
  title: string
  brand: string
  category: string
  tags: string[]
  price: number | string | null
  rating: number | null
  reviews: number
  inStock: boolean
  releasedAt: string
  image: string | null
  imageWidth: number | null
  imageHeight: number | null
  description: string | null
}

export type CatalogItem = {
  id: number
  title: string
  brand: string
  category: string
  tags: string[]
  price: number | null
  priceLabel: string
  rating: number | null
  ratingLabel: string
  reviews: number
  inStock: boolean
  releasedAt: string
  image: string | null
  imageWidth: number | null
  imageHeight: number | null
  description: string
  hasDescription: boolean
  searchText: string
}

export type SortMode = 'featured' | 'relevance' | 'price-asc' | 'price-desc' | 'rating'

export type PriceRange = 'all' | 'under-250' | '250-750' | '750-1500' | '1500-plus' | 'custom'

export type SearchControls = {
  query: string
  category: string
  inStockOnly: boolean
  priceRange: PriceRange
  customPriceMin: number
  customPriceMax: number
  selectedTags: string[]
  sortMode: SortMode
  page: number
}

export type RankedItem = CatalogItem & {
  matchScore: number
  matchedFields: string[]
}
