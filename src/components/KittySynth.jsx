import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import * as Tone from 'tone';

const KittySynth = ({ isDarkMode }) => {
  const [synth, setSynth] = useState(null);
  const [oscillatorType, setOscillatorType] = useState('sine');
  const [volume, setVolume] = useState(-12);
  const [filterFreq, setFilterFreq] = useState(1000);
  const [reverb, setReverb] = useState(0.5);

  useEffect(() => {
    // Create synth with effects chain
    const newSynth = new Tone.Synth({
      oscillator: {
        type: oscillatorType
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 1
      }
    });

    // Create effects
    const filter = new Tone.Filter(filterFreq, "lowpass");
    const reverbEffect = new Tone.Reverb(reverb);
    const vol = new Tone.Volume(volume);

    // Connect effects chain
    newSynth.chain(filter, reverbEffect, vol, Tone.Destination);
    setSynth(newSynth);

    return () => {
      if (newSynth) {
        newSynth.dispose();
      }
    };
  }, [oscillatorType]);

  // Update synth parameters
  useEffect(() => {
    if (synth) {
      synth.volume.value = volume;
    }
  }, [volume, synth]);

  useEffect(() => {
    if (synth) {
      synth.oscillator.type = oscillatorType;
    }
  }, [oscillatorType, synth]);

  const handleNotePress = (note) => {
    if (synth) {
      synth.triggerAttackRelease(note, "8n");
    }
  };

  const renderKey = (note, color = 'white', width = '60px') => (
    <Box
      onClick={() => handleNotePress(note)}
      sx={{
        width,
        height: '150px',
        backgroundColor: color === 'white' ? 
          (isDarkMode ? '#ffffff' : '#f0f0f0') : 
          (isDarkMode ? '#333333' : '#666666'),
        border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pb: 2,
        borderRadius: '0 0 4px 4px',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: color === 'white' ? 
            (isDarkMode ? '#ff69b4' : '#ffb6c1') : 
            (isDarkMode ? '#ff1493' : '#ff69b4'),
        },
        '&:active': {
          transform: 'translateY(2px)',
        }
      }}
    >
      <Typography color={color === 'white' ? 'black' : 'white'}>
        {note}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, color: isDarkMode ? 'white' : 'black' }}>
        🎹 Kitty Synth Controls
      </Typography>

      {/* Synth Controls */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: isDarkMode ? 'white' : 'black' }}>
            Waveform
          </InputLabel>
          <Select
            value={oscillatorType}
            onChange={(e) => setOscillatorType(e.target.value)}
            sx={{
              color: isDarkMode ? 'white' : 'black',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <MenuItem value="sine">Sine</MenuItem>
            <MenuItem value="square">Square</MenuItem>
            <MenuItem value="triangle">Triangle</MenuItem>
            <MenuItem value="sawtooth">Sawtooth</MenuItem>
          </Select>
        </FormControl>

        <Typography sx={{ color: isDarkMode ? 'white' : 'black', mb: 1 }}>
          Volume: {volume}dB
        </Typography>
        <Slider
          value={volume}
          onChange={(_, value) => setVolume(value)}
          min={-60}
          max={0}
          sx={{ mb: 2 }}
        />

        <Typography sx={{ color: isDarkMode ? 'white' : 'black', mb: 1 }}>
          Filter: {filterFreq}Hz
        </Typography>
        <Slider
          value={filterFreq}
          onChange={(_, value) => setFilterFreq(value)}
          min={20}
          max={20000}
          sx={{ mb: 2 }}
        />

        <Typography sx={{ color: isDarkMode ? 'white' : 'black', mb: 1 }}>
          Reverb: {reverb}
        </Typography>
        <Slider
          value={reverb}
          onChange={(_, value) => setReverb(value)}
          min={0}
          max={1}
          step={0.1}
        />
      </Box>

      {/* Piano Keys */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        mb: 2
      }}>
        {renderKey('C4')}
        {renderKey('D4')}
        {renderKey('E4')}
        {renderKey('F4')}
        {renderKey('G4')}
        {renderKey('A4')}
        {renderKey('B4')}
        {renderKey('C5')}
      </Box>
    </Box>
  );
};

export default KittySynth;
