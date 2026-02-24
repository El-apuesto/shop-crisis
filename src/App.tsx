import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCrisisStore } from '@/store';
import ShaderBackground from '@/components/three/ShaderBackground';
import CrisisOrb from '@/components/ui-custom/CrisisOrb';
import PopupSystem from '@/components/popups/PopupSystem';
import PopupInvasion from '@/components/popups/PopupInvasion';
import ParallaxLogo from '@/components/ui-custom/ParallaxLogo';
import ExposedFrameworks from '@/components/ui-custom/ExposedFrameworks';
import Header from '@/components/layout/Header';
import LandingSection from '@/sections/LandingSection';
import ProductDetailSection from '@/sections/ProductDetailSection';
import ArchivesSection from '@/sections/ArchivesSection';
import CheckoutSection from '@/sections/CheckoutSection';
import ContactSection from '@/sections/ContactSection';
import AdminSection from '@/sections/AdminSection';

// Custom cursor component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add trail point
      setTrail((prev) => [
        ...prev.slice(-5),
        { x: e.clientX, y: e.clientY, id: Date.now() },
      ]);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      }
    };
    
    const handleMouseOut = () => {
      setIsHovering(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  
  // Don't show custom cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }
  
  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[9990]"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            left: point.x,
            top: point.y,
            width: 8 - index,
            height: 8 - index,
            background: 'rgba(255, 45, 149, 0.3)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x,
          y: position.y,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          left: 0,
          top: 0,
        }}
      >
        {/* Crosshair */}
        <div 
          className="relative"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div 
            className="absolute bg-crisis-pink transition-all duration-200"
            style={{
              width: isHovering ? 24 : 16,
              height: 2,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div 
            className="absolute bg-crisis-pink transition-all duration-200"
            style={{
              width: 2,
              height: isHovering ? 24 : 16,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          {/* Center dot */}
          <div 
            className="absolute w-1 h-1 bg-crisis-pink rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </motion.div>
    </>
  );
}

// Crisis flash effect
function CrisisFlash() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9997]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.2, 0] }}
      transition={{
        duration: 0.1,
        repeat: Infinity,
        repeatDelay: 30,
      }}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(255,0,0,0.3) 0%, transparent 70%)',
      }}
    />
  );
}

// Film grain overlay
function FilmGrain() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9996]"
      style={{
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Vignette overlay
function Vignette() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9995]"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
      }}
    />
  );
}

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { currentView, setScrollY } = useCrisisStore();
  const [showPopupInvasion, setShowPopupInvasion] = useState(true);
  const [invasionComplete, setInvasionComplete] = useState(false);
  
  // Check if invasion has already been shown this session
  useEffect(() => {
    const hasShownInvasion = sessionStorage.getItem('popupInvasionShown') === 'true';
    if (hasShownInvasion) {
      setShowPopupInvasion(false);
      setInvasionComplete(true);
    }
  }, []);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollY]);
  
  // Reset scroll on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);
  
  // Handle popup invasion completion
  useEffect(() => {
    const handleInvasionComplete = () => {
      setShowPopupInvasion(false);
      setInvasionComplete(true);
    };
    
    window.addEventListener('popupInvasionComplete', handleInvasionComplete);
    return () => window.removeEventListener('popupInvasionComplete', handleInvasionComplete);
  }, []);
  
  return (
    <div className="relative min-h-screen custom-cursor">
      {/* Background layers */}
      <ShaderBackground />
      <FilmGrain />
      <Vignette />
      <CrisisFlash />
      
      {/* Custom cursor (desktop only) */}
      <CustomCursor />
      
      {/* Popup invasion system */}
      {showPopupInvasion && <PopupInvasion />}
      
      {/* Header (appears after invasion) */}
      {invasionComplete && <Header />}
      
      {/* Parallax logo (appears after invasion) */}
      {invasionComplete && <ParallaxLogo />}
      
      {/* Exposed frameworks (appears after invasion) */}
      {invasionComplete && <ExposedFrameworks />}
      
      {/* Navigation */}
      <CrisisOrb />
      
      {/* Popup system */}
      <PopupSystem />
      
      {/* Main content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <PageTransition key="landing">
              <LandingSection />
            </PageTransition>
          )}
          {currentView === 'product' && (
            <PageTransition key="product">
              <ProductDetailSection />
            </PageTransition>
          )}
          {currentView === 'archives' && (
            <PageTransition key="archives">
              <ArchivesSection />
            </PageTransition>
          )}
          {currentView === 'checkout' && (
            <PageTransition key="checkout">
              <CheckoutSection />
            </PageTransition>
          )}
          {currentView === 'contact' && (
            <PageTransition key="contact">
              <ContactSection />
            </PageTransition>
          )}
          {currentView === 'admin' && (
            <PageTransition key="admin">
              <AdminSection />
            </PageTransition>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tight">OK CRISIS</span>
            <span className="text-xs text-white/30">© 2026</span>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-white/40">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy? No.</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Chaos</span>
            <span className="hover:text-white cursor-pointer transition-colors">Refund Policy (LOL)</span>
          </div>
          
          <div className="text-[10px] text-white/20">
            Designed for the end times.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
