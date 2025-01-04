import React from 'react';
import { Box, Typography, Paper, Stack, Divider, IconButton } from '@mui/material';
import { Close, MusicNote, AutoAwesome, Equalizer, PlayArrow, 
  Undo, Redo, VolumeUp, DragIndicator } from '@mui/icons-material';

const GuideSection = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 2, color: '#7c4dff' }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const Feature = ({ icon, title, description }) => (
  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
    <Box sx={{ color: '#7c4dff' }}>{icon}</Box>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Stack>
);

export default function UserGuide({ onClose }) {
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <Paper sx={{ 
        maxWidth: 800,
        maxHeight: '90vh',
        width: '100%',
        overflow: 'auto',
        p: 4,
        position: 'relative'
      }}>
        <IconButton 
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Close />
        </IconButton>

        <Typography variant="h4" sx={{ mb: 4, color: '#7c4dff' }}>
          Welcome to Kitty's Music Box! 🎵
        </Typography>

        <GuideSection title="Getting Started">
          <Typography variant="body1" sx={{ mb: 2 }}>
            Kitty's Music Box is a fun and creative way to make music! Click on the grid cells to create
            melodies, use effects to enhance your sound, and let AI help you compose amazing tunes.
          </Typography>
        </GuideSection>

        <Divider sx={{ my: 3 }} />

        <GuideSection title="Basic Controls">
          <Feature
            icon={<PlayArrow />}
            title="Play/Stop"
            description="Click the floating purple button below the grid to play or stop your melody."
          />
          <Feature
            icon={<VolumeUp />}
            title="Volume & Tempo"
            description="Use the sliders in the effects panel to adjust volume and speed."
          />
          <Feature
            icon={<DragIndicator />}
            title="Draggable Panels"
            description="Grab the title bar of any panel to move it around the screen."
          />
        </GuideSection>

        <GuideSection title="Creating Music">
          <Feature
            icon={<MusicNote />}
            title="Grid Interaction"
            description="Click cells to toggle notes on/off. Each row represents a different musical note, from high (top) to low (bottom)."
          />
          <Feature
            icon={<Undo />}
            title="Undo/Redo"
            description="Made a mistake? Use the undo/redo buttons in the bottom left corner."
          />
        </GuideSection>

        <GuideSection title="Effects Panel">
          <Feature
            icon={<Equalizer />}
            title="Sound Effects"
            description="Add reverb, delay, and distortion to create unique sounds. Click the effects button (wave icon) to open the panel."
          />
        </GuideSection>

        <GuideSection title="AI Features">
          <Feature
            icon={<AutoAwesome />}
            title="AI Assistance"
            description="Let AI help you create melodies, suggest chord progressions, and generate rhythm patterns. Click the magic wand icon to open the AI panel."
          />
        </GuideSection>

        <GuideSection title="Tips & Tricks">
          <Typography variant="body1" component="div">
            <ul>
              <li>Try starting with a simple pattern and gradually add more notes</li>
              <li>Use effects sparingly - sometimes less is more!</li>
              <li>Experiment with the AI suggestions to get inspiration</li>
              <li>Save your favorite patterns using the save button</li>
              <li>Try different tempos to change the feel of your melody</li>
            </ul>
          </Typography>
        </GuideSection>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Have fun making music with Kitty's Music Box! If you need more help, click the help icon in the menu.
        </Typography>
      </Paper>
    </Box>
  );
}
