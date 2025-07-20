export const APP_STRINGS = {
  // Personal Information
  FULL_NAME: 'Visweshwaran S',
  TAGLINE: 'Full Stack Developer | Open Source Enthusiast | Problem Solver',
  LOCATION: 'Toronto, Canada & India',
  GITHUB_URL: 'https://github.com/vish288',
  LINKEDIN_URL: 'https://www.linkedin.com/in/suryanarayananvisweshwaran/',

  // Navigation
  NAV_ABOUT: 'About',
  NAV_REPOSITORIES: 'Repositories',
  NAV_GRATITUDE: 'Gratitude',

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

  // Gratitude Page
  GRATITUDE_FORM_TITLE: 'Send a Message',
  GRATITUDE_FORM_SUBTITLE: 'Your message will be stored securely and reviewed with appreciation.',
  GRATITUDE_PAGE_TITLE: 'Share Your Message',
  GRATITUDE_PAGE_DESCRIPTION:
    "Your thoughts, feedback, concerns, or gratitude help me grow and improve. Share whatever's on your mind.",

  GRATITUDE_SUCCESS_TITLE: 'Thank You!',
  GRATITUDE_SUCCESS_MESSAGE:
    'Your message has been received and stored securely. It means a lot to me!',
  GRATITUDE_SUCCESS_STORED_MESSAGE: 'Your message is safely stored and has been received.',

  // Form Labels
  FORM_NAME_LABEL: 'Name',
  FORM_EMAIL_LABEL: 'Email',
  FORM_MESSAGE_LABEL: 'Your Message',
  FORM_MESSAGE_PLACEHOLDER:
    "Share your thoughts, gratitude, feedback, or any message you'd like to send...",

  // Buttons
  BTN_SEND_MESSAGE: 'Send Message',
  BTN_SEND_ANOTHER: 'Send Another Message',
  BTN_GITHUB: 'GitHub',
  BTN_LINKEDIN: 'LinkedIn',
  BTN_HOME: 'Go to Homepage',

  // Security & Privacy
  SECURITY_CHECK_LABEL: 'Security Check',
  CAPTCHA_REQUIRED_ERROR: 'Please complete the security check first.',

  // Validation Messages
  VALIDATION_NAME_REQUIRED: 'Name is required',
  VALIDATION_EMAIL_REQUIRED: 'Email is required',
  VALIDATION_EMAIL_INVALID: 'Invalid email address',
  VALIDATION_MESSAGE_REQUIRED: 'Message is required',
  VALIDATION_MESSAGE_MIN_LENGTH: 'Message must be at least 10 characters long',

  // Error Messages
  ERROR_SUBMISSION_FAILED: 'Failed to submit your message. Please try again.',
  ERROR_GITHUB_AUTH: 'Failed to initiate GitHub authentication',
  ERROR_REPOSITORY_LOAD: 'Failed to load repository data',

  // Admin
  ADMIN_ACCESS_TITLE: 'Admin Access Required',
  ADMIN_ACCESS_SUBTITLE: 'Sign in with your GitHub account to access the admin dashboard',
  ADMIN_UNAUTHORIZED_TITLE: 'Access Restricted',
  ADMIN_UNAUTHORIZED_SUBTITLE: "Sorry, you don't have permission to access this admin area",
  ADMIN_NEED_ACCESS_TITLE: 'Need Access?',
  ADMIN_NEED_ACCESS_MESSAGE:
    'If you believe you should have access to this admin dashboard, please reach out politely and explain why you need access. Access is restricted to authorized users only.',
  ADMIN_MONITORING_MESSAGE: 'This area is monitored. Unauthorized access attempts are logged.',

  // Loading States
  LOADING_REPOSITORIES: 'Loading repositories...',
  LOADING_SENDING: 'Sending...',
  LOADING_REDIRECTING: 'Redirecting to GitHub...',

  // Accessibility
  SKILLS_CLOUD_DESCRIPTION: 'Interactive word cloud showing programming languages and technologies',
  REPOSITORY_COUNT_MESSAGE: 'Word cloud generated from {count} repositories',
} as const

export type AppStringKey = keyof typeof APP_STRINGS
