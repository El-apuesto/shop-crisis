import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Info, Skull } from 'lucide-react';

interface PopupData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'chaos';
  buttons?: { label: string; onClick?: () => void; variant?: 'primary' | 'secondary' }[];
}

const popupSequence: Omit<PopupData, 'id'>[] = [
  {
    title: 'CRISIS DETECTED',
    message: "Oops, looks like you've triggered a crisis. Did you forget to panic-buy?",
    type: 'chaos',
  },
  {
    title: 'Error 404: Style Not Found',
    message: "Your fashion sense appears to be missing. Have you checked the void?",
    type: 'error',
  },
  {
    title: 'System Overload',
    message: "Too much fabulousness detected. Cooling systems engaged.",
    type: 'warning',
  },
  {
    title: 'Warning',
    message: "Low self-esteem detected. Would you like to purchase confidence?",
    type: 'warning',
  },
  {
    title: 'Alert',
    message: "You're not dressed for this. Emergency outfit recommended.",
    type: 'info',
  },
  {
    title: 'Critical',
    message: "Existential dread rising. Retail therapy suggested.",
    type: 'chaos',
  },
];

export default function PopupSystem() {
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [inactivityTimer, setInactivityTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  
  const addPopup = useCallback((popup: Omit<PopupData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setPopups((prev) => [...prev, { ...popup, id }]);
  }, []);
  
  const removePopup = useCallback((id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  }, []);
  
  const clearAllPopups = useCallback(() => {
    setPopups([]);
    setSequenceIndex(0);
    setShowFinalPopup(false);
  }, []);
  
  // Inactivity detection
  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      const timer = setTimeout(() => {
        if (sequenceIndex < popupSequence.length) {
          addPopup(popupSequence[sequenceIndex]);
          setSequenceIndex((prev) => prev + 1);
          
          // Rapid-fire remaining popups
          if (sequenceIndex === 0) {
            let delay = 100;
            for (let i = 1; i < popupSequence.length; i++) {
              setTimeout(() => {
                addPopup(popupSequence[i]);
                setSequenceIndex(i + 1);
              }, delay);
              delay += 150;
            }
            
            // Show final popup after sequence
            setTimeout(() => {
              setShowFinalPopup(true);
            }, delay + 500);
          }
        }
      }, 8000);
      setInactivityTimer(timer);
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    resetTimer();
    
    return () => {
      events.forEach((event) => document.removeEventListener(event, resetTimer));
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [inactivityTimer, sequenceIndex, addPopup]);
  
  const getIcon = (type: PopupData['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'chaos':
        return <Skull className="w-5 h-5 text-crisis-pink" />;
      default:
        return <Info className="w-5 h-5 text-crisis-cyan" />;
    }
  };
  
  const getBorderColor = (type: PopupData['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-500/50';
      case 'warning':
        return 'border-yellow-500/50';
      case 'chaos':
        return 'border-crisis-pink/50';
      default:
        return 'border-crisis-cyan/50';
    }
  };
  
  return (
    <>
      {/* Regular popups */}
      <AnimatePresence>
        {popups.map((popup, index) => (
          <motion.div
            key={popup.id}
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 50,
              rotateX: -15,
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0,
              rotateZ: index * 2 - (popups.length - 1),
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 100,
              rotateX: 15,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25,
              delay: index * 0.05,
            }}
            className={`fixed z-[100] glass-panel border-2 ${getBorderColor(popup.type)} rounded-lg p-4 w-80`}
            style={{
              top: `${20 + index * 15}%`,
              right: `${20 + index * 5}%`,
              transformOrigin: 'center bottom',
              boxShadow: `
                0 20px 40px rgba(0,0,0,0.4),
                0 0 20px ${popup.type === 'chaos' ? 'rgba(255,45,149,0.2)' : 'rgba(0,240,255,0.2)'}
              `,
            }}
          >
            {/* Animated border shimmer */}
            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
              <motion.div
                className="absolute inset-0 shimmer-border opacity-30"
                animate={{ backgroundPosition: ['0% 50%', '300% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getIcon(popup.type)}
                <span className="font-bold text-sm tracking-wider text-white">
                  {popup.title}
                </span>
              </div>
              <motion.button
                whileHover={{ rotate: 360, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removePopup(popup.id)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Message with typewriter effect */}
            <motion.p 
              className="text-sm text-white/70 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {popup.message}
            </motion.p>
            
            {/* Screen shake effect for chaos popups */}
            {popup.type === 'chaos' && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{
                  x: [0, -3, 3, -3, 3, 0],
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Final popup with buttons */}
      <AnimatePresence>
        {showFinalPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowFinalPopup(false);
                clearAllPopups();
              }
            }}
          >
            <motion.div
              className="glass-panel border-2 border-crisis-pink/50 rounded-xl p-6 w-96 max-w-[90vw]"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Skull className="w-6 h-6 text-crisis-pink" />
                <h3 className="text-xl font-bold text-white">Our Apologies</h3>
              </div>
              
              <p className="text-white/70 mb-6 leading-relaxed">
                Sorry for the mix-up — we thought you were our ex-designer. As amends, want free shipping for just $5?
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    addPopup({
                      title: 'Free Shipping Applied!',
                      message: "Because choices are an illusion. (But hey, you saved $5!)",
                      type: 'info',
                    });
                    setShowFinalPopup(false);
                  }}
                  className="flex-1 py-3 px-4 bg-crisis-pink/20 border border-crisis-pink rounded-lg text-crisis-pink font-bold text-sm hover:bg-crisis-pink/30 transition-colors"
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    addPopup({
                      title: 'Interesting Choice',
                      message: "You said no, but we applied it anyway. Free shipping activated!",
                      type: 'chaos',
                    });
                    setShowFinalPopup(false);
                  }}
                  className="flex-1 py-3 px-4 bg-white/5 border border-white/20 rounded-lg text-white/70 font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  No
                </motion.button>
              </div>
              
              {/* Follow-up offer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-xs text-white/40 text-center"
              >
                Or pay $5 to delay your shipment by up to 5 business days — for that extra anticipation.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dismiss all button when multiple popups */}
      {popups.length > 2 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={clearAllPopups}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[105] px-6 py-3 glass-panel border border-crisis-pink/30 rounded-full text-sm font-bold text-crisis-pink hover:bg-crisis-pink/10 transition-colors"
        >
          Dismiss All Crisis Alerts
        </motion.button>
      )}
    </>
  );
}
