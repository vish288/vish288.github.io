export const APP_STRINGS = {
  // Personal Information
  DISPLAY_NAME: 'Vish',
  FULL_NAME: 'Visweshwaran S',
  ROLE: 'Senior Staff Engineer & Architect',
  TAGLINE:
    'I lead platform architecture for large enterprises: multi-tenant AI agent platforms, unified identity, micro-frontends and GitOps delivery on Kubernetes.',
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
    'I am a Senior Staff Engineer and solutions architect in Toronto. I have built software since 2010 for digital health, retail, telecom, B2B commerce and retail banking. I design platforms and lead the teams that ship them, from the first architecture review to the production cutover.',
  ABOUT_P2:
    'Today I lead the architecture of a multi-tenant AI agent platform for a national retailer. Teams across the business use one governed path to build, ship and operate agents, with tenancy, security and audit built in. Before that I unified authentication across 12 web applications on a national digital health platform. Its virtual-care journeys grew from a few hundred patients to 100,000 across 7 provinces in 2 quarters.',
  ABOUT_P3:
    'Outside client work, I build open-source developer tools: Model Context Protocol (MCP) servers for GitLab, Atlassian, Coda and Argo CD. They are on PyPI, and you can install them from this site.',

  // Capabilities section
  CAPABILITIES_EYEBROW: 'Capabilities',
  CAPABILITIES_HEADING: 'Where I add the most',
  CAPABILITIES: [
    {
      title: 'AI agent platforms',
      body: 'Multi-tenant agent platforms with tenant isolation and governed promotion to production; model routing, prompt and trace observability, tool catalogs and human-in-the-loop controls.',
    },
    {
      title: 'Identity and multi-tenant architecture',
      body: 'Unified authentication and authorization across many applications; workload identity, role-based access control and single sign-on; the privacy and compliance reviews that go with them.',
    },
    {
      title: 'Cloud-native delivery',
      body: 'Node.js, Java and Python services on Kubernetes; Argo CD, Helm and GitLab CI/CD; GCP, AWS and Azure; event-driven and serverless design.',
    },
    {
      title: 'Frontend platforms',
      body: 'React, TypeScript and Next.js at scale; micro-frontends and module federation; accessibility (WCAG AA) and web performance.',
    },
    {
      title: 'Security and quality',
      body: 'Secret management, deny-by-default networking, SAST and DAST scanning, CI quality gates; security, privacy and integrity reviews through to production.',
    },
    {
      title: 'Engineering leadership',
      body: 'Teams of up to 23 engineers across time zones; alignment with product, design, privacy, legal, security and SRE; architecture reviews and pre-sales.',
    },
  ],

  // Experience section
  EXPERIENCE_EYEBROW: 'Experience',
  EXPERIENCE_HEADING: 'Career',
  EXPERIENCE: [
    {
      period: '2026 – present',
      roles: ['Senior Staff Consultant, Enterprise AI Platform'],
      context: 'A national retailer; Toronto.',
      bullets: [
        'Lead the architecture of a multi-tenant enterprise AI agent platform. It standardizes how teams across the business build, govern, deploy and operate agents at scale.',
        'Teams ship through one governed path to production, replacing the ad-hoc setups each team built before.',
        'Security, audit and tenancy are built into the platform, not rebuilt by every team.',
        'Partner across engineering, security and leadership to make the platform the standard way to build agents.',
      ],
    },
    {
      period: '2025 – 2026',
      roles: ['Staff Engineer / Architect, Digital Health'],
      context:
        'Consulting for a national digital health platform used across 7 Canadian provinces; 75 developers in 6 teams.',
      bullets: [
        'Unified authentication and authorization across 3 authentication types and 12 web applications. Customer drop-off fell by 23%.',
        'Led a micro-frontend and module-federation migration of an end-of-life Next.js host and a 10-year-old React SPA. Build and deployment times fell by 40%, and 6 pods gained independent releases.',
        'Recovered a cross-application navigation integration stalled for 4 months. Reset it to a clear MVP mandate and shipped in 5 weeks.',
        'Launched eligibility-based virtual-care journeys across 7 provinces. Adoption grew from a few hundred patients to 100,000 in 2 quarters.',
        "Delivered the organization's first infrastructure-as-code migration to Argo CD across Node.js and Java microservices, a Java monolith and React and Next.js applications. No critical (P1) incidents.",
        'Introduced AI-assisted code review and built observability for it as merge requests grew from 100 a week to 100 a day. Productionized LLM-powered release-notes and dependency-risk agents.',
      ],
    },
    {
      period: '2025',
      roles: ['AI / Platform Engineer (contract)'],
      context: 'Remote engagement.',
      bullets: [
        'Designed a reusable Python platform for LLM-powered engineering automation. It centralizes Git, Jira, OpenAI, Slack, configuration and monitoring integrations.',
        'Applied prompt composition, token budgets, tiered model routing, structured-output validation and human-in-the-loop fallbacks to make agent output reliable and auditable.',
      ],
    },
    {
      period: '2015 – 2024',
      roles: [
        'Senior Staff Engineer / Architect (2023 – 2024)',
        'Staff Engineer / Architect (2021 – 2023)',
        'Lead Engineer / Solution Architect (2018 – 2021)',
        'Senior Experience Engineer (2015 – 2018)',
      ],
      context: 'Global digital consultancy; Toronto, Calgary, Bangalore and London.',
      bullets: [
        'Led teams of up to 23 engineers across geographies.',
        'Defined the MACH (microservices, API-first, cloud-native, headless) architecture that turned a US B2B supply-chain business into a full e-commerce platform. Customer-acquisition cost fell by 33%.',
        'Re-platformed a health solution for a major Canadian retailer onto a MACH architecture.',
        "Architected the organization's first cloud-native notification platform on GCP (serverless, Pub/Sub, Firestore), adopted enterprise-wide and reused for nationwide vaccination scheduling.",
        'Led headless e-commerce and multi-tenant Node.js and React architectures for telecom and North American retail clients.',
        'Received 3 awards for leadership and architecture between 2019 and 2022.',
      ],
    },
    {
      period: '2010 – 2015',
      roles: [
        'Associate Consultant, Technology (2013 – 2015)',
        'Senior Systems Engineer (2010 – 2013)',
      ],
      context: 'IT services; Chennai.',
      bullets: [
        'Led a remote team of 7 developers that built a B2B white-label platform.',
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

  // llms.txt — summary and machine-readable facts for answer engines
  LLMS_SUMMARY:
    'Visweshwaran S (Vish) is a Senior Staff Engineer and solutions architect in Toronto, Canada. He has built software since 2010 for digital health, retail, telecom, B2B commerce and retail banking. He currently leads the architecture of a multi-tenant enterprise AI agent platform.',
  LLMS_KEY_FACTS: [
    'Role: Senior Staff Engineer & Architect (consulting)',
    'Location: Toronto, Canada; also India',
    'Current focus: leading the architecture of a multi-tenant enterprise AI agent platform; one governed path to production, with tenancy, security and audit built in',
    'Identity: unified authentication across 3 authentication types and 12 web applications; customer drop-off down 23%',
    'Frontend: micro-frontend and module-federation migration; 6 pods released independently; build and deploy times down 40%',
    'Scale: virtual-care journeys from a few hundred patients to 100,000 across 7 provinces in 2 quarters',
    'Leadership: teams of up to 23 engineers; org-wide influence across 75 developers in 6 teams',
    'Open source: 4 MCP servers on PyPI — mcp-gitlab, mcp-atlassian-extended, mcp-coda, mcp-argocd',
    'Education: B.E. Electronics and Communication, Anna University',
    'Employers and clients are not named on this site.',
    'Contact: LinkedIn https://www.linkedin.com/in/suryanarayananvisweshwaran/ · GitHub https://github.com/vish288',
  ],
} as const

export type AppStringKey = keyof typeof APP_STRINGS
