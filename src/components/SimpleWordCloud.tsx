import { useMemo, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Repository {
  language: string | null
  stargazers_count: number
  topics?: string[]
}

interface SimpleWordCloudProps {
  repositories: Repository[]
}

interface SkillData {
  skill: string
  count: number
  category: string
}

// Language to skill mapping with categories
const LANGUAGE_SKILLS: Record<string, { skills: string[]; category: string }> = {
  JavaScript: { skills: ['JavaScript', 'ES6+', 'Node.js', 'npm'], category: 'frontend' },
  TypeScript: { skills: ['TypeScript', 'Type Safety', 'Static Analysis'], category: 'frontend' },
  React: { skills: ['React', 'JSX', 'Hooks', 'Components'], category: 'frontend' },
  Python: { skills: ['Python', 'Django', 'Flask', 'Data Science'], category: 'backend' },
  Java: { skills: ['Java', 'Spring', 'Maven', 'JVM'], category: 'backend' },
  Go: { skills: ['Go', 'Goroutines', 'Microservices'], category: 'backend' },
  Rust: { skills: ['Rust', 'Memory Safety', 'Systems Programming'], category: 'systems' },
  'C++': { skills: ['C++', 'STL', 'Performance Optimization'], category: 'systems' },
  C: { skills: ['C', 'Low-level Programming', 'Embedded'], category: 'systems' },
  HTML: { skills: ['HTML5', 'Semantic Markup', 'Accessibility'], category: 'frontend' },
  CSS: { skills: ['CSS3', 'Flexbox', 'Grid', 'Responsive Design'], category: 'frontend' },
  SCSS: { skills: ['Sass', 'SCSS', 'CSS Preprocessing'], category: 'frontend' },
  Vue: { skills: ['Vue.js', 'Vuex', 'Vue Router'], category: 'frontend' },
  Svelte: { skills: ['Svelte', 'SvelteKit', 'Reactive Programming'], category: 'frontend' },
  PHP: { skills: ['PHP', 'Laravel', 'Composer'], category: 'backend' },
  Ruby: { skills: ['Ruby', 'Ruby on Rails', 'Gems'], category: 'backend' },
  Shell: { skills: ['Bash', 'Shell Scripting', 'Automation'], category: 'devops' },
  Dockerfile: { skills: ['Docker', 'Containerization', 'DevOps'], category: 'devops' },
  YAML: { skills: ['YAML', 'Configuration', 'CI/CD'], category: 'devops' },
  JSON: { skills: ['JSON', 'API Design', 'Data Exchange'], category: 'data' },
  Markdown: { skills: ['Markdown', 'Documentation', 'Technical Writing'], category: 'tools' },
}

// Topic to skill mapping
const TOPIC_SKILLS: Record<string, { skills: string[]; category: string }> = {
  react: { skills: ['React', 'Frontend Development'], category: 'frontend' },
  vue: { skills: ['Vue.js', 'Frontend Framework'], category: 'frontend' },
  nodejs: { skills: ['Node.js', 'Backend Development'], category: 'backend' },
  typescript: { skills: ['TypeScript', 'Type Safety'], category: 'frontend' },
  javascript: { skills: ['JavaScript', 'Web Development'], category: 'frontend' },
  tailwindcss: { skills: ['Tailwind CSS', 'Utility-first CSS'], category: 'frontend' },
  vite: { skills: ['Vite', 'Build Tools'], category: 'tools' },
  docker: { skills: ['Docker', 'Containerization'], category: 'devops' },
  kubernetes: { skills: ['Kubernetes', 'Orchestration'], category: 'devops' },
  aws: { skills: ['AWS', 'Cloud Computing'], category: 'cloud' },
  'machine-learning': { skills: ['Machine Learning', 'AI'], category: 'data' },
  'data-science': { skills: ['Data Science', 'Analytics'], category: 'data' },
  api: { skills: ['API Development', 'REST'], category: 'backend' },
  graphql: { skills: ['GraphQL', 'Query Language'], category: 'backend' },
  testing: { skills: ['Testing', 'Quality Assurance'], category: 'tools' },
  cli: { skills: ['CLI Tools', 'Command Line'], category: 'tools' },
}

// Light / dark color pairs per category
const CATEGORY_COLORS: Record<string, { light: string; dark: string }> = {
  frontend: { light: 'rgb(5 150 105)', dark: 'rgb(52 211 153)' },
  backend: { light: 'rgb(37 99 235)', dark: 'rgb(96 165 250)' },
  systems: { light: 'rgb(220 38 38)', dark: 'rgb(248 113 113)' },
  devops: { light: 'rgb(234 88 12)', dark: 'rgb(251 146 60)' },
  cloud: { light: 'rgb(147 51 234)', dark: 'rgb(192 132 252)' },
  data: { light: 'rgb(8 145 178)', dark: 'rgb(34 211 238)' },
  tools: { light: 'rgb(82 82 91)', dark: 'rgb(161 161 170)' },
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  systems: 'Systems',
  devops: 'DevOps',
  cloud: 'Cloud',
  data: 'Data',
  tools: 'Tools',
}

// Deterministic pseudo-random based on string hash
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

export default function SimpleWordCloud({ repositories }: SimpleWordCloudProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const { actualTheme } = useTheme()
  const isDark = actualTheme === 'dark'

  const skillsData = useMemo(() => {
    const skillCounts = new Map<string, { count: number; category: string }>()

    repositories.forEach(repo => {
      const weight = Math.max(1, repo.stargazers_count || 1)

      if (repo.language && LANGUAGE_SKILLS[repo.language]) {
        const languageData = LANGUAGE_SKILLS[repo.language]
        if (languageData) {
          const { skills, category } = languageData
          skills.forEach((skill: string) => {
            const current = skillCounts.get(skill) || { count: 0, category }
            skillCounts.set(skill, { count: current.count + weight, category })
          })
        }
      }

      repo.topics?.forEach(topic => {
        if (TOPIC_SKILLS[topic]) {
          const topicData = TOPIC_SKILLS[topic]
          if (topicData) {
            const { skills, category } = topicData
            skills.forEach((skill: string) => {
              const current = skillCounts.get(skill) || { count: 0, category }
              skillCounts.set(skill, { count: current.count + weight, category })
            })
          }
        }
      })
    })

    const skillsArray: SkillData[] = Array.from(skillCounts.entries()).map(
      ([skill, { count, category }]) => ({
        skill,
        count,
        category,
      })
    )

    return skillsArray.sort((a, b) => b.count - a.count)
  }, [repositories])

  const maxCount = skillsData[0]?.count || 1

  // Rotation angles: mostly horizontal, occasional slight tilt
  const ROTATIONS = [0, 0, 0, 0, 0, -6, 6, -3, 3, -9, 9]

  return (
    <div className='w-full'>
      {/* Word Cloud */}
      <div
        className='relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-10 min-h-72 rounded-2xl border border-border/40 bg-gradient-to-br from-background via-background to-muted/20'
        role='list'
        aria-label='Skills and technologies extracted from GitHub repositories'
      >
        {skillsData.map(({ skill, count, category }) => {
          const normalized = count / maxCount
          const hash = hashCode(skill)
          const rotation = ROTATIONS[hash % ROTATIONS.length]

          // Smooth continuous sizing with floor tiers
          const fontSize = 0.8 + normalized * 2.2

          // Weight scales with size
          const fontWeight = normalized > 0.6 ? 700 : normalized > 0.3 ? 600 : 400

          // Opacity: high-count items fully opaque, low-count subtle
          const opacity = 0.5 + normalized * 0.5

          const colorPair = CATEGORY_COLORS[category] || {
            light: 'rgb(82 82 91)',
            dark: 'rgb(161 161 170)',
          }
          const color = isDark ? colorPair.dark : colorPair.light
          const dimmed = hoveredCategory !== null && hoveredCategory !== category

          return (
            <span
              key={skill}
              className='inline-block leading-tight cursor-default select-none'
              tabIndex={0}
              role='listitem'
              style={{
                fontSize: `${fontSize}rem`,
                fontWeight,
                color,
                opacity: dimmed ? 0.08 : opacity,
                transform: `rotate(${rotation}deg) scale(${dimmed ? 0.95 : 1})`,
                padding: `${fontSize > 1.8 ? 5 : 2}px ${fontSize > 1.8 ? 10 : 5}px`,
                letterSpacing: fontSize > 2 ? '-0.03em' : '-0.01em',
                filter: dimmed ? 'grayscale(0.9) blur(0.5px)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              title={`${skill}: ${count} points (${CATEGORY_LABELS[category] || category})`}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              onFocus={() => setHoveredCategory(category)}
              onBlur={() => setHoveredCategory(null)}
            >
              {skill}
            </span>
          )
        })}
      </div>

      {/* Legend */}
      <div className='mt-5 flex flex-wrap gap-4 justify-center'>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const colorPair = CATEGORY_COLORS[key]
          const count = skillsData.filter(s => s.category === key).length
          if (count === 0) return null
          const active = hoveredCategory === null || hoveredCategory === key
          return (
            <button
              key={key}
              className='flex items-center gap-1.5 text-xs transition-all duration-300 cursor-pointer bg-transparent border-none p-0'
              style={{
                opacity: active ? 1 : 0.3,
                color: active
                  ? isDark
                    ? colorPair?.dark
                    : colorPair?.light
                  : 'hsl(var(--muted-foreground))',
              }}
              onMouseEnter={() => setHoveredCategory(key)}
              onMouseLeave={() => setHoveredCategory(null)}
              onFocus={() => setHoveredCategory(key)}
              onBlur={() => setHoveredCategory(null)}
            >
              <span
                className='w-2 h-2 rounded-full inline-block'
                style={{
                  backgroundColor: isDark ? colorPair?.dark : colorPair?.light,
                }}
              />
              <span className='font-medium'>{label}</span>
              <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
