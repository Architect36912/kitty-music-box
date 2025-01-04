import React, { useState, useEffect, useCallback } from 'react';
import {
  PlayArrow, Pause, Stop, SkipPrevious, SkipNext,
  Settings, Refresh, Help, LightMode, DarkMode,
  VolumeUp, Speed
} from '@mui/icons-material';
import { IconButton, Slider, Tooltip } from '@mui/material';
import GridSequencer from './GridSequencer';
import KittySynth from './KittySynth';
import KittyTour from './KittyTour';
import AITrayManager from './AITrayManager';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(75);
  const [selectedInstrument, setSelectedInstrument] = useState('marimba');
  const [isTourOpen, setIsTourOpen] = useState(true);
  const [gridState, setGridState] = useState(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    // Add stop logic
  };

  const handleGridStateChange = useCallback((newState) => {
    setGridState(newState);
  }, []);

  const handlePatternApply = useCallback((pattern) => {
    // Apply the AI-generated pattern to the grid
    if (pattern) {
      // Update grid with new pattern
      console.log('Applying pattern:', pattern);
    }
  }, []);

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="title">SONG MAKER</div>
        <div className="controls">
          <Tooltip title="Restart">
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help">
            <IconButton onClick={() => setIsTourOpen(true)}>
              <Help />
            </IconButton>
          </Tooltip>
          <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton 
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Grid Sequencer */}
        <div className="sequencer-panel">
          <div className="instrument-selector">
            <button 
              className={selectedInstrument === 'marimba' ? 'active' : ''}
              onClick={() => setSelectedInstrument('marimba')}
            >
              Marimba
            </button>
            <button 
              className={selectedInstrument === 'electronic' ? 'active' : ''}
              onClick={() => setSelectedInstrument('electronic')}
            >
              Electronic
            </button>
          </div>

          <div className="grid-sequencer">
            <GridSequencer 
              isDarkMode={isDarkMode} 
              onStateChange={handleGridStateChange}
            />
          </div>

          {/* Playback Controls */}
          <div className="playback-controls">
            <IconButton>
              <SkipPrevious />
            </IconButton>
            <IconButton className="play-button" onClick={handlePlayPause}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={handleStop}>
              <Stop />
            </IconButton>
            <IconButton>
              <SkipNext />
            </IconButton>
          </div>

          {/* Tempo Control */}
          <div className="slider-control">
            <Speed />
            <label>Tempo</label>
            <Slider
              value={tempo}
              onChange={(e, newValue) => setTempo(newValue)}
              min={60}
              max={200}
            />
            <div className="value">{tempo} BPM</div>
          </div>

          {/* Volume Control */}
          <div className="slider-control">
            <VolumeUp />
            <label>Volume</label>
            <Slider
              value={volume}
              onChange={(e, newValue) => setVolume(newValue)}
              min={0}
              max={100}
            />
            <div className="value">{volume}%</div>
          </div>
        </div>

        {/* Synth Panel */}
        <div className="synth-panel">
          <KittySynth isDarkMode={isDarkMode} />
        </div>
      </main>

      {/* AI Tray Manager */}
      <AITrayManager 
        gridState={gridState}
        onApplyPattern={handlePatternApply}
      />

      {/* Tour Guide */}
      <KittyTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
