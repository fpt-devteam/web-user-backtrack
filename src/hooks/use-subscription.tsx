import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { toast } from '@/lib/toast';
import type { CreateSubscriptionRequest } from '@/types/subscription.type';

export function useCreateSubscription() {
  return useMutation({
    mutationFn: (request: CreateSubscriptionRequest) =>
      subscriptionService.createSubscription(request),
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionService.getMySubscription(),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] });
    },
    onError: (error) => {
      toast.fromError(error);
    },
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => subscriptionService.getPlans(),
    staleTime: 1000 * 60 * 10,
  });
}
