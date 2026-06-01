import type { ClaimStatus } from './claim.constants'

/**
 * Normalised claim request used by the claim list / card components.
 * Mapped from a backend `Conversation` in the claim-requests route.
 */
export interface ClaimRequest {
  id: string
  itemName: string
  description: string
  status: ClaimStatus
  category?: string | null
  subCategoryId?: string | null
  imageUrls: Array<string>
  createdAt: string
  updatedAt?: string | null
  lastMessageAt?: string | null
  orgName?: string | null
  orgLogoUrl?: string | null
}
