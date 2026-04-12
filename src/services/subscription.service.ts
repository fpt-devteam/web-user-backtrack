import { privateClient, publicClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  SubscriptionInfo,
  SubscriptionPlan,
  PaymentHistory,
} from '@/types/subscription.type';

type SubscriptionInfoRaw = Omit<SubscriptionInfo, 'currentPeriodStart' | 'currentPeriodEnd'> & {
  currentPeriodStart: string;
  currentPeriodEnd: string;
};

export const subscriptionService = {
  async createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    const { data } = await privateClient.post<ApiResponse<CreateSubscriptionResponse>>('/api/core/subscriptions', request);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create subscription');
    return data.data;
  },

  async getMySubscription(): Promise<SubscriptionInfo | null> {
    const { data } = await privateClient.get<ApiResponse<SubscriptionInfoRaw | null>>('/api/core/subscriptions/me');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch subscription');
    if (!data.data) return null;
    return {
      ...data.data,
      currentPeriodStart: new Date(data.data.currentPeriodStart),
      currentPeriodEnd: new Date(data.data.currentPeriodEnd),
    };
  },

  async cancelSubscription(): Promise<CreateSubscriptionResponse> {
    const { data } = await privateClient.delete<ApiResponse<CreateSubscriptionResponse>>('/api/qr/subscriptions/me');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to cancel subscription');
    return data.data;
  },

  async getPaymentHistory(): Promise<PaymentHistory> {
    const { data } = await privateClient.get<ApiResponse<PaymentHistory>>('/api/core/subscriptions/payments');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch payment history');
    return data.data;
  },

  async getPlans(): Promise<SubscriptionPlan[]> {
    const { data } = await publicClient.get<ApiResponse<SubscriptionPlan[]>>('/api/core/subscription-plans', {
      params: { subscriberType: 'User' },
    });
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch plans');
    return data.data;
  },
};
