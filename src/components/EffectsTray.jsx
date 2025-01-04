import React from 'react';
import { Stack, Slider, Typography, Switch, FormControlLabel } from '@mui/material';
import * as Tone from 'tone';

export default function EffectsTray({ synth }) {
  const [effects, setEffects] = React.useState({
    reverb: { wet: 0.3, enabled: false },
    delay: { wet: 0.2, enabled: false },
    distortion: { wet: 0.1, enabled: false }
  });

  React.useEffect(() => {
    if (!synth.current) return;

    const reverb = new Tone.Reverb();
    const delay = new Tone.FeedbackDelay("8n", 0.5);
    const distortion = new Tone.Distortion(0.8);

    if (effects.reverb.enabled) synth.current.connect(reverb);
    if (effects.delay.enabled) synth.current.connect(delay);
    if (effects.distortion.enabled) synth.current.connect(distortion);

    reverb.toDestination();
    delay.toDestination();
    distortion.toDestination();

    return () => {
      reverb.dispose();
      delay.dispose();
      distortion.dispose();
    };
  }, [effects, synth]);

  const handleEffectChange = (effect, property, value) => {
    setEffects(prev => ({
      ...prev,
      [effect]: { ...prev[effect], [property]: value }
    }));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Effects</Typography>
      
      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Switch
              checked={effects.reverb.enabled}
              onChange={(e) => handleEffectChange('reverb', 'enabled', e.target.checked)}
            />
          }
          label="Reverb"
        />
        <Slider
          disabled={!effects.reverb.enabled}
          value={effects.reverb.wet}
          onChange={(_, value) => handleEffectChange('reverb', 'wet', value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </Stack>

      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Switch
              checked={effects.delay.enabled}
              onChange={(e) => handleEffectChange('delay', 'enabled', e.target.checked)}
            />
          }
          label="Delay"
        />
        <Slider
          disabled={!effects.delay.enabled}
          value={effects.delay.wet}
          onChange={(_, value) => handleEffectChange('delay', 'wet', value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </Stack>

      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Switch
              checked={effects.distortion.enabled}
              onChange={(e) => handleEffectChange('distortion', 'enabled', e.target.checked)}
            />
          }
          label="Distortion"
        />
        <Slider
          disabled={!effects.distortion.enabled}
          value={effects.distortion.wet}
          onChange={(_, value) => handleEffectChange('distortion', 'wet', value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Stack>
  );
}
