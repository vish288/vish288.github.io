interface SimpleIconProps {
  icon: {
    title: string
    path: string
  }
  className?: string
  size?: number | undefined
  /** Hide from assistive tech and omit the title when an adjacent label names it. */
  decorative?: boolean
}

export default function SimpleIcon({
  icon,
  className = '',
  size = 24,
  decorative = false,
}: SimpleIconProps) {
  return (
    <svg
      role={decorative ? undefined : 'img'}
      viewBox='0 0 24 24'
      width={size}
      height={size}
      className={className}
      fill='currentColor'
      aria-label={decorative ? undefined : icon.title}
      aria-hidden={decorative || undefined}
    >
      {!decorative && <title>{icon.title}</title>}
      <path d={icon.path} />
    </svg>
  )
}
