import type { SearchControls } from '../types/catalog'

type CatalogHeaderProps = {
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function CatalogHeader({ updateControls }: CatalogHeaderProps) {
  return (
    <header className="flex min-h-16 items-center border-b border-line bg-paper px-5 py-4 lg:px-8">
      <button
        type="button"
        className="flex items-center gap-3 text-left transition hover:opacity-75"
        aria-label="Reset catalog"
        onClick={() =>
          updateControls({
            query: '',
            category: 'all',
            inStockOnly: false,
            priceRange: 'all',
            customPriceMin: 0,
            customPriceMax: 1500,
            selectedTags: [],
          })
        }
      >
        <img src="/downshift-logo.png" alt="" className="size-9 object-contain" aria-hidden="true" />
        <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink">Downshift</span>
      </button>
    </header>
  )
}
