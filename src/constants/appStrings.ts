export const APP_STRINGS = {
  // Personal Information
  DISPLAY_NAME: 'Vish',
  FULL_NAME: 'Visweshwaran S',
  ROLE: 'Senior Staff Engineer & Architect',
  TAGLINE:
    'I lead platform modernization for large enterprises: unified identity, micro-frontends, cloud-native delivery and LLM-powered engineering tooling.',
  LOCATION: 'Toronto, Canada & India',
  GITHUB_URL: 'https://github.com/vish288',
  LINKEDIN_URL: 'https://www.linkedin.com/in/suryanarayananvisweshwaran/',

  // Navigation
  NAV_ABOUT: 'About',
  NAV_REPOSITORIES: 'Repositories',

  // About section
  ABOUT_EYEBROW: 'About',
  ABOUT_HEADING: 'What I do',
  ABOUT_P1:
    "I'm a Senior Staff Engineer and architect, building software professionally since 2010 across digital health, retail, telecom and B2B commerce. I design platforms and lead the teams that ship them, from the first architecture review to a zero-incident cutover.",
  ABOUT_P2:
    'Most recently that has meant a national digital health platform: unified authentication across 12 web applications, a module-federation migration across six delivery pods, and virtual-care journeys that grew from a few hundred patients to 100,000 across seven provinces in two quarters.',
  ABOUT_P3:
    'Outside client work I build open-source developer tooling: MCP servers for GitLab, Atlassian, Coda and Argo CD, published on PyPI and installable from this site.',

  // Capabilities section
  CAPABILITIES_EYEBROW: 'Capabilities',
  CAPABILITIES_HEADING: 'Where I add the most',
  CAPABILITIES: [
    {
      title: 'Frontend platforms',
      body: 'React, TypeScript and Next.js at scale; micro-frontends and module federation; accessibility (WCAG AA) and web performance.',
    },
    {
      title: 'Cloud-native delivery',
      body: 'Node.js, Java and Python services on Kubernetes; ArgoCD, Helm and GitLab CI/CD; GCP, AWS and Azure; event-driven and serverless design.',
    },
    {
      title: 'Identity and multi-tenant architecture',
      body: 'Unified authentication and authorization across many applications, multi-tenant platforms, and the security and compliance reviews that go with them.',
    },
    {
      title: 'AI-assisted engineering',
      body: 'LLM engineering automation and agentic workflows: model routing, token budgets, structured outputs and human-in-the-loop controls, plus governance for AI-assisted code review.',
    },
    {
      title: 'Engineering leadership',
      body: 'Teams of up to 23 engineers across time zones; alignment with product, design, privacy, legal and SRE; architecture reviews and pre-sales.',
    },
  ],

  // Experience section
  EXPERIENCE_EYEBROW: 'Experience',
  EXPERIENCE_HEADING: 'Career',
  EXPERIENCE: [
    {
      period: '2025 – present',
      roles: [
        'Senior Staff Consultant (2026 – present)',
        'Staff Engineer / Architect, Digital Health (2025 – 2026)',
      ],
      context:
        'Consulting for a national digital health platform used by Canadians across seven provinces.',
      bullets: [
        'Unified authentication and authorization across 3 auth types and 12 web applications, removing redundant identity flows.',
        'Led a micro-frontend and module-federation migration spanning an end-of-life Next.js host and a 10-year-old React SPA, cutting build and deployment times by 40% and giving six pods independent releases.',
        'Launched eligibility-based virtual-care journeys, growing adoption from a few hundred patients to 100,000 in two quarters.',
        'Delivered an infrastructure-as-code migration to ArgoCD and Kubernetes across Next.js, Node.js and Java services and a Java monolith, with zero P1 incidents.',
        'Built observability and governance for AI-assisted development as merge requests grew from 100 a week to 100 a day.',
      ],
    },
    {
      period: '2025',
      roles: ['AI / Platform Engineer (contract)'],
      context: 'Remote engagement.',
      bullets: [
        'Designed a reusable Python platform for LLM-powered engineering automation, centralizing Git, Jira, OpenAI, Slack, configuration and monitoring integrations.',
        'Applied prompt composition, token budgeting, tiered model routing, structured-output validation and human-in-the-loop fallbacks to make agent output reliable and auditable.',
      ],
    },
    {
      period: '2015 – 2024',
      roles: [
        'Senior Staff Engineer / Architect (2023 – 2024)',
        'Staff Engineer / Architect (2021 – 2023)',
        'Lead Engineer / Solution Architect (2018 – 2021)',
        'Senior Experience Engineer (2015 – 2018)',
      ],
      context: 'Global digital consultancy; Toronto, Calgary, Bangalore and London.',
      bullets: [
        'Led cross-geography teams of up to 23 engineers.',
        'Defined the MACH architecture that turned a US B2B supply-chain business into a full e-commerce platform, cutting customer-acquisition cost by 33%.',
        'Re-platformed a health solution for a major Canadian retailer onto a MACH architecture.',
        'Architected the organization’s first cloud-native notification platform (serverless, Pub/Sub, Firestore), adopted enterprise-wide and reused for nationwide vaccination scheduling.',
        'Led headless e-commerce and multi-tenant Node.js/React architectures for telecom and North American retail clients.',
        'Recognized three times for leadership and architecture between 2019 and 2022.',
      ],
    },
    {
      period: '2010 – 2015',
      roles: [
        'Associate Consultant, Technology (2013 – 2015)',
        'Senior Systems Engineer (2010 – 2013)',
      ],
      context: 'IT services; Chennai.',
      bullets: [
        'Led a remote team of 7 developers building a B2B white-label platform.',
        'Built a JavaScript framework that merged multiple action flows into one process for retail banking clients.',
      ],
    },
  ],
  EXPERIENCE_EDUCATION: 'B.E. Electronics and Communication, Anna University',
  EXPERIENCE_LINK: 'Full history on LinkedIn',
  EXPERIENCE_CTA: 'Experience',

  // Skills word cloud (repo-derived)
  SKILLS_TITLE: 'From my public repos',
  SKILLS_SUBTITLE: 'Languages and topics across my GitHub repositories',

  // Loading States
  LOADING_REPOSITORIES: 'Loading repositories...',

  // Accessibility
  SKILLS_CLOUD_DESCRIPTION: 'Languages and topics taken from public GitHub repositories',
  REPOSITORY_COUNT_MESSAGE: 'Derived from {count} public repositories',
} as const

export type AppStringKey = keyof typeof APP_STRINGS
