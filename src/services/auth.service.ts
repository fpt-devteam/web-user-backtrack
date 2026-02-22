import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { CheckEmailStatusRequest, CheckEmailStatusResponse } from '@/types/auth.type';

export const authService = {
  async checkEmailStatus(request: CheckEmailStatusRequest): Promise<CheckEmailStatusResponse> {
    const { data } = await privateClient.post<ApiResponse<CheckEmailStatusResponse>>('/auth/check-email', request);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to check email status');
    return data.data;
  },
};