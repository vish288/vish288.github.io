// SPA route restoration after a 404.html redirect.
// 404.html encodes the original path/query into ?p=/...&q=...; this script
// decodes that back into a real URL via history.replaceState so the React
// router can pick it up on the next tick.
;((l: Location) => {
  if (l.search[1] !== '/') return
  const decoded = l.search
    .slice(1)
    .split('&')
    .map(s => s.replace(/~and~/g, '&'))
    .join('?')
  const [encodedPath, ...querySegments] = decoded.split('?')
  const query = querySegments.join('?')
  const path = encodedPath?.replace(/^\/?\?p=/, '') ?? ''
  const url = path + (query ? '?' + query.replace(/^q=/, '') : '') + l.hash
  window.history.replaceState(null, '', '/' + url)
})(window.location)
