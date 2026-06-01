export type ItemCategory = 'PersonalBelongings' | 'Cards' | 'Accessories' | 'Electronics' | 'Others'

export interface InventorySubcategory {
  id: string
  name: string
  category: ItemCategory
  /** Stable code used to resolve the subcategory icon (e.g. "phone", "wallets") */
  code?: string
  displayOrder?: number
}
