import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ParallaxLogo() {
  const [scrollY, setScrollY] = useState(0);
  const [logoPosition, setLogoPosition] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Enhanced parallax - move logo down when scrolling up
      const parallaxOffset = -currentScrollY * 0.8; // Stronger parallax effect
      setLogoPosition(parallaxOffset);
      
      // Add rotation based on scroll
      setRotation(currentScrollY * 0.1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
      className="fixed top-1/2 left-1/2 z-[9994] pointer-events-none"
      style={{
        transform: `translate(-50%, -50%) translateY(${logoPosition}px) rotate(${rotation}deg)`,
      }}
    >
      <motion.div
        className="relative"
      >
        {/* Enhanced glow effects */}
        <motion.div
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-crisis-pink via-crisis-cyan to-crisis-gold rounded-2xl blur-xl"
        />
        
        {/* Logo container with enhanced effects */}
        <div className="relative bg-black/90 backdrop-blur-md border-2 border-crisis-pink rounded-2xl px-8 py-4 shadow-2xl">
          {/* Animated border glow */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 45, 149, 0.5)",
                "0 0 40px rgba(0, 240, 255, 0.5)",
                "0 0 20px rgba(255, 215, 0, 0.5)",
                "0 0 20px rgba(255, 45, 149, 0.5)"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-2xl"
          />
          
          <div className="relative flex items-center gap-4">
            {/* Enhanced logo icon - replace with your actual logo icon */}
            <div className="relative w-12 h-12">
              <img 
                src="/logo/logo-icon.svg" 
                alt="Crisis Logo Icon"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to animated placeholder if logo not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback placeholder - no spinning */}
              <div
                className="hidden w-12 h-12 bg-gradient-to-br from-crisis-pink to-crisis-purple rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-black text-lg">OK</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <motion.span 
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255, 45, 149, 0.8)",
                    "0 0 20px rgba(0, 240, 255, 0.8)",
                    "0 0 10px rgba(255, 215, 0, 0.8)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="text-white font-black text-2xl tracking-tight"
              >
                CRISIS
              </motion.span>
              <motion.span 
                animate={{
                  opacity: [0.5, 1, 0.5],
                  letterSpacing: ["0.05em", "0.15em", "0.05em"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-crisis-pink text-[10px] tracking-widest uppercase"
              >
                Design Studio
              </motion.span>
            </div>
          </div>
        </div>
        
        {/* Enhanced glitch effect overlay */}
        <motion.div
          animate={{
            opacity: [0, 0.2, 0],
            x: [0, 5, -5, 0]
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: 4,
          }}
          className="absolute inset-0 bg-gradient-to-r from-crisis-pink to-crisis-cyan rounded-2xl"
          style={{
            filter: 'blur(3px)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>
      
      {/* Enhanced scroll indicator */}
      {scrollY < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-crisis-pink text-lg"
          >
            ↓
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
