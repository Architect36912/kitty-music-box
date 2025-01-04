import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Fade, Box, IconButton, Tooltip } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import DraggableTray from './DraggableTray';
import AIFeaturesTray from './AIFeaturesTray';

export default function AITrayManager({ gridState, onApplyPattern }) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 20 });
  const [lastInteraction, setLastInteraction] = useState(null);

  // Track user interactions and determine when to show AI suggestions
  const handleUserActivity = useCallback((activity) => {
    setLastInteraction(activity);
    
    const shouldShowTray = (
      activity === 'multiple_notes_added' ||
      activity === 'pattern_detected' ||
      activity === 'long_pause' ||
      activity === 'requested_help'
    );

    if (shouldShowTray && !isVisible) {
      const newPosition = calculateOptimalPosition(activity);
      setPosition(newPosition);
      setIsVisible(true);
    }
  }, [isVisible]);

  // Monitor grid state changes
  useEffect(() => {
    if (gridState) {
      const activity = analyzeGridActivity(gridState);
      if (activity) {
        handleUserActivity(activity);
      }
    }
  }, [gridState, handleUserActivity]);

  const handleClose = () => {
    setIsVisible(false);
    setLastInteraction(null);
  };

  const toggleTray = () => {
    setIsVisible(!isVisible);
  };

  const calculateOptimalPosition = (activity) => {
    const positions = {
      multiple_notes_added: { x: window.innerWidth - 350, y: 20 },
      pattern_detected: { x: window.innerWidth - 350, y: 100 },
      long_pause: { x: 20, y: window.innerHeight - 300 },
      requested_help: { x: window.innerWidth / 2 - 150, y: 50 },
      default: { x: window.innerWidth - 350, y: 20 }
    };
    return positions[activity] || positions.default;
  };

  const analyzeGridActivity = (gridState) => {
    if (!gridState) return null;
    if (gridState.activityCount > 3) {
      return 'multiple_notes_added';
    }
    return null;
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <Tooltip title={isVisible ? "Hide AI Assistant" : "Show AI Assistant"}>
        <IconButton
          onClick={toggleTray}
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            bgcolor: isVisible ? 'primary.main' : 'background.paper',
            boxShadow: 3,
            '&:hover': {
              bgcolor: isVisible ? 'primary.dark' : 'background.default',
            },
            zIndex: theme.zIndex.drawer + 2
          }}
        >
          <AutoAwesome />
        </IconButton>
      </Tooltip>

      {/* AI Tray */}
      <div className="ai-tray">
        <Fade in={isVisible} timeout={300}>
          <div style={{ 
            position: 'fixed',
            top: position.y,
            left: position.x,
            zIndex: theme.zIndex.drawer + 1
          }}>
            <DraggableTray
              title="AI Music Assistant"
              onClose={handleClose}
              defaultPosition={position}
            >
              <div className="ai-content">
                <AIFeaturesTray onApplyPattern={onApplyPattern} />
              </div>
            </DraggableTray>
          </div>
        </Fade>
      </div>
    </>
  );
}
