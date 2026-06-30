import { Star, PackageCheck, PackageX } from 'lucide-react'
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
    <Card className="group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="size-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            width={item.imageWidth ?? 500}
            height={item.imageHeight ?? 320}
          />
        ) : (
          <div className="grid size-full place-items-center bg-[linear-gradient(135deg,#dfe8df,#f7d8b4,#d9e6ec)] p-6 text-center text-sm font-semibold text-ink">
            Image coming soon
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge tone={item.inStock ? 'sage' : 'clay'} className="bg-white/90 backdrop-blur">
            {item.inStock ? (
              <PackageCheck className="mr-1 size-3.5" />
            ) : (
              <PackageX className="mr-1 size-3.5" />
            )}
            {item.inStock ? 'In stock' : 'Out of stock'}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-bold uppercase text-muted">{item.brand}</span>
            <span className="shrink-0 text-sm font-bold text-ink">{item.priceLabel}</span>
          </div>
          <h3 className="font-serif text-xl leading-tight text-ink">{highlightText(item.title, query)}</h3>
          <p className="line-clamp-2 text-sm text-muted">{highlightText(item.description, query)}</p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <Badge tone="ink">{highlightText(item.category, query)}</Badge>
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{highlightText(tag, query)}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <Star className="size-4 fill-honey text-honey" />
            {item.ratingLabel}
          </span>
          <span>{item.reviews.toLocaleString()} reviews</span>
        </div>

        {hasQuery && item.matchedFields.length > 0 ? (
          <span className="text-xs font-semibold text-clay">
            Matched {item.matchedFields.join(', ')}
          </span>
        ) : null}
      </div>
    </Card>
  )
}
