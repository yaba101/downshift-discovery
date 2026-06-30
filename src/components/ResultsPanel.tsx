import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { Button } from './ui/button'
import type { RankedItem, SearchControls } from '../types/catalog'

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
  const { isError, isLoading, isPending } = status

  function changePage(page: number) {
    updateControls({ page })
    window.requestAnimationFrame(() => {
      document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div id="catalog-results" className="min-w-0 scroll-mt-4">
      {isPending ? (
        <p className="border-b border-line px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">Updating results</p>
      ) : null}

      {isLoading ? (
        <div className="grid border-l border-line md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-[470px] animate-pulse border-b border-r border-line bg-mist/40" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="border-b border-line p-10 text-center text-ink">
          <h2 className="font-serif text-5xl font-black uppercase tracking-[-0.04em]">The catalog did not load.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">The local product file could not be read.</p>
          <Button type="button" className="mt-5 rounded-none" onClick={refetch}>
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && result.totalItems === 0 ? (
        <div className="border-b border-line p-10 text-center text-ink">
          <h2 className="font-serif text-5xl font-black uppercase tracking-[-0.04em]">No matching pieces.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Try a broader search or clear one of the active filters.</p>
          <Button type="button" className="mt-5 rounded-none" onClick={resetControls}>
            Clear filters
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && result.totalItems > 0 ? (
        <>
          <ul className="grid list-none border-l border-line p-0 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((item) => (
              <li key={item.id} className="border-b border-r border-line">
                <ProductCard item={item} query={debouncedQuery} tilt="none" />
              </li>
            ))}
          </ul>

          <nav className="flex flex-col items-center gap-3 border-b border-line px-5 py-8 text-ink" aria-label="Results pagination">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-none border-line bg-transparent px-4 text-[13px] font-bold uppercase tracking-[0.12em]"
                disabled={currentPage <= 1}
                onClick={() => changePage(currentPage - 1)}
              >
                Back
              </Button>
              {visiblePages.map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => changePage(page)}
                  className={`grid size-10 place-items-center border border-line text-sm font-bold transition ${
                    currentPage === page ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-mist'
                  }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <Button
                type="button"
                variant="default"
                className="h-10 rounded-none bg-ink px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-paper"
                disabled={currentPage >= result.totalPages}
                onClick={() => changePage(currentPage + 1)}
              >
                Next
              </Button>
              <PageJump key={currentPage} changePage={changePage} currentPage={currentPage} totalPages={result.totalPages} />
            </div>
            <p className="text-sm font-semibold text-muted">
              {pageStart.toLocaleString()}-{pageEnd.toLocaleString()} of {result.totalItems.toLocaleString()}
            </p>
          </nav>
        </>
      ) : null}
    </div>
  )
}

function PageJump({
  changePage,
  currentPage,
  totalPages,
}: {
  changePage: (page: number) => void
  currentPage: number
  totalPages: number
}) {
  const [pageInput, setPageInput] = useState(String(currentPage))

  function goToPageInput() {
    const nextPage = Number(pageInput)

    if (!Number.isFinite(nextPage)) {
      setPageInput(String(currentPage))
      return
    }

    changePage(Math.min(totalPages, Math.max(1, Math.trunc(nextPage))))
  }

  return (
    <>
      <label className="ml-2 flex h-10 items-center gap-2 border border-line px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-muted">
        Page
        <input
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={(event) => setPageInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              goToPageInput()
            }
          }}
          className="w-16 bg-transparent text-center text-ink outline-none"
          aria-label="Page number"
        />
      </label>
      <button
        type="button"
        className="grid h-10 min-w-12 place-items-center bg-ink px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-paper transition hover:bg-ink/90"
        onClick={goToPageInput}
      >
        Go
      </button>
    </>
  )
}
