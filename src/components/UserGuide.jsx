import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import {
  MusicNote,
  Keyboard,
  PlayArrow,
  AutoAwesome,
  Close
} from '@mui/icons-material';

const UserGuide = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'black'
      }}>
        <Typography variant="h5" component="span" sx={{ color: 'black', fontWeight: 'bold' }}>
          🐱 Kitty's Music Box - User Guide
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'black' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ color: 'black' }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'black' }}>
            Quick Start
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <MusicNote sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Creating Notes" 
                secondary="Click on any cell in the grid to add or remove a note. Each row represents a different musical note."
                sx={{ 
                  '& .MuiListItemText-primary': { color: 'black', fontWeight: 'bold' },
                  '& .MuiListItemText-secondary': { color: 'black' }
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Keyboard sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Keyboard Shortcuts" 
                secondary={`
                  Hold a note key (C, D, E, F, G, A, B) and a number (1-5) for the octave, then click to place that note.
                  Example: Hold 'C' + '3', then click to place a C3 note.
                `}
                sx={{ 
                  '& .MuiListItemText-primary': { color: 'black', fontWeight: 'bold' },
                  '& .MuiListItemText-secondary': { color: 'black' }
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <PlayArrow sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Playback Controls" 
                secondary="Use the play, pause, and stop buttons to control your music. Toggle loop mode to repeat your sequence."
                sx={{ 
                  '& .MuiListItemText-primary': { color: 'black', fontWeight: 'bold' },
                  '& .MuiListItemText-secondary': { color: 'black' }
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <AutoAwesome sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText 
                primary="AI Assistant" 
                secondary="Click the AI Assistant button (bottom right) to show/hide the AI features tray. Get intelligent suggestions for melodies, chords, and rhythms."
                sx={{ 
                  '& .MuiListItemText-primary': { color: 'black', fontWeight: 'bold' },
                  '& .MuiListItemText-secondary': { color: 'black' }
                }}
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'black' }}>
            Tips & Tricks
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                secondary="• Hover over note labels to see available keyboard shortcuts"
                sx={{ '& .MuiListItemText-secondary': { color: 'black' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                secondary="• The AI Assistant will automatically suggest patterns based on your playing"
                sx={{ '& .MuiListItemText-secondary': { color: 'black' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                secondary="• Drag the AI tray to reposition it anywhere on screen"
                sx={{ '& .MuiListItemText-secondary': { color: 'black' } }}
              />
            </ListItem>
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuide;
