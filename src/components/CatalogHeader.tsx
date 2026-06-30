import { ShoppingCart, UserRound } from 'lucide-react'
import type { SearchControls } from '../types/catalog'

type CatalogHeaderProps = {
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function CatalogHeader({ updateControls }: CatalogHeaderProps) {
  return (
    <header className="mb-10 grid items-center gap-6 md:grid-cols-[180px_minmax(0,1fr)_180px]">
      <button
        type="button"
        className="justify-self-start transition hover:scale-105"
        aria-label="Reset catalog"
        onClick={() => updateControls({ query: '', category: 'all', inStockOnly: false, priceRange: 'all', selectedTags: [] })}
      >
        <img src="/catalog-logo.svg" alt="" className="h-9 w-auto" aria-hidden="true" />
      </button>

      <nav className="flex flex-wrap items-center gap-7 text-[18px] font-extrabold text-olive/50 md:justify-center lg:gap-11">
        <span className="transition hover:text-olive">Home</span>
        <span className="text-olive">Catalog</span>
        <span className="transition hover:text-olive">Instructions</span>
        <span className="transition hover:text-olive">FAQ</span>
        <span className="transition hover:text-olive">About us</span>
      </nav>

      <div className="flex items-center gap-6 text-olive md:justify-self-end">
        <ShoppingCart className="size-7 stroke-[2.4]" />
        <UserRound className="size-7 stroke-[2.4]" />
      </div>
    </header>
  )
}
