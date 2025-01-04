import React from 'react';
import { 
  Box, 
  Slider, 
  Typography, 
  Stack, 
  IconButton,
  Popover,
  Paper
} from '@mui/material';
import { 
  GraphicEq,
  Timer,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material';

export default function NoteControls({
  selectedNote,
  onPitchChange,
  onLengthChange,
  colors
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [noteLength, setNoteLength] = React.useState(1); // 1 = eighth note

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleLengthChange = (_, value) => {
    setNoteLength(value);
    onLengthChange(value);
  };

  const noteLengthLabels = {
    0.5: '16th',
    1: '8th',
    2: '1/4',
    4: '1/2',
    8: 'Whole'
  };

  return (
    <Box>
      {selectedNote && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            bgcolor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            width: 'fit-content'
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <GraphicEq sx={{ color: colors.secondary }} />
              <Typography variant="body2" color="textSecondary">
                Pitch Control
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton 
                size="small" 
                onClick={() => onPitchChange(1)}
                sx={{ color: colors.primary }}
              >
                <KeyboardArrowUp />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onPitchChange(-1)}
                sx={{ color: colors.primary }}
              >
                <KeyboardArrowDown />
              </IconButton>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Timer sx={{ color: colors.secondary }} />
              <Typography variant="body2" color="textSecondary">
                Note Length: {noteLengthLabels[noteLength]}
              </Typography>
            </Stack>
            <Slider
              value={noteLength}
              onChange={handleLengthChange}
              step={null}
              marks={[
                { value: 0.5, label: '16th' },
                { value: 1, label: '8th' },
                { value: 2, label: '1/4' },
                { value: 4, label: '1/2' },
                { value: 8, label: 'Whole' }
              ]}
              min={0.5}
              max={8}
              sx={{
                color: colors.primary,
                width: 200,
                '& .MuiSlider-mark': {
                  backgroundColor: colors.secondary
                }
              }}
            />
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
