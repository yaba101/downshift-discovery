import { useEffect, useMemo, useState, useTransition } from 'react'
import { useQueryStates } from 'nuqs'
import { CatalogHeader } from './components/CatalogHeader'
import { FilterSidebar } from './components/FilterSidebar'
import { ResultsPanel } from './components/ResultsPanel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import {
  DEFAULT_SEARCH_CONTROLS,
  catalogControlParsers,
  catalogControlUrlKeys,
} from './lib/controlState'
import { filterAndRankItems, getCatalogFacets, PAGE_SIZE } from './lib/search'
import { useCatalogItems } from './hooks/useCatalogItems'
import { useCatalogResults } from './hooks/useCatalogResults'
import type { SearchControls, SortMode } from './types/catalog'

const CUSTOM_PRICE_FILTER_DEBOUNCE_MS = 1200

function useDebouncedValue<T>(value: T, delay = 180) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debounced
}

function getCatalogSafeControls(controls: SearchControls, categories: string[], availableTags: Set<string>, hasCatalogItems: boolean) {
  if (!hasCatalogItems) {
    return controls
  }

  const category = controls.category === 'all' || categories.includes(controls.category) ? controls.category : 'all'
  const selectedTags = controls.selectedTags.filter((tag) => availableTags.has(tag))

  if (category === controls.category && selectedTags.length === controls.selectedTags.length) {
    return controls
  }

  return {
    ...controls,
    category,
    selectedTags,
  }
}

function App() {
  const { data: items = [], isLoading, isError, refetch } = useCatalogItems()
  const [isPending, startTransition] = useTransition()
  const [controls, setControls] = useQueryStates(catalogControlParsers, {
    clearOnDefault: true,
    history: 'replace',
    shallow: true,
    startTransition,
    urlKeys: catalogControlUrlKeys,
  })
  const debouncedQuery = useDebouncedValue(controls.query)
  const debouncedCustomPriceMin = useDebouncedValue(controls.customPriceMin, CUSTOM_PRICE_FILTER_DEBOUNCE_MS)
  const debouncedCustomPriceMax = useDebouncedValue(controls.customPriceMax, CUSTOM_PRICE_FILTER_DEBOUNCE_MS)

  const facets = useMemo(() => getCatalogFacets(items), [items])
  const availableTags = useMemo(() => new Set(items.flatMap((item) => item.tags)), [items])
  const catalogSafeControls = useMemo(
    () => getCatalogSafeControls(controls, facets.categories, availableTags, items.length > 0),
    [availableTags, controls, facets.categories, items.length],
  )
  const activeControls = useMemo(
    () => ({
      ...catalogSafeControls,
      customPriceMax: catalogSafeControls.priceRange === 'custom' ? debouncedCustomPriceMax : catalogSafeControls.customPriceMax,
      customPriceMin: catalogSafeControls.priceRange === 'custom' ? debouncedCustomPriceMin : catalogSafeControls.customPriceMin,
      query: debouncedQuery,
    }),
    [catalogSafeControls, debouncedCustomPriceMax, debouncedCustomPriceMin, debouncedQuery],
  )
  const { data: result, prefetchPage } = useCatalogResults(items, activeControls)
  const shareableControls = useMemo(
    () => ({
      ...catalogSafeControls,
      page: Math.min(catalogSafeControls.page, result.totalPages),
    }),
    [catalogSafeControls, result.totalPages],
  )
  const hasActiveSearch = debouncedQuery.trim().length > 0
  const hasFilters =
    shareableControls.category !== 'all' ||
    shareableControls.inStockOnly ||
    shareableControls.priceRange !== 'all' ||
    shareableControls.selectedTags.length > 0 ||
    hasActiveSearch

  const querySuggestions = useMemo(
    () => (catalogSafeControls.query.trim() ? result.items.slice(0, 5).map((item) => item.title) : []),
    [catalogSafeControls.query, result.items],
  )

  useEffect(() => {
    if (items.length === 0 || controls.page === shareableControls.page) {
      return
    }

    void setControls({ page: shareableControls.page })
  }, [controls.page, items.length, setControls, shareableControls.page])

  useEffect(() => {
    if (items.length === 0 || result.totalPages <= 1) {
      return
    }

    const pagesToPrefetch = [controls.page + 1, controls.page - 1].filter((page) => page >= 1 && page <= result.totalPages)
    const imageUrls = pagesToPrefetch.flatMap((page) =>
      filterAndRankItems(items, { ...activeControls, page })
        .items.map((item) => item.image)
        .filter((image): image is string => Boolean(image)),
    )

    const preloadedImages = imageUrls.map((src) => {
      const image = new Image()
      image.src = src
      return image
    })

    return () => {
      preloadedImages.forEach((image) => {
        image.src = ''
      })
    }
  }, [activeControls, controls.page, items, result.totalPages])

  function updateControls(nextControls: Partial<SearchControls>) {
    void setControls((current) => ({
      ...getCatalogSafeControls(current, facets.categories, availableTags, items.length > 0),
      ...nextControls,
      page: nextControls.page ?? 1,
    }))
  }

  function chooseQuery(query: string) {
    updateControls({ query })
  }

  function resetControls() {
    void setControls(DEFAULT_SEARCH_CONTROLS)
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-[1680px] border-x border-line bg-paper">
        <CatalogHeader updateControls={updateControls} />

        <section className="border-b border-line px-5 py-10 text-center md:py-14" aria-labelledby="results-heading">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.36em] text-muted">Product discovery</p>
          <h1
            id="results-heading"
            className="font-serif text-[clamp(3.8rem,11vw,8.5rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.045em] text-ink"
          >
            Home Goods
          </h1>
        </section>

        <section
          id="catalog-controls"
          className="scroll-mt-4 grid items-center gap-4 border-b border-line px-5 py-4 text-sm font-semibold text-muted md:grid-cols-[1fr_auto_1fr] lg:px-8"
        >
          <p className="text-center md:text-right">
            <span className="text-ink">{result.totalItems.toLocaleString()}</span> products
          </p>
          <div className="flex items-center justify-center gap-6">
            <span>
              Show <span className="text-ink">{PAGE_SIZE}</span>
            </span>
            <span className="hidden h-4 w-px bg-line/70 md:block" />
            <span>
              Page <span className="text-ink">{Math.min(controls.page, result.totalPages)}</span> of{' '}
              <span className="text-ink">{result.totalPages.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex justify-center md:justify-start">
            <Select value={controls.sortMode} onValueChange={(value) => updateControls({ sortMode: value as SortMode })}>
              <SelectTrigger className="h-11 min-w-56 rounded-none border border-line bg-paper px-4 text-sm font-bold text-ink shadow-[4px_4px_0_rgba(48,48,48,0.08)] transition hover:bg-mist focus:ring-1 focus:ring-ink [&>svg]:size-5 [&>svg]:text-ink">
                <span className="mr-2 text-[11px] uppercase tracking-[0.16em] text-muted">Sort</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Best selling</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price low to high</SelectItem>
                <SelectItem value="price-desc">Price high to low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
          <FilterSidebar
            categories={facets.categories}
            chooseQuery={chooseQuery}
            controls={shareableControls}
            hasFilters={hasFilters}
            popularTags={facets.popularTags}
            resetControls={resetControls}
            suggestions={querySuggestions}
            updateControls={updateControls}
          />
          <section className="min-w-0">
            <ResultsPanel
              controls={shareableControls}
              debouncedQuery={debouncedQuery}
              refetch={() => void refetch()}
              resetControls={resetControls}
              result={result}
              status={{ hasActiveSearch, hasFilters, isError, isLoading, isPending }}
              prefetchPage={prefetchPage}
              updateControls={updateControls}
            />
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
