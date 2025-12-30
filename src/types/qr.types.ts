export interface QRCode {
  id: string;
  publicCode: string;
  linkedAt: string;
  createdAt: string;
}

export interface Item {
  name: string;
  description: string;
  imageUrls: string[];
}

export interface Owner {
  id: string;
  email: string;
  displayName: string | null;
}

export interface QRCodeDetails {
  qrCode: QRCode;
  item: Item;
  owner: Owner;
}