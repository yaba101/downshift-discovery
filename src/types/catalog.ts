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

export type SearchControls = {
  query: string
  category: string
  inStockOnly: boolean
  sortMode: SortMode
  page: number
}

export type RankedItem = CatalogItem & {
  matchScore: number
  matchedFields: string[]
}
