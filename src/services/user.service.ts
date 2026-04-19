import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { privateClient, publicClient } from '@/lib/api-client';
import { auth, storage } from '@/lib/firebase';
import type { ApiResponse } from '@/types/api-response.type';
import type { UserProfile, PublicUserProfile, Post } from '@/types/user.type';

export interface UpdateMeDto {
  displayName?: string
  avatarUrl?: string
  phone?: string
  showEmail?: boolean
  showPhone?: boolean
}

export const userService = {
  async uploadAvatar(file: File): Promise<string> {
    const uid = auth.currentUser?.uid
    if (!uid) throw new Error('Not authenticated')
    const ext      = file.name.split('.').pop() ?? 'jpg'
    const path     = `avatars/${uid}/${Date.now()}.${ext}`
    const snapshot = await uploadBytes(ref(storage, path), file, {
      contentType: file.type,
    })
    return getDownloadURL(snapshot.ref)
  },
  async updateMe(dto: UpdateMeDto): Promise<UserProfile> {
    const { data } = await privateClient.patch<ApiResponse<UserProfile>>('/api/core/users/me', dto);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update profile');
    return data.data;
  },
  async getMe(): Promise<UserProfile> {
    const { data } = await privateClient.get<ApiResponse<UserProfile>>('/api/core/users/me');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch user profile');
    return data.data;
  },
  async createUser(): Promise<UserProfile> {
    const { data } = await privateClient.post<ApiResponse<UserProfile>>('/api/core/users');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create user');
    return data.data;
  },
  async getPublicUserProfile(userId: string): Promise<PublicUserProfile> {
    const { data } = await publicClient.get<ApiResponse<PublicUserProfile>>(`/api/core/users/${userId}`);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch public user profile');
    return data.data;
  },
  async getUserPosts(userId: string): Promise<Post[]> {
    const { data } = await publicClient.get<ApiResponse<Post[]>>(`/api/core/posts/users/${userId}`);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch user posts');
    return data.data;
  },
};