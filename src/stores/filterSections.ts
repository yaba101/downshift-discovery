import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FilterSectionId = 'search' | 'category' | 'availability' | 'price' | 'tags'

type FilterSectionState = {
  collapsedSections: Record<FilterSectionId, boolean>
  toggleSection: (section: FilterSectionId) => void
}

const defaultCollapsedSections: Record<FilterSectionId, boolean> = {
  search: false,
  category: false,
  availability: false,
  price: false,
  tags: false,
}

export const useFilterSectionStore = create<FilterSectionState>()(
  persist(
    (set) => ({
      collapsedSections: defaultCollapsedSections,
      toggleSection: (section) =>
        set((state) => ({
          collapsedSections: {
            ...defaultCollapsedSections,
            ...state.collapsedSections,
            [section]: !state.collapsedSections[section],
          },
        })),
    }),
    {
      name: 'downshift-filter-sections',
    },
  ),
)
