import { CheckCircle2, ChevronUp, Circle, Search, X } from 'lucide-react'
import type { ReactNode } from 'react'
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

function priceRangeLabel(value: PriceRange) {
  return priceRanges.find((range) => range.value === value)?.label ?? 'Custom'
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
    <aside className="border-b border-line bg-paper text-ink lg:border-b-0 lg:border-r">
      <div className="px-5 py-8 lg:px-7">
        <div className="mb-7 flex items-start justify-between gap-4">
          <h2 className="font-serif text-4xl font-black uppercase leading-none tracking-[-0.04em]">Filter by</h2>
          {hasFilters ? (
            <button
              type="button"
              className="mt-1 text-sm font-bold text-muted underline underline-offset-4 transition hover:text-ink"
              onClick={resetControls}
            >
              Clear all
            </button>
          ) : null}
        </div>

        {hasFilters ? (
          <div className="mb-7 flex flex-wrap gap-2">
            {controls.query.trim() ? <ActiveFilterChip>Search: {controls.query.trim()}</ActiveFilterChip> : null}
            {controls.category !== 'all' ? <ActiveFilterChip>{controls.category}</ActiveFilterChip> : null}
            {controls.inStockOnly ? <ActiveFilterChip>In stock</ActiveFilterChip> : null}
            {controls.priceRange !== 'all' ? <ActiveFilterChip>Price: {priceRangeLabel(controls.priceRange)}</ActiveFilterChip> : null}
            {controls.selectedTags.map((tag) => (
              <ActiveFilterChip key={tag}>{tag}</ActiveFilterChip>
            ))}
          </div>
        ) : null}

        <FilterGroup title="Search">
          <div className="relative">
            <label htmlFor="sidebar-search" className="sr-only">
              Search products
            </label>
            <Input
              id="sidebar-search"
              value={controls.query}
              onChange={(event) => updateControls({ query: event.target.value })}
              className="h-11 rounded-none border-line bg-transparent pl-4 pr-11 text-sm font-semibold shadow-none placeholder:text-muted focus-visible:ring-1 focus-visible:ring-ink"
              placeholder="Search catalog"
            />
            <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
          {controls.query.trim() && suggestions.length > 0 ? (
            <div className="mt-3 space-y-2">
              {suggestions.slice(0, 3).map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  className="block w-full truncate text-left text-xs font-bold text-muted transition hover:text-ink"
                  onClick={() => chooseQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </FilterGroup>

        <FilterGroup title="Category">
          <div className="space-y-3">
            {['all', ...categories].map((category) => {
              const active = controls.category === category
              return (
                <FilterOption
                  key={category}
                  active={active}
                  label={category === 'all' ? 'All' : category}
                  onClick={() => updateControls({ category })}
                />
              )
            })}
          </div>
        </FilterGroup>

        <FilterGroup title="Availability">
          <FilterOption
            active={controls.inStockOnly}
            label="In stock only"
            onClick={() => updateControls({ inStockOnly: !controls.inStockOnly })}
          />
        </FilterGroup>

        <FilterGroup title="Price">
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <FilterOption
                key={range.value}
                active={controls.priceRange === range.value}
                label={range.label}
                onClick={() => updateControls({ priceRange: range.value })}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Tags">
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => {
              const active = controls.selectedTags.includes(tag)
              return (
                <button
                  type="button"
                  key={tag}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    active ? 'border-ink bg-ink text-paper' : 'border-line bg-transparent text-muted hover:border-ink hover:text-ink'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </FilterGroup>
      </div>
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-6">
      <h3 className="mb-5 flex items-center justify-between font-serif text-2xl font-black uppercase tracking-[-0.03em]">
        <span>{title}</span>
        <ChevronUp className="size-5 stroke-[2.4]" />
      </h3>
      {children}
    </section>
  )
}

function FilterOption({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  const Icon = active ? CheckCircle2 : Circle

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 text-left text-sm font-semibold text-muted transition hover:text-ink"
      onClick={onClick}
    >
      <Icon className={`size-4 ${active ? 'fill-paper text-ink' : 'text-line'}`} />
      <span>{label}</span>
    </button>
  )
}

function ActiveFilterChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper">
      {children}
      <X className="size-3" />
    </span>
  )
}
