import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface KineticLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

const sizeClasses = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
  xl: 'text-display-xl',
};

export default function KineticLogo({ 
  className = '', 
  size = 'xl',
  showTagline = true 
}: KineticLogoProps) {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const letters = 'OK CRISIS'.split('');
  
  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    }));
  }, [controls]);
  
  const handleHover = () => {
    setIsHovered(true);
    controls.start({
      textShadow: [
        '0 0 10px rgba(255, 45, 149, 0.5)',
        '0 0 20px rgba(255, 45, 149, 0.4)',
        '0 0 30px rgba(255, 45, 149, 0.3)',
      ],
      transition: { duration: 0.3 },
    });
  };
  
  const handleHoverEnd = () => {
    setIsHovered(false);
    controls.start({
      textShadow: '0 0 0px rgba(255, 45, 149, 0)',
      transition: { duration: 0.3 },
    });
  };
  
  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center justify-center ${className}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      {/* Main Logo */}
      <div className="relative">
        <motion.div 
          className={`font-black tracking-tighter ${sizeClasses[size]} flex`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.04em',
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={controls}
              whileHover={{
                x: Math.random() > 0.5 ? 3 : -3,
                transition: { duration: 0.1, repeat: 2, repeatType: 'reverse' },
              }}
              className="inline-block relative"
              style={{
                color: letter === ' ' ? 'transparent' : 'white',
                textShadow: isHovered 
                  ? '0 0 20px rgba(255, 45, 149, 0.6), 0 0 40px rgba(255, 45, 149, 0.4)'
                  : '0 0 10px rgba(255, 45, 149, 0.3)',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
              
              {/* Particle burst on hover */}
              {isHovered && (
                <motion.div
                  className="absolute -top-2 left-1/2"
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{ opacity: 0, scale: 2, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      className="absolute w-1 h-1 rounded-full bg-crisis-pink"
                      initial={{ x: 0, y: 0 }}
                      animate={{
                        x: (Math.random() - 0.5) * 40,
                        y: (Math.random() - 0.5) * 40,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.5, delay: j * 0.05 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Glitch overlay */}
        <motion.div
          className={`absolute inset-0 font-black tracking-tighter ${sizeClasses[size]} flex pointer-events-none`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.04em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255, 45, 149, 0.3)',
          }}
          animate={isHovered ? {
            x: [0, -2, 2, -1, 1, 0],
            opacity: [0, 0.5, 0, 0.3, 0, 0],
          } : {}}
          transition={{ duration: 0.2 }}
        >
          {'OK CRISIS'.split('').map((letter, i) => (
            <span key={i} className="inline-block">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </motion.div>
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-4 text-sm md:text-base text-white/60 text-center max-w-md font-light tracking-wide"
        >
          Do you wanna look good or not?{' '}
          <span className="text-crisis-pink">Don't you wanna dress your best for the crisis?</span>
        </motion.p>
      )}
      
      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-crisis-pink to-transparent"
      />
    </div>
  );
}
