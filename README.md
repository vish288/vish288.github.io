# Vish - Personal Portfolio

[![CI/CD Pipeline](https://github.com/vish288/vish288.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/vish288/vish288.github.io/actions/workflows/ci.yml)
[![Security Audit](https://github.com/vish288/vish288.github.io/actions/workflows/security.yml/badge.svg)](https://github.com/vish288/vish288.github.io/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-green.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Personal portfolio website built with React 18, TypeScript, Tailwind CSS, and shadcn/ui

## 🚀 Live Website

Visit: [https://vish288.github.io](https://vish288.github.io)

## ✨ Features

- **Tech Stack**: React 18, TypeScript 5.7, Vite 6, Tailwind CSS, shadcn/ui
- **Pages**: GitHub repositories, About, Gratitude message form
- **Design**: Mobile-first responsive with custom green theme
- **Integration**: Live GitHub API data
- **Admin Console**: OAuth-protected message management
- **Testing**: Unit tests with Vitest, type checking, linting
- **Deployment**: GitHub Actions CI/CD to GitHub Pages

## 📱 Pages

- **Repositories (`/`)**: Live GitHub repository data with stars, forks, languages
- **About (`/about`)**: Professional profile with skills and contact info
- **Gratitude (`/gratitude`)**: Message submission form with validation

## 🚀 Quick Start

**⚠️ This project uses pnpm exclusively. If you're still using npm, it's time to grow up and learn pnpm.**

```bash
git clone https://github.com/vish288/vish288.github.io.git
cd vish288.github.io
pnpm install
pnpm run dev
```

## 📜 Scripts

```bash
pnpm run dev        # Development server
pnpm run build      # Production build
pnpm run deploy     # Deploy to GitHub Pages
pnpm run test       # Run tests
pnpm run lint       # Lint and fix
pnpm run typecheck  # Type checking
```

## 📚 Documentation

- **[Development Guide](docs/DEVELOPMENT.md)** - Setup, scripts, and development workflow
- **[Architecture](docs/ARCHITECTURE.md)** - Tech stack, project structure, and design system

## 🤝 Contributing

1. Fork repository and create feature branch
2. Make changes and add tests
3. Run: `pnpm run typecheck && pnpm run lint && pnpm run test`
4. Commit with conventional messages
5. Open Pull Request

**Note**: This project uses pnpm. Don't use npm. Seriously.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vish**

- Website: [https://vish288.github.io](https://vish288.github.io)
- GitHub: [@vish288](https://github.com/vish288)
