import { useMutation, useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { toast } from '@/lib/toast';
import type { CreateSubscriptionRequest } from '@/types/subscription.type';

export function useCreateSubscription() {
  return useMutation({
    mutationFn: (request: CreateSubscriptionRequest) =>
      subscriptionService.createSubscription(request),
    onError: (error) => {
      toast.fromError(error);
    },
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionService.getMySubscription(),
  });
}
