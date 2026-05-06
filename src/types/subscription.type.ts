export type CreateSubscriptionRequest = {
  planId: string;
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingInterval: 'Monthly' | 'Yearly';
  subscriberType: string;
  features: string[];
}

export interface CreateSubscriptionResponse {
  id: string;
  subscriberType: string;
  userId: string;
  planId: string;
  planSnapshot: {
    name: string;
    price: number;
    currency: string;
    billingInterval: string;
    features: string[];
  };
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  clientSecret: string;
}

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
  subscriberType: string;
  userId: string;
  planId: string;
  planSnapshot: {
    name: string;
    price: number;
    currency: string;
    billingInterval: 'Monthly' | 'Yearly';
    features: string[];
  };
  status: OngoingSubscriptionStatusType;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
};

export interface PaymentItem {
  id: string;
  subscriptionId: string;
  subscriberType: string;
  userId: string;
  providerInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  paymentDate: string;
  createdAt: string;
  invoiceUrl?: string;
}

export interface PaymentHistory {
  total: number;
  items: PaymentItem[];
}
