import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, CircularProgress, IconButton, Paper, Tooltip } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

// Lazy load components
const KittyGrid = lazy(() => import('./components/KittyGrid'));
const AITrayManager = lazy(() => import('./components/AITrayManager'));
const GridSequencer = lazy(() => import('./components/GridSequencer'));
const AIFeaturesTray = lazy(() => import('./components/AIFeaturesTray'));
const KittyTour = lazy(() => import('./components/KittyTour'));
const UserGuide = lazy(() => import('./components/UserGuide'));
import * as Tone from 'tone';

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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Loading component
const LoadingFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
    flexDirection="column"
    gap={2}
  >
    <CircularProgress color="secondary" size={60} />
    <Typography variant="h6" color="primary">
      Loading Kitty's Music Box...
    </Typography>
  </Box>
);

function App() {
  const [gridState, setGridState] = useState(null);
  const [showAITray, setShowAITray] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isToneStarted, setIsToneStarted] = useState(false);
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    // Initialize Tone.js synth
    const newSynth = new Tone.PolySynth().toDestination();
    setSynth(newSynth);
  }, []);

  const handleGridStateChange = useCallback((newState) => {
    setGridState(newState);
  }, []);

  const handleAIPatternApply = useCallback((pattern) => {
    // TODO: Apply the pattern to the grid
    console.log('Applying pattern:', pattern);
  }, []);

  const startAudioContext = async () => {
    if (!isToneStarted) {
      await Tone.start();
      setIsToneStarted(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        className="app-container" 
        onClick={startAudioContext}
        sx={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <KittyTour />
        
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Suspense fallback={<CircularProgress />}>
            <KittyGrid onStateChange={handleGridStateChange} />
          </Suspense>
        </Paper>

        {/* AI Tray Toggle Button */}
        <Tooltip title={showAITray ? "Hide AI Features" : "Show AI Features"}>
          <IconButton
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            onClick={() => setShowAITray(!showAITray)}
          >
            <AutoAwesome />
          </IconButton>
        </Tooltip>

        {/* AI Features Tray */}
        {showAITray && (
          <Paper
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 20,
              borderRadius: 2,
              boxShadow: 3,
              zIndex: 1000,
              bgcolor: 'background.paper'
            }}
          >
            <AITrayManager 
              gridState={gridState}
              onApplyPattern={handleAIPatternApply}
            />
          </Paper>
        )}

        <UserGuide open={showGuide} onClose={() => setShowGuide(false)} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
