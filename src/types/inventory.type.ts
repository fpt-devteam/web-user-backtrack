export type ItemCategory = 'PersonalBelongings' | 'Cards' | 'Accessories' | 'Electronics' | 'Others'

export interface InventorySubcategory {
  id: string
  name: string
  category: ItemCategory
}
