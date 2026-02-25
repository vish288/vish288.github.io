# Development Guide

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Installation

```bash
git clone https://github.com/vish288/vish288.github.io.git
cd vish288.github.io
pnpm install
pnpm run dev
```

## Available Scripts

### Development
```bash
pnpm run dev          # Start development server
pnpm run preview      # Preview production build locally
```

### Building
```bash
pnpm run build        # Build for production
pnpm run build:github # Build for GitHub Pages
pnpm run deploy       # Build and deploy to GitHub Pages
```

### Code Quality
```bash
pnpm run test         # Run tests
pnpm run test:watch   # Run tests in watch mode
pnpm run typecheck    # Run TypeScript type checking
pnpm run lint         # Run ESLint and fix issues
pnpm run format       # Format code with Prettier
```

### Maintenance
```bash
pnpm run clean        # Clean build artifacts
pnpm audit            # Check for security vulnerabilities
pnpm outdated         # Check for outdated dependencies
```

## Testing

Run all quality checks:

```bash
pnpm run typecheck && pnpm run lint:check && pnpm run format:check && pnpm run test
```

## Contributing

1. Fork repository and create feature branch
2. Make changes and add tests
3. Run quality checks
4. Commit with conventional messages
5. Open Pull Request
