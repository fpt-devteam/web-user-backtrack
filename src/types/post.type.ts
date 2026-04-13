export type PostType = 'Lost' | 'Found'

export type PostCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Accessories'
  | 'Documents'
  | 'Wallet'
  | 'Suitcase'
  | 'Bags'
  | 'Keys'
  | 'Other'

export interface FeedFilters {
  geo?: {
    location?: { latitude: number; longitude: number } | null
    radiusInKm?: number | null
  } | null
  postType?: PostType | null
  category?: PostCategory | null
  authorId?: string | null
  organizationId?: string | null
}

export interface PostLocation {
  latitude: number
  longitude: number
  displayAddress?: string | null
}

export interface Post {
  id: string
  title: string
  description?: string | null
  postType: PostType
  imageUrl?: string | null
  location?: PostLocation | null
  distanceKm?: number | null
  createdAt: string
  updatedAt?: string
  userId?: string | null
  userName?: string | null
  userAvatarUrl?: string | null
  /** Org this post belongs to, if any */
  orgId?: string | null
  orgName?: string | null
  orgLogoUrl?: string | null
}

export interface FeedRequest {
  location: { latitude: number; longitude: number }
  query: string
  filters?: FeedFilters | null
  page?: number
  pageSize?: number
}

export interface SearchPostsRequest {
  query: string
  filters?: FeedFilters | null
  page?: number
  pageSize?: number
}

// ── Raw API shapes (feed endpoint) ──────────────────────────────
export interface FeedApiPostItem {
  itemName: string
  category: string
  color?: string | null
  brand?: string | null
  condition?: string | null
  material?: string | null
  size?: string | null
  distinctiveMarks?: string | null
  additionalDetails?: string | null
}

export interface FeedApiPostOrganization {
  id: string
  name: string
  slug: string
  location?: { latitude: number; longitude: number } | null
  displayAddress?: string | null
  phone?: string | null
  industryType?: string | null
  logoUrl?: string | null
}

export interface FeedApiPost {
  id: string
  author: {
    id: string
    displayName: string
    avatarUrl?: string | null
  }
  organization?: FeedApiPostOrganization | null
  postType: PostType
  status?: string | null
  item: FeedApiPostItem
  imageUrls?: Array<string> | null
  location: { latitude: number; longitude: number }
  externalPlaceId?: string | null
  displayAddress?: string | null
  eventTime?: string | null
  createdAt: string
  distanceInMeters?: number | null
  finderInfo?: {
    finderName?: string | null
    email?: string | null
    phone?: string | null
  } | null
}

export interface FeedApiResponse {
  electronics?: FeedApiPost[] | null
  clothing?: FeedApiPost[] | null
  accessories?: FeedApiPost[] | null
  documents?: FeedApiPost[] | null
  wallet?: FeedApiPost[] | null
  suitcase?: FeedApiPost[] | null
  bags?: FeedApiPost[] | null
  keys?: FeedApiPost[] | null
  other?: FeedApiPost[] | null
  [key: string]: FeedApiPost[] | null | undefined
}
