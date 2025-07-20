import { siGithub } from 'simple-icons'
import SimpleIcon from './SimpleIcon'

interface GitHubIconProps {
  className?: string
  size?: number
}

export default function GitHubIcon({ className = "h-4 w-4", size }: GitHubIconProps) {
  return <SimpleIcon icon={siGithub} className={className} size={size} />
}