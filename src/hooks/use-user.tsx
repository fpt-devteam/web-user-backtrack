// src/features/user/hooks/useMyProfileQuery.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import type { UserProfile } from '@/types/user.types'

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
}
export const useGetMe = (enabled: boolean) => {
  return useQuery<UserProfile, Error>({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMe(),
    staleTime: 60_000, // 1 minute
    enabled,
  })
}

export const useUpsertUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error>({
    mutationFn: () => userService.upsertUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}