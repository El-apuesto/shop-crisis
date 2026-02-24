import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FrameworkAccess {
  id: string;
  name: string;
  version: string;
  type: 'frontend' | 'backend' | 'styling' | 'animation' | 'state' | 'ui';
  description: string;
  icon: string;
  accessTime: number;
}

const frameworks: FrameworkAccess[] = [
  {
    id: '1',
    name: 'React',
    version: '19.2.0',
    type: 'frontend',
    description: 'Component rendering engine',
    icon: '⚛️',
    accessTime: 100
  },
  {
    id: '2',
    name: 'TypeScript',
    version: '5.9.3',
    type: 'frontend',
    description: 'Type safety enforcement',
    icon: '📘',
    accessTime: 300
  },
  {
    id: '3',
    name: 'Tailwind CSS',
    version: '3.4.19',
    type: 'styling',
    description: 'Utility-first styling',
    icon: '🎨',
    accessTime: 500
  },
  {
    id: '4',
    name: 'Framer Motion',
    version: '12.34.3',
    type: 'animation',
    description: 'Animation library',
    icon: '🎬',
    accessTime: 700
  },
  {
    id: '5',
    name: 'GSAP',
    version: '3.14.2',
    type: 'animation',
    description: 'Professional animation',
    icon: '⚡',
    accessTime: 900
  },
  {
    id: '6',
    name: 'Three.js',
    version: '0.183.1',
    type: 'frontend',
    description: '3D graphics rendering',
    icon: '🎮',
    accessTime: 1100
  },
  {
    id: '7',
    name: 'Zustand',
    version: '5.0.11',
    type: 'state',
    description: 'State management',
    icon: '🗄️',
    accessTime: 1300
  },
  {
    id: '8',
    name: 'Radix UI',
    version: '1.1.15',
    type: 'ui',
    description: 'Accessible components',
    icon: '♿',
    accessTime: 1500
  },
  {
    id: '9',
    name: 'Vite',
    version: '7.2.4',
    type: 'frontend',
    description: 'Build tool & dev server',
    icon: '🔥',
    accessTime: 1700
  },
  {
    id: '10',
    name: 'PostCSS',
    version: '8.5.6',
    type: 'styling',
    description: 'CSS processing',
    icon: '📝',
    accessTime: 1900
  }
];

const typeColors = {
  frontend: 'from-blue-500 to-cyan-500',
  backend: 'from-green-500 to-emerald-500',
  styling: 'from-purple-500 to-pink-500',
  animation: 'from-orange-500 to-red-500',
  state: 'from-indigo-500 to-purple-500',
  ui: 'from-teal-500 to-green-500'
};

export default function ExposedFrameworks() {
  const [scrollY, setScrollY] = useState(0);
  const [accessedFrameworks, setAccessedFrameworks] = useState<FrameworkAccess[]>([]);
  const [currentAccess, setCurrentAccess] = useState<FrameworkAccess | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Calculate which frameworks should be accessed based on scroll position
      const scrollProgress = Math.min(currentScrollY / 2000, 1); // Full access at 2000px
      const frameworksToAccess = frameworks.filter(framework => 
        framework.accessTime <= scrollProgress * 2000
      );

      setAccessedFrameworks(frameworksToAccess);

      // Set current accessing framework
      const nextFramework = frameworks.find(framework => 
        framework.accessTime > scrollProgress * 1900 && 
        framework.accessTime <= scrollProgress * 2000 + 100
      );
      
      if (nextFramework && nextFramework.id !== currentAccess?.id) {
        setCurrentAccess(nextFramework);
        
        // Trigger glitch effect
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200);
        
        // Clear current access after animation
        setTimeout(() => setCurrentAccess(null), 1000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentAccess]);

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9993] pointer-events-none">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`bg-black/90 backdrop-blur-md border rounded-lg p-4 max-w-xs transition-all duration-300 ${
          glitchEffect 
            ? 'border-crisis-pink shadow-pink-500/50' 
            : 'border-crisis-pink/30'
        }`}
        style={{
          boxShadow: glitchEffect 
            ? '0 0 30px rgba(255, 45, 149, 0.5)' 
            : '0 0 10px rgba(255, 45, 149, 0.2)'
        }}
      >
        <motion.h3 
          animate={{
            textShadow: glitchEffect 
              ? ["0 0 10px rgba(255, 45, 149, 0.8)", "0 0 20px rgba(255, 45, 149, 0.4)", "0 0 10px rgba(255, 45, 149, 0.8)"]
              : "0 0 5px rgba(255, 45, 149, 0.3)"
          }}
          transition={{ duration: 0.3 }}
          className="text-crisis-pink font-bold text-xs mb-3 tracking-widest uppercase"
        >
          Framework Access Log
        </motion.h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {accessedFrameworks.map((framework) => (
              <motion.div
                key={framework.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }}
                className={`relative bg-gradient-to-r ${typeColors[framework.type]} bg-opacity-10 border border-white/20 rounded p-2 overflow-hidden`}
              >
                {/* Subtle scan line effect */}
                <motion.div
                  animate={{ y: [-20, 20] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                  className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                
                <div className="relative flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="text-lg"
                  >
                    {framework.icon}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <motion.span 
                        animate={{
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-white font-semibold text-xs truncate"
                      >
                        {framework.name}
                      </motion.span>
                      <motion.span 
                        animate={{
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-white/50 text-[8px]"
                      >
                        v{framework.version}
                      </motion.span>
                    </div>
                    <motion.p 
                      animate={{
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-white/70 text-[8px] truncate"
                    >
                      {framework.description}
                    </motion.p>
                  </div>
                  <motion.div 
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${typeColors[framework.type]}`}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Enhanced current access indicator */}
        <AnimatePresence>
          {currentAccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-2 bg-gradient-to-r from-crisis-pink/20 to-crisis-cyan/20 border border-crisis-pink rounded relative overflow-hidden"
            >
              {/* Scanning effect */}
              <motion.div
                animate={{ x: [-100, 100] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-crisis-pink to-transparent"
              />
              
              <div className="relative flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-lg"
                >
                  {currentAccess.icon}
                </motion.div>
                <div className="flex-1">
                  <motion.p 
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-crisis-pink font-bold text-xs"
                  >
                    ACCESSING...
                  </motion.p>
                  <motion.p 
                    animate={{
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-white/80 text-[8px]"
                  >
                    {currentAccess.name}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced scroll progress indicator */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between mb-1">
            <motion.span 
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-white/50 text-[8px]"
            >
              Scan Progress
            </motion.span>
            <motion.span 
              animate={{
                opacity: [0.7, 1, 0.7],
                textShadow: ["0 0 5px rgba(255, 45, 149, 0.5)", "0 0 10px rgba(255, 45, 149, 0.8)", "0 0 5px rgba(255, 45, 149, 0.5)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-crisis-pink text-[8px] font-bold"
            >
              {Math.round((scrollY / 2000) * 100)}%
            </motion.span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-crisis-pink via-crisis-cyan to-crisis-purple rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((scrollY / 2000) * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            >
              {/* Shimmer effect on progress bar */}
              <motion.div
                animate={{ x: [-100, 200] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
