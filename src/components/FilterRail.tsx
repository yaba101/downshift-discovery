import { SlidersHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import type { CatalogItem, SearchControls } from '../types/catalog'

type FilterRailProps = {
  categories: string[]
  controls: SearchControls
  hasActiveSearch: boolean
  hasFilters: boolean
  items: CatalogItem[]
  popularTags: string[]
  chooseQuery: (query: string) => void
  resetControls: () => void
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function FilterRail({
  categories,
  controls,
  hasActiveSearch,
  hasFilters,
  items,
  popularTags,
  chooseQuery,
  resetControls,
  updateControls,
}: FilterRailProps) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start" aria-label="Discovery filters">
      <section className="rounded-lg border border-line bg-paper p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-ink">Refine</h2>
          {hasFilters ? (
            <Button type="button" variant="ghost" size="sm" onClick={resetControls}>
              Clear
            </Button>
          ) : null}
        </div>

        <label
          htmlFor="in-stock-only"
          className="mb-5 flex h-12 items-center justify-between rounded-md border border-line bg-white px-3 text-sm font-bold text-ink"
        >
          <span>In stock only</span>
          <Checkbox
            id="in-stock-only"
            checked={controls.inStockOnly}
            onCheckedChange={(checked) => updateControls({ inStockOnly: checked === true })}
          />
        </label>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-muted">
            <SlidersHorizontal className="size-4" />
            Rooms
          </div>
          <ul className="grid gap-2">
            <li>
              <Button
                type="button"
                variant={controls.category === 'all' ? 'default' : 'outline'}
                className="w-full justify-between"
                onClick={() => updateControls({ category: 'all' })}
              >
                All categories
                <span>{items.length.toLocaleString()}</span>
              </Button>
            </li>
            {categories.map((category) => {
              const count = items.filter((item) => item.category === category).length
              return (
                <li key={category}>
                  <Button
                    type="button"
                    variant={controls.category === category ? 'default' : 'outline'}
                    className="w-full justify-between"
                    onClick={() => updateControls({ category })}
                  >
                    {category}
                    <span>{count}</span>
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {!hasActiveSearch ? (
        <section className="rounded-lg border border-line bg-paper p-4">
          <h2 className="mb-3 font-serif text-2xl text-ink">Popular searches</h2>
          <ul className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <li key={tag}>
                <Button type="button" variant="soft" size="sm" onClick={() => chooseQuery(tag)}>
                  {tag}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  )
}
