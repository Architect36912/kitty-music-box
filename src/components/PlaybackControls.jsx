import React from 'react';
import { Box, IconButton, Slider, Stack, Typography, Tooltip } from '@mui/material';
import { 
  PlayArrowRounded, 
  PauseRounded, 
  StopRounded, 
  FastRewindRounded, 
  FastForwardRounded,
  VolumeUp,
  VolumeOff,
  Speed
} from '@mui/icons-material';

export default function PlaybackControls({ 
  isPlaying,
  onPlayPause,
  onStop,
  onRewind,
  onFastForward,
  tempo,
  onTempoChange,
  volume,
  onVolumeChange,
  colors
}) {
  const [isMuted, setIsMuted] = React.useState(false);
  const previousVolume = React.useRef(volume);

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(previousVolume.current);
    } else {
      previousVolume.current = volume;
      onVolumeChange(-60);
    }
    setIsMuted(!isMuted);
  };

  return (
    <Box
      sx={{
        bgcolor: colors.surface,
        borderRadius: 3,
        p: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        border: `1px solid ${colors.border}`,
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        transition: 'all 0.3s ease'
      }}
    >
      <Stack spacing={3}>
        {/* Playback Controls */}
        <Stack 
          direction="row" 
          spacing={1} 
          justifyContent="center"
          alignItems="center"
        >
          <Tooltip title="Rewind">
            <IconButton onClick={onRewind} size="large">
              <FastRewindRounded sx={{ color: colors.secondary }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isPlaying ? "Pause" : "Play"}>
            <IconButton 
              onClick={onPlayPause} 
              sx={{ 
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.secondary },
                width: 56,
                height: 56
              }}
            >
              {isPlaying ? (
                <PauseRounded sx={{ color: '#fff', fontSize: 32 }} />
              ) : (
                <PlayArrowRounded sx={{ color: '#fff', fontSize: 32 }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Stop">
            <IconButton onClick={onStop} size="large">
              <StopRounded sx={{ color: colors.secondary }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Fast Forward">
            <IconButton onClick={onFastForward} size="large">
              <FastForwardRounded sx={{ color: colors.secondary }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Tempo Control */}
        <Stack spacing={1}>
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
          >
            <Speed sx={{ color: colors.secondary }} />
            <Typography variant="body2" color="textSecondary">
              Tempo: {tempo} BPM
            </Typography>
          </Stack>
          <Slider
            value={tempo}
            onChange={(_, value) => onTempoChange(value)}
            min={60}
            max={200}
            sx={{
              color: colors.primary,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                backgroundColor: colors.text
              }
            }}
          />
        </Stack>

        {/* Volume Control */}
        <Stack spacing={1}>
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
          >
            <IconButton onClick={handleMuteToggle} size="small">
              {isMuted ? (
                <VolumeOff sx={{ color: colors.secondary }} />
              ) : (
                <VolumeUp sx={{ color: colors.secondary }} />
              )}
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              Volume: {Math.round(((volume + 60) / 60) * 100)}%
            </Typography>
          </Stack>
          <Slider
            value={volume}
            onChange={(_, value) => onVolumeChange(value)}
            min={-60}
            max={0}
            sx={{
              color: colors.primary,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                backgroundColor: colors.text
              }
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
