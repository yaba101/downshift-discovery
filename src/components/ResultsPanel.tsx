import { ChevronDown } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { RankedItem, SearchControls, SortMode } from '../types/catalog'

type ResultsPanelProps = {
  controls: SearchControls
  debouncedQuery: string
  status: {
    hasActiveSearch: boolean
    hasFilters: boolean
    isError: boolean
    isLoading: boolean
    isPending: boolean
  }
  result: {
    items: RankedItem[]
    totalItems: number
    totalPages: number
  }
  refetch: () => void
  resetControls: () => void
  updateControls: (nextControls: Partial<SearchControls>) => void
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
}

function priceRangeLabel(value: SearchControls['priceRange']) {
  const labels = {
    all: 'All prices',
    'under-250': 'Under $250',
    '250-750': '$250-750',
    '750-1500': '$750-1,500',
    '1500-plus': '$1,500+',
  }
  return labels[value]
}

export function ResultsPanel({
  controls,
  debouncedQuery,
  status,
  result,
  refetch,
  resetControls,
  updateControls,
}: ResultsPanelProps) {
  const currentPage = Math.min(controls.page, result.totalPages)
  const visiblePages = getVisiblePages(currentPage, result.totalPages)
  const pageStart = result.totalItems === 0 ? 0 : (currentPage - 1) * 12 + 1
  const pageEnd = Math.min(currentPage * 12, result.totalItems)
  const { hasActiveSearch, hasFilters, isError, isLoading, isPending } = status

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 id="results-heading" className="text-2xl font-normal tracking-tight text-olive">
            Showing <span className="font-black">{result.totalItems.toLocaleString()} results</span>
          </h1>
          <p className="mt-1 text-sm font-bold text-olive/50">
            {isLoading ? 'Loading catalog' : `${pageStart.toLocaleString()}-${pageEnd.toLocaleString()} on this page`}
            {isPending ? ' · Updating' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-black text-olive">Sort by</span>
          <Select value={controls.sortMode} onValueChange={(value) => updateControls({ sortMode: value as SortMode })}>
            <SelectTrigger className="h-11 min-w-56 rounded-full border-0 bg-white px-5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price (from low to high)</SelectItem>
              <SelectItem value="price-desc">Price (from high to low)</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters ? (
        <div className="mb-7 flex flex-wrap items-center gap-2">
          {hasActiveSearch ? <Badge>Search: {debouncedQuery}</Badge> : null}
          {controls.category !== 'all' ? <Badge>{controls.category}</Badge> : null}
          {controls.priceRange !== 'all' ? <Badge>Price: {priceRangeLabel(controls.priceRange)}</Badge> : null}
          {controls.inStockOnly ? <Badge>In stock</Badge> : null}
          {controls.selectedTags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          <Button type="button" variant="soft" size="sm" className="rounded-full" onClick={resetControls}>
            Clear all
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-[360px] animate-pulse rounded-[30px] bg-card-cream" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-[30px] bg-card-cream p-10 text-center text-olive">
          <h2 className="text-3xl font-black">The catalog did not load.</h2>
          <p className="mx-auto mt-3 max-w-xl text-olive/60">The local product file could not be read.</p>
          <Button type="button" className="mt-5 rounded-full" onClick={refetch}>
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && result.totalItems === 0 ? (
        <div className="rounded-[30px] bg-card-cream p-10 text-center text-olive">
          <h2 className="text-3xl font-black">No matching pieces.</h2>
          <p className="mx-auto mt-3 max-w-xl text-olive/60">Try a broader search or clear one of the active filters.</p>
          <Button type="button" className="mt-5 rounded-full" onClick={resetControls}>
            Clear filters
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && result.totalItems > 0 ? (
        <>
          <ul className="grid list-none gap-5 p-0 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((item, index) => (
              <li key={item.id}>
                <ProductCard item={item} query={debouncedQuery} tilt={index % 5 === 0 ? 'left' : index % 5 === 2 ? 'right' : 'none'} />
              </li>
            ))}
          </ul>

          <nav className="mt-10 flex flex-col items-center gap-3 text-olive" aria-label="Results pagination">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="soft"
                className="rounded-full"
                disabled={currentPage <= 1}
                onClick={() => updateControls({ page: currentPage - 1 })}
              >
                Back
              </Button>
              {visiblePages.map((page, index) => {
                const previousPage = visiblePages[index - 1]
                const showGap = previousPage !== undefined && page - previousPage > 1
                return (
                  <div key={page} className="flex items-center">
                    {showGap ? <span className="px-2 text-sm font-black text-olive/40">...</span> : null}
                    <button
                      type="button"
                      onClick={() => updateControls({ page })}
                      className={`grid size-10 place-items-center rounded-full text-sm font-black transition ${
                        currentPage === page ? 'bg-olive text-white' : 'bg-white text-olive hover:bg-sage-button'
                      }`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  </div>
                )
              })}
              <Button
                type="button"
                variant="default"
                className="rounded-full"
                disabled={currentPage >= result.totalPages}
                onClick={() => updateControls({ page: currentPage + 1 })}
              >
                Next
              </Button>
              <div className="ml-2 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold">
                Page
                <span className="font-black">{currentPage}</span>
                <ChevronDown className="size-4" />
              </div>
            </div>
            <p className="text-sm font-bold">
              {pageStart.toLocaleString()}-{pageEnd.toLocaleString()} of {result.totalItems.toLocaleString()}
            </p>
          </nav>
        </>
      ) : null}
    </div>
  )
}
