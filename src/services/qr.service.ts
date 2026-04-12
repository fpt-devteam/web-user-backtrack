import { publicClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { QRCodeDetails, PublicQrProfile } from '@/types/qr.type';

export const qrService = {
  async getQrCodeByPublicCode(publicCode: string): Promise<QRCodeDetails> {
    const { data } = await publicClient.get<ApiResponse<QRCodeDetails>>(`/api/qr/public/${publicCode}`);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch QR code details');
    return data.data;
  },

  async getPublicQrProfile(publicCode: string): Promise<PublicQrProfile> {
    const { data } = await publicClient.get<ApiResponse<PublicQrProfile>>(`/api/core/qr/public/${publicCode}`);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch public profile');
    return data.data;
  },
};