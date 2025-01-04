import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function Test() {
  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#111111' }}>
      <Typography 
        variant="h2" 
        sx={{ 
          mb: 4,
          color: '#ff69b4',
          textAlign: 'center'
        }}
      >
        Test Component
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Box>
  );
}

export default Test;
