import { Search, X } from 'lucide-react'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { SearchControls, SortMode } from '../types/catalog'

type CatalogHeaderProps = {
  categories: string[]
  controls: SearchControls
  suggestions: string[]
  chooseQuery: (query: string) => void
  updateControls: (nextControls: Partial<SearchControls>) => void
}

export function CatalogHeader({ categories, controls, suggestions, chooseQuery, updateControls }: CatalogHeaderProps) {
  const showSuggestions = controls.query.trim().length > 0 && suggestions.length > 0

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-cobalt">Downshift catalog</p>
            <h1 className="font-serif text-4xl leading-none text-ink sm:text-5xl">Home goods index</h1>
          </div>
          <Badge tone="sage" className="w-fit">
            TanStack Query cache active
          </Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative">
            <label htmlFor="catalog-search" className="sr-only">
              Search the catalog
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <Input
              id="catalog-search"
              value={controls.query}
              onChange={(event) => updateControls({ query: event.target.value })}
              className="h-16 pl-12 pr-12 text-lg shadow-md"
              placeholder="Search linen lamps, rattan storage, Fenwick, kitchen..."
            />
            {controls.query ? (
              <button
                type="button"
                onClick={() => updateControls({ query: '' })}
                className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-mist hover:text-ink"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
            {showSuggestions ? (
              <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-lg border border-line bg-paper shadow-2xl">
                <div className="border-b border-line px-4 py-2 text-xs font-extrabold uppercase text-muted">
                  Suggestions
                </div>
                <ul className="list-none p-1">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-bold text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                        onClick={() => chooseQuery(suggestion)}
                      >
                        <Search className="size-4 text-cobalt" />
                        <span className="line-clamp-2">{suggestion}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={controls.category} onValueChange={(value) => updateControls({ category: value })}>
              <SelectTrigger aria-label="Filter by category" className="h-12 min-w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={controls.sortMode} onValueChange={(value) => updateControls({ sortMode: value as SortMode })}>
              <SelectTrigger aria-label="Sort results" className="h-12 min-w-44">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  )
}
