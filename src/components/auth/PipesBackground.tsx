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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let pipes: Pipe[] = [];
    let frameCount = 0;
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30;
    const colors = isDark
      ? ['#decc73', '#eede2e', '#f6da74', '#f1e986', '#f8eb94']
      : ['#2564eb', 'var(--alpha-signal)', '#60A5FA', '#1d4fd8', '#93C5FD'];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maxPipes = prefersReducedMotion ? 0 : 10;
    const spawnInterval = prefersReducedMotion ? Number.MAX_SAFE_INTEGER : 30;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);

        canvas.width = width;
        canvas.height = height;
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
        length: 80 + Math.random() * 120,
        progress: 0,
        speed: 0.8 + Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 1.5 + Math.random() * 1.5,
        opacity: 0.35 + Math.random() * 0.25,
      };
    };

    const drawPipe = (pipe: Pipe) => {
      ctx.strokeStyle = pipe.color;
      ctx.lineWidth = pipe.width;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
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
        const packetPos = pipe.progress * 0.72;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
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
        ctx.arc(packetX, packetY, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const updatePipe = (pipe: Pipe) => {
      pipe.progress += pipe.speed;

      return pipe.progress < pipe.length;
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      if (frameCount % spawnInterval === 0 && pipes.length < maxPipes) {
        pipes.push(createPipe());
      }

      pipes = pipes.filter((pipe) => {
        const alive = updatePipe(pipe);
        if (alive) drawPipe(pipe);
        return alive;
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < Math.min(4, maxPipes); i++) {
      pipes.push(createPipe());
    }

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.38 }}
    />
  );
}
