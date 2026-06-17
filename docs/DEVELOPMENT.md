# Development Guide

## Prerequisites

- Node.js >= 24
- pnpm >= 10 (this repo pins `packageManager: pnpm@10.14.0`)

Both are managed via [mise](https://mise.jdx.dev/) if you have it installed.

## Setup

```bash
git clone https://github.com/vish288/vish288.github.io.git
cd vish288.github.io
pnpm install
pnpm dev
```

Dev server runs on http://localhost:3000.

## Scripts

```bash
pnpm dev               # Vite dev server
pnpm build             # Production build → dist/
pnpm build:github      # Same as build; preserved for clarity in the release workflow
pnpm preview           # Serve dist/ locally for a smoke test

pnpm test              # Vitest run
pnpm test:watch        # Vitest watch
pnpm test:coverage     # Vitest with v8 coverage

pnpm typecheck         # tsc --noEmit
pnpm lint              # eslint --fix
pnpm lint:check        # eslint, no fix
pnpm format            # prettier --write
pnpm format:check      # prettier --check

pnpm clean             # rm dist + logs
```

Full pre-PR check:

```bash
pnpm typecheck && pnpm lint:check && pnpm format:check && pnpm test
```

## Release flow

[release-please](https://github.com/googleapis/release-please) drives versioning off conventional commits on `main`:

- `feat:` → minor bump
- `fix:` / `perf:` → patch bump
- `BREAKING CHANGE:` footer → major bump
- `chore:`, `docs:`, `ci:`, `build:`, `style:`, `refactor:`, `test:` → no version bump but recorded in CHANGELOG sections

Workflow:

1. Push a conventional-commit PR to `main`.
2. The release-please workflow opens (or updates) a release PR titled `chore(main): release vish288-personal-website X.Y.Z`. A second job auto-formats CHANGELOG.md on that PR.
3. Merging the release PR cuts the tag and triggers the build + deploy job, which uploads the Vite artifact to GitHub Pages.

## Pages

Pages source must be set to **GitHub Actions** (Settings → Pages → Source). With the legacy "Deploy from a branch" mode the artifact is ignored and Pages Jekyll-serves the raw source tree instead — see PR #121 history if this ever drifts.

## Dependency hygiene

- Dependabot is configured in `.github/dependabot.yml` to group npm minor/patch, npm major, and github-actions bumps into batched PRs (weekly).
- All GitHub Actions are SHA-pinned (repo policy `sha_pinning_required: true`). When bumping, dereference tag → commit SHA and keep the `# vN.N.N` trailing comment.

## Contributing

1. Branch from `main`.
2. Make the change with tests.
3. Run the full pre-PR check above.
4. Conventional-commit message; open PR.
