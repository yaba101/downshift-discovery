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
  const pages = new Set([1, 2, 3, 4, currentPage])
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
  const resultWord = result.totalItems === 1 ? 'result' : 'results'

  return (
    <div className="min-w-0">
      <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 id="results-heading" className="font-serif text-[24px] font-medium tracking-[-0.04em] text-olive">
            Showing <span className="font-extrabold">{result.totalItems.toLocaleString()} {resultWord}</span>
          </h1>
          <p className="mt-1 text-sm font-extrabold text-olive/50">
            {isLoading ? 'Loading catalog' : `${pageStart.toLocaleString()}-${pageEnd.toLocaleString()} on this page`}
            {isPending ? ' · Updating' : ''}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[18px] font-extrabold text-olive">Sort by</span>
          <Select value={controls.sortMode} onValueChange={(value) => updateControls({ sortMode: value as SortMode })}>
            <SelectTrigger className="h-11 min-w-[240px] rounded-full border-0 bg-white px-5 text-[15px] font-extrabold text-olive shadow-none [&_svg]:size-8 [&_svg]:rounded-full [&_svg]:bg-olive [&_svg]:p-1.5 [&_svg]:text-white">
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
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {hasActiveSearch ? <Badge className="px-4 py-2 text-[14px] font-extrabold">Search: {debouncedQuery} ×</Badge> : null}
          {controls.category !== 'all' ? <Badge className="px-4 py-2 text-[14px] font-extrabold">{controls.category} ×</Badge> : null}
          {controls.priceRange !== 'all' ? (
            <Badge className="px-4 py-2 text-[14px] font-extrabold">Price range: {priceRangeLabel(controls.priceRange)} ×</Badge>
          ) : null}
          {controls.inStockOnly ? <Badge className="px-4 py-2 text-[14px] font-extrabold">In stock ×</Badge> : null}
          {controls.selectedTags.map((tag) => (
            <Badge key={tag} className="px-4 py-2 text-[14px] font-extrabold">{tag} ×</Badge>
          ))}
          <button type="button" className="ml-1 text-[14px] font-extrabold underline underline-offset-4" onClick={resetControls}>
            Clear all
          </button>
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
            {result.items.map((item) => (
              <li key={item.id}>
                <ProductCard item={item} query={debouncedQuery} tilt="none" />
              </li>
            ))}
          </ul>

          <nav className="mt-12 flex flex-col items-center gap-3 text-olive" aria-label="Results pagination">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="soft"
                className="h-10 rounded-full px-4 text-[14px] font-extrabold"
                disabled={currentPage <= 1}
                onClick={() => updateControls({ page: currentPage - 1 })}
              >
                ‹ Back
              </Button>
              {visiblePages.map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => updateControls({ page })}
                  className={`grid size-10 place-items-center rounded-full text-sm font-extrabold transition ${
                    currentPage === page ? 'bg-olive text-white' : 'bg-white text-olive hover:bg-sage-button'
                  }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <Button
                type="button"
                variant="default"
                className="h-10 rounded-full px-4 text-[14px] font-extrabold"
                disabled={currentPage >= result.totalPages}
                onClick={() => updateControls({ page: currentPage + 1 })}
              >
                Next ›
              </Button>
              <div className="ml-2 flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-extrabold text-olive/50">
                Page
                <span className="text-olive">{currentPage}</span>
              </div>
              <button
                type="button"
                className="grid h-10 min-w-12 place-items-center rounded-full bg-olive px-4 text-[14px] font-extrabold text-white transition hover:bg-olive/90"
                onClick={() => updateControls({ page: currentPage })}
              >
                Go
              </button>
            </div>
            <p className="w-full max-w-[560px] text-left text-[14px] font-extrabold">
              {pageStart.toLocaleString()}-{pageEnd.toLocaleString()} of {result.totalItems.toLocaleString()}
            </p>
          </nav>
        </>
      ) : null}
    </div>
  )
}
