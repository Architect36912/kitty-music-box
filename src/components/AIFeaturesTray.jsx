import React from 'react';
import { Stack, Button, Typography, CircularProgress, Chip } from '@mui/material';
import { AutoAwesome, MusicNote, AutoMode, Piano } from '@mui/icons-material';

// Simulated AI functions (replace with actual AI implementation)
const generateMelody = () => new Promise(resolve => 
  setTimeout(() => resolve(Array(15).fill().map(() => Math.random() > 0.7)), 1000)
);

const suggestChords = () => new Promise(resolve =>
  setTimeout(() => resolve(['Cmaj', 'Amin', 'Fmaj', 'Gmaj']), 1000)
);

const suggestRhythm = () => new Promise(resolve =>
  setTimeout(() => resolve([1, 0, 1, 0, 1, 1, 0, 1]), 1000)
);

export default function AIFeaturesTray({ onApplyPattern }) {
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState({
    chords: [],
    rhythm: []
  });

  const handleGenerateMelody = async () => {
    setLoading(true);
    try {
      const pattern = await generateMelody();
      onApplyPattern(pattern);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestChords = async () => {
    setLoading(true);
    try {
      const chords = await suggestChords();
      setSuggestions(prev => ({ ...prev, chords }));
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestRhythm = async () => {
    setLoading(true);
    try {
      const rhythm = await suggestRhythm();
      setSuggestions(prev => ({ ...prev, rhythm }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">AI Features</Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
          onClick={handleGenerateMelody}
          disabled={loading}
        >
          Generate Melody
        </Button>

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Piano />}
          onClick={handleSuggestChords}
          disabled={loading}
        >
          Suggest Chords
        </Button>

        {suggestions.chords.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {suggestions.chords.map((chord, i) => (
              <Chip
                key={i}
                label={chord}
                icon={<MusicNote />}
                onClick={() => {}}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        )}

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <AutoMode />}
          onClick={handleSuggestRhythm}
          disabled={loading}
        >
          Suggest Rhythm
        </Button>

        {suggestions.rhythm.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {suggestions.rhythm.map((beat, i) => (
              <Chip
                key={i}
                label={beat ? '♪' : '𝄽'}
                onClick={() => {}}
                color={beat ? 'primary' : 'default'}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
