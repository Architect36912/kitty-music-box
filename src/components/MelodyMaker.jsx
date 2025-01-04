import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  Grid, 
  Slider, 
  Typography,
  IconButton,
  useTheme 
} from '@mui/material';
import { 
  PlayArrow, 
  Stop, 
  Refresh,
  Save,
  MusicNote
} from '@mui/icons-material';
import * as Tone from 'tone';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function MelodyMaker() {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [melody, setMelody] = useState([]);
  const [tempo, setTempo] = useState(120);
  const [scale, setScale] = useState('major');

  const scales = {
    major: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    minor: ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'],
    pentatonic: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
  };

  const generateMelody = () => {
    const notes = scales[scale];
    const newMelody = Array(8).fill().map(() => ({
      note: notes[Math.floor(Math.random() * notes.length)],
      duration: ['8n', '4n', '2n'][Math.floor(Math.random() * 2)],
    }));
    setMelody(newMelody);
    return newMelody;
  };

  const playMelody = async () => {
    if (!isPlaying && melody.length > 0) {
      setIsPlaying(true);
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      synth.volume.value = -10;
      
      await Tone.start();
      Tone.Transport.bpm.value = tempo;
      
      const now = Tone.now();
      let time = 0;
      
      melody.forEach((note) => {
        synth.triggerAttackRelease(
          note.note, 
          note.duration, 
          now + time
        );
        time += Tone.Time(note.duration).toSeconds();
      });

      setTimeout(() => setIsPlaying(false), time * 1000 + 500);
    }
  };

  const stopPlaying = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: theme.palette.primary.main }}>
        Melody Maker 🎵
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            p: 2, 
            mb: 3,
            background: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.primary.main}20`,
          }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={generateMelody}
                disabled={isPlaying}
              >
                Generate New Melody
              </Button>
              <IconButton 
                color="primary" 
                onClick={playMelody}
                disabled={isPlaying || melody.length === 0}
              >
                <PlayArrow />
              </IconButton>
              <IconButton 
                color="secondary" 
                onClick={stopPlaying}
                disabled={!isPlaying}
              >
                <Stop />
              </IconButton>
              <IconButton color="primary" disabled={melody.length === 0}>
                <Save />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {melody.map((note, index) => (
                <MotionBox
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  sx={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    color: 'white',
                  }}
                >
                  <MusicNote />
                  <Typography variant="body2">{note.note}</Typography>
                  <Typography variant="caption">{note.duration}</Typography>
                </MotionBox>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 2,
            background: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.primary.main}20`,
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Settings
            </Typography>
            
            <Typography gutterBottom>Tempo: {tempo} BPM</Typography>
            <Slider
              value={tempo}
              onChange={(e, newValue) => {
                setTempo(newValue);
                Tone.Transport.bpm.value = newValue;
              }}
              min={60}
              max={180}
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Scale</Typography>
            <Grid container spacing={1}>
              {Object.keys(scales).map((scaleType) => (
                <Grid item key={scaleType}>
                  <Button
                    variant={scale === scaleType ? 'contained' : 'outlined'}
                    onClick={() => setScale(scaleType)}
                    size="small"
                  >
                    {scaleType}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MelodyMaker;
