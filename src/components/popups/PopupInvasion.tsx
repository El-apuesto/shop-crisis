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
  // 50 rapid popups over 3 seconds (every 60ms)
  { id: '1', title: 'Welcome Back!', message: 'We missed you! The design team has been waiting.', delay: 100, position: { x: 20, y: 20 } },
  { id: '2', title: 'Design Review', message: 'Client loves your chaotic energy!', delay: 160, position: { x: 70, y: 15 } },
  { id: '3', title: 'URGENT Meeting', message: 'Sarah needs your input on crisis aesthetic!', delay: 220, position: { x: 15, y: 60 } },
  { id: '4', title: 'Design System', message: 'Your color palette is trending!', delay: 280, position: { x: 60, y: 70 } },
  { id: '5', title: 'Portfolio Feature', message: 'Design Weekly wants to feature you!', delay: 340, position: { x: 25, y: 40 } },
  { id: '6', title: 'Client Feedback', message: 'They love your existential dread approach!', delay: 400, position: { x: 75, y: 35 } },
  { id: '7', title: 'Design Award', message: 'Nominated for "Most Traumatizing UX 2026"!', delay: 460, position: { x: 10, y: 80 } },
  { id: '8', title: 'Team Meeting', message: 'Design system having existential crisis!', delay: 520, position: { x: 50, y: 25 } },
  { id: '9', title: 'Design Inspiration', message: 'Found your moodboard of error messages!', delay: 580, position: { x: 35, y: 55 } },
  { id: '10', title: 'New Project', message: 'Client wants your signature chaos!', delay: 640, position: { x: 80, y: 45 } },
  { id: '11', title: 'Design Trend', message: 'Your glitch art is going viral!', delay: 700, position: { x: 45, y: 15 } },
  { id: '12', title: 'Conference Invite', message: 'Keynote speaker at CrisisCon 2026!', delay: 760, position: { x: 20, y: 75 } },
  { id: '13', title: 'Design Workshop', message: 'Teach your "chaotic minimalism" method!', delay: 820, position: { x: 65, y: 50 } },
  { id: '14', title: 'Client Call', message: 'They want MORE of your signature style!', delay: 880, position: { x: 30, y: 30 } },
  { id: '15', title: 'Design Blog', message: 'Featured in "Post-Apocalyptic Design"!', delay: 940, position: { x: 55, y: 80 } },
  { id: '16', title: 'Award Ceremony', message: 'You won "Most Disruptive Designer"!', delay: 1000, position: { x: 15, y: 45 } },
  { id: '17', title: 'Design Podcast', message: 'Interview request: "The Art of Chaos"!', delay: 1060, position: { x: 70, y: 25 } },
  { id: '18', title: 'New Client', message: 'Fortune 500 wants your crisis aesthetic!', delay: 1120, position: { x: 40, y: 65 } },
  { id: '19', title: 'Design Magazine', message: 'Cover story: "Designer of the Apocalypse"!', delay: 1180, position: { x: 25, y: 85 } },
  { id: '20', title: 'Art Gallery', message: 'Your glitch art in MoMA exhibition!', delay: 1240, position: { x: 60, y: 40 } },
  { id: '21', title: 'Design School', message: 'Guest lecture: "Embracing Digital Chaos"!', delay: 1300, position: { x: 35, y: 20 } },
  { id: '22', title: 'Tech Conference', message: 'Panel: "The Beauty of Broken UI"!', delay: 1360, position: { x: 75, y: 60 } },
  { id: '23', title: 'Design Award', message: 'Nominated: "Best Glitch Aesthetic"!', delay: 1420, position: { x: 10, y: 35 } },
  { id: '24', title: 'Client Meeting', message: 'They want your "controlled chaos" approach!', delay: 1480, position: { x: 50, y: 70 } },
  { id: '25', title: 'Design Summit', message: 'Keynote: "Finding Order in Chaos"!', delay: 1540, position: { x: 30, y: 50 } },
  { id: '26', title: 'New Project', message: 'Redesign for major tech company!', delay: 1600, position: { x: 65, y: 15 } },
  { id: '27', title: 'Design Award', message: 'Won "Most Innovative Chaos" award!', delay: 1660, position: { x: 20, y: 60 } },
  { id: '28', title: 'Book Deal', message: 'Publish your design philosophy!', delay: 1720, position: { x: 45, y: 35 } },
  { id: '29', title: 'Design Exhibition', message: 'Solo show: "Digital Disruption"!', delay: 1780, position: { x: 70, y: 75 } },
  { id: '30', title: 'Client Feedback', message: 'This is EXACTLY what we wanted!', delay: 1840, position: { x: 15, y: 25 } },
  { id: '31', title: 'Design Trend', message: 'Your style is now mainstream!', delay: 1900, position: { x: 55, y: 45 } },
  { id: '32', title: 'New Client', message: 'Startup wants your signature look!', delay: 1960, position: { x: 35, y: 75 } },
  { id: '33', title: 'Design Award', message: 'Lifetime Achievement in Chaos!', delay: 2020, position: { x: 60, y: 30 } },
  { id: '34', title: 'Art Commission', message: 'Museum wants your digital pieces!', delay: 2080, position: { x: 25, y: 55 } },
  { id: '35', title: 'Design Podcast', message: 'Series: "Masters of Disruption"!', delay: 2140, position: { x: 75, y: 20 } },
  { id: '36', title: 'Client Meeting', message: 'They want to double your budget!', delay: 2200, position: { x: 40, y: 80 } },
  { id: '37', title: 'Design School', message: 'Named chair after your work!', delay: 2260, position: { x: 10, y: 50 } },
  { id: '38', title: 'Tech Giant', message: 'Google wants your design expertise!', delay: 2320, position: { x: 65, y: 60 } },
  { id: '39', title: 'Design Award', message: 'International recognition incoming!', delay: 2380, position: { x: 30, y: 15 } },
  { id: '40', title: 'New Project', message: 'Redesign entire social media platform!', delay: 2440, position: { x: 50, y: 35 } },
  { id: '41', title: 'Design Magazine', message: 'Monthly column: "Chaos & Order"!', delay: 2500, position: { x: 20, y: 85 } },
  { id: '42', title: 'Client Call', message: 'They want exclusive rights to your style!', delay: 2560, position: { x: 70, y: 40 } },
  { id: '43', title: 'Design Exhibition', message: 'World tour: "The Crisis Aesthetic"!', delay: 2620, position: { x: 15, y: 70 } },
  { id: '44', title: 'New Client', message: 'Fortune 100 wants complete redesign!', delay: 2680, position: { x: 45, y: 25 } },
  { id: '45', title: 'Design Award', message: 'Nobel Prize for Design Chaos!', delay: 2740, position: { x: 60, y: 80 } },
  { id: '46', title: 'Book Deal', message: 'Multi-book contract signed!', delay: 2800, position: { x: 25, y: 45 } },
  { id: '47', title: 'Design Summit', message: 'Opening keynote speaker!', delay: 2860, position: { x: 75, y: 55 } },
  { id: '48', title: 'Client Meeting', message: 'Unlimited budget for your vision!', delay: 2920, position: { x: 35, y: 65 } },
  { id: '49', title: 'Design Award', message: 'Hall of Fame induction!', delay: 2980, position: { x: 55, y: 20 } },
  { id: '50', title: 'Global Recognition', message: 'UN wants your design for world peace!', delay: 3040, position: { x: 20, y: 35 } },
  
  // 2-3 second pause, then final popup
  {
    id: '51',
    title: 'WAIT...',
    message: 'You\'re not the designer, are you? OH NO. We made a terrible mistake.',
    delay: 5000,
    position: { x: 45, y: 45 }
  },
  {
    id: '52',
    title: 'PAY MORE, GET LESS!',
    message: 'Our exclusive business model! Premium chaos pricing! CLICK ANYWHERE TO CONTINUE!',
    delay: 6000,
    position: { x: 40, y: 50 }
  }
];

export default function PopupInvasion() {
  const [activePopups, setActivePopups] = useState<PopupMessage[]>([]);
  const [canCloseAll, setCanCloseAll] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [triggerFireworks, setTriggerFireworks] = useState(false);

  // Check if popup invasion has already been shown this session
  const hasShownInvasion = typeof window !== 'undefined' && 
    sessionStorage.getItem('popupInvasionShown') === 'true';

  useEffect(() => {
    // Don't show invasion if already shown this session
    if (hasShownInvasion) return;

    const timers: NodeJS.Timeout[] = [];

    popupMessages.forEach((popup) => {
      const timer = setTimeout(() => {
        setActivePopups(prev => [...prev, popup]);
        
        if (popup.id === '52') {
          setTimeout(() => {
            setCanCloseAll(true);
            setTriggerFireworks(true); // Trigger fireworks!
          }, 500);
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
