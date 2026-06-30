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
  { label: 'Custom', value: 'custom' },
]

const MIN_PRICE = 0
const MAX_PRICE = 2500
const PRICE_STEP = 25

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
  return priceRanges.find((range) => range.value === value)?.label ?? 'All'
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

  function updateCustomPrice(next: { min?: number; max?: number }) {
    const nextMin = clampPrice(next.min ?? controls.customPriceMin)
    const nextMax = clampPrice(next.max ?? controls.customPriceMax)

    updateControls({
      priceRange: 'custom',
      customPriceMin: Math.min(nextMin, nextMax),
      customPriceMax: Math.max(nextMin, nextMax),
    })
  }

  return (
    <aside className="border-b border-line bg-paper text-ink lg:border-b-0 lg:border-r">
      <div className="px-5 py-8 lg:px-7">
        <div className="mb-7 flex items-start justify-between gap-4">
          <h2 className="font-serif text-4xl font-bold uppercase leading-none tracking-[-0.035em]">Filter by</h2>
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
            {controls.query.trim() ? (
              <ActiveFilterChip label={`Remove search filter ${controls.query.trim()}`} onRemove={() => updateControls({ query: '' })}>
                Search: {controls.query.trim()}
              </ActiveFilterChip>
            ) : null}
            {controls.category !== 'all' ? (
              <ActiveFilterChip label={`Remove ${controls.category} category`} onRemove={() => updateControls({ category: 'all' })}>
                {controls.category}
              </ActiveFilterChip>
            ) : null}
            {controls.inStockOnly ? (
              <ActiveFilterChip label="Remove in stock filter" onRemove={() => updateControls({ inStockOnly: false })}>
                In stock
              </ActiveFilterChip>
            ) : null}
            {controls.priceRange !== 'all' ? (
              <ActiveFilterChip label="Remove price filter" onRemove={() => updateControls({ priceRange: 'all' })}>
                Price: {controls.priceRange === 'custom' ? `$${controls.customPriceMin}-${controls.customPriceMax}` : priceRangeLabel(controls.priceRange)}
              </ActiveFilterChip>
            ) : null}
            {controls.selectedTags.map((tag) => (
              <ActiveFilterChip
                key={tag}
                label={`Remove ${tag} tag`}
                onRemove={() => updateControls({ selectedTags: controls.selectedTags.filter((selected) => selected !== tag) })}
              >
                {tag}
              </ActiveFilterChip>
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
            <div className="mt-2 border border-line bg-paper shadow-[6px_6px_0_rgba(48,48,48,0.08)]" aria-label="Search suggestions">
              <p className="border-b border-line px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Suggestions</p>
              {suggestions.slice(0, 3).map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  className="flex w-full items-center gap-3 border-b border-line/60 px-4 py-3 text-left text-sm font-semibold text-muted transition last:border-b-0 hover:bg-mist hover:text-ink"
                  onClick={() => chooseQuery(suggestion)}
                >
                  <Search className="size-4 shrink-0" />
                  <span className="truncate">{suggestion}</span>
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
          <div className="mt-5 space-y-4 border-t border-line/70 pt-5">
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Min
                <input
                  type="number"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={controls.customPriceMin}
                  onChange={(event) => updateCustomPrice({ min: Number(event.target.value) })}
                  className="h-10 w-full border border-line bg-transparent px-3 text-sm font-semibold text-ink outline-none focus:ring-1 focus:ring-ink"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Max
                <input
                  type="number"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={controls.customPriceMax}
                  onChange={(event) => updateCustomPrice({ max: Number(event.target.value) })}
                  className="h-10 w-full border border-line bg-transparent px-3 text-sm font-semibold text-ink outline-none focus:ring-1 focus:ring-ink"
                />
              </label>
            </div>
            <label className="block space-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Minimum price
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={controls.customPriceMin}
                onChange={(event) => updateCustomPrice({ min: Number(event.target.value) })}
                className="w-full accent-ink"
              />
            </label>
            <label className="block space-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Maximum price
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={controls.customPriceMax}
                onChange={(event) => updateCustomPrice({ max: Number(event.target.value) })}
                className="w-full accent-ink"
              />
            </label>
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
      <h3 className="mb-5 flex items-center justify-between font-serif text-2xl font-bold uppercase tracking-[-0.025em]">
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

function ActiveFilterChip({ children, label, onRemove }: { children: ReactNode; label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper">
      {children}
      <button type="button" aria-label={label} className="-mr-1 rounded-full p-0.5 transition hover:bg-paper/15" onClick={onRemove}>
        <X className="size-3" />
      </button>
    </span>
  )
}

function clampPrice(value: number) {
  if (Number.isNaN(value)) {
    return MIN_PRICE
  }

  return Math.min(MAX_PRICE, Math.max(MIN_PRICE, Math.round(value / PRICE_STEP) * PRICE_STEP))
}
