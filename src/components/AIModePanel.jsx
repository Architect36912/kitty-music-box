import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Slider,
  Typography,
  Card,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Save,
  Download,
  Refresh,
  MusicNote,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AIMusicGenerator from '../services/aiMusicGenerator';

const styles = {
  control: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  slider: {
    '& .MuiSlider-thumb': {
      width: 24,
      height: 24,
      backgroundColor: '#fff',
      '&:before': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
      },
      '&:hover, &.Mui-focusVisible, &.Mui-active': {
        boxShadow: 'none',
      },
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
    },
  },
};

const AIModePanel = () => {
  const [generator] = useState(() => new AIMusicGenerator());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentComposition, setCurrentComposition] = useState(null);
  const [player, setPlayer] = useState(null);
  const [style, setStyle] = useState('electronic');
  const [complexity, setComplexity] = useState(0.7);
  const [effects, setEffects] = useState({
    reverb: 0.3,
    delay: 0.2,
    chorus: 0.3,
    distortion: 0.1,
  });

  useEffect(() => {
    return () => {
      if (player) {
        player.stop();
      }
    };
  }, [player]);

  const handleGenerateClick = () => {
    const composition = generator.generateMelody(style, complexity);
    setCurrentComposition(composition);
  };

  const handlePlayClick = async () => {
    if (isPlaying && player) {
      player.stop();
      setIsPlaying(false);
      return;
    }

    if (currentComposition) {
      setIsPlaying(true);
      const newPlayer = await generator.playMelody(currentComposition);
      setPlayer(newPlayer);
    }
  };

  const handleEffectChange = (effect, value) => {
    setEffects(prev => ({ ...prev, [effect]: value }));
    generator.setEffectLevel(effect, value);
  };

  const handleSave = async () => {
    if (currentComposition) {
      const midi = await generator.exportToMIDI(currentComposition);
      // Implementation for saving MIDI file
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Style Selection */}
        <Card sx={styles.control}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Style & Complexity
          </Typography>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <Select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="electronic">Electronic</MenuItem>
                <MenuItem value="jazz">Jazz</MenuItem>
                <MenuItem value="pop">Pop</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography gutterBottom>Complexity</Typography>
              <Slider
                value={complexity}
                onChange={(e, value) => setComplexity(value)}
                min={0}
                max={1}
                step={0.1}
                sx={styles.slider}
              />
            </Box>
          </Stack>
        </Card>

        {/* Effects Controls */}
        <Card sx={{ ...styles.control, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Effects
          </Typography>
          <Stack spacing={3}>
            {Object.entries(effects).map(([effect, value]) => (
              <Box key={effect}>
                <Typography gutterBottom>
                  {effect.charAt(0).toUpperCase() + effect.slice(1)}
                </Typography>
                <Slider
                  value={value}
                  onChange={(e, val) => handleEffectChange(effect, val)}
                  min={0}
                  max={1}
                  step={0.1}
                  sx={styles.slider}
                />
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Playback Controls */}
        <Card sx={{ ...styles.control, mt: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<MusicNote />}
              onClick={handleGenerateClick}
              sx={{
                background: 'linear-gradient(45deg, #ff69b4, #9c27b0)',
                color: 'white',
              }}
            >
              Generate New
            </Button>
            <IconButton
              size="large"
              onClick={handlePlayClick}
              sx={{
                color: isPlaying ? '#ff4081' : '#4caf50',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {isPlaying ? <Stop /> : <PlayArrow />}
            </IconButton>
            <IconButton
              size="large"
              onClick={handleSave}
              disabled={!currentComposition}
              sx={{
                color: '#2196f3',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Save />
            </IconButton>
          </Stack>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AIModePanel;
