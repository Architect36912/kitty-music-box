import React from 'react';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function KittyTour({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to Kitty's Music Box! ",
      content: "Let's learn how to create beautiful music together!"
    },
    {
      title: "The Grid",
      content: "Click on any cell to add or remove a note. The grid represents different musical notes (vertically) over time (horizontally)."
    },
    {
      title: "Keyboard Shortcuts",
      content: "Use keyboard shortcuts to quickly set note values:\n\n" +
        "• Press 'C' + number (1-8) then click a cell to set a C note (e.g., C+3 for C3)\n" +
        "• Press 'D' + number for D notes\n" +
        "• Press 'E' + number for E notes\n" +
        "• Press 'F' + number for F notes\n" +
        "• Press 'G' + number for G notes\n" +
        "• Press 'A' + number for A notes\n" +
        "• Press 'B' + number for B notes"
    },
    {
      title: "AI Assistant",
      content: "The AI assistant will pop up to help you create melodies. It can suggest patterns, chords, and rhythms based on what you're playing."
    },
    {
      title: "Playback Controls",
      content: "Use the play, pause, and stop buttons at the bottom to control your music. Adjust tempo and volume using the sliders."
    }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.7)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        sx={{
          maxWidth: 600,
          width: '90%',
          p: 4,
          position: 'relative',
          bgcolor: 'white',
          color: 'black'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'black'
          }}
        >
          <Close />
        </IconButton>

        {steps.map((step, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'black', fontWeight: 'bold' }}>
              {step.title}
            </Typography>
            <Typography 
              sx={{ 
                color: 'black',
                whiteSpace: 'pre-line',
                lineHeight: 1.6
              }}
            >
              {step.content}
            </Typography>
          </Box>
        ))}

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            mt: 2,
            bgcolor: '#ff69b4',
            '&:hover': {
              bgcolor: '#ff1493'
            }
          }}
        >
          Got it!
        </Button>
      </Paper>
    </Box>
  );
}
