import { useMemo, useState } from 'react'

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

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'rgb(16 185 129)',
  backend: 'rgb(59 130 246)',
  systems: 'rgb(239 68 68)',
  devops: 'rgb(249 115 22)',
  cloud: 'rgb(168 85 247)',
  data: 'rgb(6 182 212)',
  tools: 'rgb(107 114 128)',
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
  const ROTATIONS = [0, 0, 0, 0, 0, -8, 8, -4, 4, -12, 12]

  return (
    <div className='w-full'>
      {/* Word Cloud */}
      <div
        className='relative flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 px-4 py-8 min-h-72 rounded-xl bg-gradient-to-br from-background via-background to-secondary/10 dark:to-secondary/5'
        role='img'
        aria-label='Word cloud of skills and technologies extracted from GitHub repositories'
      >
        {skillsData.map(({ skill, count, category }) => {
          const normalized = count / maxCount
          const hash = hashCode(skill)
          const rotation = ROTATIONS[hash % ROTATIONS.length]

          // Size: 6 tiers from 0.8rem to 2.8rem
          let fontSize: number
          if (normalized > 0.85) fontSize = 2.8
          else if (normalized > 0.65) fontSize = 2.2
          else if (normalized > 0.45) fontSize = 1.7
          else if (normalized > 0.3) fontSize = 1.35
          else if (normalized > 0.15) fontSize = 1.05
          else fontSize = 0.85

          // Weight
          const fontWeight = normalized > 0.6 ? 700 : normalized > 0.3 ? 600 : 500

          // Opacity: high-count items are fully opaque, low-count fade slightly
          const opacity = 0.55 + normalized * 0.45

          const color = CATEGORY_COLORS[category] || 'rgb(107 114 128)'
          const isHighlighted = hoveredCategory === null || hoveredCategory === category
          const dimmed = hoveredCategory !== null && hoveredCategory !== category

          return (
            <span
              key={skill}
              className='inline-block leading-tight transition-all duration-300 cursor-default select-none'
              style={{
                fontSize: `${fontSize}rem`,
                fontWeight,
                color,
                opacity: dimmed ? 0.12 : opacity,
                transform: `rotate(${rotation}deg)${isHighlighted && !dimmed ? '' : ''}`,
                padding: `${fontSize > 1.5 ? 4 : 2}px ${fontSize > 1.5 ? 8 : 4}px`,
                letterSpacing: fontSize > 2 ? '-0.02em' : '0',
                filter: dimmed ? 'grayscale(0.8)' : 'none',
              }}
              title={`${skill}: ${count} points (${CATEGORY_LABELS[category] || category})`}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {skill}
            </span>
          )
        })}
      </div>

      {/* Legend */}
      <div className='mt-4 flex flex-wrap gap-3 justify-center'>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const color = CATEGORY_COLORS[key]
          const count = skillsData.filter(s => s.category === key).length
          if (count === 0) return null
          return (
            <button
              key={key}
              className='flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity duration-200 hover:opacity-100 cursor-pointer bg-transparent border-none p-0'
              style={{
                opacity: hoveredCategory === null || hoveredCategory === key ? 1 : 0.35,
              }}
              onMouseEnter={() => setHoveredCategory(key)}
              onMouseLeave={() => setHoveredCategory(null)}
              onFocus={() => setHoveredCategory(key)}
              onBlur={() => setHoveredCategory(null)}
            >
              <span
                className='w-2.5 h-2.5 rounded-full inline-block'
                style={{ backgroundColor: color }}
              />
              <span>{label}</span>
              <span className='text-muted-foreground/60'>({count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
