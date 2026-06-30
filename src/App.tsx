import { useEffect, useMemo, useState, useTransition } from 'react'
import { CatalogHeader } from './components/CatalogHeader'
import { FilterSidebar } from './components/FilterSidebar'
import { ResultsPanel } from './components/ResultsPanel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { filterAndRankItems, getCatalogFacets, PAGE_SIZE } from './lib/search'
import { useCatalogItems } from './hooks/useCatalogItems'
import type { SearchControls, SortMode } from './types/catalog'

const initialControls: SearchControls = {
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

function useDebouncedValue(value: string, delay = 180) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debounced
}

function App() {
  const { data: items = [], isLoading, isError, refetch } = useCatalogItems()
  const [controls, setControls] = useState<SearchControls>(initialControls)
  const [isPending, startTransition] = useTransition()
  const debouncedQuery = useDebouncedValue(controls.query)

  const facets = useMemo(() => getCatalogFacets(items), [items])
  const activeControls = useMemo(() => ({ ...controls, query: debouncedQuery }), [controls, debouncedQuery])
  const result = useMemo(() => filterAndRankItems(items, activeControls), [items, activeControls])
  const hasActiveSearch = debouncedQuery.trim().length > 0
  const hasFilters =
    controls.category !== 'all' ||
    controls.inStockOnly ||
    controls.priceRange !== 'all' ||
    controls.selectedTags.length > 0 ||
    hasActiveSearch

  const querySuggestions = useMemo(
    () => (controls.query.trim() ? result.items.slice(0, 5).map((item) => item.title) : []),
    [controls.query, result.items],
  )

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
    startTransition(() => {
      setControls((current) => ({ ...current, ...nextControls, page: nextControls.page ?? 1 }))
    })
  }

  function chooseQuery(query: string) {
    updateControls({ query })
  }

  function resetControls() {
    startTransition(() => setControls(initialControls))
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

        <section className="grid items-center gap-4 border-b border-line px-5 py-4 text-sm font-semibold text-muted md:grid-cols-[1fr_auto_1fr] lg:px-8">
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
              <SelectTrigger className="h-auto min-w-44 border-0 bg-transparent p-0 text-sm font-semibold text-muted shadow-none focus:ring-0">
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
            controls={controls}
            hasFilters={hasFilters}
            popularTags={facets.popularTags}
            resetControls={resetControls}
            suggestions={querySuggestions}
            updateControls={updateControls}
          />
          <section className="min-w-0">
            <ResultsPanel
              controls={controls}
              debouncedQuery={debouncedQuery}
              refetch={() => void refetch()}
              resetControls={resetControls}
              result={result}
              status={{ hasActiveSearch, hasFilters, isError, isLoading, isPending }}
              updateControls={updateControls}
            />
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
