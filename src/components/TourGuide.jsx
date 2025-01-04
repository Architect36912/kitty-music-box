import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, NavigateNext, NavigateBefore, Pets } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const tourSteps = [
  {
    title: "Welcome to Kitty's Music Box! ",
    content: "Meow! I'm your musical companion! I'll help you create purr-fect melodies. Let me show you around my musical playground!",
    image: '/kitty-icon.jpg'
  },
  {
    title: "My Musical Face ",
    content: "The grid is shaped like my face! My eyes, nose, and whiskers light up when you make music. Try clicking different parts to create sounds!",
    target: '.grid-sequencer'
  },
  {
    title: "My AI Powers ",
    content: "I can help you make music! Click the magic wand to see my suggestions or let me create a whole melody for you!",
    target: '.ai-controls'
  },
  {
    title: "Play with Me! ",
    content: "Press the big play button to hear your creation. Watch my face react to the music - I get excited when there's lots of notes!",
    target: '.play-controls'
  },
  {
    title: "Complete Tasks ",
    content: "I have special tasks for you! Create melodies, use AI, and make groovy beats to earn points. Check them on the right side!",
    target: '.tasks-panel'
  },
  {
    title: "Ready to Make Music! ",
    content: "Let's create some amazing music together! Remember, I'm always here to help with my AI powers!",
    image: '/kitty-icon.jpg'
  }
];

const TourGuide = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open && tourSteps[activeStep].target) {
      const element = document.querySelector(tourSteps[activeStep].target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setShowHighlight(true);
      }
    }
    return () => setShowHighlight(false);
  }, [activeStep, open]);

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, tourSteps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleClose = () => {
    localStorage.setItem('tourCompleted', 'true');
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff8fa 0%, #fff 100%)',
            boxShadow: '0 8px 32px rgba(255,105,180,0.2)',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                color: '#ff1493',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Pets sx={{ color: '#ff69b4' }} />
              {tourSteps[activeStep].title}
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: '#ff69b4' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tourSteps[activeStep].image && (
                <Box
                  component="img"
                  src={tourSteps[activeStep].image}
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(255,105,180,0.2)',
                  }}
                />
              )}
              <Typography 
                sx={{ 
                  color: '#333',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  fontWeight: 500,
                  mb: 3,
                  '& strong': {
                    color: '#ff1493',
                  }
                }}
              >
                {tourSteps[activeStep].content}
              </Typography>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel={!isMobile}
              orientation={isMobile ? 'vertical' : 'horizontal'}
            >
              {tourSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel 
                    StepIconProps={{
                      sx: {
                        color: '#ff69b4',
                        '&.Mui-active': {
                          color: '#ff1493',
                        },
                        '&.Mui-completed': {
                          color: '#ff69b4',
                        },
                      }
                    }}
                  />
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<NavigateBefore />}
            sx={{
              color: '#ff69b4',
              '&:hover': {
                bgcolor: 'rgba(255,105,180,0.1)',
              },
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === tourSteps.length - 1 ? handleClose : handleNext}
            endIcon={activeStep === tourSteps.length - 1 ? <Pets /> : <NavigateNext />}
            sx={{
              background: 'linear-gradient(45deg, #ff69b4, #ff1493)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff4081, #ff1493)',
              },
              px: 4,
            }}
          >
            {activeStep === tourSteps.length - 1 ? 'Start Making Music!' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      {showHighlight && tourSteps[activeStep].target && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1200,
            pointerEvents: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              border: '2px solid #ff69b4',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            },
          }}
        />
      )}
    </>
  );
};

export default TourGuide;
