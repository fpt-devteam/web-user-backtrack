// src/features/user/hooks/useMyProfileQuery.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {  Post, PublicUserProfile, UserProfile } from '@/types/user.type'
import { userService, type UpdateMeDto } from '@/services/user.service'
import { toast } from '@/lib/toast'

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

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation<string, Error, File>({
    mutationFn: async (file) => {
      const url = await userService.uploadAvatar(file)
      await userService.updateMe({ avatarUrl: url })
      return url
    },
    onSuccess: (url) => {
      queryClient.setQueryData<UserProfile>(userKeys.me(), (old) =>
        old ? { ...old, avatarUrl: url } : old
      )
      toast.success('Avatar updated')
    },
    onError: (err) => {
      toast.fromError(err)
    },
  })
}

export const useUpdateMe = () => {
  const queryClient = useQueryClient()
  return useMutation<UserProfile, Error, UpdateMeDto>({
    mutationFn: (dto) => userService.updateMe(dto),
    onSuccess: (updated) => {
      queryClient.setQueryData(userKeys.me(), updated)
      toast.success('Profile updated')
    },
    onError: (err) => {
      toast.fromError(err)
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error>({
    mutationFn: () => userService.createUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: (err) => {
      toast.fromError(err)
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
  return useQuery<Post[], Error>({
    queryKey: userKeys.posts(userId),
    queryFn: () => userService.getUserPosts(userId),
    staleTime: 60_000,
    enabled: enabled && !!userId,
  })
}