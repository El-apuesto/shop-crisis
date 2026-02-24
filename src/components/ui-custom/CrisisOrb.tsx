import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCrisisStore } from '@/store';
import { ShoppingBag, Archive, User, Mail, Volume2, VolumeX, Shield } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view: 'landing' | 'archives' | 'checkout' | 'contact' | 'admin';
  angle: number;
}

const navItems: NavItem[] = [
  { id: 'shop', label: 'SHOP', icon: <ShoppingBag className="w-5 h-5" />, view: 'landing', angle: 0 },
  { id: 'archives', label: 'ARCHIVES', icon: <Archive className="w-5 h-5" />, view: 'archives', angle: 51.4 },
  { id: 'cart', label: 'CART', icon: <ShoppingBag className="w-5 h-5" />, view: 'checkout', angle: 102.8 },
  { id: 'contact', label: 'CONTACT', icon: <Mail className="w-5 h-5" />, view: 'contact', angle: 154.2 },
  { id: 'account', label: 'ACCOUNT', icon: <User className="w-5 h-5" />, view: 'admin', angle: 205.6 },
];

export default function CrisisOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [orbTexture, setOrbTexture] = useState<'chrome' | 'concrete' | 'card'>('chrome');
  const { setView, cart, audioEnabled, toggleAudio, isAdmin } = useCrisisStore();
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  useEffect(() => {
    if (hoveredItem) {
      switch (hoveredItem) {
        case 'archives':
          setOrbTexture('concrete');
          break;
        case 'cart':
          setOrbTexture('card');
          break;
        default:
          setOrbTexture('chrome');
      }
    } else {
      setOrbTexture('chrome');
    }
  }, [hoveredItem]);
  
  const handleNavClick = (view: NavItem['view']) => {
    setView(view);
    setIsOpen(false);
  };
  
  const getOrbGradient = () => {
    switch (orbTexture) {
      case 'concrete':
        return 'radial-gradient(circle at 30% 30%, #666, #333, #111)';
      case 'card':
        return 'conic-gradient(from 0deg, #ff2d95, #00f0ff, #ffd700, #ff2d95)';
      default:
        return 'radial-gradient(circle at 30% 30%, #e8e8e8, #a0a0a0, #404040, #111)';
    }
  };
  
  return (
    <>
      {/* Crisis Orb Button */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isOpen
              ? '0 0 60px rgba(255, 45, 149, 0.6)'
              : '0 0 30px rgba(255, 45, 149, 0.3)',
          }}
        >
          {/* Chrome sphere effect */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              background: getOrbGradient(),
              boxShadow: `
                inset -5px -5px 15px rgba(0,0,0,0.5),
                inset 5px 5px 15px rgba(255,255,255,0.3),
                0 10px 30px rgba(0,0,0,0.5)
              `,
            }}
          />
          
          {/* Highlight reflection */}
          <div
            className="absolute top-2 left-3 w-5 h-3 rounded-full opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8), transparent)',
            }}
          />
          
          {/* Inner content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-crisis-black font-bold text-xs"
            >
              {isOpen ? '×' : '☰'}
            </motion.div>
          </div>
          
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-crisis-pink/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.button>
        
        {/* Cart badge */}
        {cartItemCount > 0 && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-crisis-pink rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          >
            {cartItemCount}
          </motion.div>
        )}
      </motion.div>
      
      {/* Audio Toggle */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        onClick={toggleAudio}
        className="fixed top-6 right-24 z-50 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        {audioEnabled ? (
          <Volume2 className="w-4 h-4 text-crisis-pink" />
        ) : (
          <VolumeX className="w-4 h-4 text-white/50" />
        )}
      </motion.button>
      
      {/* Radial Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Radial Menu */}
            <motion.div
              className="fixed top-6 right-6 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {navItems.map((item, index) => {
                const angle = (index * 72 - 90) * (Math.PI / 180);
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.button
                    key={item.id}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    animate={{ scale: 1, x, y, opacity: 1 }}
                    exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    onClick={() => handleNavClick(item.view)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="absolute top-8 left-8 w-14 h-14 rounded-full glass-panel glass-panel-hover flex flex-col items-center justify-center gap-1 group"
                    style={{
                      boxShadow: hoveredItem === item.id
                        ? '0 0 30px rgba(255, 45, 149, 0.4)'
                        : undefined,
                    }}
                  >
                    <div className="text-crisis-pink group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[8px] font-bold tracking-wider text-white/70 group-hover:text-white">
                      {item.label}
                    </span>
                    
                    {/* Connection line to orb */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-crisis-pink/50 to-transparent origin-left"
                      style={{
                        width: radius - 28,
                        transform: `rotate(${-index * 72 + 90}deg) translateX(28px)`,
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Admin indicator */}
      {isAdmin && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-6 right-36 z-50 w-10 h-10 rounded-full bg-crisis-red/20 border border-crisis-red flex items-center justify-center"
        >
          <Shield className="w-4 h-4 text-crisis-red" />
        </motion.div>
      )}
    </>
  );
}
