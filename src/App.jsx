import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import KittyGrid from './components/KittyGrid';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff69b4',
    },
    secondary: {
      main: '#ff1493',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h2" 
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff69b4, #ff1493)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
          }}
        >
          🐱 Kitty's Music Box
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
          <KittyGrid />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
