import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { orgService } from '@/services/org.service';
import { toast } from '@/lib/toast';

export const orgKeys = {
  all: ['orgs'] as const,
  lists: () => [...orgKeys.all, 'list'] as const,
  detail: (id: string) => [...orgKeys.all, 'detail', id] as const,
};

const PAGE_SIZE = 20;

export function useGetOrgs() {
  return useInfiniteQuery({
    queryKey: orgKeys.lists(),
    queryFn: ({ pageParam }) =>
      orgService.getOrgs({ page: pageParam, pageSize: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const loaded = (lastPageParam - 1) * PAGE_SIZE + lastPage.items.length;
      return loaded < lastPage.totalCount ? lastPageParam + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGetOrgById(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: orgKeys.detail(id),
    queryFn: () => orgService.getOrgById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (error) toast.fromError(error);

  return { data, isLoading };
}
