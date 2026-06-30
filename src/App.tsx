import { useEffect, useMemo, useState, useTransition } from 'react'
import { CatalogHeader } from './components/CatalogHeader'
import { FilterSidebar } from './components/FilterSidebar'
import { ResultsPanel } from './components/ResultsPanel'
import { filterAndRankItems, getCatalogFacets } from './lib/search'
import { useCatalogItems } from './hooks/useCatalogItems'
import type { SearchControls } from './types/catalog'

const initialControls: SearchControls = {
  query: '',
  category: 'all',
  inStockOnly: false,
  priceRange: 'all',
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
    <main className="min-h-screen bg-sage-frame p-3 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-[1420px] rounded-[34px] bg-catalog-canvas px-5 py-8 shadow-[0_30px_120px_rgba(41,54,34,0.22)] sm:px-8 lg:px-10">
        <CatalogHeader updateControls={updateControls} />

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
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
          <section className="order-first min-w-0 lg:order-none" aria-labelledby="results-heading">
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
