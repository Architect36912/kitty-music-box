import React, { useEffect } from 'react';
import { Box } from '@mui/material';

const SnowEffect = () => {
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.style.left = Math.random() * window.innerWidth + 'px';
      snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
      snowflake.style.opacity = Math.random();
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      snowflake.innerHTML = '❄';
      return snowflake;
    };

    const snow = () => {
      const snowflake = createSnowflake();
      document.getElementById('snow-container').appendChild(snowflake);

      // Remove snowflake after animation
      setTimeout(() => {
        snowflake.remove();
      }, 5000);
    };

    const snowInterval = setInterval(snow, 100);

    return () => clearInterval(snowInterval);
  }, []);

  return (
    <Box
      id="snow-container"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        '& .snowflake': {
          position: 'fixed',
          top: '-10px',
          color: '#fff',
          animation: 'fall linear forwards',
          '@keyframes fall': {
            to: {
              transform: 'translateY(105vh)',
            },
          },
        },
      }}
    />
  );
};

export default SnowEffect;
