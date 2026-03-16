import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { Org } from '@/types/org.type';
import type { PagedResponse } from '@/types/pagination.type';

export interface GetOrgsParams {
  page?: number;
  pageSize?: number;
}

export const orgService = {
  async getOrgs(params: GetOrgsParams = {}): Promise<PagedResponse<Org>> {
    const { page = 1, pageSize = 20 } = params;
    const { data } = await privateClient.get<ApiResponse<PagedResponse<Org>>>(
      '/api/core/orgs',
      { params: { page, pageSize } },
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch organisations');
    return data.data;
  },
  async getOrgById(id: string): Promise<Org> {
    const { data } = await privateClient.get<ApiResponse<Org>>(
      `/api/core/orgs/${id}/public`,
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch organisation');
    return data.data;
  },
};
