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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
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
          overflow: 'hidden',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Typography 
            variant="h2" 
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff69b4, #ff1493)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            }}
          >
            🐱 Kitty's Music Box
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Create purr-fect melodies with your feline friend!
          </Typography>
        </Box>
        <KittyGrid />
      </Box>
    </ThemeProvider>
  );
}

export default App;
