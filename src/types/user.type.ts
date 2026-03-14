export interface UserProfile {
  id: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  showEmail: boolean;
  showPhone: boolean;
  globalRole: UserGlobalRoleType;
}

// PublicUserProfileResult
export interface PublicUserProfile {
  id: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface PostAuthor {
  id: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// PostResult
export interface Post {
  id: string;
  author?: PostAuthor | null;
  postType: string;
  itemName: string;
  description: string;
  imageUrls: string[];
  location: GeoPoint;
  externalPlaceId?: string | null;
  displayAddress?: string | null;
  eventTime: string;
  createdAt: string;
}

export const UserGlobalRole = {
  Customer: 'Customer',
  PlatformSuperAdmin: 'PlatformSuperAdmin',
} as const;

export type UserGlobalRoleType = typeof UserGlobalRole[keyof typeof UserGlobalRole];

const ROLE_VALUES = Object.values(UserGlobalRole) as readonly UserGlobalRoleType[];

export function parseUserGlobalRole(input: unknown): UserGlobalRoleType | null {
  if (typeof input !== "string") return null;
  return (ROLE_VALUES as readonly string[]).includes(input) ? (input as UserGlobalRoleType) : null;
}