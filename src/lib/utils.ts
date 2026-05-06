import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getErrorMessage(error: unknown, fallback = 'An unknown error occurred'): string {
  return (
    (error as any)?.response?.data?.error?.message ||
    (error as any)?.error?.message ||
    (error as any)?.message ||
    fallback
  )
}