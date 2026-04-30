import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'star';
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
const shapes: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isActive && !isAnimating) {
      setIsAnimating(true);
      
      const newParticles: Particle[] = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100 + Math.random() * 0.5;
        const speed = 8 + Math.random() * 12;
        
        newParticles.push({
          id: i,
          x: centerX,
          y: centerY,
          size: 8 + Math.random() * 12,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 20,
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        });
      }
      
      setParticles(newParticles);
      
      const duration = 3000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed < duration) {
          setParticles(prev => prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3,
            vx: p.vx * 0.98,
            rotation: p.rotation + p.rotationSpeed
          })));
          
          requestAnimationFrame(animate);
        } else {
          setParticles([]);
          setIsAnimating(false);
          onComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isActive, isAnimating, onComplete]);
  
  if (particles.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.shape !== 'star' ? p.color : 'transparent',
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '0',
            clipPath: p.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none',
            boxShadow: p.shape === 'circle' ? `0 0 ${p.size}px ${p.color}` : 'none'
          }}
        />
      ))}
    </div>
  );
}
