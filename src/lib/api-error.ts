import { isAxiosError } from 'axios'

export type ApiErrorCode =
  | 'unauthenticated'  // 401 – no/expired token
  | 'forbidden'        // 403 – authenticated but not allowed
  | 'not_found'        // 404
  | 'conflict'         // 409 – resource already exists
  | 'validation'       // 422 – bad input
  | 'rate_limited'     // 429
  | 'server_error'     // 5xx
  | 'network_error'    // no response at all
  | 'unknown'

export function classifyApiError(error: unknown): ApiErrorCode {
  if (!isAxiosError(error)) return 'unknown'
  if (!error.response) return 'network_error'

  switch (error.response.status) {
    case 401: return 'unauthenticated'
    case 403: return 'forbidden'
    case 404: return 'not_found'
    case 409: return 'conflict'
    case 422: return 'validation'
    case 429: return 'rate_limited'
  }
  if (error.response.status >= 500) return 'server_error'
  return 'unknown'
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isAxiosError(error)) {
    return error.response?.data?.error?.message ?? error.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
