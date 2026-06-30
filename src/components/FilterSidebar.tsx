import { Search } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import type { PriceRange, SearchControls } from '../types/catalog'

const priceRanges: Array<{ label: string; value: PriceRange }> = [
  { label: 'All', value: 'all' },
  { label: 'Under $250', value: 'under-250' },
  { label: '$250-750', value: '250-750' },
  { label: '$750-1,500', value: '750-1500' },
  { label: '$1,500+', value: '1500-plus' },
]

type FilterSidebarProps = {
  categories: string[]
  controls: SearchControls
  hasFilters: boolean
  popularTags: string[]
  suggestions: string[]
  chooseQuery: (query: string) => void
  resetControls: () => void
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function FilterSidebar({
  categories,
  controls,
  hasFilters,
  popularTags,
  suggestions,
  chooseQuery,
  resetControls,
  updateControls,
}: FilterSidebarProps) {
  function toggleTag(tag: string) {
    const selectedTags = controls.selectedTags.includes(tag)
      ? controls.selectedTags.filter((selected) => selected !== tag)
      : [...controls.selectedTags, tag]
    updateControls({ selectedTags })
  }

  return (
    <aside className="order-last rounded-[24px] border border-olive/30 bg-catalog-panel p-4 text-olive shadow-inner lg:sticky lg:top-6 lg:order-none lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Filters</h2>
        {hasFilters ? (
          <button type="button" className="text-sm font-bold underline underline-offset-4" onClick={resetControls}>
            Clear
          </button>
        ) : null}
      </div>

      <section className="space-y-3 border-b border-olive/20 pb-6">
        <h3 className="text-lg font-black">Search</h3>
        <div className="relative">
          <label htmlFor="sidebar-search" className="sr-only">
            Search products
          </label>
          <Input
            id="sidebar-search"
            value={controls.query}
            onChange={(event) => updateControls({ query: event.target.value })}
            className="h-11 rounded-full border-0 bg-white pl-5 pr-12 text-sm shadow-none"
            placeholder="linen lamp"
          />
          <button
            type="button"
            className="absolute right-1 top-1 grid size-9 place-items-center rounded-full bg-olive text-white"
            aria-label="Run search"
          >
            <Search className="size-4" />
          </button>
        </div>
        {controls.query.trim() && suggestions.length > 0 ? (
          <div className="space-y-1">
            {suggestions.slice(0, 3).map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                className="block w-full truncate rounded-full bg-white/70 px-3 py-2 text-left text-xs font-bold text-olive transition hover:bg-white"
                onClick={() => chooseQuery(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-3 border-b border-olive/20 py-6">
        <h3 className="text-lg font-black">Categories</h3>
        <div className="space-y-3">
          {['all', ...categories].map((category) => {
            const active = controls.category === category
            return (
              <button
                type="button"
                key={category}
                className="flex w-full items-center gap-3 text-left text-sm font-bold"
                onClick={() => updateControls({ category })}
              >
                <span
                  className={`grid size-6 place-items-center rounded border-2 ${
                    active ? 'border-olive bg-olive text-white' : 'border-olive/70'
                  }`}
                >
                  {active ? '✓' : ''}
                </span>
                <span>{category === 'all' ? 'All' : category}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-3 border-b border-olive/20 py-6">
        <h3 className="text-lg font-black">Price range</h3>
        <div className="space-y-3">
          {priceRanges.map((range) => {
            const active = controls.priceRange === range.value
            return (
              <button
                type="button"
                key={range.value}
                className="flex w-full items-center gap-3 text-left text-sm font-bold"
                onClick={() => updateControls({ priceRange: range.value })}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full border-2 ${
                    active ? 'border-olive bg-olive shadow-[inset_0_0_0_5px_#eef1ed]' : 'border-olive/70'
                  }`}
                />
                <span>{range.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-3 py-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">Tags</h3>
          <Button
            type="button"
            variant={controls.inStockOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateControls({ inStockOnly: !controls.inStockOnly })}
            className="rounded-full"
          >
            In stock
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => {
            const active = controls.selectedTags.includes(tag)
            return (
              <button
                type="button"
                key={tag}
                className={`rounded-full px-3 py-2 text-sm font-bold transition ${
                  active ? 'bg-olive text-white' : 'bg-white text-olive hover:bg-white/70'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}
