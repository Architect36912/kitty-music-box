import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  AutoAwesome,
  MusicNote,
  Refresh,
  Add
} from '@mui/icons-material';

// Mock AI suggestions (replace with real AI later)
const MELODY_SUGGESTIONS = [
  {
    name: "Happy Melody",
    notes: ["C4", "E4", "G4", "C5", "G4", "E4", "C4"],
    type: "melody"
  },
  {
    name: "Dreamy Pattern",
    notes: ["F4", "A4", "C5", "E5", "C5", "A4", "F4"],
    type: "melody"
  },
  {
    name: "Bouncy Rhythm",
    notes: ["G4", "B4", "D5", "G5", "D5", "B4", "G4"],
    type: "rhythm"
  }
];

export default function AIFeaturesTray({ onApplyPattern }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState(MELODY_SUGGESTIONS);

  const handleGenerateNew = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const newSuggestions = [
        ...suggestions,
        {
          name: "New Melody " + Math.floor(Math.random() * 100),
          notes: ["C4", "E4", "G4", "B4", "A4", "F4", "D4"],
          type: "melody"
        }
      ];
      setSuggestions(newSuggestions);
      setIsGenerating(false);
    }, 1500);
  };

  const handleApplyPattern = (pattern) => {
    if (onApplyPattern) {
      onApplyPattern(pattern);
    }
  };

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesome color="primary" />
        <Typography variant="h6" color="primary">
          AI Music Suggestions
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
        onClick={handleGenerateNew}
        disabled={isGenerating}
        fullWidth
        sx={{ mb: 2 }}
      >
        {isGenerating ? 'Generating...' : 'Generate New Ideas'}
      </Button>

      <List>
        {suggestions.map((suggestion, index) => (
          <React.Fragment key={index}>
            <ListItem
              secondaryAction={
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => handleApplyPattern(suggestion)}
                >
                  Apply
                </Button>
              }
            >
              <ListItemIcon>
                <MusicNote color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={suggestion.name}
                secondary={`${suggestion.notes.length} notes - ${suggestion.type}`}
              />
            </ListItem>
            {index < suggestions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Click 'Apply' to add a pattern to your grid. Generate new ideas anytime!
      </Typography>
    </Box>
  );
}
