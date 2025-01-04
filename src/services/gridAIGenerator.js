class GridAIGenerator {
  constructor() {
    this.patterns = {
      electronic: [
        { probability: 0.7, pattern: [[0,4,8,12], [2,6,10,14], [1,5,9,13]] }, // Arpeggio
        { probability: 0.6, pattern: [[0,1,2,3], [8,9,10,11], [16,17,18,19]] }, // Chord progression
        { probability: 0.5, pattern: [[0,8,16,24], [4,12,20,28]] }, // Beat pattern
      ],
      marimba: [
        { probability: 0.8, pattern: [[0,2,4,6], [8,10,12,14], [16,18,20,22]] }, // Melodic pattern
        { probability: 0.6, pattern: [[0,4,8], [12,16,20], [24,28,0]] }, // Rolling pattern
        { probability: 0.5, pattern: [[0,1], [8,9], [16,17], [24,25]] }, // Grace notes
      ]
    };
  }

  generatePattern(instrument, complexity) {
    const grid = Array(16).fill().map(() => Array(32).fill(false));
    const selectedPatterns = this.patterns[instrument];

    selectedPatterns.forEach(({ probability, pattern }) => {
      if (Math.random() < probability * complexity) {
        pattern.forEach(positions => {
          positions.forEach(pos => {
            const row = Math.floor(Math.random() * 13);
            const col = pos % 32;
            grid[row][col] = true;
          });
        });
      }
    });

    return { grid };
  }

  suggestNextNotes(currentGrid, currentStep) {
    const suggestions = [];
    const nextStep = (currentStep + 1) % 32;
    
    // Analyze current pattern
    const activeNotes = [];
    currentGrid.forEach((row, rowIndex) => {
      if (row[currentStep]) {
        activeNotes.push(rowIndex);
      }
    });

    // Generate suggestions based on active notes
    if (activeNotes.length > 0) {
      // Suggest notes in harmony
      activeNotes.forEach(note => {
        const harmonicIntervals = [3, 4, 7]; // Third, fourth, fifth intervals
        harmonicIntervals.forEach(interval => {
          const harmonicNote = (note + interval) % 16;
          if (harmonicNote >= 0 && harmonicNote < 16) {
            suggestions.push({
              row: harmonicNote,
              col: nextStep,
              probability: 0.8 - (interval * 0.1)
            });
          }
        });
      });
    } else {
      // Suggest starting notes
      [0, 4, 7, 11].forEach(note => {
        suggestions.push({
          row: note,
          col: nextStep,
          probability: 0.6
        });
      });
    }

    // Sort by probability and return top 3
    return suggestions
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
  }

  analyzePattern(grid) {
    const analysis = {
      complexity: 0,
      rhythm: 0,
      melody: 0,
      harmony: 0
    };

    // Calculate complexity based on number of active notes
    const activeNotes = grid.flat().filter(cell => cell).length;
    analysis.complexity = activeNotes / (grid.length * grid[0].length);

    // Analyze rhythm patterns
    grid.forEach(row => {
      let consecutiveNotes = 0;
      row.forEach((cell, i) => {
        if (cell && row[i + 1]) consecutiveNotes++;
      });
      analysis.rhythm += consecutiveNotes;
    });

    // Analyze melodic movement
    grid.forEach((row, rowIndex) => {
      if (rowIndex > 0) {
        row.forEach((cell, colIndex) => {
          if (cell && grid[rowIndex - 1][colIndex]) {
            analysis.melody++;
          }
        });
      }
    });

    // Analyze harmony (simultaneous notes)
    grid[0].forEach((_, colIndex) => {
      let simultaneousNotes = 0;
      grid.forEach(row => {
        if (row[colIndex]) simultaneousNotes++;
      });
      if (simultaneousNotes > 1) {
        analysis.harmony += simultaneousNotes - 1;
      }
    });

    // Normalize values
    analysis.rhythm /= grid[0].length;
    analysis.melody /= (grid.length * grid[0].length);
    analysis.harmony /= (grid.length * grid[0].length);

    return analysis;
  }
}

export default GridAIGenerator;
