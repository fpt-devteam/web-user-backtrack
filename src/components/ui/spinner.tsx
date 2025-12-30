import * as React from "react"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl"

const sizeMap: Record<SpinnerSize, string> = {
  xs: "size-2",
  sm: "size-4",
  md: "size-8",
  lg: "size-16",
  xl: "size-32",
}

type SpinnerProps = Omit<React.ComponentProps<typeof Loader2Icon>, "size"> & {
  size?: SpinnerSize
}

function Spinner({ className, size = "sm", ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", sizeMap[size], "mx-auto", className)}
      {...props}
    />
  )
}

export { Spinner }
