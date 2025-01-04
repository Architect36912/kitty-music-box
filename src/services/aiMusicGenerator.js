import * as Tone from 'tone';

const SCALES = {
  pentatonic: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
  blues: ['C4', 'Eb4', 'F4', 'F#4', 'G4', 'Bb4', 'C5'],
  jazz: ['C4', 'D4', 'Eb4', 'E4', 'G4', 'A4', 'Bb4', 'C5'],
  electronic: ['C4', 'D4', 'F4', 'G4', 'A4', 'C5', 'D5'],
  oriental: ['C4', 'Db4', 'E4', 'F4', 'A4', 'Bb4', 'C5'],
};

const CHORD_PROGRESSIONS = {
  pop: [
    ['C4', 'E4', 'G4'],
    ['G4', 'B4', 'D4'],
    ['A4', 'C4', 'E4'],
    ['F4', 'A4', 'C4'],
  ],
  jazz: [
    ['C4', 'E4', 'G4', 'B4'],
    ['Dm4', 'F4', 'A4'],
    ['G4', 'B4', 'D4'],
    ['C4', 'E4', 'G4'],
  ],
  electronic: [
    ['C4', 'G4', 'C5'],
    ['F4', 'C5', 'F5'],
    ['G4', 'D5', 'G5'],
    ['Am4', 'E5', 'A5'],
  ],
};

const DRUM_PATTERNS = {
  basic: {
    kick: ['4n', '4n', '4n', '4n'],
    snare: ['8n', '8n', '4n', '4n'],
    hihat: ['16n', '16n', '16n', '16n'],
  },
  complex: {
    kick: ['4n', '8n', '8n', '4n'],
    snare: ['8t', '8t', '8t', '4n'],
    hihat: ['16n', '16n', '8n', '16n'],
  },
  electronic: {
    kick: ['2n', '4n', '4n', '8n'],
    snare: ['8n', '16n', '16n', '8n'],
    hihat: ['32n', '32n', '16n', '16n'],
  },
};

class AIMusicGenerator {
  constructor() {
    this.setupInstruments();
    this.effects = this.setupEffects();
  }

  setupInstruments() {
    // Main synth for melodies
    this.leadSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine8'
      },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8,
      },
    }).toDestination();

    // Bass synth
    this.bassSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.7,
        release: 1,
      },
    }).toDestination();

    // Drum sounds
    this.drums = {
      kick: new Tone.MembraneSynth().toDestination(),
      snare: new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { decay: 0.1 },
      }).toDestination(),
      hihat: new Tone.MetalSynth({
        frequency: 200,
        envelope: { decay: 0.02 },
      }).toDestination(),
    };
  }

  setupEffects() {
    return {
      reverb: new Tone.Reverb({
        decay: 3,
        wet: 0.3,
      }).toDestination(),
      delay: new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.3,
        wet: 0.2,
      }).toDestination(),
      chorus: new Tone.Chorus({
        frequency: 4,
        delayTime: 2.5,
        depth: 0.5,
        wet: 0.3,
      }).toDestination(),
      distortion: new Tone.Distortion({
        distortion: 0.4,
        wet: 0.1,
      }).toDestination(),
    };
  }

  connectEffects() {
    this.leadSynth.chain(
      this.effects.chorus,
      this.effects.reverb,
      this.effects.delay,
      Tone.Destination
    );
    this.bassSynth.chain(
      this.effects.distortion,
      this.effects.reverb,
      Tone.Destination
    );
  }

  generateMelody(style = 'electronic', complexity = 0.7) {
    const scale = SCALES[style] || SCALES.pentatonic;
    const progression = CHORD_PROGRESSIONS[style] || CHORD_PROGRESSIONS.pop;
    const pattern = DRUM_PATTERNS[complexity > 0.5 ? 'complex' : 'basic'];
    
    const melody = [];
    const bassline = [];
    const drums = { kick: [], snare: [], hihat: [] };

    // Generate melody
    for (let i = 0; i < 16; i++) {
      if (Math.random() < complexity) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        const duration = ['8n', '4n', '2n'][Math.floor(Math.random() * 3)];
        melody.push({ note, duration, velocity: 0.7 + Math.random() * 0.3 });
      }
    }

    // Generate bassline
    progression.forEach(chord => {
      bassline.push({
        note: chord[0],
        duration: '2n',
        velocity: 0.8,
      });
    });

    // Generate drum pattern
    Object.entries(pattern).forEach(([drum, rhythms]) => {
      rhythms.forEach(rhythm => {
        drums[drum].push({
          duration: rhythm,
          velocity: drum === 'kick' ? 0.9 : 0.7,
        });
      });
    });

    return {
      melody,
      bassline,
      drums,
      bpm: 80 + Math.floor(Math.random() * 60), // 80-140 BPM
    };
  }

  async playMelody({ melody, bassline, drums, bpm }) {
    Tone.Transport.bpm.value = bpm;
    
    // Schedule melody
    const melodyPart = new Tone.Part((time, note) => {
      this.leadSynth.triggerAttackRelease(
        note.note,
        note.duration,
        time,
        note.velocity
      );
    }, melody.map((note, i) => [i * 0.5, note])).start(0);

    // Schedule bassline
    const bassPart = new Tone.Part((time, note) => {
      this.bassSynth.triggerAttackRelease(
        note.note,
        note.duration,
        time,
        note.velocity
      );
    }, bassline.map((note, i) => [i * 2, note])).start(0);

    // Schedule drums
    Object.entries(drums).forEach(([drum, pattern]) => {
      const drumPart = new Tone.Part((time, hit) => {
        this.drums[drum].triggerAttackRelease(
          drum === 'kick' ? 'C1' : 'C4',
          hit.duration,
          time,
          hit.velocity
        );
      }, pattern.map((hit, i) => [i * 0.25, hit])).start(0);
    });

    // Start playback
    await Tone.start();
    Tone.Transport.start();

    return {
      stop: () => {
        melodyPart.dispose();
        bassPart.dispose();
        Tone.Transport.stop();
        Tone.Transport.position = 0;
      }
    };
  }

  setEffectLevel(effect, level) {
    if (this.effects[effect]) {
      this.effects[effect].wet.value = level;
    }
  }

  async exportToMIDI(composition) {
    // Implementation for MIDI export
    // This would convert the composition to MIDI format
  }
}

export default AIMusicGenerator;
