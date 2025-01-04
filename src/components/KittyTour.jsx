import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { Button } from '@mui/material';

const tourSteps = [
  {
    target: 'body',
    content: 'Welcome to Kitty\'s Music Box! Let\'s take a quick tour together! 🐱',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.instrument-selector',
    content: 'Choose between Marimba and Electronic sounds for your music! Each has its own unique character. 🎵',
    placement: 'bottom',
  },
  {
    target: '.grid-sequencer',
    content: 'Create musical patterns by clicking on the grid cells. Each row represents a different note, and the sequence plays from left to right! 🎹',
    placement: 'right',
  },
  {
    target: '.playback-controls',
    content: 'Control your music with these buttons! Play, pause, stop, or skip through your creation. ▶️',
    placement: 'bottom',
  },
  {
    target: '.slider-control',
    content: 'Adjust the tempo (speed) and volume of your music using these sliders. 🎛️',
    placement: 'bottom',
  },
  {
    target: '.synth-panel',
    content: 'This is your synthesizer panel! Play notes, adjust effects, and create amazing sounds! 🎹',
    placement: 'left',
  },
  {
    target: '.theme-toggle',
    content: 'Switch between light and dark mode to match your mood! 🌙',
    placement: 'left',
  },
  {
    target: '.controls',
    content: 'Access helpful tools here - restart your composition, get help, or change the theme! 🛠️',
    placement: 'bottom',
    isFixed: true,
  }
];

const KittyTour = ({ isOpen, onClose }) => {
  const handleJoyrideCallback = (data) => {
    const { status, type, step } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      onClose();
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={isOpen}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      hideCloseButton={false}
      spotlightClicks={true}
      styles={{
        options: {
          primaryColor: '#007AFF',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          zIndex: 10000,
        },
        spotlight: {
          backgroundColor: 'transparent',
        },
        tooltip: {
          backgroundColor: '#ffffff',
          textAlign: 'left',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        tooltipTitle: {
          color: '#000000',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px',
        },
        tooltipContent: {
          color: '#000000',
          fontSize: '14px',
          lineHeight: '1.5',
        },
        buttonNext: {
          backgroundColor: '#007AFF',
          color: '#ffffff',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        },
        buttonBack: {
          color: '#007AFF',
          marginRight: '10px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: 'bold',
          border: '1px solid #007AFF',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0,122,255,0.1)',
          },
        },
        buttonSkip: {
          color: '#666666',
          opacity: 0.7,
          fontSize: '14px',
          '&:hover': {
            opacity: 1,
          },
        },
        buttonClose: {
          color: '#666666',
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
          },
        },
      }}
      locale={{
        last: 'End Tour',
        skip: 'Skip Tour',
        next: 'Next',
        back: 'Back',
        close: 'Close',
      }}
    />
  );
};

export default KittyTour;
