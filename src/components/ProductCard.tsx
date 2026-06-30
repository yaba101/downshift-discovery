import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import type { RankedItem } from '../types/catalog'
import { Card } from './ui/card'

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
    <Card
      className={`group relative flex min-h-[342px] flex-col overflow-hidden rounded-[30px] border-0 bg-card-cream p-6 shadow-none transition duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_28px_60px_rgba(52,60,39,0.12)] ${tiltClass}`}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        {item.image && !imageFailed ? (
          <img
            src={item.image}
            alt={item.title}
            className="max-h-52 w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
            loading="lazy"
            width={item.imageWidth ?? 500}
            height={item.imageHeight ?? 320}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid size-36 place-items-center rounded-full bg-catalog-panel text-center text-sm font-black text-olive">
            Image coming soon
          </div>
        )}
      </div>

      <div className="mt-5 pr-12">
        <h3 className="line-clamp-2 text-[16px] font-bold leading-6 tracking-[-0.02em] text-olive">
          {highlightText(item.title, query)}
        </h3>
        <p className="mt-1 text-[17px] font-extrabold tracking-[-0.02em] text-olive">{item.priceLabel}</p>
      </div>

      {!item.inStock ? (
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-olive">
          Out of stock
        </span>
      ) : null}

      <button
        type="button"
        className="absolute bottom-5 right-5 grid size-12 place-items-center rounded-full bg-sage-button text-olive transition group-hover:bg-olive group-hover:text-white"
        aria-label={`View ${item.title}`}
      >
        <ArrowUpRight className="size-6" />
      </button>
    </Card>
  )
}
