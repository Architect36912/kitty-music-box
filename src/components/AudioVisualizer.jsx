import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const AudioVisualizer = ({ analyser, isDarkMode }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  const draw = () => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas with theme-appropriate background
    ctx.fillStyle = isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
    ctx.fillRect(0, 0, width, height);

    try {
      // Draw frequency data
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencyData);

      const barWidth = (width / frequencyData.length) * 2.5;
      const barSpacing = 1;
      let x = 0;

      // Create gradient for bars
      const barGradient = ctx.createLinearGradient(0, height, 0, 0);
      barGradient.addColorStop(0, '#ff69b4');
      barGradient.addColorStop(1, '#ff1493');

      for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = (frequencyData[i] / 255) * height;
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff1493';
        ctx.fillStyle = barGradient;
        
        // Draw bar with rounded corners
        ctx.beginPath();
        ctx.roundRect(x, height - barHeight, barWidth - barSpacing, barHeight, 5);
        ctx.fill();
        
        x += barWidth;
      }

      // Draw waveform
      const waveformData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(waveformData);

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = isDarkMode ? '#ff1493' : '#ff69b4';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff69b4';

      const sliceWidth = width / waveformData.length;
      x = 0;

      for (let i = 0; i < waveformData.length; i++) {
        const v = waveformData[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Add decorative kitty ears at peaks
      const peaks = [];
      for (let i = 1; i < waveformData.length - 1; i++) {
        if (waveformData[i] > waveformData[i - 1] && waveformData[i] > waveformData[i + 1]) {
          peaks.push({ x: i * sliceWidth, y: (waveformData[i] / 128.0) * (height / 2) });
        }
      }

      // Draw kitty ears on some peaks
      peaks.forEach((peak, index) => {
        if (index % 20 === 0) { // Draw ears every 20 peaks to avoid overcrowding
          ctx.fillStyle = '#ff69b4';
          // Left ear
          ctx.beginPath();
          ctx.moveTo(peak.x - 10, peak.y);
          ctx.lineTo(peak.x, peak.y - 15);
          ctx.lineTo(peak.x + 5, peak.y);
          ctx.closePath();
          ctx.fill();
          // Right ear
          ctx.beginPath();
          ctx.moveTo(peak.x + 5, peak.y);
          ctx.lineTo(peak.x + 15, peak.y - 15);
          ctx.lineTo(peak.x + 20, peak.y);
          ctx.closePath();
          ctx.fill();
        }
      });

    } catch (error) {
      console.log('Visualizer not ready yet');
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  // Handle canvas resize
  const handleResize = () => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match container
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initial resize
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Start animation
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isDarkMode]);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        background: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </Box>
  );
};

export default AudioVisualizer;
