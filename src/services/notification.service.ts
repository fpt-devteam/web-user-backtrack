import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  NotificationSendPushRequest,
  NotificationResponse,
} from '@/types/notification.type';

export const notificationService = {
  async sendNotification(dto: NotificationSendPushRequest): Promise<NotificationResponse> {
    const { data } = await privateClient.post<ApiResponse<NotificationResponse>>('/api/core/notifications', dto);
    if (!data.success) {
      throw new Error(data.error?.message ?? 'Failed to send notification');
    }
    return data.data;
  },
};
