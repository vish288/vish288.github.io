# Development Guide

## Tech Stack

| Layer | Tool | Version |
|-------|------|---------|
| Framework | React | 19 |
| Language | TypeScript | 5.9 |
| Bundler | Vite | 7 |
| Styling | Tailwind CSS | 4 |
| Components | shadcn/ui + Radix | — |
| Testing | Vitest + Testing Library | 4 |
| CI/CD | GitHub Actions | — |
| Versioning | release-please | — |

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

## Setup

```bash
git clone https://github.com/vish288/vish288.github.io.git
cd vish288.github.io
pnpm install
pnpm run dev
```

## Scripts

### Development
```bash
pnpm run dev          # Start development server on port 3000
pnpm run preview      # Preview production build locally
```

### Building
```bash
pnpm run build        # Build for production
pnpm run build:github # Build for GitHub Pages (same as build)
pnpm run deploy       # Build and move to docs/
```

### Testing
```bash
pnpm run test            # Run tests once
pnpm run test:watch      # Run tests in watch mode
pnpm run test:coverage   # Run tests with coverage report
```

### Code Quality
```bash
pnpm run typecheck    # TypeScript type checking
pnpm run lint         # ESLint with auto-fix
pnpm run lint:check   # ESLint without auto-fix
pnpm run format       # Prettier format
pnpm run format:check # Prettier check
```

### Maintenance
```bash
pnpm run clean        # Clean build artifacts
pnpm audit            # Check for security vulnerabilities
pnpm outdated         # Check for outdated dependencies
```

## Full Quality Check

```bash
pnpm run typecheck && pnpm run lint:check && pnpm run format:check && pnpm run test
```

## Release Process

This repo uses [release-please](https://github.com/googleapis/release-please) with conventional commits:

1. Push to `main` with conventional commit prefix (`feat:`, `fix:`, `chore:`, etc.)
2. release-please auto-creates a release PR with version bump and changelog
3. Merging the release PR triggers build + deploy to GitHub Pages

Version bumps: `feat:` = minor, `fix:` = patch, `BREAKING CHANGE:` = major.

## Contributing

1. Fork repository and create a feature branch
2. Make changes and add tests
3. Run the full quality check above
4. Commit with [conventional messages](https://www.conventionalcommits.org/)
5. Open a Pull Request
