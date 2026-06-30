import { ArrowLeft, ArrowRight, PackageSearch } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import type { RankedItem, SearchControls } from '../types/catalog'

type ResultsPanelProps = {
  controls: SearchControls
  debouncedQuery: string
  hasActiveSearch: boolean
  hasFilters: boolean
  isError: boolean
  isLoading: boolean
  isPending: boolean
  result: {
    items: RankedItem[]
    totalItems: number
    totalPages: number
  }
  refetch: () => void
  resetControls: () => void
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function ResultsPanel({
  controls,
  debouncedQuery,
  hasActiveSearch,
  hasFilters,
  isError,
  isLoading,
  isPending,
  result,
  refetch,
  resetControls,
  updateControls,
}: ResultsPanelProps) {
  return (
    <>
      <div className="mb-5 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase text-cobalt">
            <PackageSearch className="size-4" />
            {isPending ? 'Updating' : 'Results'}
          </div>
          <h2 id="results-heading" className="font-serif text-4xl leading-none text-ink">
            {hasActiveSearch ? `"${debouncedQuery}"` : 'Catalog picks'}
          </h2>
          <p className="mt-2 text-sm font-semibold text-muted">
            {isLoading
              ? 'Loading catalog'
              : `${result.totalItems.toLocaleString()} products${
                  controls.category !== 'all' ? ` in ${controls.category}` : ''
                }${controls.inStockOnly ? ' in stock' : ''}`}
          </p>
        </div>

        {hasFilters ? (
          <div className="flex flex-wrap gap-2">
            {hasActiveSearch ? <Badge tone="cobalt">Search: {debouncedQuery}</Badge> : null}
            {controls.category !== 'all' ? <Badge tone="plum">{controls.category}</Badge> : null}
            {controls.inStockOnly ? <Badge tone="sage">In stock</Badge> : null}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-lg border border-line bg-paper" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-line bg-paper p-8 text-center shadow-sm">
          <h2 className="font-serif text-3xl text-ink">The catalog did not load.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            The local product file could not be read. Try again after the dev server refreshes.
          </p>
          <Button type="button" className="mt-5" onClick={refetch}>
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && result.totalItems === 0 ? (
        <div className="rounded-lg border border-line bg-paper p-8 text-center shadow-sm">
          <h2 className="font-serif text-3xl text-ink">No matching pieces.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Try a broader material, product type, brand, or room.</p>
          <Button type="button" className="mt-5" onClick={resetControls}>
            Clear filters
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && result.totalItems > 0 ? (
        <>
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {result.items.map((item) => (
              <li key={item.id}>
                <ProductCard item={item} query={debouncedQuery} />
              </li>
            ))}
          </ul>

          <nav
            className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row"
            aria-label="Results pagination"
          >
            <Button
              type="button"
              variant="outline"
              disabled={controls.page <= 1}
              onClick={() => updateControls({ page: controls.page - 1 })}
            >
              <ArrowLeft className="size-4" />
              Previous
            </Button>
            <span className="text-sm font-bold text-muted">
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
    </>
  )
}
