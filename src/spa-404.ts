// Caught by GitHub Pages on any unknown route; encodes the requested path
// and query into a ?p=/...&q=... pair that index.html's spa-redirect handler
// decodes back into a real route via history.replaceState.
const l = window.location
const PATH_SEGMENTS_TO_KEEP = 0
const prefix = l.pathname
  .split('/')
  .slice(0, 1 + PATH_SEGMENTS_TO_KEEP)
  .join('/')
const remainder = l.pathname
  .slice(1)
  .split('/')
  .slice(PATH_SEGMENTS_TO_KEEP)
  .join('/')
  .replace(/&/g, '~and~')
const query = l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : ''
l.replace(`${prefix}/?p=/${remainder}${query}${l.hash}`)
