import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Loop,
  FastForward,
  FastRewind,
  Refresh,
} from '@mui/icons-material';

// Define all available notes and their octaves
const ALL_NOTES = [
  'C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1',
  'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'
];

const DISPLAY_NOTES = [
  'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'
];

const BEATS = 16;

const NOTE_KEYS = {
  'C': 'C',
  'D': 'D',
  'E': 'E',
  'F': 'F',
  'G': 'G',
  'A': 'A',
  'B': 'B'
};

const OCTAVE_KEYS = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5'
};

const GridSequencer = ({ isDarkMode, onStateChange }) => {
  const [grid, setGrid] = useState(Array(DISPLAY_NOTES.length).fill().map(() => Array(BEATS).fill(null)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNote, setSelectedNote] = useState(null);
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      
      if (!pressedKeys.has(key)) {
        setPressedKeys(prev => {
          const newKeys = new Set(prev);
          newKeys.add(key);
          return newKeys;
        });
      }

      // Check if we have both a note and octave pressed
      const pressedNoteKey = Array.from(pressedKeys).find(k => NOTE_KEYS[k]);
      const pressedOctaveKey = Array.from(pressedKeys).find(k => OCTAVE_KEYS[k]);

      if (pressedNoteKey && pressedOctaveKey) {
        const newNote = `${pressedNoteKey}${pressedOctaveKey}`;
        setSelectedNote(newNote);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toUpperCase();
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(key);
        return newKeys;
      });

      // Clear selected note if either note or octave key is released
      if (NOTE_KEYS[key] || OCTAVE_KEYS[key]) {
        setSelectedNote(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys]);

  const toggleCell = (row, col) => {
    const newGrid = [...grid];
    
    if (!newGrid[row][col]) {
      const noteToAdd = selectedNote || DISPLAY_NOTES[row];
      newGrid[row][col] = {
        type: 'note',
        note: noteToAdd,
        velocity: 1
      };

      // Notify parent of state change
      if (onStateChange) {
        onStateChange({
          grid: newGrid,
          isPlaying,
          currentStep,
          lastAction: 'add',
          position: { row, col },
          note: noteToAdd
        });
      }
    } else {
      newGrid[row][col] = null;
      
      // Notify parent of state change
      if (onStateChange) {
        onStateChange({
          grid: newGrid,
          isPlaying,
          currentStep,
          lastAction: 'remove',
          position: { row, col }
        });
      }
    }
    setGrid(newGrid);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentStep(0);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className={`grid-sequencer ${isDarkMode ? 'dark' : 'light'}`}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary">
          {selectedNote 
            ? `Selected Note: ${selectedNote}` 
            : 'Hold a note (C-B) + number (1-5) to select a note'}
        </Typography>
      </Box>

      <div className="controls">
        <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
          <IconButton onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Stop">
          <IconButton onClick={handleStop}>
            <Stop />
          </IconButton>
        </Tooltip>
        <Tooltip title={isLooping ? 'Disable Loop' : 'Enable Loop'}>
          <IconButton onClick={() => setIsLooping(!isLooping)}>
            <Loop color={isLooping ? 'primary' : 'inherit'} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear Grid">
          <IconButton onClick={() => setGrid(Array(DISPLAY_NOTES.length).fill().map(() => Array(BEATS).fill(null)))}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>

      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            <div className="note-label">
              {DISPLAY_NOTES[rowIndex]}
              {selectedNote && (
                <span className="shortcut-hint">
                  {Array.from(pressedKeys).join('+')}
                </span>
              )}
            </div>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell ? 'active' : ''} ${
                  currentStep === colIndex ? 'current' : ''
                } ${
                  selectedNote === DISPLAY_NOTES[rowIndex] ? 'selected' : ''
                }`}
                onClick={() => toggleCell(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridSequencer;
