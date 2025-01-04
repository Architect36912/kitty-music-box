import React from 'react';
import Draggable from 'react-draggable';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import { Close, DragIndicator } from '@mui/icons-material';

export default function DraggableTray({ title, onClose, children, defaultPosition }) {
  return (
    <Draggable handle=".drag-handle" defaultPosition={defaultPosition || { x: 0, y: 0 }}>
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          minWidth: 300,
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 1000
        }}
      >
        <Box
          className="drag-handle"
          sx={{
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'move',
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicator />
            <Typography variant="subtitle1">{title}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Paper>
    </Draggable>
  );
}
