export interface Org {
  id: string;
  name: string;
  slug: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  displayAddress: string | null;
  externalPlaceId: string | null;
  phone: string | null;
  industryType: string;
  logoUrl: string | null;
  taxIdentificationNumber: string | null;
  status: 'Active' | 'Inactive' | string;
  createdAt: string;
}
