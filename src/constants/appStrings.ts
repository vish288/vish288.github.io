export const APP_STRINGS = {
  // Personal Information
  DISPLAY_NAME: 'Vish',
  FULL_NAME: 'Visweshwaran S',
  TAGLINE:
    'Frontend & platform engineer. I build React apps and MCP servers for GitLab, Atlassian, Coda and Argo CD.',
  LOCATION: 'Toronto, Canada & India',
  GITHUB_URL: 'https://github.com/vish288',
  LINKEDIN_URL: 'https://www.linkedin.com/in/suryanarayananvisweshwaran/',

  // Navigation
  NAV_ABOUT: 'About',
  NAV_REPOSITORIES: 'Repositories',
  NAV_MCP: 'MCP Install',

  // About Page
  ABOUT_TITLE: 'About Me',
  ABOUT_SUBTITLE: 'Frontend and platform engineering, plus open-source developer tooling.',
  ABOUT_DESCRIPTION_1:
    'I work across the frontend and the platform beneath it — building React and TypeScript interfaces and keeping them fast and reliable in production.',
  ABOUT_DESCRIPTION_2:
    'I also ship open-source developer tooling: MCP servers for GitLab, Atlassian, Coda and Argo CD, published on PyPI and installable from this site. Based between Toronto and India.',

  SKILLS_TITLE: 'Skills & Technologies',
  SKILLS_SUBTITLE: 'Technologies I work with regularly',

  CONNECT_TITLE: "Let's Connect",
  CONNECT_SUBTITLE: 'Open to professional opportunities and collaborations',

  // Buttons
  BTN_GITHUB: 'GitHub',
  BTN_LINKEDIN: 'LinkedIn',
  BTN_HOME: 'Go to Homepage',

  // Error Messages
  ERROR_REPOSITORY_LOAD: 'Failed to load repository data',

  // Loading States
  LOADING_REPOSITORIES: 'Loading repositories...',

  // Accessibility
  SKILLS_CLOUD_DESCRIPTION: 'Languages and topics taken from public GitHub repositories',
  REPOSITORY_COUNT_MESSAGE: 'Derived from {count} public repositories',
} as const

export type AppStringKey = keyof typeof APP_STRINGS
