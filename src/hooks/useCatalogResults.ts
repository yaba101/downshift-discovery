import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { filterAndRankItems, type FilterResult } from '../lib/search'
import type { CatalogItem, SearchControls } from '../types/catalog'

const RESULT_STALE_TIME = 1000 * 60 * 5
const RESULT_GC_TIME = 1000 * 60 * 15

const emptyResult: FilterResult = {
  items: [],
  totalItems: 0,
  totalPages: 1,
}

function catalogResultsQueryKey(controls: SearchControls) {
  return [
    'catalog-results',
    {
      category: controls.category,
      customPriceMax: controls.customPriceMax,
      customPriceMin: controls.customPriceMin,
      inStockOnly: controls.inStockOnly,
      page: controls.page,
      priceRange: controls.priceRange,
      query: controls.query.trim().toLowerCase(),
      selectedTags: [...controls.selectedTags].sort(),
      sortMode: controls.sortMode,
    },
  ] as const
}

export function useCatalogResults(items: CatalogItem[], controls: SearchControls) {
  const queryClient = useQueryClient()
  const hasItems = items.length > 0
  const query = useQuery({
    enabled: hasItems,
    gcTime: RESULT_GC_TIME,
    placeholderData: keepPreviousData,
    queryFn: () => filterAndRankItems(items, controls),
    queryKey: catalogResultsQueryKey(controls),
    staleTime: RESULT_STALE_TIME,
  })

  const result = query.data ?? (hasItems ? filterAndRankItems(items, controls) : emptyResult)

  useEffect(() => {
    if (!hasItems || result.totalPages <= 1) {
      return
    }

    const pagesToPrefetch = [controls.page + 1, controls.page - 1].filter((page) => page >= 1 && page <= result.totalPages)

    for (const page of pagesToPrefetch) {
      const pageControls = { ...controls, page }
      void queryClient.prefetchQuery({
        gcTime: RESULT_GC_TIME,
        queryFn: () => filterAndRankItems(items, pageControls),
        queryKey: catalogResultsQueryKey(pageControls),
        staleTime: RESULT_STALE_TIME,
      })
    }
  }, [controls, hasItems, items, queryClient, result.totalPages])

  return {
    ...query,
    data: result,
  }
}
