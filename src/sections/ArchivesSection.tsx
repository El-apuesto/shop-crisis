import { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { archivedProducts } from '@/data/products';
import { useCrisisStore } from '@/store';
import { Archive, Flame, Heart, ArrowLeft } from 'lucide-react';

interface HolographicShirtProps {
  color: string;
}

function HolographicShirt({ color }: HolographicShirtProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getColor = (colorName: string) => {
    const colors: Record<string, string> = {
      'Prototype Grey': '#666666',
      'Regret Blue': '#2a4d69',
    };
    return colors[colorName] || '#666666';
  };
  
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={1.2}>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshPhysicalMaterial
          color={getColor(color)}
          roughness={0.4}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Holographic glow */}
      <mesh scale={[1.6, 2.1, 0.35]}>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  );
}

export default function ArchivesSection() {
  const [filter, setFilter] = useState<'all' | 'chaotic' | 'classic'>('all');
  const { setView } = useCrisisStore();
  
  const filteredProducts = archivedProducts.filter((p) => {
    if (filter === 'chaotic') return (p.chaosLevel || 0) > 8;
    if (filter === 'classic') return (p.chaosLevel || 0) <= 8;
    return true;
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-24 pb-12 px-4 md:px-8"
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setView('landing')}
        className="fixed top-24 left-6 z-30 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Shop</span>
      </motion.button>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Archive className="w-5 h-5 text-crisis-cyan" />
            <span className="text-crisis-cyan text-xs tracking-[0.3em] uppercase">
              The Museum of Regrets
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            ARCHIVES
          </h1>
          <p className="mt-4 text-white/50 max-w-lg mx-auto">
            Past runs. Beautiful mistakes. Shirts that exist in the digital void, 
            forever out of stock but never forgotten.
          </p>
        </motion.div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-12"
        >
          {[
            { id: 'all', label: 'All Regrets', icon: Archive },
            { id: 'chaotic', label: 'Most Chaotic', icon: Flame },
            { id: 'classic', label: 'Crisis Classics', icon: Heart },
          ].map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(id as typeof filter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === id
                  ? 'bg-crisis-cyan/20 border border-crisis-cyan text-crisis-cyan'
                  : 'glass-panel text-white/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Archive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative group"
            >
              <div 
                className="glass-panel rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  transform: 'perspective(1000px) rotateX(10deg)',
                  transformOrigin: 'center bottom',
                }}
              >
                {/* Holographic preview */}
                <div className="relative h-64 w-full bg-gradient-to-b from-crisis-cyan/5 to-transparent">
                  <Canvas
                    camera={{ position: [0, 0, 4], fov: 50 }}
                    gl={{ antialias: true, alpha: true }}
                    dpr={[1, 2]}
                  >
                    <ambientLight intensity={0.3} />
                    <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
                    <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff2d95" />
                    <Environment preset="night" />
                    <HolographicShirt color={product.colors[0]} />
                  </Canvas>
                  
                  {/* Holographic scan line */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(0,240,255,0.1), transparent)',
                    }}
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Archived badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-crisis-cyan/20 border border-crisis-cyan/50 rounded-full text-xs font-bold text-crisis-cyan">
                      ARCHIVED
                    </span>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-6 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-black text-white">
                      {product.name}
                    </h3>
                    <span className="text-xs font-mono text-crisis-cyan">
                      {product.runNumber}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white/50">
                    {product.description}
                  </p>
                  
                  {product.chaosLevel && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">Chaos Level:</span>
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(product.chaosLevel / 11) * 100}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-crisis-cyan to-crisis-pink"
                        />
                      </div>
                      <span className="text-xs font-mono text-crisis-cyan">
                        {product.chaosLevel}/11
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <button
                      disabled
                      className="w-full py-3 rounded-lg border border-white/10 text-white/30 font-bold text-sm cursor-not-allowed"
                    >
                      FOREVER SOLD OUT
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Light beam effect */}
              <div 
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-64 pointer-events-none opacity-30"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,240,255,0.3), transparent)',
                  filter: 'blur(20px)',
                }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-white/30">No archived runs match this filter.</p>
            <p className="text-white/20 text-sm mt-2">Even our mistakes are selective.</p>
          </motion.div>
        )}
        
        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-white/30 max-w-md mx-auto">
            "The archives are a reminder that every crisis eventually becomes history. 
            And every history eventually becomes fashion."
          </p>
          <p className="text-xs text-white/20 mt-2">— The OK Crisis Design Team, probably</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
