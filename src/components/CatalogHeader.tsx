import { Heart, ShoppingBag, UserRound } from 'lucide-react'
import type { SearchControls } from '../types/catalog'

type CatalogHeaderProps = {
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function CatalogHeader({ updateControls }: CatalogHeaderProps) {
  return (
    <header className="mb-9 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center justify-between gap-5">
        <button
          type="button"
          className="font-serif text-3xl italic leading-none text-olive"
          onClick={() => updateControls({ query: '', category: 'all', inStockOnly: false, priceRange: 'all', selectedTags: [] })}
        >
          ds
        </button>
      </div>

      <nav className="flex flex-wrap items-center gap-5 text-base font-bold text-olive/50 md:gap-10">
        <span>Home</span>
        <span className="text-olive">Catalog</span>
        <span>Instructions</span>
        <span>FAQ</span>
        <span>About us</span>
      </nav>

      <div className="flex items-center gap-4 text-olive">
        <Heart className="size-5" />
        <ShoppingBag className="size-5" />
        <UserRound className="size-5" />
      </div>
    </header>
  )
}
