# Development Guide

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
git clone https://github.com/vish288/vish288.github.io.git
cd vish288.github.io
npm install
npm run dev
```

## Available Scripts

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
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint and fix issues
npm run format       # Format code with Prettier
```

### Maintenance
```bash
npm run clean        # Clean build artifacts
npm audit            # Check for security vulnerabilities
npm outdated         # Check for outdated dependencies
```

## Testing

Run all quality checks:

```bash
npm run typecheck && npm run lint:check && npm run format:check && npm run test
```

## Contributing

1. Fork repository and create feature branch
2. Make changes and add tests  
3. Run quality checks
4. Commit with conventional messages
5. Open Pull Request