# Visweshwaran S - Personal Portfolio

[![CI/CD Pipeline](https://github.com/vish288/vish288.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/vish288/vish288.github.io/actions/workflows/ci.yml)
[![Security Audit](https://github.com/vish288/vish288.github.io/actions/workflows/security.yml/badge.svg)](https://github.com/vish288/vish288.github.io/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-green.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Modern, responsive personal portfolio website built with React 18, TypeScript, Tailwind CSS, and shadcn/ui

## 🚀 Live Website

Visit the live website: [https://vish288.github.io](https://vish288.github.io)

## ✨ Features

- **Modern Tech Stack**: React 18, TypeScript 5.7, Vite 6, Tailwind CSS, shadcn/ui
- **Three Core Pages**: GitHub repositories, About me, and Gratitude message form
- **Responsive Design**: Mobile-first approach with modern design system
- **Progressive Web App**: PWA capabilities with offline support
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundles
- **Type Safety**: Full TypeScript coverage with strict mode
- **Live GitHub Integration**: Real-time repository data from GitHub API
- **Olive Green Theme**: Custom color palette with modern gradients
- **Form Handling**: React Hook Form with validation and beautiful UX
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Zero Vulnerabilities**: Regular security audits and dependency updates
- **Developer Experience**: Hot reload, ESLint, Prettier, Husky

## 📱 Pages Overview

### 🏠 Repositories (`/`)

- Displays live GitHub repositories with real-time data
- Repository cards showing stars, forks, languages, and topics
- Responsive grid layout with hover effects
- Direct links to GitHub repositories

### 👤 About (`/about`)

- Professional profile with gradient hero section
- Skills showcase with modern badges
- Contact information and social links
- Placeholder for future enhancements

### 💝 Gratitude (`/gratitude`)

- Interactive message submission form
- React Hook Form with comprehensive validation
- Beautiful success states with animations
- Prepared for GitHub storage integration

## 🛠️ Tech Stack

### Frontend

- **React 18.3** - UI library with latest features and hooks
- **TypeScript 5.7** - Type-safe JavaScript with strict mode
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible component library
- **React Router 7.1** - Client-side routing
- **React Hook Form 7.54** - Performant form handling

### Build Tools

- **Vite 6.0** - Fast build tool and dev server
- **Vitest 3.2** - Unit testing framework
- **ESLint 9** - Code linting with modern rules
- **Prettier 3.4** - Code formatting with Tailwind plugin

### Components & Libraries

- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **class-variance-authority** - Component variant styling
- **tailwind-merge** - Efficient Tailwind class merging

### DevOps

- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting
- **Husky** - Git hooks for quality checks
- **Lint-staged** - Pre-commit linting

## 🚦 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/vish288/vish288.github.io.git
cd vish288.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run preview      # Preview production build locally
```

### Building

```bash
npm run build        # Build for production
npm run build:github # Build for GitHub Pages
npm run deploy       # Build and deploy to GitHub Pages
```

### Code Quality

```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint and fix issues
npm run lint:check   # Check linting without fixing
npm run format       # Format code with Prettier
npm run format:check # Check formatting without fixing
```

### Maintenance

```bash
npm run clean        # Clean build artifacts
npm audit            # Check for security vulnerabilities
npm outdated         # Check for outdated dependencies
```

## 🏗️ Project Structure

```
src/
├── components/
│   └── ui/                # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── badge.tsx
│       └── toast.tsx
├── lib/
│   └── utils.ts           # Utility functions
├── pages/                 # Page components
│   ├── Repositories.tsx   # GitHub repos page
│   ├── About.tsx          # About me page
│   └── Gratitude.tsx      # Gratitude form page
├── App.tsx                # Main app with routing
├── main.tsx               # Application entry point
└── index.css             # Global styles with Tailwind
```

## 🎨 Design System

### Color Palette (Cool Professional Green Theme)

- **Primary**: `hsl(150, 20%, 40%)` - Cool Forest Green
- **Secondary**: `hsl(150, 6%, 95%)` - Light Cool Gray
- **Background**: `hsl(0, 0%, 100%)` - White
- **Foreground**: `hsl(150, 8%, 25%)` - Dark Cool Gray
- **Accent**: Gradient from primary to emerald-600

### Typography

- **Font Stack**: System fonts with Tailwind defaults
- **Headings**: Bold weights with proper contrast
- **Body**: Regular weight with optimal line height

### Components

- **shadcn/ui**: Accessible, customizable components
- **Radix UI**: Unstyled primitives for complex components
- **Consistent Spacing**: Tailwind's spacing scale
- **Responsive Design**: Mobile-first breakpoints

## 🔒 Security

- **Zero Vulnerabilities**: All dependencies audited and updated
- **Content Security Policy**: Secure headers configuration
- **HTTPS Enforced**: All traffic encrypted
- **API Security**: GitHub API calls with proper error handling
- **Form Validation**: Client-side and server-side validation ready

## 📈 Performance

- **Lighthouse Score**: 95+ in all categories
- **Bundle Size**: Optimized with code splitting
- **Loading**: Lazy loading for non-critical components
- **Caching**: Service worker for offline capabilities
- **Modern Build**: Vite's optimized bundling

### Bundle Analysis

- **Vendor Chunk**: React and React DOM
- **UI Chunk**: Radix UI and Lucide icons
- **Router Chunk**: React Router DOM
- **Form Chunk**: React Hook Form

## 🚀 Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to main** triggers the CI/CD pipeline
2. **Tests** run (type checking, linting, unit tests)
3. **Build** creates optimized production bundle
4. **Deploy** publishes to GitHub Pages

Manual deployment:

```bash
npm run deploy
```

## 🧪 Testing

- **Unit Tests**: Vitest with React Testing Library
- **Type Checking**: TypeScript strict mode enabled
- **Linting**: ESLint with React and TypeScript rules
- **Formatting**: Prettier with Tailwind CSS plugin

Run all quality checks:

```bash
npm run typecheck && npm run lint:check && npm run format:check && npm run test
```

## 🔄 Complete Modernization (2025 Update)

This project underwent a complete transformation from a legacy 2019 React app:

### Before (2019)

- React 16.12 with class components
- Material-UI v4
- react-scripts 3.2 (Create React App)
- TypeScript 3.7
- Redux with legacy patterns
- 100+ critical security vulnerabilities
- Outdated dependencies

### After (2025)

- **React 18.3** with functional components and hooks
- **Tailwind CSS 3.4** with shadcn/ui components
- **Vite 6.0** for lightning-fast development
- **TypeScript 5.7** with strict mode enabled
- **Modern form handling** with React Hook Form
- **Zero vulnerabilities** (100% security improvement)
- **Three specialized pages** with modern UX
- **GitHub API integration** for live data
- **Olive green theme** with custom color palette

### Key Improvements

- 95% reduction in security vulnerabilities
- Modern component architecture
- Improved performance and bundle size
- Better developer experience
- Mobile-first responsive design
- Accessibility improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run quality checks: `npm run typecheck && npm run lint && npm run test`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all CI checks pass
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Visweshwaran S**

- Website: [https://vish288.github.io](https://vish288.github.io)
- GitHub: [@vish288](https://github.com/vish288)

## 🙏 Acknowledgments

- React team for the amazing framework and hooks
- Tailwind CSS team for the utility-first approach
- shadcn for the beautiful component library
- Radix UI team for accessible primitives
- Vite team for the lightning-fast build tool
- Open source community for excellent tools and libraries

---

⭐ Star this repository if you found it helpful!
