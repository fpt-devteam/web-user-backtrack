// /api/qr/qr-code/public-code/:publicCode
import { publicClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { QRCodeDetails } from '@/types/qr.types';

export const qrService = {
  async getQrCodeByPublicCode(publicCode: string): Promise<QRCodeDetails> {
    const { data } = await publicClient.get<ApiResponse<QRCodeDetails>>(`/api/qr/qr-code/public-code/${publicCode}`);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch QR code details');
    return data.data;
  },
};