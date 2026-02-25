import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  SubscriptionInfo,
} from '@/types/subscription.type';

type SubscriptionInfoRaw = Omit<SubscriptionInfo, 'currentPeriodStart' | 'currentPeriodEnd'> & {
  currentPeriodStart: string;
  currentPeriodEnd: string;
};

export const subscriptionService = {
  async createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    const { data } = await privateClient.post<ApiResponse<CreateSubscriptionResponse>>('/api/qr/subscriptions', request);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create subscription');
    return data.data;
  },

  async getMySubscription(): Promise<SubscriptionInfo | null> {
    const { data } = await privateClient.get<ApiResponse<SubscriptionInfoRaw | null>>('/api/qr/subscriptions/me');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch subscription');
    if (!data.data) return null;
    return {
      ...data.data,
      currentPeriodStart: new Date(data.data.currentPeriodStart),
      currentPeriodEnd: new Date(data.data.currentPeriodEnd),
    };
  },
};
