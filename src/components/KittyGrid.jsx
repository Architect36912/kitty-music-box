import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Slider, Typography, Stack, Button, Tooltip, Chip, useTheme, useMediaQuery } from '@mui/material';
import { 
  PlayArrow, Stop, Settings, Save, 
  AutoFixHigh, EmojiEvents, Lock, LockOpen,
  Pets, Close, Menu
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tone from 'tone';

// Cat face grid regions
const CAT_REGIONS = {
  leftEar: { startRow: 0, endRow: 4, startCol: 4, endCol: 12 },
  rightEar: { startRow: 0, endRow: 4, startCol: 20, endCol: 28 },
  leftEye: { startRow: 5, endRow: 7, startCol: 8, endCol: 12 },
  rightEye: { startRow: 5, endRow: 7, startCol: 20, endCol: 24 },
  nose: { startRow: 8, endRow: 9, startCol: 15, endCol: 17 },
  mouth: { startRow: 10, endRow: 12, startCol: 13, endCol: 19 },
  whiskers: { startRow: 9, endRow: 12, startCol: 0, endCol: 32 },
};

const GRID_PRESETS = [
  { name: 'Default', cols: 16, rows: 8, icon: '🐱' },
  { name: 'Wide', cols: 24, rows: 8, icon: '😺' },
  { name: 'Large', cols: 32, rows: 16, icon: '😸' },
];

const NOTES = [
  'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'
];

const TASKS = [
  { id: 'create_melody', title: 'Create a Melody', points: 100 },
  { id: 'use_ai', title: 'Use AI Generation', points: 150 },
  { id: 'make_groovy', title: 'Make it Groovy', points: 200 },
  { id: 'save_work', title: 'Save Your Work', points: 50 },
];

const getCellColor = (isActive, region) => {
  const colors = {
    leftEar: '#ff69b4',
    rightEar: '#ff69b4',
    leftEye: '#4fc3f7',
    rightEye: '#4fc3f7',
    nose: '#ff4081',
    mouth: '#ff80ab',
    whiskers: '#b39ddb',
    default: '#ff69b4'
  };
  return isActive ? colors[region] || colors.default : 'rgba(255,255,255,0.1)';
};

const NoteCell = ({ active, isCurrentStep, rowIndex, colIndex, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const note = NOTES[rowIndex];
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Box
        onClick={onClick}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: active 
            ? isCurrentStep 
              ? '#ff1493' 
              : '#ff69b4'
            : isCurrentStep 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 10px rgba(255, 105, 180, 0.5)',
          }
        }}
      />
      {showTooltip && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '4px solid transparent',
              borderTopColor: 'rgba(0, 0, 0, 0.8)',
            }
          }}
        >
          {note}
        </Box>
      )}
    </Box>
  );
};

const KittyGrid = () => {
  const [gridSize, setGridSize] = useState(GRID_PRESETS[0]); // Start with Default size
  const [grid, setGrid] = useState(Array(gridSize.rows).fill().map(() => Array(gridSize.cols).fill(false)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [synth, setSynth] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState('marimba');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [score, setScore] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [catMood, setCatMood] = useState('happy'); // 'happy', 'sleepy', 'excited'
  const [showGridSettings, setShowGridSettings] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const newGrid = Array(8).fill().map(() => Array(16).fill(false));
    setGrid(newGrid);
    setGridSize({ cols: 16, rows: 8 });
  }, []);

  // Initialize synth with better settings
  useEffect(() => {
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: selectedInstrument === 'marimba' ? 'triangle' : 'square',
        volume: -8 // Lower volume to prevent clipping
      },
      envelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.2,
        release: 1
      }
    }).toDestination();

    // Add effects for better sound
    const reverb = new Tone.Reverb({
      decay: 2,
      wet: 0.2
    }).toDestination();

    newSynth.connect(reverb);
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
      reverb.dispose();
    };
  }, [selectedInstrument]);

  // Update cat mood based on grid activity
  useEffect(() => {
    const activeNotes = grid.flat().filter(Boolean).length;
    const totalCells = grid.length * grid[0].length;
    const activity = activeNotes / totalCells;

    if (activity > 0.3) {
      setCatMood('excited');
    } else if (activity < 0.1) {
      setCatMood('sleepy');
    } else {
      setCatMood('happy');
    }
  }, [grid]);

  // Get cell style based on position and state
  const getCellStyle = (row, col, isActive) => {
    let region = 'default';
    let style = {
      bgcolor: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      transform: 'scale(1)',
    };

    // Check which region the cell belongs to
    Object.entries(CAT_REGIONS).forEach(([name, bounds]) => {
      if (
        row >= bounds.startRow && row <= bounds.endRow &&
        col >= bounds.startCol && col <= bounds.endCol
      ) {
        region = name;
      }
    });

    // Apply special styles based on region and state
    if (isActive) {
      style.bgcolor = getCellColor(true, region);
      style.border = `1px solid ${getCellColor(true, region)}`;
      style.transform = 'scale(1.1)';
    }

    // Special effects for cat features
    if (region === 'leftEye' || region === 'rightEye') {
      style.borderRadius = '50%';
      if (catMood === 'excited') {
        style.transform = 'scale(1.2)';
      } else if (catMood === 'sleepy') {
        style.transform = 'scale(0.8)';
      }
    }

    return style;
  };

  // Sequencer logic
  useEffect(() => {
    if (isPlaying) {
      // Start audio context on first play
      if (Tone.context.state !== 'running') {
        Tone.start();
      }

      const interval = Tone.Transport.scheduleRepeat((time) => {
        setCurrentStep((prev) => (prev + 1) % gridSize.cols);
        
        grid.forEach((row, rowIndex) => {
          if (row[currentStep] && rowIndex < NOTES.length) {
            // Add slight velocity variation for more natural sound
            const velocity = 0.7 + Math.random() * 0.3;
            synth?.triggerAttackRelease(NOTES[rowIndex], '8n', time, velocity);
          }
        });
      }, '8n');

      Tone.Transport.start();
      Tone.Transport.bpm.value = tempo;

      return () => {
        Tone.Transport.clear(interval);
        Tone.Transport.stop();
      };
    }
  }, [isPlaying, grid, currentStep, tempo, synth, gridSize.cols]);

  const toggleCell = (row, col) => {
    if (isLocked) return;
    
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });

    // Check for task completion
    if (!completedTasks.includes('create_melody')) {
      setCompletedTasks(prev => [...prev, 'create_melody']);
      setScore(prev => prev + 100);
    }
  };

  const togglePlayback = async () => {
    try {
      // Ensure audio context is running
      await Tone.start();
      console.log("Audio context started:", Tone.context.state);
      
      setIsPlaying(!isPlaying);
      
      if (!isPlaying) {
        // Reset step when starting playback
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Error starting audio context:", error);
    }
  };

  const generateAISuggestion = () => {
    // Simulate AI suggestion
    const suggestion = Array(gridSize.rows).fill().map(() => 
      Array(gridSize.cols).fill().map(() => Math.random() > 0.8)
    );
    setAiSuggestions(suggestion);
    setShowSuggestions(true);

    if (!completedTasks.includes('use_ai')) {
      setCompletedTasks(prev => [...prev, 'use_ai']);
      setScore(prev => prev + 150);
    }
  };

  const playTestSound = async () => {
    try {
      await Tone.start();
      synth?.triggerAttackRelease('C4', '8n', Tone.now(), 0.9);
    } catch (error) {
      console.error("Error playing test sound:", error);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Cat Mood Indicator */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#ff69b4' }}>
          {catMood === 'excited' && '😺 Excited!'}
          {catMood === 'happy' && '😊 Happy'}
          {catMood === 'sleepy' && '😴 Sleepy'}
        </Typography>
      </Box>

      {/* Controls */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ 
          mb: 4,
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={togglePlayback}
          startIcon={isPlaying ? <Stop /> : <PlayArrow />}
          sx={{
            background: 'linear-gradient(45deg, #ff69b4, #ff1493)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ff4081, #ff1493)',
            },
          }}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>

        <Box sx={{ minWidth: 200 }}>
          <Typography gutterBottom>Tempo: {tempo} BPM</Typography>
          <Slider
            value={tempo}
            onChange={(e, newValue) => setTempo(newValue)}
            min={60}
            max={200}
            sx={{ color: '#ff69b4' }}
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <Button 
            variant={selectedInstrument === 'marimba' ? 'contained' : 'outlined'}
            onClick={() => setSelectedInstrument('marimba')}
          >
            Marimba
          </Button>
          <Button 
            variant={selectedInstrument === 'electronic' ? 'contained' : 'outlined'}
            onClick={() => setSelectedInstrument('electronic')}
          >
            Electronic
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setIsLocked(!isLocked)}>
            {isLocked ? <Lock /> : <LockOpen />}
          </IconButton>
          <IconButton onClick={generateAISuggestion}>
            <AutoFixHigh />
          </IconButton>
          <IconButton onClick={() => setShowGridSettings(true)}>
            <Settings />
          </IconButton>
        </Stack>
      </Stack>

      {/* Grid Container */}
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          mx: 'auto',
          mt: { xs: 4, sm: 6 },
          mb: { xs: 4, sm: 2 },
          px: { xs: 1, sm: 2, md: 4 },
        }}
      >
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gap: { xs: 0.2, sm: 0.3, md: 0.5 },
            bgcolor: 'background.paper',
            p: { xs: 1, sm: 2 },
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            position: 'relative',
            aspectRatio: '2/1',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(255,105,180,0.1) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none',
            }
          }}
        >
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <NoteCell
                key={`${rowIndex}-${colIndex}`}
                active={cell}
                isCurrentStep={colIndex === currentStep}
                rowIndex={rowIndex}
                colIndex={colIndex}
                onClick={() => toggleCell(rowIndex, colIndex)}
              />
            ))
          ))}
        </Box>
      </Box>

      {/* Tasks Panel */}
      <Box 
        sx={{ 
          position: 'fixed',
          right: 20,
          top: 100,
          width: { xs: '100%', sm: 200 },
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          p: 2,
          zIndex: 100,
          display: { xs: 'none', md: 'block' },
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#ff69b4' }}>
          Tasks
        </Typography>
        <Stack spacing={1}>
          {TASKS.map(task => (
            <Chip
              key={task.id}
              label={task.title}
              icon={completedTasks.includes(task.id) ? <EmojiEvents /> : undefined}
              color={completedTasks.includes(task.id) ? 'success' : 'default'}
              sx={{ 
                opacity: completedTasks.includes(task.id) ? 0.7 : 1,
                bgcolor: completedTasks.includes(task.id) ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                '& .MuiChip-icon': {
                  color: '#ffd700',
                },
              }}
            />
          ))}
        </Stack>
        <Typography variant="h6" sx={{ mt: 2, color: '#ff69b4' }}>
          Score: {score}
        </Typography>
      </Box>

      {/* AI Suggestions Overlay */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={() => setShowSuggestions(false)}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  p: 4,
                  borderRadius: 2,
                  maxWidth: 400,
                }}
                onClick={e => e.stopPropagation()}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  AI Suggestion
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setGrid(aiSuggestions);
                    setShowSuggestions(false);
                  }}
                >
                  Apply Suggestion
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Sound Button */}
      <Button
        variant="contained"
        onClick={playTestSound}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #ff69b4, #ff1493)',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff4081, #ff1493)',
          },
        }}
      >
        Test Sound
      </Button>
    </Box>
  );
};

export default KittyGrid;
