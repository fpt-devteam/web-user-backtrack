import { useQuery } from '@tanstack/react-query'
import { subcategoryService } from '@/services/subcategory.service'
import type { ItemCategory } from '@/types/inventory.type'

export const subcategoryKeys = {
  all: ['subcategories'] as const,
  byCategory: (category?: string) => [...subcategoryKeys.all, category ?? 'all'] as const,
}

export function useGetSubcategories(category?: string) {
  return useQuery({
    queryKey: subcategoryKeys.byCategory(category),
    queryFn: () => subcategoryService.getAll(category as ItemCategory),
    staleTime: 1000 * 60 * 30,
    enabled: !!category,
  })
}
