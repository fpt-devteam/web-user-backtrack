export interface QRCodeDetails {
  id: string;
  userId: string;
  publicCode: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicQrProfile {
  publicCode: string;
  userId: string;
  note: string | null;
  displayName: string;
  avatarUrl: string | null;
  email: string | null;
  phone: string | null;
}
