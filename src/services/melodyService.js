import * as Tone from 'tone';

// Musical scales and their intervals
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  jazz: [0, 2, 4, 6, 8, 10],
};

// Chord progressions
const PROGRESSIONS = {
  pop: ['I', 'V', 'vi', 'IV'],
  jazz: ['ii', 'V', 'I'],
  blues: ['I', 'IV', 'I', 'V', 'IV', 'I'],
};

const NOTE_DURATIONS = {
  whole: '1n',
  half: '2n',
  quarter: '4n',
  eighth: '8n',
  sixteenth: '16n',
};

// Convert scale degree to MIDI note number
const scaleToMIDI = (degree, scale, root = 60) => { // 60 is middle C
  const octave = Math.floor(degree / 7);
  const pitch = scale[degree % 7] + (octave * 12) + root;
  return pitch;
};

// Convert MIDI note number to note name
const MIDIToNote = (midi) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = notes[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
};

const generateRhythm = (measures = 4, complexity = 0.5) => {
  const rhythm = [];
  const durationsArray = Object.values(NOTE_DURATIONS);
  let remainingTime = measures * 4; // 4 beats per measure

  while (remainingTime > 0) {
    // Choose duration based on complexity
    const maxDurationIndex = Math.floor((1 - complexity) * durationsArray.length);
    const duration = durationsArray[Math.floor(Math.random() * maxDurationIndex)];
    const durationValue = 4 / parseInt(duration); // Convert to beats

    if (durationValue <= remainingTime) {
      rhythm.push(duration);
      remainingTime -= durationValue;
    }
  }

  return rhythm;
};

export const generateMelody = async (options = {}) => {
  const {
    style = 'pop',
    scale = 'major',
    complexity = 0.5,
    measures = 4,
    root = 'C4',
  } = options;

  const rootMIDI = Tone.Frequency(root).toMidi();
  const selectedScale = SCALES[scale];
  const rhythm = generateRhythm(measures, complexity);
  const melody = [];

  // Generate melody following the chord progression
  const progression = PROGRESSIONS[style];
  let progressionIndex = 0;
  let beatCount = 0;

  rhythm.forEach(duration => {
    // Change chord every measure
    if (beatCount >= 4) {
      beatCount = 0;
      progressionIndex = (progressionIndex + 1) % progression.length;
    }

    // Generate note based on current chord and scale
    const degree = Math.floor(Math.random() * 7);
    const midiNote = scaleToMIDI(degree, selectedScale, rootMIDI);
    const note = MIDIToNote(midiNote);

    melody.push({
      note,
      duration,
      velocity: 0.7 + (Math.random() * 0.3), // Random velocity for dynamics
    });

    beatCount += 4 / parseInt(duration);
  });

  return melody;
};

export const playMelody = async (melody, synth) => {
  if (!synth) return;

  const now = Tone.now();
  let time = now;

  // Create effects
  const reverb = new Tone.Reverb(2).toDestination();
  const delay = new Tone.FeedbackDelay('8n', 0.3).toDestination();
  
  // Connect synth to effects
  synth.connect(reverb);
  synth.connect(delay);

  melody.forEach(({ note, duration, velocity }) => {
    synth.triggerAttackRelease(note, duration, time, velocity);
    time += Tone.Time(duration).toSeconds();
  });
};

export const saveMelodyToFile = (melody) => {
  const data = JSON.stringify({
    melody,
    timestamp: new Date().toISOString(),
    version: '1.0',
  }, null, 2);

  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `kitty-melody-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const loadMelodyFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data.melody || data);
      } catch (error) {
        reject(new Error('Invalid melody file format'));
      }
    };
    reader.readAsText(file);
  });
};
