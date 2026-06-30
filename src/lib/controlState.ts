import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs'
import type { PriceRange, SearchControls, SortMode } from '../types/catalog'

export const DEFAULT_SEARCH_CONTROLS: SearchControls = {
  query: '',
  category: 'all',
  inStockOnly: false,
  priceRange: 'all',
  customPriceMin: 0,
  customPriceMax: 1500,
  selectedTags: [],
  sortMode: 'featured',
  page: 1,
}

const sortModes = ['featured', 'relevance', 'price-asc', 'price-desc', 'rating'] as const satisfies SortMode[]
const priceRanges = ['all', 'under-250', '250-750', '750-1500', '1500-plus', 'custom'] as const satisfies PriceRange[]

export const catalogControlParsers = {
  page: parseAsInteger.withDefault(DEFAULT_SEARCH_CONTROLS.page),
  query: parseAsString.withDefault(DEFAULT_SEARCH_CONTROLS.query),
  category: parseAsString.withDefault(DEFAULT_SEARCH_CONTROLS.category),
  inStockOnly: parseAsBoolean.withDefault(DEFAULT_SEARCH_CONTROLS.inStockOnly),
  priceRange: parseAsStringLiteral(priceRanges).withDefault(DEFAULT_SEARCH_CONTROLS.priceRange),
  customPriceMin: parseAsInteger.withDefault(DEFAULT_SEARCH_CONTROLS.customPriceMin),
  customPriceMax: parseAsInteger.withDefault(DEFAULT_SEARCH_CONTROLS.customPriceMax),
  selectedTags: parseAsArrayOf(parseAsString, ',').withDefault(DEFAULT_SEARCH_CONTROLS.selectedTags),
  sortMode: parseAsStringLiteral(sortModes).withDefault(DEFAULT_SEARCH_CONTROLS.sortMode),
}

export const catalogControlUrlKeys = {
  page: 'page',
  query: 'q',
  category: 'category',
  inStockOnly: 'stock',
  priceRange: 'price',
  customPriceMin: 'min',
  customPriceMax: 'max',
  selectedTags: 'tags',
  sortMode: 'sort',
}
