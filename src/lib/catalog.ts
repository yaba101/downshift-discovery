import type { CatalogItem, CatalogItemRaw } from '../types/catalog'

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const RATING_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function parsePrice(price: CatalogItemRaw['price']) {
  if (typeof price === 'number' && Number.isFinite(price)) {
    return price
  }

  if (typeof price === 'string') {
    const parsed = Number(price.replaceAll(',', '').trim())
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function normalizeCatalogItem(raw: CatalogItemRaw): CatalogItem {
  const price = parsePrice(raw.price)
  const rating = typeof raw.rating === 'number' && Number.isFinite(raw.rating) ? raw.rating : null
  const description = raw.description?.trim() || 'Details are still being collected for this piece.'
  const tags = Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : []

  return {
    id: raw.id,
    title: raw.title,
    brand: raw.brand,
    category: raw.category,
    tags,
    price,
    priceLabel: price === null ? 'Price unavailable' : CURRENCY_FORMATTER.format(price),
    rating,
    ratingLabel: rating === null ? 'No rating yet' : RATING_FORMATTER.format(rating),
    reviews: raw.reviews,
    inStock: raw.inStock,
    releasedAt: raw.releasedAt,
    image: raw.image,
    imageWidth: raw.imageWidth,
    imageHeight: raw.imageHeight,
    description,
    hasDescription: Boolean(raw.description?.trim()),
    searchText: [raw.title, raw.brand, raw.category, ...tags, description].join(' ').toLowerCase(),
  }
}

function normalizeCatalog(rawItems: CatalogItemRaw[]) {
  return rawItems.map(normalizeCatalogItem)
}

export async function fetchCatalogItems() {
  const response = await fetch('/items.json')

  if (!response.ok) {
    throw new Error(`Catalog request failed with ${response.status}`)
  }

  const rawItems = (await response.json()) as CatalogItemRaw[]
  return normalizeCatalog(rawItems)
}
