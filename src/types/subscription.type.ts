export type CreateSubscriptionRequest = {
  priceId: string;
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  providerPriceId: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreateSubscriptionResponse = {
  clientSecret: string;
};

export const SubscriptionPlanType = {
  Monthly: 'Monthly',
  Yearly: 'Yearly',
} as const;

export type SubscriptionPlanType = typeof SubscriptionPlanType[keyof typeof SubscriptionPlanType];

export const OngoingSubscriptionStatus = {
  Active: 'Active',
  PastDue: 'PastDue',
  Unpaid: 'Unpaid',
} as const;

export type OngoingSubscriptionStatusType = typeof OngoingSubscriptionStatus[keyof typeof OngoingSubscriptionStatus];

export type SubscriptionInfo = {
  id: string;
  userId: string;
  planType: SubscriptionPlanType;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  status: OngoingSubscriptionStatusType;
  cancelAtPeriodEnd: boolean;
};
