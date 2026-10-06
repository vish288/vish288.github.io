import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'

interface Repository {
  language: string | null
  topics?: string[]
}

interface SimpleWordCloudProps {
  repositories: Repository[]
}

interface Tally {
  name: string
  count: number
}

// Topics that are noise rather than signal — infrastructure of the repo, not a skill.
const TOPIC_IGNORE = new Set(['hacktoberfest', 'portfolio', 'personal-website', 'config'])

function tally(values: string[]): Tally[] {
  const counts = new Map<string, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  )
}

export default function SimpleWordCloud({ repositories }: SimpleWordCloudProps) {
  const { languages, topics } = useMemo(() => {
    const langs = repositories.map(r => r.language).filter((l): l is string => Boolean(l))
    const tops = repositories.flatMap(r => r.topics ?? []).filter(t => !TOPIC_IGNORE.has(t))
    return { languages: tally(langs), topics: tally(tops).slice(0, 12) }
  }, [repositories])

  return (
    <div className='space-y-6'>
      {languages.length > 0 && (
        <div>
          <h3 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
            Languages
          </h3>
          <ul
            className='flex flex-wrap gap-2'
            aria-label='Programming languages used across repositories'
          >
            {languages.map(({ name, count }) => (
              <li key={name}>
                <Badge variant='secondary' className='gap-1.5 text-sm font-medium'>
                  {name}
                  <span className='text-muted-foreground tabular-nums'>{count}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {topics.length > 0 && (
        <div>
          <h3 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
            Topics
          </h3>
          <ul className='flex flex-wrap gap-2' aria-label='Topics tagged across repositories'>
            {topics.map(({ name }) => (
              <li key={name}>
                <Badge variant='outline' className='text-sm'>
                  {name}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
