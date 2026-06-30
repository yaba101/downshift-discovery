import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import { ProductCard } from './components/ProductCard'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Checkbox } from './components/ui/checkbox'
import { Input } from './components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { getCatalogFacets, filterAndRankItems } from './lib/search'
import { useCatalogItems } from './hooks/useCatalogItems'
import type { SearchControls, SortMode } from './types/catalog'

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
  const featured = useMemo(
    () =>
      items
        .filter((item) => item.inStock && item.rating && item.rating >= 4.6)
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 4),
    [items],
  )

  const hasActiveSearch = debouncedQuery.trim().length > 0
  const hasFilters = controls.category !== 'all' || controls.inStockOnly || hasActiveSearch
  const heroItems = hasActiveSearch && result.items.length > 0 ? result.items.slice(0, 4) : featured

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
    <main className="min-h-screen overflow-hidden">
      <section className="border-b border-line bg-porcelain">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
          <div className="flex flex-col justify-center gap-7">
            <Badge tone="sage" className="w-fit">
              <Sparkles className="mr-1 size-3.5" />
              4,000 home goods, searched with taste
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-serif text-5xl leading-none text-ink sm:text-6xl lg:text-7xl">
                Find the piece that makes the room click.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                Search by material, room, product type, brand, or category. The page keeps the messy catalog useful
                with clear fallbacks and fast local discovery.
              </p>
            </div>

            <div className="relative max-w-2xl">
              <label htmlFor="catalog-search" className="sr-only">
                Search the catalog
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <Input
                id="catalog-search"
                value={controls.query}
                onChange={(event) => updateControls({ query: event.target.value })}
                className="pl-12 pr-12"
                placeholder="Try linen lamp, rattan storage, Fenwick..."
              />
              {controls.query ? (
                <button
                  type="button"
                  onClick={() => updateControls({ query: '' })}
                  className="absolute right-4 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-mist hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {heroItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                <div className="aspect-[5/3] overflow-hidden bg-mist">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="size-full object-cover" />
                  ) : (
                    <div className="grid size-full place-items-center text-sm font-semibold text-muted">
                      Image coming soon
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <span className="text-xs font-bold uppercase text-muted">{item.category}</span>
                  <h2 className="font-serif text-xl leading-tight text-ink">{item.title}</h2>
                  <p className="text-sm font-semibold text-clay">{item.priceLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10" aria-label="Discovery controls">
        {!hasActiveSearch ? (
          <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-serif text-2xl text-ink">Browse by room</h2>
              <ul className="flex flex-wrap gap-2">
                {facets.categories.map((category) => (
                  <li key={category}>
                    <Button
                      type="button"
                      variant={controls.category === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateControls({ category })}
                    >
                      {category}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-serif text-2xl text-ink">Popular materials and styles</h2>
              <ul className="flex flex-wrap gap-2">
                {facets.popularTags.map((tag) => (
                  <li key={tag}>
                    <Button type="button" variant="outline" size="sm" onClick={() => chooseQuery(tag)}>
                      {tag}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 rounded-lg border border-line bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <SlidersHorizontal className="size-4" />
            Refine discovery
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <Select value={controls.category} onValueChange={(value) => updateControls({ category: value })}>
              <SelectTrigger aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {facets.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label
              htmlFor="in-stock-only"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink shadow-sm"
            >
              <Checkbox
                id="in-stock-only"
                checked={controls.inStockOnly}
                onCheckedChange={(checked) => updateControls({ inStockOnly: checked === true })}
              />
              In stock only
            </label>

            <Select value={controls.sortMode} onValueChange={(value) => updateControls({ sortMode: value as SortMode })}>
              <SelectTrigger aria-label="Sort results">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters ? (
              <Button type="button" variant="ghost" onClick={resetControls}>
                Clear
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-10" aria-labelledby="results-heading">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="results-heading" className="font-serif text-3xl text-ink">
              {hasActiveSearch ? `Results for "${debouncedQuery}"` : 'Featured catalog picks'}
            </h2>
            <p className="text-sm text-muted">
              {isLoading
                ? 'Loading the catalog...'
                : `${result.totalItems.toLocaleString()} products found${
                    controls.category !== 'all' ? ` in ${controls.category}` : ''
                  }${controls.inStockOnly ? ' that are in stock' : ''}.`}
            </p>
          </div>
          {isPending ? <span className="text-sm font-semibold text-clay">Updating...</span> : null}
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-lg border border-line bg-white" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-lg border border-line bg-white p-8 text-center shadow-sm">
            <h2 className="font-serif text-3xl text-ink">The catalog did not load.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              The page is ready, but the remote product file could not be reached. Try again and the cached query will
              recover when the request succeeds.
            </p>
            <Button type="button" className="mt-5" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && result.totalItems === 0 ? (
          <div className="rounded-lg border border-line bg-white p-8 text-center shadow-sm">
            <h2 className="font-serif text-3xl text-ink">No pieces matched that search.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Try a broader material, product type, brand, or clear one of the active filters.
            </p>
            <Button type="button" className="mt-5" onClick={resetControls}>
              Clear filters
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && result.totalItems > 0 ? (
          <>
            <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((item) => (
                <li key={item.id}>
                  <ProductCard item={item} query={debouncedQuery} />
                </li>
              ))}
            </ul>

            <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Results pagination">
              <Button
                type="button"
                variant="outline"
                disabled={controls.page <= 1}
                onClick={() => updateControls({ page: controls.page - 1 })}
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>
              <span className="text-sm font-semibold text-muted">
                Page {Math.min(controls.page, result.totalPages)} of {result.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={controls.page >= result.totalPages}
                onClick={() => updateControls({ page: controls.page + 1 })}
              >
                Next
                <ArrowRight className="size-4" />
              </Button>
            </nav>
          </>
        ) : null}
      </section>
    </main>
  )
}

export default App
