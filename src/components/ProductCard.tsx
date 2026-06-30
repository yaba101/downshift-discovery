import { Star } from 'lucide-react'
import { useState } from 'react'
import type { RankedItem } from '../types/catalog'

type ProductCardProps = {
  item: RankedItem
  query: string
  tilt?: 'left' | 'right' | 'none'
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
      <mark key={`${part}-${index}`} className="rounded bg-olive/10 px-1 text-olive">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function ProductCard({ item, query, tilt = 'none' }: ProductCardProps) {
  const tiltClass = tilt === 'left' ? '-rotate-2' : tilt === 'right' ? 'rotate-2' : ''
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article
      className={`group flex min-h-[520px] flex-col bg-paper px-5 py-7 transition duration-300 hover:bg-mist/45 ${tiltClass}`}
    >
      <div className="flex min-h-[270px] flex-1 items-center justify-center">
        {item.image && !imageFailed ? (
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[270px] w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            width={item.imageWidth ?? 500}
            height={item.imageHeight ?? 320}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid size-40 place-items-center rounded-full bg-mist text-center text-xs font-extrabold uppercase tracking-[0.12em] text-muted">
            Image coming soon
          </div>
        )}
      </div>

      <div className="mt-8">
        <PreciseRating rating={item.rating} ratingLabel={item.ratingLabel} reviews={item.reviews} />

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
          <h3 className="font-serif text-[26px] font-bold uppercase leading-[1.02] tracking-[-0.025em] text-ink">
            {highlightText(item.title, query)}
          </h3>
          <p className="pt-1 font-serif text-[25px] font-bold uppercase leading-none tracking-[-0.025em] text-ink">{item.priceLabel}</p>
        </div>

        <p className="mt-5 text-sm font-semibold text-muted">
          {item.category}
          {item.brand ? ` / ${item.brand}` : ''}
        </p>
      </div>

      {!item.inStock ? (
        <span className="mt-4 inline-flex w-fit rounded-full border border-line px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-muted">
          Out of stock
        </span>
      ) : null}
    </article>
  )
}

function PreciseRating({ rating, ratingLabel, reviews }: { rating: number | null; ratingLabel: string; reviews: number }) {
  const safeRating = Math.max(0, Math.min(5, rating ?? 0))

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-clay" aria-label={`${ratingLabel} rating from ${reviews.toLocaleString()} reviews`}>
      <span className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        {rating === null ? 'New' : safeRating.toFixed(1)}
      </span>
      <span className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => {
          const fillPercent = Math.max(0, Math.min(1, safeRating - index)) * 100

          return (
            <span key={index} className="relative grid size-4 place-items-center text-clay/25">
              <Star className="size-4 fill-current" />
              <span className="absolute inset-0 overflow-hidden text-clay" style={{ width: `${fillPercent}%` }}>
                <Star className="size-4 fill-current" />
              </span>
            </span>
          )
        })}
      </span>
      <span className="font-sans text-[11px] font-semibold text-muted">({reviews.toLocaleString()})</span>
    </div>
  )
}
