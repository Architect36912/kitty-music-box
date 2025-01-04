import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { PlayArrow, Stop, Download, Delete, Edit, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SavedMelodies = () => {
  const [melodies, setMelodies] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, melody: null });

  const handlePlay = (id) => {
    if (playingId === id) {
      setPlayingId(null);
      // Stop playback logic here
    } else {
      setPlayingId(id);
      // Start playback logic here
    }
  };

  const handleDownload = (melody) => {
    const data = JSON.stringify(melody.pattern);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${melody.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id) => {
    setMelodies(melodies.filter(melody => melody.id !== id));
  };

  const handleEdit = (melody) => {
    setEditDialog({ open: true, melody });
  };

  const handleSaveEdit = () => {
    if (editDialog.melody) {
      setMelodies(melodies.map(m => 
        m.id === editDialog.melody.id ? editDialog.melody : m
      ));
      setEditDialog({ open: false, melody: null });
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const pattern = JSON.parse(e.target.result);
          const newMelody = {
            id: Date.now(),
            name: file.name.replace('.json', ''),
            pattern,
            created: new Date().toLocaleString(),
          };
          setMelodies([...melodies, newMelody]);
        } catch (error) {
          console.error('Error importing melody:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box>
      {/* Import Button */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <input
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          id="import-melody"
          onChange={handleImport}
        />
        <label htmlFor="import-melody">
          <Button
            variant="contained"
            component="span"
            sx={{
              background: 'linear-gradient(45deg, #ff69b4, #9c27b0)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff4081, #7b1fa2)',
              },
            }}
          >
            Import Melody
          </Button>
        </label>
      </Box>

      {/* Melodies Grid */}
      <Grid container spacing={3}>
        {melodies.map((melody) => (
          <Grid item xs={12} sm={6} md={4} key={melody.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                sx={{
                  p: 2,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {melody.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Created: {melody.created}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => handlePlay(melody.id)}
                    sx={{ color: playingId === melody.id ? '#ff4081' : '#4caf50' }}
                  >
                    {playingId === melody.id ? <Stop /> : <PlayArrow />}
                  </IconButton>
                  <IconButton
                    onClick={() => handleDownload(melody)}
                    sx={{ color: '#2196f3' }}
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEdit(melody)}
                    sx={{ color: '#ff9800' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(melody.id)}
                    sx={{ color: '#f44336' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {melodies.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            No saved melodies yet
          </Typography>
          <Typography variant="body1">
            Create a new melody in the Grid Sequencer or AI Mode, then save it to see it here!
          </Typography>
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, melody: null })}>
        <DialogTitle>Edit Melody</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Melody Name"
            fullWidth
            value={editDialog.melody?.name || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              melody: { ...editDialog.melody, name: e.target.value }
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, melody: null })}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedMelodies;
