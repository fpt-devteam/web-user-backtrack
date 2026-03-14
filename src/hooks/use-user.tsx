// src/features/user/hooks/useMyProfileQuery.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import type { UserProfile, PublicUserProfile, Post } from '@/types/user.type'
import type { PagedResponse } from '@/types/pagination.type'

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  publicProfile: (userId: string) => [...userKeys.all, 'public', userId] as const,
  posts: (userId: string) => [...userKeys.all, 'posts', userId] as const,
}
export const useGetMe = (enabled: boolean) => {
  return useQuery<UserProfile, Error>({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMe(),
    staleTime: 60_000, // 1 minute
    enabled,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error>({
    mutationFn: () => userService.createUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export const useGetPublicUserProfile = (userId: string, enabled: boolean = true) => {
  return useQuery<PublicUserProfile, Error>({
    queryKey: userKeys.publicProfile(userId),
    queryFn: () => userService.getPublicUserProfile(userId),
    staleTime: 60_000,
    enabled: enabled && !!userId,
  })
}

export const useGetUserPosts = (userId: string, enabled: boolean = true) => {
  return useQuery<PagedResponse<Post>, Error>({
    queryKey: userKeys.posts(userId),
    queryFn: () => userService.getUserPosts(userId),
    staleTime: 60_000,
    enabled: enabled && !!userId,
  })
}