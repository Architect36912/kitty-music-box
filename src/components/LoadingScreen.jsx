import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import kittyImage from '/image_fx_ (10).jpg';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid #ff69b4',
          boxShadow: '0 0 30px rgba(255, 105, 180, 0.5)',
          position: 'relative',
          mb: 4,
        }}
      >
        <img
          src={kittyImage}
          alt="Kitty Loading"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#ff69b4',
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          textAlign: 'center',
        }}
      >
        🐱 Loading Kitty's Music Box
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          maxWidth: 400,
          px: 2,
        }}
      >
        Getting everything purr-fect for you...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
