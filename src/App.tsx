import { useEffect } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Box, Container, AppBar, Toolbar, Typography, Paper } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './store'
import SearchSort from './components/SearchSort'
import Tiles from './components/Tiles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#443266',
    },
    secondary: {
      main: '#8C489F',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

function App() {
  useEffect(() => {
    // Initialize app data
    console.log('App initialized')
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Visweshwaran S - Portfolio
              </Typography>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <SearchSort />
            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
              <Tiles />
            </Paper>
          </Container>

          <Box
            component="footer"
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'secondary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2">© 2025 Visweshwaran S</Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  )
}

export default App