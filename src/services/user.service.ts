import { privateClient, publicClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { UserProfile, PublicUserProfile, Post } from '@/types/user.type';
import type { PagedResponse } from '@/types/pagination.type';

export const userService = {
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
  async getUserPosts(userId: string): Promise<PagedResponse<Post>> {
    const { data } = await publicClient.get<ApiResponse<PagedResponse<Post>>>(`/api/core/users/${userId}/posts`);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch user posts');
    return data.data;
  },
};