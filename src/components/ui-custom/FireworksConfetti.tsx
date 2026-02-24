import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  type: 'confetti' | 'firework';
}

export default function FireworksConfetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#ff2d95', '#00f0ff', '#ffd700', '#ff0040', '#00ff00', '#ff00ff'];
    const newParticles: Particle[] = [];

    // Create confetti
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: `confetti-${i}`,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * -15 - 5
        },
        type: 'confetti'
      });
    }

    // Create firework bursts
    for (let i = 0; i < 5; i++) {
      const centerX = Math.random() * window.innerWidth;
      const centerY = Math.random() * window.innerHeight * 0.5;
      
      for (let j = 0; j < 20; j++) {
        const angle = (Math.PI * 2 * j) / 20;
        const speed = Math.random() * 5 + 5;
        
        newParticles.push({
          id: `firework-${i}-${j}`,
          x: centerX,
          y: centerY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 2,
          velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
          },
          type: 'firework'
        });
      }
    }

    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.velocity.x,
        y: particle.y + particle.velocity.y,
        velocity: {
          x: particle.velocity.x * 0.98,
          y: particle.velocity.y + 0.5 // gravity
        }
      })).filter(particle => particle.y < window.innerHeight + 50));
    }, 50);

    // Clean up after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, 3000);

    return () => clearInterval(interval);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              rotate: 0
            }}
            animate={{ 
              opacity: [1, 1, 0],
              scale: [0, 1, 0.5],
              rotate: particle.type === 'confetti' ? 360 : 0
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: particle.type === 'firework' ? 1 : 2,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.type === 'confetti' ? '2px' : '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
