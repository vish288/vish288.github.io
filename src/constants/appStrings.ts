export const APP_STRINGS = {
  // Personal Information
  DISPLAY_NAME: 'Vish',
  FULL_NAME: 'Visweshwaran S',
  TAGLINE: 'Full Stack Developer | Open Source Enthusiast | Problem Solver',
  LOCATION: 'Toronto, Canada & India',
  GITHUB_URL: 'https://github.com/vish288',
  LINKEDIN_URL: 'https://www.linkedin.com/in/suryanarayananvisweshwaran/',

  // Navigation
  NAV_ABOUT: 'About',
  NAV_REPOSITORIES: 'Repositories',
  NAV_MCP: 'MCP Install',

  // About Page
  ABOUT_TITLE: 'About Me',
  ABOUT_SUBTITLE: 'Passionate developer building innovative solutions',
  ABOUT_DESCRIPTION_1:
    "I'm a passionate full-stack developer with a love for creating elegant solutions to complex problems. With experience in modern web technologies, I enjoy building applications that make a difference in people's lives.",
  ABOUT_DESCRIPTION_2:
    "When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge with the developer community. I believe in the power of collaboration and continuous learning.",

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
  SKILLS_CLOUD_DESCRIPTION: 'Interactive word cloud showing programming languages and technologies',
  REPOSITORY_COUNT_MESSAGE: 'Word cloud generated from {count} repositories',
} as const

export type AppStringKey = keyof typeof APP_STRINGS
