import { useMemo } from 'react'

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

const CATEGORY_COLORS = {
  frontend: 'text-emerald-600 dark:text-emerald-400',
  backend: 'text-blue-600 dark:text-blue-400',
  systems: 'text-red-600 dark:text-red-400',
  devops: 'text-orange-600 dark:text-orange-400',
  cloud: 'text-purple-600 dark:text-purple-400',
  data: 'text-cyan-600 dark:text-cyan-400',
  tools: 'text-gray-600 dark:text-gray-400',
}

const CATEGORY_BG_COLORS = {
  frontend:
    'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-800/30',
  backend: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30',
  systems: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30',
  devops: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-800/30',
  cloud: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-800/30',
  data: 'bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:hover:bg-cyan-800/30',
  tools: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/30 dark:hover:bg-gray-700/50',
}

export default function SimpleWordCloud({ repositories }: SimpleWordCloudProps) {
  const skillsData = useMemo(() => {
    const skillCounts = new Map<string, { count: number; category: string }>()

    // Process repositories to extract skills
    repositories.forEach(repo => {
      const weight = Math.max(1, repo.stargazers_count || 1)

      // Process languages
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

      // Process topics
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

    // Convert to sorted array
    const skillsArray: SkillData[] = Array.from(skillCounts.entries()).map(
      ([skill, { count, category }]) => ({
        skill,
        count,
        category,
      })
    )

    // Sort by count (descending)
    return skillsArray.sort((a, b) => b.count - a.count)
  }, [repositories])

  const maxCount = skillsData[0]?.count || 1

  const getFontSize = (count: number) => {
    const normalized = count / maxCount
    if (normalized > 0.8) return 'text-4xl'
    if (normalized > 0.6) return 'text-3xl'
    if (normalized > 0.4) return 'text-2xl'
    if (normalized > 0.2) return 'text-xl'
    return 'text-lg'
  }

  const getFontWeight = (count: number) => {
    const normalized = count / maxCount
    if (normalized > 0.7) return 'font-bold'
    if (normalized > 0.4) return 'font-semibold'
    return 'font-medium'
  }

  return (
    <div className='w-full'>
      {/* Word Cloud Container */}
      <div className='flex flex-wrap items-center justify-center gap-2 p-6 min-h-64 bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-secondary/10 rounded-lg'>
        {skillsData.map(({ skill, count, category }) => (
          <span
            key={skill}
            className={`
              inline-block px-2 py-1 rounded-md transition-all duration-200 cursor-pointer
              ${getFontSize(count)} ${getFontWeight(count)}
              ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || 'text-gray-500'}
              ${CATEGORY_BG_COLORS[category as keyof typeof CATEGORY_BG_COLORS] || 'bg-gray-50 hover:bg-gray-100'}
              transform hover:scale-110 hover:shadow-sm
            `}
            title={`${skill} - ${count} ${count === 1 ? 'point' : 'points'} (${category})`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className='mt-4 flex flex-wrap gap-4 justify-center text-xs'>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 rounded-full bg-emerald-500' />
          <span className='capitalize text-muted-foreground'>frontend</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 rounded-full bg-blue-500' />
          <span className='capitalize text-muted-foreground'>backend</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 rounded-full bg-red-500' />
          <span className='capitalize text-muted-foreground'>systems</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 rounded-full bg-orange-500' />
          <span className='capitalize text-muted-foreground'>devops</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 rounded-full bg-purple-500' />
          <span className='capitalize text-muted-foreground'>cloud</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 rounded-full bg-cyan-500' />
          <span className='capitalize text-muted-foreground'>data</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-3 h-3 rounded-full bg-gray-500' />
          <span className='capitalize text-muted-foreground'>tools</span>
        </div>
      </div>
    </div>
  )
}
