import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack,
  Fade,
  Chip,
  IconButton,
  LinearProgress
} from '@mui/material';
import { 
  AutoAwesome,
  Celebration,
  EmojiEvents,
  Psychology,
  StarBorder
} from '@mui/icons-material';

// Encouraging feedback messages
const FEEDBACK_MESSAGES = {
  rhythm: [
    "Great rhythm pattern! Your timing is spot on! 🎵",
    "Love how you're mixing up the beat! Very creative! 🌟",
    "The rhythm flows naturally - keep it up! 🎶",
    "Nice syncopation! You've got rhythm! 🎼"
  ],
  melody: [
    "Beautiful melody! It's really catchy! ✨",
    "Your note choices create a lovely progression! 🎹",
    "The melody has a great emotional quality! 💫",
    "Wonderful musical phrases - very expressive! 🎵"
  ],
  creativity: [
    "You're thinking outside the box - amazing! 🚀",
    "Such unique musical ideas - keep exploring! 🌈",
    "Your creativity is shining through! ⭐",
    "Love these innovative patterns! 🎨"
  ],
  improvement: [
    "Try adding some variation in this section 💡",
    "Maybe experiment with different note lengths 🎵",
    "Consider adding some contrasting elements ✨",
    "How about trying a different rhythm here? 🎶"
  ]
};

// Analyze the music pattern
const analyzePattern = (grid) => {
  const analysis = {
    rhythmComplexity: 0,
    melodicRange: 0,
    patternVariety: 0,
    noteCount: 0
  };

  // Count active notes and analyze patterns
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        analysis.noteCount++;
        analysis.melodicRange = Math.max(analysis.melodicRange, rowIndex);
        
        // Check for pattern variety
        if (colIndex > 0 && row[colIndex - 1]) {
          analysis.patternVariety++;
        }
        
        // Check for rhythm complexity
        if (colIndex % 4 !== 0 && cell) {
          analysis.rhythmComplexity++;
        }
      }
    });
  });

  return analysis;
};

export default function AIMusicFeedback({ grid, colors }) {
  const [feedback, setFeedback] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateFeedback = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis time
    setTimeout(() => {
      const analysis = analyzePattern(grid);
      const newFeedback = [];

      // Generate encouraging feedback based on analysis
      if (analysis.noteCount > 0) {
        if (analysis.rhythmComplexity > 3) {
          newFeedback.push({
            type: 'rhythm',
            message: FEEDBACK_MESSAGES.rhythm[Math.floor(Math.random() * FEEDBACK_MESSAGES.rhythm.length)],
            icon: <Celebration sx={{ color: colors.primary }} />
          });
        }

        if (analysis.melodicRange > 5) {
          newFeedback.push({
            type: 'melody',
            message: FEEDBACK_MESSAGES.melody[Math.floor(Math.random() * FEEDBACK_MESSAGES.melody.length)],
            icon: <EmojiEvents sx={{ color: colors.secondary }} />
          });
        }

        if (analysis.patternVariety > 4) {
          newFeedback.push({
            type: 'creativity',
            message: FEEDBACK_MESSAGES.creativity[Math.floor(Math.random() * FEEDBACK_MESSAGES.creativity.length)],
            icon: <StarBorder sx={{ color: colors.primary }} />
          });
        }

        // Always add an encouraging suggestion
        newFeedback.push({
          type: 'improvement',
          message: FEEDBACK_MESSAGES.improvement[Math.floor(Math.random() * FEEDBACK_MESSAGES.improvement.length)],
          icon: <Psychology sx={{ color: colors.secondary }} />
        });
      }

      setFeedback(newFeedback);
      setIsAnalyzing(false);
    }, 1000);
  };

  // Generate new feedback when the grid changes significantly
  useEffect(() => {
    generateFeedback();
  }, [grid]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        bgcolor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        maxWidth: 400
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AutoAwesome sx={{ color: colors.primary }} />
          <Typography variant="h6" color="textPrimary">
            AI Music Feedback
          </Typography>
        </Stack>

        {isAnalyzing ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              sx={{ 
                bgcolor: `${colors.primary}22`,
                '& .MuiLinearProgress-bar': {
                  bgcolor: colors.primary
                }
              }} 
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Analyzing your melody...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {feedback.map((item, index) => (
              <Fade in key={index}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {item.icon}
                  <Typography 
                    variant="body1" 
                    color="textPrimary"
                    sx={{ 
                      flex: 1,
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                  >
                    {item.message}
                  </Typography>
                </Stack>
              </Fade>
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1}>
          <Chip 
            label="Rhythm" 
            icon={<Celebration />}
            sx={{ bgcolor: `${colors.primary}22` }}
          />
          <Chip 
            label="Melody" 
            icon={<EmojiEvents />}
            sx={{ bgcolor: `${colors.secondary}22` }}
          />
          <Chip 
            label="Creativity" 
            icon={<StarBorder />}
            sx={{ bgcolor: `${colors.primary}22` }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
