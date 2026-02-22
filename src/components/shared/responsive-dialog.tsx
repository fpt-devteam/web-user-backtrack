import * as React from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

export { Dialog } from 'radix-ui'

export function ResponsiveDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Responsive dialog content:
 * - Mobile: slides up from bottom (bottom sheet)
 * - Desktop (sm+): centered modal
 */
export function ResponsiveDialogContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <ResponsiveDialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 bg-white outline-none',

          // ── Mobile: bottom sheet ──────────────────────────────────
          'bottom-0 left-0 right-0 rounded-t-3xl px-6 pt-3 pb-10',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
          'duration-300 ease-out',

          // ── Desktop: centered modal ───────────────────────────────
          'sm:bottom-auto sm:left-1/2 sm:top-1/2',
          'sm:-translate-x-1/2 sm:-translate-y-1/2',
          'sm:rounded-3xl sm:w-full sm:max-w-sm',
          'sm:px-8 sm:py-8',
          'sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95',
          'sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95',

          className,
        )}
        {...props}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden mx-auto mb-6 h-1 w-10 rounded-full bg-gray-300" />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export const ResponsiveDialogRoot = DialogPrimitive.Root
export const ResponsiveDialogClose = DialogPrimitive.Close
