interface SimpleIconProps {
  icon: {
    title: string
    path: string
  }
  className?: string
  size?: number | undefined
}

export default function SimpleIcon({ icon, className = "", size = 24 }: SimpleIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-label={icon.title}
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}