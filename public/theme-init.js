// Set the theme class before first paint so a dark load never flashes light.
// Served from the same origin (script-src 'self'); no inline script needed.
// Mirrors the resolution in src/contexts/ThemeContext.tsx; the ThemeProvider
// takes over after mount and adds `theme-ready`, which enables the fade.
(function () {
  try {
    var stored = localStorage.getItem('theme')
    // Unknown/absent values resolve to system, matching ThemeContext's guard.
    var theme = stored === 'dark' || stored === 'light' ? stored : 'system'
    var dark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    var root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(dark ? 'dark' : 'light')
  } catch (e) {
    /* storage/matchMedia unavailable: fall back to the CSS media query */
  }
})()
