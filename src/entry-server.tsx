import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppContent } from './App'

/** Render the routed app tree to an HTML string for the given route. */
export function render(url: string): string {
  return renderToString(
    <ThemeProvider>
      <StaticRouter location={url}>
        <AppContent />
      </StaticRouter>
    </ThemeProvider>
  )
}

// Re-export the data the prerender script needs, so it imports a single built
// SSR bundle rather than reaching into individual source modules.
export { APP_STRINGS } from './constants/appStrings'
export { SERVERS } from './constants/mcpServers'
export { ROUTE_META } from './constants/routeMeta'
