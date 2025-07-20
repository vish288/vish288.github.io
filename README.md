# Visweshwaran S - Personal Portfolio

[![CI/CD Pipeline](https://github.com/vish288/vish288.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/vish288/vish288.github.io/actions/workflows/ci.yml)
[![Security Audit](https://github.com/vish288/vish288.github.io/actions/workflows/security.yml/badge.svg)](https://github.com/vish288/vish288.github.io/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-green.svg)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/MUI-6.3-blue.svg)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Modern, responsive personal portfolio website built with React 18, TypeScript, Vite, and Material-UI

## 🚀 Live Website

Visit the live website: [https://vish288.github.io](https://vish288.github.io)

## ✨ Features

- **Modern Tech Stack**: React 18, TypeScript 5.7, Vite 6, MUI v6
- **Responsive Design**: Mobile-first approach with Material Design
- **Progressive Web App**: PWA capabilities with offline support
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundles
- **Type Safety**: Full TypeScript coverage with strict mode
- **State Management**: Redux Toolkit for predictable state updates
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Security**: Regular security audits and dependency updates
- **Developer Experience**: Hot reload, ESLint, Prettier, Husky

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library with latest features
- **TypeScript 5.7** - Type-safe JavaScript
- **Material-UI 6.3** - React component library
- **Redux Toolkit 2.5** - State management
- **React Router 7.1** - Client-side routing

### Build Tools
- **Vite 6.0** - Fast build tool and dev server
- **Vitest** - Unit testing framework
- **ESLint 9** - Code linting
- **Prettier 3.4** - Code formatting

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting
- **Husky** - Git hooks
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
├── components/          # Reusable UI components
│   ├── SearchSort.tsx
│   └── Tiles.tsx
├── hooks/              # Custom React hooks
│   ├── useAppDispatch.ts
│   └── useAppSelector.ts
├── pages/              # Page components
├── store/              # Redux store and slices
│   ├── index.ts
│   └── tilesSlice.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
├── test/               # Test configuration
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🎨 Design System

- **Primary Color**: #443266 (Deep Purple)
- **Secondary Color**: #8C489F (Medium Purple)
- **Typography**: Roboto font family
- **Responsive Breakpoints**: Mobile-first Material-UI breakpoints
- **Component Library**: Material-UI with custom theme

## 🔒 Security

- Regular security audits via GitHub Actions
- Dependency vulnerability scanning
- Content Security Policy headers
- HTTPS enforced
- No sensitive data in client-side code

## 📈 Performance

- **Lighthouse Score**: 95+ in all categories
- **Bundle Size**: Optimized with code splitting
- **Loading**: Lazy loading for non-critical components
- **Caching**: Service worker for offline capabilities
- **Images**: Optimized and responsive images

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
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint with React and TypeScript rules
- **Formatting**: Prettier with consistent code style

Run all quality checks:
```bash
npm run typecheck && npm run lint:check && npm run format:check && npm run test
```

## 🔄 Migration from Legacy

This project was completely modernized from a 2019 React app:

### Before (2019)
- React 16.12 with class components
- Material-UI v4
- react-scripts 3.2
- TypeScript 3.7
- 100+ security vulnerabilities

### After (2025)
- React 18.3 with functional components and hooks
- MUI v6 with modern styling
- Vite 6 for fast development
- TypeScript 5.7 with strict mode
- 5 minor vulnerabilities (95% reduction)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run quality checks: `npm run typecheck && npm run lint && npm run test`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Visweshwaran S**
- Website: [https://vish288.github.io](https://vish288.github.io)
- GitHub: [@vish288](https://github.com/vish288)
- Email: visweshwaran.s@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Material-UI team for the component library
- Vite team for the lightning-fast build tool
- Open source community for the excellent tools and libraries

---

⭐ Star this repository if you found it helpful!