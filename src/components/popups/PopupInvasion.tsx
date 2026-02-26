import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FireworksConfetti from '@/components/ui-custom/FireworksConfetti';

interface PopupMessage {
  id: string;
  title: string;
  message: string;
  delay: number;
  position: { x: number; y: number };
}

const popupMessages: PopupMessage[] = [
  // Quick popups that happen once
  { id: '1', title: 'New Email', message: 'Client wants emergency redesign!', delay: 200, position: { x: 20, y: 20 } },
  { id: '2', title: 'Design Alert', message: 'Your portfolio crashed their server!', delay: 400, position: { x: 70, y: 30 } },
  { id: '3', title: 'Meeting Request', message: 'Urgent: They need your chaos aesthetic!', delay: 600, position: { x: 45, y: 60 } },
  { id: '4', title: 'Project Update', message: 'Your glitch art went viral!', delay: 800, position: { x: 30, y: 40 } },
  { id: '5', title: 'Design Award', message: 'Nominated for "Most Traumatic UX"!', delay: 1000, position: { x: 60, y: 70 } },
  { id: '6', title: 'Client Feedback', message: 'They love your existential dread approach!', delay: 1200, position: { x: 75, y: 35 } },
  { id: '7', title: 'Design Award', message: 'Nominated for "Most Traumatizing UX 2026"!', delay: 1400, position: { x: 10, y: 80 } },
  { id: '8', title: 'Team Meeting', message: 'Design system having existential crisis!', delay: 1600, position: { x: 50, y: 25 } },
  { id: '9', title: 'Design Inspiration', message: 'Found your moodboard of error messages!', delay: 1800, position: { x: 35, y: 55 } },
  { id: '10', title: 'New Project', message: 'Client wants your signature chaos!', delay: 2000, position: { x: 80, y: 45 } },
  
  // Final popup - closes all
  {
    id: '52',
    title: 'PAY MORE, GET LESS!',
    message: 'Our exclusive business model! Premium chaos pricing! CLICK ANYWHERE TO CONTINUE!',
    delay: 2500,
    position: { x: 40, y: 50 }
  }
];

export default function PopupInvasion() {
  const [activePopups, setActivePopups] = useState<PopupMessage[]>([]);
  const [canCloseAll, setCanCloseAll] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [triggerFireworks, setTriggerFireworks] = useState(false);

  // Check if popup invasion has already been shown this session
  const hasShownInvasion = false; // Always show for now - remove session storage

  useEffect(() => {
    // Don't show invasion if already shown this session
    if (hasShownInvasion) return;

    const timers: NodeJS.Timeout[] = [];

    popupMessages.forEach((popup) => {
      const timer = setTimeout(() => {
        setActivePopups(prev => [...prev, popup]);
        
        if (popup.id === '52') {
          // Final popup - close all immediately when clicked
          setCanCloseAll(true);
          setTriggerFireworks(true); // Trigger fireworks!
        }
      }, popup.delay);
      
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [hasShownInvasion]);

  const handleCloseAll = () => {
    if (!canCloseAll || isClosing) return;
    
    setIsClosing(true);
    setActivePopups([]);
    
    // Mark invasion as shown in session storage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('popupInvasionShown', 'true');
    }
    
    // Trigger the main app to handle the post-invasion state
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('popupInvasionComplete'));
    }, 500);
  };

  return (
    <>
      <FireworksConfetti trigger={triggerFireworks} />
      <AnimatePresence>
        {activePopups.map((popup) => (
        <motion.div
          key={popup.id}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: Math.random() * 20 - 10,
            x: Math.random() * 100 - 50
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0,
            rotate: Math.random() * 720 - 360,
            y: Math.random() * 200 - 100
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            mass: 0.8
          }}
          className={`fixed z-[9998] border-2 shadow-2xl rounded-lg p-4 max-w-xs cursor-pointer transition-all ${
            popup.id === '52' 
              ? 'bg-gradient-to-br from-red-600 to-crisis-pink border-red-800 shadow-red-500/50 animate-pulse' 
              : 'bg-white border-black hover:shadow-pink-500/50'
          }`}
          style={{
            left: `${popup.position.x}%`,
            top: `${popup.position.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: popup.id === '52' ? 'pulse 1s infinite' : undefined
          }}
          onClick={handleCloseAll}
        >
          <div className="flex items-start gap-2">
            <div className={`flex-shrink-0 w-2 h-2 rounded-full animate-pulse mt-1 ${
              popup.id === '52' ? 'bg-white' : 'bg-red-500'
            }`}></div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm mb-1 ${
                popup.id === '52' ? 'text-white' : 'text-gray-900'
              }`}>
                {popup.title}
              </h3>
              <p className={`text-xs leading-relaxed ${
                popup.id === '52' ? 'text-white/90' : 'text-gray-700'
              }`}>
                {popup.message}
              </p>
            </div>
          </div>
          
          {popup.id === '52' && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mt-3 text-center"
            >
              <span className="text-sm font-bold text-white animate-bounce">
                💸 PAY MORE, GET LESS! 💸
              </span>
              <div className="mt-2 text-xs text-white/80">
                🎆 Fireworks included! 🎊
              </div>
            </motion.div>
          )}
          
          <div className="mt-2 flex justify-between items-center">
            <span className={`text-[8px] ${
              popup.id === '52' ? 'text-white/70' : 'text-gray-400'
            }`}>
              {new Date().toLocaleTimeString()}
            </span>
            <button 
              className={`text-xs transition-colors ${
                popup.id === '52' 
                  ? 'text-white/80 hover:text-white' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActivePopups(prev => prev.filter(p => p.id !== popup.id));
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      ))}
      
      {canCloseAll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] bg-black/20 backdrop-blur-sm cursor-pointer"
          onClick={handleCloseAll}
        />
      )}
    </AnimatePresence>
    </>
  );
}
