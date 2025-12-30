// src/features/user/hooks/useMyProfileQuery.ts
import { toast } from '@/lib/toast'
import { qrService } from '@/services/qr.service'
import { useQuery } from '@tanstack/react-query'


export const qrKeys = {
  all: ['qr'] as const,
  qrByPublicCode: (publicCode: string) => [...qrKeys.all, 'qr', publicCode] as const,
}

export const useGetQrByPublicCode = (publicCode: string, enabled: boolean = true) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: qrKeys.qrByPublicCode(publicCode),
    queryFn: () => qrService.getQrCodeByPublicCode(publicCode),
    staleTime: 60_000,
    enabled: enabled && !!publicCode,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  }

}

