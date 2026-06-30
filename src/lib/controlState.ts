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

const STORAGE_KEY = 'downshift-search-controls'
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

function parseControls(source: Partial<Record<keyof SearchControls, unknown>>): SearchControls {
  const sortMode = typeof source.sortMode === 'string' && sortModes.includes(source.sortMode as SortMode) ? source.sortMode : DEFAULT_SEARCH_CONTROLS.sortMode
  const priceRange =
    typeof source.priceRange === 'string' && priceRanges.includes(source.priceRange as PriceRange) ? source.priceRange : DEFAULT_SEARCH_CONTROLS.priceRange
  const customPriceMin = Number(source.customPriceMin ?? DEFAULT_SEARCH_CONTROLS.customPriceMin)
  const customPriceMax = Number(source.customPriceMax ?? DEFAULT_SEARCH_CONTROLS.customPriceMax)
  const page = Number(source.page ?? DEFAULT_SEARCH_CONTROLS.page)

  return {
    query: typeof source.query === 'string' ? source.query : DEFAULT_SEARCH_CONTROLS.query,
    category: typeof source.category === 'string' && source.category.trim() ? source.category : DEFAULT_SEARCH_CONTROLS.category,
    inStockOnly: Boolean(source.inStockOnly),
    priceRange: priceRange as PriceRange,
    customPriceMin: Number.isFinite(customPriceMin) ? Math.max(0, customPriceMin) : DEFAULT_SEARCH_CONTROLS.customPriceMin,
    customPriceMax: Number.isFinite(customPriceMax) ? Math.max(0, customPriceMax) : DEFAULT_SEARCH_CONTROLS.customPriceMax,
    selectedTags: Array.isArray(source.selectedTags) ? source.selectedTags.filter((tag): tag is string => typeof tag === 'string' && Boolean(tag.trim())) : [],
    sortMode: sortMode as SortMode,
    page: Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_SEARCH_CONTROLS.page,
  }
}

export function hasCatalogUrlControls(search = window.location.search) {
  const params = new URLSearchParams(search)
  return ['q', 'category', 'stock', 'price', 'min', 'max', 'tags', 'sort', 'page'].some((key) => params.has(key))
}

export function readControlsFromStorage() {
  try {
    const savedControls = window.localStorage.getItem(STORAGE_KEY)

    if (!savedControls) {
      return null
    }

    return parseControls(JSON.parse(savedControls) as Partial<Record<keyof SearchControls, unknown>>)
  } catch {
    return null
  }
}

export function persistControlsToStorage(controls: SearchControls) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(controls))
}

export function clearPersistedControls() {
  window.localStorage.removeItem(STORAGE_KEY)
}
