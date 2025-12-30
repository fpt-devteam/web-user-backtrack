import * as React from "react"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inlineMessageVariants = cva(
  "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
  {
    variants: {
      variant: {
        info: "border-border bg-muted/40 text-foreground",
        success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-50",
        warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-50",
        error: "border-destructive/30 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
} as const

type InlineMessageProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inlineMessageVariants> & {
    title?: string
    icon?: boolean
  }

export function InlineMessage({
  className,
  variant = "info",
  title,
  icon = true,
  children,
  ...props
}: InlineMessageProps) {
  const Icon = iconMap[variant ?? "info"]

  return (
    <div className={cn(inlineMessageVariants({ variant }), className)} {...props}>
      {icon && <Icon className="mt-0.5 size-4 shrink-0 opacity-90" aria-hidden="true" />}
      <div className="min-w-0">
        {title && <div className="font-medium leading-5">{title}</div>}
        {children && <div className={cn(title && "mt-0.5", "leading-5 text-muted-foreground")}>{children}</div>}
      </div>
    </div>
  )
}
