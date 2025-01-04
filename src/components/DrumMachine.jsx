import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  Grid, 
  Slider, 
  Typography,
  IconButton,
  useTheme,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  PlayArrow, 
  Stop, 
  Refresh,
  Save,
  Share,
  Add,
  Remove,
  AutoAwesome,
  Settings
} from '@mui/icons-material';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

function DrumMachine() {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [pattern, setPattern] = useState([]);
  const [tempo, setTempo] = useState(120);
  const [steps, setSteps] = useState(8);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiMode, setAiMode] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Initialize drum sounds with proper gain control
  const drumSounds = {
    kick: new Tone.MembraneSynth({
      volume: -6,
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
      }
    }).chain(new Tone.Gain(0.8).toDestination()),
    
    snare: new Tone.NoiseSynth({
      volume: -8,
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0
      }
    }).chain(new Tone.Gain(0.7).toDestination()),
    
    hihat: new Tone.MetalSynth({
      volume: -12,
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0.01
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).chain(new Tone.Gain(0.6).toDestination()),
    
    clap: new Tone.NoiseSynth({
      volume: -10,
      noise: { type: 'pink' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0
      }
    }).chain(new Tone.Gain(0.7).toDestination()),
    
    tom: new Tone.MembraneSynth({
      volume: -8,
      pitchDecay: 0.05,
      octaves: 2,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0
      }
    }).chain(new Tone.Gain(0.8).toDestination())
  };

  // Initialize effects
  const reverb = new Tone.Reverb({
    decay: 1.5,
    wet: 0.2
  }).toDestination();

  const delay = new Tone.PingPongDelay({
    delayTime: "8n",
    feedback: 0.2,
    wet: 0.1
  }).toDestination();

  // Add effects to certain drums
  drumSounds.snare.connect(reverb);
  drumSounds.clap.connect(reverb);
  drumSounds.hihat.connect(delay);

  // Play test sound function
  const playTestSound = (drum) => {
    if (Tone.context.state !== 'running') {
      Tone.start();
    }
    
    if (drum === 'kick') {
      drumSounds[drum].triggerAttackRelease('C1', '8n', undefined, 1);
    } else if (drum === 'tom') {
      drumSounds[drum].triggerAttackRelease('G1', '8n', undefined, 0.8);
    } else if (drum === 'hihat') {
      drumSounds[drum].triggerAttackRelease('32n', undefined, 0.6);
    } else if (drum === 'clap') {
      drumSounds[drum].triggerAttackRelease('16n', undefined, 0.7);
    } else {
      drumSounds[drum].triggerAttackRelease('8n', undefined, 0.9);
    }
  };

  const generatePattern = () => {
    if (aiMode) {
      // AI-generated pattern based on current tempo and style
      const complexity = tempo > 140 ? 0.7 : 0.5;
      const newPattern = Array(steps).fill().map(() => ({
        kick: Math.random() > 0.7,
        snare: Math.random() > 0.7,
        hihat: Math.random() > 0.5,
        clap: Math.random() > 0.8,
        tom: Math.random() > 0.8
      }));
      setPattern(newPattern);
      return newPattern;
    } else {
      // Empty pattern for manual creation
      const newPattern = Array(steps).fill().map(() => ({
        kick: false,
        snare: false,
        hihat: false,
        clap: false,
        tom: false
      }));
      setPattern(newPattern);
      return newPattern;
    }
  };

  // Initialize Tone.js
  useEffect(() => {
    // Start audio context on user interaction
    const initAudio = async () => {
      await Tone.start();
      Tone.Transport.bpm.value = tempo;
    };
    
    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

  // Update audio when sound kit changes
  useEffect(() => {
    const updateSoundKit = () => {
      if (selectedSound === 'acoustic') {
        drumSounds.kick.set({
          pitchDecay: 0.1,
          octaves: 6,
          oscillator: { type: 'triangle' }
        });
        drumSounds.snare.set({
          noise: { type: 'pink' },
          envelope: { decay: 0.1, sustain: 0 }
        });
        drumSounds.hihat.set({
          frequency: 2000,
          envelope: { decay: 0.05 }
        });
      } else if (selectedSound === '808') {
        drumSounds.kick.set({
          pitchDecay: 0.2,
          octaves: 4,
          oscillator: { type: 'sine' }
        });
        drumSounds.snare.set({
          noise: { type: 'white' },
          envelope: { decay: 0.2, sustain: 0 }
        });
        drumSounds.hihat.set({
          frequency: 1000,
          envelope: { decay: 0.1 }
        });
      }
      // Default electronic kit settings are already set
    };
    
    updateSoundKit();
  }, [selectedSound]);

  // Play pattern with proper timing
  const playPattern = async () => {
    if (!isPlaying && pattern.length > 0) {
      setIsPlaying(true);
      
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
      
      Tone.Transport.bpm.value = tempo;
      
      const repeat = (time) => {
        const step = pattern[currentStep];
        
        Object.entries(step).forEach(([drum, isActive]) => {
          if (isActive) {
            if (drum === 'kick') {
              drumSounds[drum].triggerAttackRelease('C1', '8n', time, 1);
            } else if (drum === 'tom') {
              drumSounds[drum].triggerAttackRelease('G1', '8n', time, 0.8);
            } else if (drum === 'hihat') {
              drumSounds[drum].triggerAttackRelease('32n', time, 0.6);
            } else if (drum === 'clap') {
              drumSounds[drum].triggerAttackRelease('16n', time, 0.7);
            } else {
              drumSounds[drum].triggerAttackRelease('8n', time, 0.9);
            }
          }
        });
        
        setCurrentStep((prev) => (prev + 1) % steps);
      };
      
      Tone.Transport.scheduleRepeat(repeat, '8n');
      Tone.Transport.start();
    }
  };

  const stopPlaying = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepChange = (drumType, stepIndex) => {
    const newPattern = [...pattern];
    newPattern[stepIndex] = {
      ...newPattern[stepIndex],
      [drumType]: !newPattern[stepIndex][drumType]
    };
    setPattern(newPattern);
  };

  const handleSoundMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSoundSelect = (sound) => {
    setSelectedSound(sound);
    setAnchorEl(null);
  };

  useEffect(() => {
    generatePattern();
  }, [steps]);

  return (
    <Box>
      <Typography variant="h4" className="neon-text" sx={{ mb: 4 }}>
        Drum Machine 🥁
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AutoAwesome />}
                onClick={generatePattern}
                disabled={isPlaying}
              >
                {aiMode ? 'Generate Pattern' : 'Clear Pattern'}
              </Button>
              <IconButton 
                color="primary" 
                onClick={playPattern}
                disabled={isPlaying || pattern.length === 0}
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
              <IconButton color="primary" onClick={handleSoundMenu}>
                <Settings />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => handleSoundSelect('acoustic')}>Acoustic Kit</MenuItem>
                <MenuItem onClick={() => handleSoundSelect('electronic')}>Electronic Kit</MenuItem>
                <MenuItem onClick={() => handleSoundSelect('808')}>808 Kit</MenuItem>
              </Menu>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={aiMode}
                    onChange={(e) => setAiMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="AI Mode"
              />
            </Box>

            <Grid container spacing={1}>
              {Object.keys(drumSounds).map((drum, drumIndex) => (
                <Grid item xs={12} key={drum}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2,
                    mb: 2
                  }}>
                    <Typography sx={{ minWidth: 80, textTransform: 'capitalize' }}>
                      {drum}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                      {pattern.map((step, stepIndex) => (
                        <MotionBox
                          key={`${drum}-${stepIndex}`}
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: 1,
                            backgroundColor: currentStep === stepIndex && isPlaying
                              ? theme.palette.primary.main
                              : step[drum]
                              ? theme.palette.secondary.main
                              : 'rgba(255,255,255,0.1)'
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onClick={() => handleStepChange(drum, stepIndex)}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
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

            <Typography gutterBottom>Steps: {steps}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <IconButton 
                onClick={() => setSteps(Math.max(4, steps - 4))}
                disabled={steps <= 4}
              >
                <Remove />
              </IconButton>
              <Slider
                value={steps}
                onChange={(e, newValue) => setSteps(newValue)}
                min={4}
                max={16}
                step={4}
                marks
                sx={{ flex: 1 }}
              />
              <IconButton 
                onClick={() => setSteps(Math.min(16, steps + 4))}
                disabled={steps >= 16}
              >
                <Add />
              </IconButton>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Share />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Share Pattern
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
              fullWidth
            >
              Save Pattern
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DrumMachine;
