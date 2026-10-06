import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element not found')
}

// ponytail: createRoot (not hydrateRoot) — the client re-renders over the
// prerendered markup rather than hydrating it, which avoids mismatches with
// live GitHub data and the resolved theme. Switch to hydrateRoot only if a
// content flash ever shows on first paint.
const root = createRoot(container)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
