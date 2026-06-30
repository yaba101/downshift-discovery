import { Search, ShoppingBag, UserRound } from 'lucide-react'
import type { SearchControls } from '../types/catalog'

type CatalogHeaderProps = {
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function CatalogHeader({ updateControls }: CatalogHeaderProps) {
  return (
    <header className="grid min-h-16 items-center gap-4 border-b border-line bg-paper px-5 py-4 md:grid-cols-[260px_minmax(0,1fr)_260px] lg:px-8">
      <button
        type="button"
        className="flex items-center gap-3 justify-self-start text-left transition hover:opacity-75"
        aria-label="Reset catalog"
        onClick={() => updateControls({ query: '', category: 'all', inStockOnly: false, priceRange: 'all', selectedTags: [] })}
      >
        <img src="/downshift-logo.png" alt="" className="size-9 object-contain" aria-hidden="true" />
        <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink">Downshift</span>
      </button>

      <nav className="flex flex-wrap items-center gap-7 text-sm font-bold uppercase tracking-[0.16em] text-muted md:justify-center">
        <span className="transition hover:text-ink">Home</span>
        <span className="text-ink">Catalog</span>
        <span className="transition hover:text-ink">Search</span>
        <span className="transition hover:text-ink">About</span>
      </nav>

      <div className="flex items-center gap-5 text-ink md:justify-self-end">
        <Search className="size-5 stroke-[2.2]" />
        <ShoppingBag className="size-5 stroke-[2.2]" />
        <UserRound className="size-5 stroke-[2.2]" />
      </div>
    </header>
  )
}
