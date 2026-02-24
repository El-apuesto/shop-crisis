import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import KineticLogo from '@/components/ui-custom/KineticLogo';
import ProductCard3D from '@/components/three/ProductCard3D';
import { products } from '@/data/products';
import { ChevronDown } from 'lucide-react';

export default function LandingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex flex-col items-center justify-center px-4"
        style={{ y, opacity, scale }}
      >
        <KineticLogo />
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/40 tracking-widest uppercase">Current Run</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-crisis-pink" />
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Products Section */}
      <section className="relative py-24 px-4 md:px-8 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-crisis-pink text-xs tracking-[0.3em] uppercase mb-4 block">
            Limited Edition
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            THE CURRENT RUN
          </h2>
          <p className="mt-4 text-white/50 max-w-md mx-auto">
            Three shirts. Three existential statements. One low, low price that makes our accountants cry.
          </p>
        </motion.div>
        
        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <ProductCard3D key={product.id} product={product} index={index} />
          ))}
        </div>
        
        {/* Run info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-4 glass-panel px-6 py-3 rounded-full">
            <span className="text-xs text-white/40 tracking-widest uppercase">Next Drop In</span>
            <div className="flex gap-2">
              {['14', '23', '59'].map((num, i) => (
                <span key={i} className="text-lg font-mono font-bold text-crisis-pink">
                  {num}{i < 2 && ':'}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Crisis Confessions Ticker */}
      <section className="relative py-8 border-t border-white/10 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span className="text-xs text-white/30 tracking-widest uppercase">#CrisisConfessions</span>
              <span className="text-sm text-white/50">
                "The pettiest breakup? They put milk in before cereal." — Anonymous
              </span>
              <span className="w-1 h-1 rounded-full bg-crisis-pink/50" />
              <span className="text-sm text-white/50">
                "I ended it because they clapped when the plane landed." — @chaos_queen
              </span>
              <span className="w-1 h-1 rounded-full bg-crisis-cyan/50" />
            </div>
          ))}
        </motion.div>
      </section>
      
      {/* Footer teaser */}
      <section className="relative py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
            THINK YOU CAN HANDLE MORE?
          </h3>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Dive into the archives. Witness our past mistakes. Judge us silently.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 glass-panel border border-crisis-pink/30 rounded-lg text-crisis-pink font-bold tracking-wider uppercase hover:bg-crisis-pink/10 transition-colors"
          >
            Explore Archives
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
