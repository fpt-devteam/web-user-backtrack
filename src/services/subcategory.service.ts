import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { InventorySubcategory, ItemCategory } from '@/types/inventory.type'

export const subcategoryService = {
  async getAll(category?: ItemCategory): Promise<Array<InventorySubcategory>> {
    const { data } = await privateClient.get<ApiResponse<Array<InventorySubcategory>>>('/api/core/subcategories', {
      params: category ? { category } : undefined,
    })
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch subcategories')
    return data.data
  },
}
