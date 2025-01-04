import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton, Stack, Typography, Switch, Tooltip, Fab, 
  Zoom, Slide, Paper, Drawer, Popover, Dialog, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { PlayArrowRounded, StopRounded, VolumeUp, Undo, Redo, 
  Lightbulb, MusicNote, Speed, AutoAwesome, Equalizer, Help, Fullscreen, FullscreenExit, Settings } from '@mui/icons-material';
import * as Tone from 'tone';
import Tour from 'reactour';
import DraggableTray from './DraggableTray';
import EffectsTray from './EffectsTray';
import AIFeaturesTray from './AIFeaturesTray';
import UserGuide from './UserGuide';
import PlaybackControls from './PlaybackControls';
import NoteControls from './NoteControls';
import AIMusicFeedback from './AIMusicFeedback';

const NOTES = [
  'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 
  'G3', 'F3', 'E3', 'D3', 'C3'
];

const getThemeColors = (isDark) => ({
  background: isDark ? '#1a1b1e' : '#f8f9fa',
  surface: isDark ? '#2d2d30' : '#ffffff',
  primary: '#7c4dff',
  secondary: isDark ? '#bb86fc' : '#673ab7',
  success: '#00e676',
  error: '#ff1744',
  text: isDark ? '#ffffff' : '#000000',
  textSecondary: isDark ? '#b3b3b3' : '#666666',
  border: isDark ? '#404040' : '#e0e0e0',
  noteActive: '#7c4dff',
  noteHover: '#bb86fc',
  currentStep: '#00e676'
});

export default function KittyGrid() {
  const [gridSize, setGridSize] = useState({ cols: 10, rows: 15 });
  const [grid, setGrid] = useState(() => 
    Array(gridSize.rows).fill().map(() => 
      Array(gridSize.cols).fill(false)
    )
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openTrays, setOpenTrays] = useState({
    effects: false,
    ai: false
  });
  const [showGuide, setShowGuide] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteLengths, setNoteLengths] = useState({});
  const [pitchShifts, setPitchShifts] = useState({});
  const [notePopover, setNotePopover] = useState({
    open: false,
    anchorEl: null,
    note: null
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [newGridSize, setNewGridSize] = useState({ cols: 10, rows: 15 });

  const synth = useRef(null);
  const COLORS = getThemeColors(isDarkMode);
  const [audioReady, setAudioReady] = useState(false);
  const audioContextStarted = useRef(false);

  const initializeAudio = async () => {
    try {
      if (!audioContextStarted.current) {
        await Tone.start();
        console.log("Audio context started!");
        audioContextStarted.current = true;
        
        // Create new synth
        if (!synth.current) {
          synth.current = new Tone.Synth({
            oscillator: {
              type: "triangle"
            },
            envelope: {
              attack: 0.005,
              decay: 0.1,
              sustain: 0.3,
              release: 1
            }
          }).toDestination();
          
          // Add effects
          const reverb = new Tone.Reverb(1.5).toDestination();
          const delay = new Tone.FeedbackDelay("8n", 0.1).toDestination();
          synth.current.connect(reverb);
          synth.current.connect(delay);
          
          synth.current.volume.value = -6;
        }
        setAudioReady(true);
      }
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  };

  useEffect(() => {
    const handleInteraction = async () => {
      await initializeAudio();
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (synth.current) {
        synth.current.dispose();
      }
    };
  }, []);

  const playNote = useCallback((note, duration = "8n", time) => {
    if (audioReady && synth.current) {
      try {
        const now = time || Tone.now();
        synth.current.triggerAttackRelease(note, duration, now);
        console.log(`Playing note: ${note}, duration: ${duration}`);
      } catch (error) {
        console.error("Error playing note:", error);
      }
    } else {
      console.log("Audio not ready or synth not initialized");
    }
  }, [audioReady]);

  useEffect(() => {
    if (synth.current) {
      synth.current.volume.value = Tone.gainToDb(volume);
    }
  }, [volume]);

  const addToHistory = useCallback((newGrid) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newGrid);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleCellClick = useCallback((rowIndex, colIndex, event) => {
    if (!audioReady) {
      initializeAudio();
      return;
    }

    if (event.shiftKey) {
      const key = `${rowIndex}-${colIndex}`;
      const pitchShift = pitchShifts[key] || 0;
      const length = noteLengths[key] || 1;
      const baseNote = NOTES[rowIndex];
      const noteNumber = Tone.Frequency(baseNote).toMidi();
      const shiftedNote = Tone.Frequency(noteNumber + pitchShift, "midi").toNote();

      setNotePopover({
        open: true,
        anchorEl: event.currentTarget,
        note: {
          row: rowIndex,
          col: colIndex,
          baseNote,
          shiftedNote,
          pitchShift,
          length
        }
      });
    } else {
      const newGrid = [...grid];
      newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex];
      setGrid(newGrid);
      addToHistory(newGrid);

      // Play note immediately when toggled on
      if (newGrid[rowIndex][colIndex]) {
        const key = `${rowIndex}-${colIndex}`;
        const pitchShift = pitchShifts[key] || 0;
        const baseNote = NOTES[rowIndex];
        const noteNumber = Tone.Frequency(baseNote).toMidi();
        const shiftedNote = Tone.Frequency(noteNumber + pitchShift, "midi").toNote();
        
        // Force a short delay to ensure audio context is ready
        setTimeout(() => {
          playNote(shiftedNote, "8n");
        }, 50);
      }
    }
  }, [grid, pitchShifts, audioReady, playNote, addToHistory]);

  const toggleCell = useCallback((rowIndex, colIndex) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex];
      return newGrid;
    });
    addToHistory(grid);
  }, []);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGrid(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGrid(history[historyIndex + 1]);
    }
  };

  const handleNoteSelect = (rowIndex, colIndex) => {
    setSelectedNote({ row: rowIndex, col: colIndex });
  };

  const handlePitchChange = (direction) => {
    if (!selectedNote) return;
    
    const key = `${selectedNote.row}-${selectedNote.col}`;
    const currentShift = pitchShifts[key] || 0;
    const newShift = currentShift + direction;
    
    if (newShift >= -12 && newShift <= 12) {
      setPitchShifts({
        ...pitchShifts,
        [key]: newShift
      });
    }
  };

  const handleLengthChange = (length) => {
    if (!selectedNote) return;
    
    const key = `${selectedNote.row}-${selectedNote.col}`;
    setNoteLengths({
      ...noteLengths,
      [key]: length
    });
  };

  const playStep = useCallback(() => {
    if (!isPlaying || !audioReady) return;
    
    const time = Tone.now();
    grid.forEach((row, rowIndex) => {
      if (row[currentStep % gridSize.cols]) {
        const key = `${rowIndex}-${currentStep % gridSize.cols}`;
        const pitchShift = pitchShifts[key] || 0;
        const length = noteLengths[key] || 1;
        
        const baseNote = NOTES[rowIndex];
        const noteNumber = Tone.Frequency(baseNote).toMidi();
        const shiftedNote = Tone.Frequency(noteNumber + pitchShift, "midi").toNote();
        
        playNote(shiftedNote, `${length * 0.25}n`, time);
      }
    });
    
    setCurrentStep((step) => (step + 1) % gridSize.cols);
  }, [grid, currentStep, isPlaying, pitchShifts, noteLengths, gridSize.cols, audioReady, playNote]);

  useEffect(() => {
    const interval = setInterval(playStep, (60 / tempo) * 1000);
    return () => clearInterval(interval);
  }, [playStep, tempo]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      Tone.start();
      setCurrentStep(0);
    }
  };

  const handleRewind = () => {
    setCurrentStep(0);
  };

  const handleFastForward = () => {
    setCurrentStep(gridSize.cols - 1);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const getCellSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 600) return 20; 
    if (screenWidth < 960) return 24; 
    return 28; 
  };

  const [cellSize, setCellSize] = useState(getCellSize());

  useEffect(() => {
    const handleResize = () => {
      setCellSize(getCellSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNoteClick = (event, rowIndex, colIndex) => {
    handleCellClick(rowIndex, colIndex, event);
  };

  const handlePopoverClose = () => {
    setNotePopover({
      open: false,
      anchorEl: null,
      note: null
    });
  };

  const handleGridSizeChange = () => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    setCurrentStep(0);

    const newGrid = Array(newGridSize.rows).fill().map(() => 
      Array(newGridSize.cols).fill(false)
    );

    grid.forEach((row, rowIndex) => {
      if (rowIndex < newGridSize.rows) {
        row.forEach((cell, colIndex) => {
          if (colIndex < newGridSize.cols) {
            newGrid[rowIndex][colIndex] = cell;
          }
        });
      }
    });

    setGridSize(newGridSize);
    setGrid(newGrid);
    addToHistory(newGrid);
    setShowGridSettings(false);
  };

  const NoteCell = ({ active, isCurrentStep, rowIndex, colIndex, size }) => {
    const key = `${rowIndex}-${colIndex}`;
    const pitchShift = pitchShifts[key] || 0;
    const length = noteLengths[key] || 1;
    const isSelected = selectedNote?.row === rowIndex && selectedNote?.col === colIndex;

    return (
      <Box
        onClick={(e) => handleNoteClick(e, rowIndex, colIndex)}
        sx={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: active ? COLORS.noteActive : COLORS.surface,
          opacity: 1,
          border: `2px solid ${
            isCurrentStep 
              ? COLORS.currentStep 
              : isSelected 
                ? COLORS.primary 
                : active 
                  ? COLORS.noteActive 
                  : COLORS.border
          }`,
          borderRadius: '8px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: active ? 'translateY(-2px)' : 'none',
          boxShadow: active 
            ? `0 4px 12px ${COLORS.noteActive}50`
            : 'none',
          '&:hover': {
            opacity: 1,
            backgroundColor: active ? COLORS.noteActive : COLORS.noteHover,
            transform: 'translateY(-4px)',
            boxShadow: `0 6px 16px ${COLORS.noteActive}50`
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&::after': {
            content: `"${NOTES[rowIndex]}"`,
            position: 'absolute',
            left: '50%',
            bottom: -20,
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: COLORS.textSecondary,
            opacity: 0.7
          }
        }}
      >
        {(active || isSelected) && (pitchShift !== 0 || length !== 1) && (
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: COLORS.surface,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              zIndex: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: `1px solid ${COLORS.border}`
            }}
          >
            {pitchShift !== 0 && `${pitchShift > 0 ? '+' : ''}${pitchShift}`}
            {length !== 1 && ` ${length}x`}
          </Box>
        )}
      </Box>
    );
  };

  const GridSettingsDialog = () => (
    <Dialog 
      open={showGridSettings} 
      onClose={() => setShowGridSettings(false)}
      PaperProps={{
        sx: {
          bgcolor: COLORS.surface,
          color: COLORS.text,
          minWidth: 300
        }
      }}
    >
      <DialogTitle sx={{ color: COLORS.primary }}>Grid Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Rows (1-20)"
            type="number"
            value={newGridSize.rows}
            onChange={(e) => setNewGridSize(prev => ({
              ...prev,
              rows: Math.min(20, Math.max(1, parseInt(e.target.value) || 1))
            }))}
            InputProps={{ sx: { color: COLORS.text } }}
            sx={{ 
              '& label': { color: COLORS.textSecondary },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: COLORS.border },
                '&:hover fieldset': { borderColor: COLORS.primary },
              }
            }}
          />
          <TextField
            label="Columns (1-20)"
            type="number"
            value={newGridSize.cols}
            onChange={(e) => setNewGridSize(prev => ({
              ...prev,
              cols: Math.min(20, Math.max(1, parseInt(e.target.value) || 1))
            }))}
            InputProps={{ sx: { color: COLORS.text } }}
            sx={{ 
              '& label': { color: COLORS.textSecondary },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: COLORS.border },
                '&:hover fieldset': { borderColor: COLORS.primary },
              }
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleGridSizeChange}
            sx={{ 
              bgcolor: COLORS.primary,
              '&:hover': { bgcolor: `${COLORS.primary}dd` }
            }}
          >
            Apply Changes
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      p: { xs: 1, sm: 2, md: 3 },
      bgcolor: COLORS.background,
      minHeight: '100vh',
      color: COLORS.text,
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{ 
          p: 2, 
          bgcolor: COLORS.surface,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: COLORS.text }}>
          Kitty's Music Box
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Grid Settings">
            <IconButton onClick={() => setShowGridSettings(true)}>
              <Settings sx={{ color: COLORS.secondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? (
                <FullscreenExit sx={{ color: COLORS.secondary }} />
              ) : (
                <Fullscreen sx={{ color: COLORS.secondary }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="User Guide">
            <IconButton onClick={() => setShowGuide(true)}>
              <Help sx={{ color: COLORS.secondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={() => setIsDarkMode(!isDarkMode)}>
              <Lightbulb sx={{ color: COLORS.textSecondary }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Main Content */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: isFullscreen ? '1fr' : { xs: '1fr', lg: '1fr 400px' },
        gap: 3,
        height: isFullscreen ? '100vh' : 'calc(100vh - 180px)',
        overflow: 'hidden',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1000 : 1,
        bgcolor: COLORS.background,
        p: isFullscreen ? 3 : 0
      }}>
        {/* Left Side - Grid and Controls */}
        <Stack spacing={3} sx={{ overflow: 'hidden' }}>
          {/* Grid Container */}
          <Paper
            elevation={3}
            sx={{ 
              flex: 1,
              overflow: 'hidden',
              bgcolor: COLORS.surface,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Grid Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Typography variant="h6" sx={{ color: COLORS.text }}>
                Music Grid ({gridSize.rows}×{gridSize.cols})
              </Typography>
              {selectedNote && (
                <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                  Selected: Note {selectedNote.row + 1}, Beat {selectedNote.col + 1}
                </Typography>
              )}
            </Box>

            {/* Grid Scroll Container */}
            <Box sx={{ 
              flex: 1,
              overflow: 'auto',
              p: { xs: 2, sm: 3, md: 4 },
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: `${COLORS.border}33`,
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: COLORS.border,
                borderRadius: 4,
                '&:hover': {
                  bgcolor: COLORS.secondary,
                },
              },
            }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize.cols}, ${cellSize * 1.5}px)`,
                gap: { xs: 1, sm: 2, md: 3 },
                minWidth: 'fit-content',
                '& > *': {
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }
              }}>
                {grid.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <NoteCell
                        key={`${rowIndex}-${colIndex}`}
                        active={cell}
                        isCurrentStep={colIndex === currentStep % gridSize.cols}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        size={cellSize * 1.5}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Playback Controls */}
          <Paper
            elevation={3}
            sx={{ 
              p: 3,
              bgcolor: COLORS.surface,
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`
            }}
          >
            <PlaybackControls
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              onStop={handleStop}
              onRewind={handleRewind}
              onFastForward={handleFastForward}
              tempo={tempo}
              onTempoChange={setTempo}
              volume={volume}
              onVolumeChange={setVolume}
              colors={COLORS}
            />
          </Paper>
        </Stack>

        {/* Right Side - Only show when not fullscreen */}
        {!isFullscreen && (
          <Stack 
            spacing={3} 
            sx={{ 
              display: { xs: 'none', lg: 'flex' },
              height: '100%',
              overflow: 'auto'
            }}
          >
            {/* Note Controls */}
            <Paper
              elevation={3}
              sx={{ 
                p: 3,
                bgcolor: COLORS.surface,
                borderRadius: 3,
                border: `1px solid ${COLORS.border}`
              }}
            >
              <NoteControls
                selectedNote={selectedNote}
                onPitchChange={handlePitchChange}
                onLengthChange={handleLengthChange}
                colors={COLORS}
              />
            </Paper>

            {/* AI Feedback */}
            <Paper
              elevation={3}
              sx={{ 
                p: 3,
                bgcolor: COLORS.surface,
                borderRadius: 3,
                border: `1px solid ${COLORS.border}`,
                flex: 1
              }}
            >
              <AIMusicFeedback
                grid={grid}
                colors={COLORS}
              />
            </Paper>
          </Stack>
        )}
      </Box>

      {/* Grid Settings Dialog */}
      <GridSettingsDialog />

      {/* User Guide Modal */}
      {showGuide && (
        <UserGuide onClose={() => setShowGuide(false)} />
      )}

      {/* Floating Action Buttons */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200
        }}
      >
        <Tooltip title="Effects">
          <Fab
            size="medium"
            color={openTrays.effects ? "secondary" : "primary"}
            onClick={() => setOpenTrays(prev => ({ ...prev, effects: !prev.effects }))}
            sx={{
              bgcolor: openTrays.effects ? COLORS.secondary : COLORS.primary,
              '&:hover': {
                bgcolor: openTrays.effects ? `${COLORS.secondary}dd` : `${COLORS.primary}dd`
              }
            }}
          >
            <Equalizer />
          </Fab>
        </Tooltip>
        <Tooltip title="AI Features">
          <Fab
            size="medium"
            color={openTrays.ai ? "secondary" : "primary"}
            onClick={() => setOpenTrays(prev => ({ ...prev, ai: !prev.ai }))}
            sx={{
              bgcolor: openTrays.ai ? COLORS.secondary : COLORS.primary,
              '&:hover': {
                bgcolor: openTrays.ai ? `${COLORS.secondary}dd` : `${COLORS.primary}dd`
              }
            }}
          >
            <AutoAwesome />
          </Fab>
        </Tooltip>
      </Stack>

      {/* Draggable Trays */}
      {openTrays.effects && (
        <DraggableTray
          title="Effects"
          onClose={() => setOpenTrays(prev => ({ ...prev, effects: false }))}
          defaultPosition={{ x: 20, y: 20 }}
          style={{ zIndex: 1300 }}
        >
          <EffectsTray synth={synth} />
        </DraggableTray>
      )}

      {openTrays.ai && (
        <DraggableTray
          title="AI Features"
          onClose={() => setOpenTrays(prev => ({ ...prev, ai: false }))}
          defaultPosition={{ x: window.innerWidth - 320, y: 20 }}
          style={{ zIndex: 1300 }}
        >
          <AIFeaturesTray
            onApplyPattern={(pattern) => {
              const newGrid = [...grid];
              const rowIndex = 0; 
              pattern.forEach((value, colIndex) => {
                if (colIndex < gridSize.cols) {
                  newGrid[rowIndex][colIndex] = value;
                }
              });
              setGrid(newGrid);
              addToHistory(newGrid);
            }}
          />
        </DraggableTray>
      )}
      
      {/* Note Details Popover */}
      <Popover
        open={notePopover.open}
        anchorEl={notePopover.anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            p: 2,
            bgcolor: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 2,
            maxWidth: 300
          }
        }}
      >
        {notePopover.note && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.primary }}>
              Note Details
            </Typography>
            
            <Stack spacing={0.5}>
              <Typography variant="body2">
                <strong>Position:</strong> Row {notePopover.note.row + 1}, Beat {notePopover.note.col + 1}
              </Typography>
              <Typography variant="body2">
                <strong>Base Note:</strong> {notePopover.note.baseNote}
              </Typography>
              <Typography variant="body2">
                <strong>Shifted Note:</strong> {notePopover.note.shiftedNote}
                {notePopover.note.pitchShift !== 0 && ` (${notePopover.note.pitchShift > 0 ? '+' : ''}${notePopover.note.pitchShift})`}
              </Typography>
              <Typography variant="body2">
                <strong>Length:</strong> {notePopover.note.length}x
              </Typography>
            </Stack>

            <Box sx={{ 
              mt: 1, 
              p: 1, 
              bgcolor: `${COLORS.secondary}11`,
              borderRadius: 1,
              border: `1px dashed ${COLORS.secondary}44`
            }}>
              <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
                Tip: Click to toggle note, Shift+Click for details
              </Typography>
            </Box>
          </Stack>
        )}
      </Popover>
    </Box>
  );
}
