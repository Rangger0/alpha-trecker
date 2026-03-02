// src/components/auth/PipesBackground.tsx
import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Pipe {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  length: number;
  progress: number;
  speed: number;
  color: string;
  width: number;
  opacity: number;
}

export function PipesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const colors = isDark 
    ? ['#00FF88', '#00CC6A', '#00994F', '#00FFAA', '#66FFB3']
    : ['#2564eb', '#3B82F6', '#60A5FA', '#1d4fd8', '#93C5FD'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let pipes: Pipe[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let frameCount = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    const createPipe = (startX?: number, startY?: number): Pipe => {
      const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
      const x = startX ?? Math.random() * canvas.width;
      const y = startY ?? Math.random() * canvas.height;
      
      return {
        x,
        y,
        direction: directions[Math.floor(Math.random() * directions.length)],
        length: 100 + Math.random() * 200,
        progress: 0,
        speed: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 2 + Math.random() * 3,
        opacity: 0.6 + Math.random() * 0.4,
      };
    };

    const drawPipe = (pipe: Pipe) => {
      ctx.strokeStyle = pipe.color;
      ctx.lineWidth = pipe.width;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = pipe.color;
      ctx.globalAlpha = pipe.opacity;

      ctx.beginPath();
      ctx.moveTo(pipe.x, pipe.y);

      let endX = pipe.x;
      let endY = pipe.y;

      switch (pipe.direction) {
        case 'up':
          endY = pipe.y - pipe.progress;
          break;
        case 'down':
          endY = pipe.y + pipe.progress;
          break;
        case 'left':
          endX = pipe.x - pipe.progress;
          break;
        case 'right':
          endX = pipe.x + pipe.progress;
          break;
      }

      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Data packet
      if (pipe.progress > 20) {
        const packetPos = pipe.progress * 0.8;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 25;
        ctx.shadowColor = pipe.color;
        ctx.globalAlpha = 1;

        let packetX = pipe.x;
        let packetY = pipe.y;

        switch (pipe.direction) {
          case 'up':
            packetY = pipe.y - packetPos;
            break;
          case 'down':
            packetY = pipe.y + packetPos;
            break;
          case 'left':
            packetX = pipe.x - packetPos;
            break;
          case 'right':
            packetX = pipe.x + packetPos;
            break;
        }

        ctx.beginPath();
        ctx.arc(packetX, packetY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const updatePipe = (pipe: Pipe) => {
      pipe.progress += pipe.speed;
      
      const dx = mouseX - pipe.x;
      const dy = mouseY - pipe.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        pipe.progress += 1;
      }

      return pipe.progress < pipe.length;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      frameCount++;

      if (frameCount % 20 === 0 && pipes.length < 25) {
        pipes.push(createPipe());
      }

      if (frameCount % 40 === 0) {
        pipes.push(createPipe(mouseX, mouseY));
      }

      pipes = pipes.filter((pipe) => {
        const alive = updatePipe(pipe);
        if (alive) drawPipe(pipe);
        return alive;
      });

      // Connection nodes
      pipes.forEach((pipe, i) => {
        pipes.slice(i + 1).forEach((otherPipe) => {
          const dx = Math.abs(pipe.x - otherPipe.x);
          const dy = Math.abs(pipe.y - otherPipe.y);
          
          if (dx < 15 && dy < 15) {
            ctx.fillStyle = isDark ? '#00ff88' : '#0051ff';
            ctx.shadowBlur = 30;
            ctx.shadowColor = ctx.fillStyle;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(pipe.x, pipe.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    for (let i = 0; i < 8; i++) {
      pipes.push(createPipe());
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isDark, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ opacity: 0.6 }}
    />
  );
}