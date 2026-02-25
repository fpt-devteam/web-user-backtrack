import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { CreateSubscriptionRequest, CreateSubscriptionResponse } from '@/types/subscription.type';

export const subscriptionService = {
  async createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    const { data } = await privateClient.post<ApiResponse<CreateSubscriptionResponse>>('/api/qr/subscriptions', request);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create subscription');
    return data.data;
  },
};