import { Check, ChevronDown, CornerDownLeft, Search } from 'lucide-react'
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
    <aside className="order-last text-olive lg:sticky lg:top-6 lg:order-none lg:self-start">
      <div className="relative rounded-[22px] border border-olive/25 bg-catalog-panel px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] lg:max-h-[calc(100vh-4rem)] lg:overflow-hidden">
        <div className="pointer-events-none absolute bottom-4 right-2 top-16 hidden w-1.5 rounded-full bg-white/70 lg:block">
          <span className="absolute left-0 top-0 block h-40 w-1.5 rounded-full bg-olive/30" />
        </div>

        <div className="mb-7 flex items-center justify-between pr-4">
          <h2 className="font-serif text-[26px] font-extrabold leading-none tracking-[-0.04em]">Filters</h2>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-sage-button text-olive transition hover:bg-olive hover:text-white"
            aria-label="Collapse filters"
          >
            <CornerDownLeft className="size-5 rotate-90" />
          </button>
        </div>

        <div className="max-h-none space-y-7 pr-0 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-4">
          <section className="space-y-3">
            <h3 className="text-[18px] font-extrabold">Search</h3>
            <div className="relative">
              <label htmlFor="sidebar-search" className="sr-only">
                Search products
              </label>
              <Input
                id="sidebar-search"
                value={controls.query}
                onChange={(event) => updateControls({ query: event.target.value })}
                className="h-10 rounded-full border-0 bg-white pl-5 pr-12 text-[15px] font-semibold text-olive shadow-none placeholder:text-olive/40"
                placeholder="Search catalog"
              />
              <button
                type="button"
                className="absolute right-1 top-1 grid size-8 place-items-center rounded-full bg-olive text-white"
                aria-label="Run search"
              >
                <Search className="size-4 stroke-[3]" />
              </button>
            </div>
            {controls.query.trim() && suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.slice(0, 3).map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    className="block w-full truncate rounded-full bg-white/80 px-3 py-2 text-left text-xs font-extrabold text-olive transition hover:bg-white"
                    onClick={() => chooseQuery(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="space-y-4">
            <SectionTitle>Categories</SectionTitle>
            <div className="space-y-3">
              {['all', ...categories].map((category) => {
                const active = controls.category === category
                return (
                  <button
                    type="button"
                    key={category}
                    className="flex w-full items-center gap-3 text-left text-[15px] font-extrabold"
                    onClick={() => updateControls({ category })}
                  >
                    <span
                      className={`grid size-[23px] shrink-0 place-items-center rounded-[5px] border-2 ${
                        active ? 'border-olive bg-olive text-white' : 'border-olive/75 bg-transparent'
                      }`}
                    >
                      {active ? <Check className="size-4 stroke-[3]" /> : null}
                    </span>
                    <span>{category === 'all' ? 'All' : category}</span>
                  </button>
                )
              })}
              <button
                type="button"
                className="flex w-full items-center gap-3 pt-1 text-left text-[15px] font-extrabold"
                onClick={() => updateControls({ inStockOnly: !controls.inStockOnly })}
              >
                <span
                  className={`grid size-[23px] shrink-0 place-items-center rounded-[5px] border-2 ${
                    controls.inStockOnly ? 'border-olive bg-olive text-white' : 'border-olive/75 bg-transparent'
                  }`}
                >
                  {controls.inStockOnly ? <Check className="size-4 stroke-[3]" /> : null}
                </span>
                <span>In stock only</span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>Price range</SectionTitle>
            <div className="space-y-3">
              {priceRanges.map((range) => {
                const active = controls.priceRange === range.value
                return (
                  <button
                    type="button"
                    key={range.value}
                    className="flex w-full items-center gap-3 text-left text-[15px] font-extrabold"
                    onClick={() => updateControls({ priceRange: range.value })}
                  >
                    <span
                      className={`grid size-[23px] shrink-0 place-items-center rounded-full border-2 ${
                        active ? 'border-olive bg-olive shadow-[inset_0_0_0_5px_#eef1ee]' : 'border-olive/75'
                      }`}
                    />
                    <span>{range.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="px-1 pt-1">
              <div className="relative h-8">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-olive/20" />
                <div className="absolute left-[2%] right-[42%] top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-olive" />
                <span className="absolute left-0 top-1/2 size-6 -translate-y-1/2 rounded-full bg-olive" />
                <span className="absolute left-[55%] top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-olive" />
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-5 py-2 text-xs font-extrabold text-olive/50">
                  Min: <b className="text-olive">$0</b>
                </span>
                <span className="rounded-full bg-white px-5 py-2 text-xs font-extrabold text-olive/50">
                  Max: <b className="text-olive">$1.5k</b>
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-4 pb-1">
            <SectionTitle>Tags</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => {
                const active = controls.selectedTags.includes(tag)
                return (
                  <button
                    type="button"
                    key={tag}
                    className={`rounded-full px-3.5 py-2 text-[14px] font-extrabold leading-none transition ${
                      active ? 'bg-sage-button text-olive shadow-[inset_0_-1px_0_rgba(48,57,20,0.16)]' : 'bg-white text-olive hover:bg-white/70'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                )
              })}
              <button
                type="button"
                className="rounded-full bg-olive px-3.5 py-2 text-[14px] font-extrabold leading-none text-white"
                onClick={hasFilters ? resetControls : undefined}
              >
                {hasFilters ? 'Clear...' : 'More...'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </aside>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center justify-between text-[18px] font-extrabold">
      <span>{children}</span>
      <ChevronDown className="size-5 stroke-[2.6]" />
    </h3>
  )
}
