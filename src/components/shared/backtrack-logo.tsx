interface BacktrackLogoProps {
  width?: number
  height?: number
  className?: string
}

export function BacktrackLogo({ width = 120, height = 28, className }: Readonly<BacktrackLogoProps>) {
  return (
    <img
      src="/backtrack-logo.svg"
      alt="Backtrack"
      width={width}
      height={height}
      className={className}
      draggable={false}
    />
  )
}
