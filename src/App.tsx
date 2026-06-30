import { useEffect, useMemo, useState, useTransition } from 'react'
import { CheckCircle2, CircleDollarSign, Grid2X2, Sparkles } from 'lucide-react'
import { CatalogHeader } from './components/CatalogHeader'
import { EditorialShelf } from './components/EditorialShelf'
import { FilterRail } from './components/FilterRail'
import { ResultsPanel } from './components/ResultsPanel'
import { StatsStrip } from './components/StatsStrip'
import { filterAndRankItems, getCatalogFacets } from './lib/search'
import { useCatalogItems } from './hooks/useCatalogItems'
import type { SearchControls } from './types/catalog'

const initialControls: SearchControls = {
  query: '',
  category: 'all',
  inStockOnly: false,
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
  const hasFilters = controls.category !== 'all' || controls.inStockOnly || hasActiveSearch

  const catalogStats = useMemo(() => {
    const brands = new Set(items.map((item) => item.brand))
    const priced = items.filter((item) => item.price !== null).length
    const available = items.filter((item) => item.inStock).length

    return [
      { label: 'Products', value: items.length.toLocaleString(), icon: Grid2X2 },
      { label: 'Makers', value: brands.size.toLocaleString(), icon: Sparkles },
      { label: 'In stock', value: available.toLocaleString(), icon: CheckCircle2 },
      { label: 'Priced', value: priced.toLocaleString(), icon: CircleDollarSign },
    ]
  }, [items])

  const editorialItems = useMemo(
    () =>
      items
        .filter((item) => item.inStock && item.image && item.rating && item.rating >= 4.6)
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 3),
    [items],
  )
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
    <main className="min-h-screen">
      <CatalogHeader
        categories={facets.categories}
        chooseQuery={chooseQuery}
        controls={controls}
        suggestions={querySuggestions}
        updateControls={updateControls}
      />
      <StatsStrip isLoading={isLoading} stats={catalogStats} />

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
        <FilterRail
          categories={facets.categories}
          chooseQuery={chooseQuery}
          controls={controls}
          hasActiveSearch={hasActiveSearch}
          hasFilters={hasFilters}
          items={items}
          popularTags={facets.popularTags}
          resetControls={resetControls}
          updateControls={updateControls}
        />

        <section className="min-w-0" aria-labelledby="results-heading">
          {!hasActiveSearch && editorialItems.length > 0 ? (
            <EditorialShelf
              categoryCount={facets.categories.length}
              chooseQuery={chooseQuery}
              items={editorialItems}
              totalItems={items.length}
            />
          ) : null}
          <ResultsPanel
            controls={controls}
            debouncedQuery={debouncedQuery}
            hasActiveSearch={hasActiveSearch}
            hasFilters={hasFilters}
            isError={isError}
            isLoading={isLoading}
            isPending={isPending}
            refetch={() => void refetch()}
            resetControls={resetControls}
            result={result}
            updateControls={updateControls}
          />
        </section>
      </div>
    </main>
  )
}

export default App
