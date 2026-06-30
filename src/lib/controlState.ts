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
const sortModes: SortMode[] = ['featured', 'relevance', 'price-asc', 'price-desc', 'rating']
const priceRanges: PriceRange[] = ['all', 'under-250', '250-750', '750-1500', '1500-plus', 'custom']

function parseNumber(value: string | null, fallback: number) {
  if (value === null) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parsePositiveInteger(value: string | null, fallback: number) {
  return Math.max(1, Math.trunc(parseNumber(value, fallback)))
}

function parseBoolean(value: string | null) {
  return value === '1' || value === 'true'
}

function parseTags(value: string | null) {
  if (!value) {
    return []
  }

  return Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  )
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

function hasUrlControls(params: URLSearchParams) {
  return ['q', 'category', 'stock', 'price', 'min', 'max', 'tags', 'sort', 'page'].some((key) => params.has(key))
}

export function readControlsFromUrl(search = window.location.search) {
  const params = new URLSearchParams(search)

  if (!hasUrlControls(params)) {
    return null
  }

  return parseControls({
    category: params.get('category') ?? DEFAULT_SEARCH_CONTROLS.category,
    customPriceMax: parseNumber(params.get('max'), DEFAULT_SEARCH_CONTROLS.customPriceMax),
    customPriceMin: parseNumber(params.get('min'), DEFAULT_SEARCH_CONTROLS.customPriceMin),
    inStockOnly: parseBoolean(params.get('stock')),
    page: parsePositiveInteger(params.get('page'), DEFAULT_SEARCH_CONTROLS.page),
    priceRange: params.get('price') ?? DEFAULT_SEARCH_CONTROLS.priceRange,
    query: params.get('q') ?? DEFAULT_SEARCH_CONTROLS.query,
    selectedTags: parseTags(params.get('tags')),
    sortMode: params.get('sort') ?? DEFAULT_SEARCH_CONTROLS.sortMode,
  })
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

export function getInitialSearchControls() {
  return readControlsFromUrl() ?? readControlsFromStorage() ?? DEFAULT_SEARCH_CONTROLS
}

export function persistControlsToStorage(controls: SearchControls) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(controls))
}

export function clearPersistedControls() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function controlsToSearchParams(controls: SearchControls) {
  const params = new URLSearchParams()

  if (controls.query.trim()) {
    params.set('q', controls.query.trim())
  }

  if (controls.category !== DEFAULT_SEARCH_CONTROLS.category) {
    params.set('category', controls.category)
  }

  if (controls.inStockOnly) {
    params.set('stock', '1')
  }

  if (controls.priceRange !== DEFAULT_SEARCH_CONTROLS.priceRange) {
    params.set('price', controls.priceRange)
  }

  if (controls.priceRange === 'custom') {
    params.set('min', String(controls.customPriceMin))
    params.set('max', String(controls.customPriceMax))
  }

  if (controls.selectedTags.length > 0) {
    params.set('tags', [...controls.selectedTags].sort().join(','))
  }

  if (controls.sortMode !== DEFAULT_SEARCH_CONTROLS.sortMode) {
    params.set('sort', controls.sortMode)
  }

  if (controls.page !== DEFAULT_SEARCH_CONTROLS.page) {
    params.set('page', String(controls.page))
  }

  return params
}

export function replaceUrlWithControls(controls: SearchControls) {
  const params = controlsToSearchParams(controls)
  const nextSearch = params.toString()
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`

  window.history.replaceState(null, '', nextUrl)
}
