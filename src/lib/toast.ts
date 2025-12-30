import { toast as sonner } from "sonner"

type ToastOpts = Parameters<typeof sonner>[1]

export const toast = {
  success: (msg: string, opts?: ToastOpts) => sonner.success(msg, opts),
  error: (msg: string, opts?: ToastOpts) => sonner.error(msg, opts),
  info: (msg: string, opts?: ToastOpts) => sonner.info(msg, opts),
  warning: (msg: string, opts?: ToastOpts) => sonner.warning(msg, opts),

  fromError: (err: unknown, fallback = "Something went wrong", opts?: ToastOpts) => {
    const msg =
      (err as any)?.response?.data?.error?.message ||
      (err as any)?.error?.message ||
      (err as any)?.message ||
      fallback
    return sonner.error(msg, opts)
  }
}
