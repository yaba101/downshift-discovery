import { PackageCheck, PackageX, Star } from 'lucide-react'
import type { RankedItem } from '../types/catalog'
import { Badge } from './ui/badge'
import { Card } from './ui/card'

type ProductCardProps = {
  item: RankedItem
  query: string
}

function highlightText(text: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (terms.length === 0) {
    return text
  }

  const pattern = new RegExp(`(${terms.join('|')})`, 'ig')
  const matcher = new RegExp(`^(${terms.join('|')})$`, 'i')
  const parts = text.split(pattern)

  return parts.map((part, index) =>
    matcher.test(part) ? (
      <mark key={`${part}-${index}`} className="rounded bg-honey/35 px-1 text-ink">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function ProductCard({ item, query }: ProductCardProps) {
  const hasQuery = query.trim().length > 0

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="size-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            width={item.imageWidth ?? 500}
            height={item.imageHeight ?? 320}
          />
        ) : (
          <div className="grid size-full place-items-center bg-[linear-gradient(135deg,#dfe8df,#dde8f2,#f4e7d0)] p-6 text-center text-sm font-bold text-ink">
            Image coming soon
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone={item.inStock ? 'sage' : 'clay'} className="bg-paper/95 backdrop-blur">
            {item.inStock ? (
              <PackageCheck className="mr-1 size-3.5" />
            ) : (
              <PackageX className="mr-1 size-3.5" />
            )}
            {item.inStock ? 'In stock' : 'Out of stock'}
          </Badge>
          {item.price === null ? <Badge tone="cobalt" className="bg-paper/95 backdrop-blur">Quote</Badge> : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/20 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-extrabold uppercase text-cobalt">{item.brand}</span>
            <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-sm font-extrabold text-ink">
              {item.priceLabel}
            </span>
          </div>
          <h3 className="font-serif text-xl leading-tight text-ink">{highlightText(item.title, query)}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-muted">{highlightText(item.description, query)}</p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <Badge tone="plum">{highlightText(item.category, query)}</Badge>
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{highlightText(tag, query)}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line pt-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1 font-bold text-ink">
            <Star className="size-4 fill-honey text-honey" />
            {item.ratingLabel}
          </span>
          <span>{item.reviews.toLocaleString()} reviews</span>
        </div>

        {hasQuery && item.matchedFields.length > 0 ? (
          <span className="text-xs font-bold text-cobalt">
            Matched {item.matchedFields.join(', ')}
          </span>
        ) : null}
      </div>
    </Card>
  )
}
