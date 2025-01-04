import React, { useState } from 'react';
import { 
  IconButton, 
  Tooltip,
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

const NOTES = [
  { note: 'C4', display: 'C4' },
  { note: 'B3', display: 'B3' },
  { note: 'A3', display: 'A3' },
  { note: 'G3', display: 'G3' },
  { note: 'F3', display: 'F3' },
  { note: 'E3', display: 'E3' },
  { note: 'D3', display: 'D3' },
  { note: 'C3', display: 'C3' },
  { note: 'Hi-Hat', display: 'Hi-Hat' }
];

const BEATS = 16;

const GridSequencer = () => {
  const [grid, setGrid] = useState(Array(NOTES.length).fill().map(() => Array(BEATS).fill(null)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const toggleCell = (row, col) => {
    const newGrid = [...grid];
    if (!newGrid[row][col]) {
      const noteNumber = (row % 6) + 1;
      newGrid[row][col] = { type: 'melodic', number: noteNumber };
    } else {
      newGrid[row][col] = null;
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
    <div className="app-container">
      <div className="title-bar">
        <h1>PROJECT 3000</h1>
      </div>
      
      <div className="controls-bar">
        <Tooltip title="Previous Beat">
          <IconButton onClick={() => setCurrentStep((prev) => (prev - 1 + BEATS) % BEATS)}>
            <FastRewind />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isPlaying ? "Pause" : "Play"}>
          <IconButton className="play-button" onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Stop">
          <IconButton onClick={handleStop}>
            <Stop />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Next Beat">
          <IconButton onClick={() => setCurrentStep((prev) => (prev + 1) % BEATS)}>
            <FastForward />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear Grid">
          <IconButton onClick={() => setGrid(Array(NOTES.length).fill().map(() => Array(BEATS).fill(null)))}>
            <Refresh />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isLooping ? "Loop On" : "Loop Off"}>
          <IconButton 
            onClick={() => setIsLooping(!isLooping)}
            color={isLooping ? "primary" : "default"}
          >
            <Loop />
          </IconButton>
        </Tooltip>
      </div>

      <div className="grid-section">
        <div className="note-labels">
          {NOTES.map((note, index) => (
            <div key={index} className="note-label">
              {note.display}
            </div>
          ))}
        </div>

        <div className="grid-container">
          <div className="beat-numbers">
            {Array(BEATS).fill().map((_, i) => (
              <div key={i} className="beat-number">
                {i + 1}
              </div>
            ))}
          </div>

          <div className="grid">
            {grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <Tooltip 
                  key={`${rowIndex}-${colIndex}`}
                  title={`${NOTES[rowIndex].display} - Beat ${colIndex + 1}`}
                  placement="top"
                >
                  <div
                    className={`cell ${cell ? `${cell.type} note-${cell.number}` : ''} ${colIndex === currentStep ? 'current' : ''}`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                    role="button"
                    aria-label={`${NOTES[rowIndex].display} - Beat ${colIndex + 1}`}
                  />
                </Tooltip>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridSequencer;
