# Architecture

## Tech Stack

- **React 18.3** - UI library
- **TypeScript 5.7** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Vite 6.0** - Build tool and dev server
- **Vitest 3.2** - Testing framework

## Project Structure

```
src/
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── icons/             # Icon components
│   └── ...                # Feature components
├── pages/                 # Page components
├── services/              # API and business logic
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── styles/                # Global styles
```

## Design System

### Color Palette
- **Primary**: Cool Forest Green `hsl(150, 20%, 40%)`
- **Secondary**: Light Cool Gray `hsl(150, 6%, 95%)`
- **Background**: White
- **Foreground**: Dark Cool Gray `hsl(150, 8%, 25%)`

### Components
- Built with shadcn/ui and Radix UI primitives
- Mobile-first responsive design
- Consistent spacing with Tailwind scale

## Deployment

- **Platform**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Domain**: Custom domain with CNAME
- **Build**: Vite production build with optimizations