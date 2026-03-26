export interface BusinessHour {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
}

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
  contactEmail: string | null;
  industryType: string;
  taxIdentificationNumber: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  description: string | null;
  locationNote: string | null;
  businessHours: BusinessHour[] | null;
  requiredFinderContactFields: string[] | null;
  status: 'Active' | 'Inactive' | string;
  createdAt: string;
}
