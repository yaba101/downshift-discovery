import { useQuery } from '@tanstack/react-query'
import { fetchCatalogItems } from '../lib/catalog'

export function useCatalogItems() {
  return useQuery({
    queryKey: ['catalog-items'],
    queryFn: fetchCatalogItems,
  })
}
