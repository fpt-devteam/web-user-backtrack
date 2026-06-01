import type { ItemCategory } from '@/types/inventory.type'

const icons: Record<string, string> = import.meta.glob('../assets/icons/**/*.png', {
  import: 'default',
  eager: true,
})

const FILE_OVERRIDES: Record<string, string> = {
  smartwatch: 'smart_watch',
}

function categoryFolder(category: ItemCategory): string | null {
  switch (category) {
    case 'PersonalBelongings': return 'personal_belongings'
    case 'Cards':              return 'cards'
    case 'Electronics':        return 'electronics'
    case 'Others':             return 'others'
    case 'Accessories':        return null
    default:                   return null
  }
}

/** Resolve a subcategory PNG icon from a category + subcategory code, or null. */
export function getSubcategoryIcon(category: ItemCategory, code: string): string | null {
  const folder = categoryFolder(category)
  if (!folder) return null
  const fileBase = (FILE_OVERRIDES[code] ?? code).trim()
  if (!fileBase) return null
  const key = Object.keys(icons).find(
    (k) => k.includes(`/assets/icons/${folder}/`) && k.endsWith(`/${fileBase}.png`),
  )
  return key ? icons[key] : null
}
