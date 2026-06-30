import { Badge } from './ui/badge'
import type { CatalogItem } from '../types/catalog'

type EditorialShelfProps = {
  categoryCount: number
  items: CatalogItem[]
  totalItems: number
  chooseQuery: (query: string) => void
}

export function EditorialShelf({ categoryCount, items, totalItems, chooseQuery }: EditorialShelfProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="mb-6 overflow-hidden rounded-lg border border-line bg-ink text-paper">
      <div className="grid lg:grid-cols-[0.7fr_1.3fr]">
        <div className="flex flex-col justify-between gap-8 p-6">
          <div>
            <Badge tone="cobalt" className="border-paper/25 bg-paper/10 text-paper">
              Editor shelf
            </Badge>
            <h2 className="mt-4 font-serif text-4xl leading-tight">High-signal pieces with stock and proof.</h2>
          </div>
          <p className="text-sm leading-6 text-paper/70">
            {totalItems.toLocaleString()} products indexed across {categoryCount} rooms.
          </p>
        </div>
        <ul className="grid list-none gap-px bg-paper/15 p-0 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="bg-ink">
              <button
                type="button"
                onClick={() => chooseQuery(item.title)}
                className="group flex h-full w-full flex-col text-left"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-mist">
                  <img
                    src={item.image ?? ''}
                    alt={item.title}
                    className="size-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-xs font-extrabold uppercase text-paper/50">{item.category}</p>
                  <h3 className="font-serif text-xl leading-tight text-paper">{item.title}</h3>
                  <p className="text-sm font-bold text-honey">{item.priceLabel}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
