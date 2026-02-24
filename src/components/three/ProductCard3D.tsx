import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useCrisisStore } from '@/store';

interface ShirtModelProps {
  isHovered: boolean;
  color: string;
}

function ShirtModel({ isHovered, color }: ShirtModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Intensify on hover
      if (isHovered) {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
  });
  
  // Convert color names to hex
  const getColor = (colorName: string) => {
    const colors: Record<string, string> = {
      'Void Black': '#0a0a0a',
      'Crisis Pink': '#ff2d95',
      'Existential Grey': '#4a4a4a',
      'Stability White': '#f5f5f5',
      'Grounded Beige': '#d4c4b0',
      'Reliable Navy': '#1a2744',
      'Judgment Red': '#cc0000',
      'Consequence Black': '#111111',
      'Absolution White': '#ffffff',
    };
    return colors[colorName] || '#ffffff';
  };
  
  return (
    <Float
      speed={isHovered ? 2 : 1}
      rotationIntensity={isHovered ? 0.5 : 0.2}
      floatIntensity={isHovered ? 0.5 : 0.3}
    >
      <mesh ref={meshRef} scale={isHovered ? 1.1 : 1}>
        {/* Simplified shirt shape using box geometry */}
        <boxGeometry args={[1.5, 2, 0.3, 32, 32, 8]} />
        <meshPhysicalMaterial
          color={getColor(color)}
          roughness={0.6}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          sheen={0.5}
          sheenColor="#ffffff"
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Neon rim light effect */}
      {isHovered && (
        <mesh scale={[1.55, 2.05, 0.35]}>
          <boxGeometry args={[1.5, 2, 0.3]} />
          <meshBasicMaterial
            color="#ff2d95"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </Float>
  );
}

interface ProductCard3DProps {
  product: Product;
  index: number;
}

export default function ProductCard3D({ product, index }: ProductCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { setSelectedProduct, setView, addToCart } = useCrisisStore();
  const [isClaimed, setIsClaimed] = useState(false);
  
  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClaimed(true);
    addToCart({
      product,
      quantity: 1,
      size: 'M',
      color: selectedColor,
    });
    setTimeout(() => setIsClaimed(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative w-full max-w-md mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass card container */}
      <div 
        className="relative glass-panel rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          transform: isHovered 
            ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg) translateZ(20px)' 
            : 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)',
          boxShadow: isHovered
            ? '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,45,149,0.2)'
            : '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Shimmer border */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <motion.div
            className="absolute inset-0 shimmer-border opacity-20"
            animate={{ backgroundPosition: ['0% 50%', '300% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        {/* 3D Canvas */}
        <div className="relative h-80 w-full">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff2d95" />
            <Environment preset="city" />
            <ShirtModel isHovered={isHovered} color={selectedColor} />
          </Canvas>
          
          {/* Depth of field overlay on hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)',
              }}
            />
          )}
        </div>
        
        {/* Product info */}
        <div className="p-6 space-y-4">
          {/* Name and run number */}
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black tracking-tight text-white">
              {product.name}
            </h3>
            <span className="text-xs font-mono text-crisis-pink tracking-widest">
              {product.runNumber}
            </span>
          </div>
          
          {/* Description */}
          <motion.p 
            className="text-sm text-white/60 leading-relaxed"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
          >
            {product.description}
          </motion.p>
          
          {/* Color selector */}
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === color 
                    ? 'border-crisis-pink scale-110' 
                    : 'border-white/20 hover:border-white/40'
                }`}
                style={{
                  background: color.toLowerCase().includes('black') 
                    ? '#0a0a0a'
                    : color.toLowerCase().includes('pink')
                    ? '#ff2d95'
                    : color.toLowerCase().includes('white')
                    ? '#f5f5f5'
                    : color.toLowerCase().includes('grey')
                    ? '#4a4a4a'
                    : color.toLowerCase().includes('beige')
                    ? '#d4c4b0'
                    : color.toLowerCase().includes('navy')
                    ? '#1a2744'
                    : color.toLowerCase().includes('red')
                    ? '#cc0000'
                    : '#ffffff',
                }}
                title={color}
              />
            ))}
          </div>
          
          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-lg text-white/40 line-through decoration-crisis-pink decoration-2">
              ${product.originalPrice}
            </span>
            <motion.span 
              className="text-3xl font-black text-crisis-pink"
              animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              ${product.salePrice}
            </motion.span>
          </div>
          
          {/* Footnote */}
          <p className="text-[10px] text-white/30 leading-tight">
            We skipped the .99 trick because we're not here to deceive you into thinking 
            you're saving more — unless you want to. Use code 'PAYMORE' at checkout to 
            voluntarily overpay and feel extra bougie.
          </p>
          
          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(255,45,149,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm tracking-wider uppercase transition-all ${
                isClaimed
                  ? 'bg-crisis-gold text-black'
                  : 'bg-crisis-pink/20 border border-crisis-pink text-crisis-pink hover:bg-crisis-pink/30'
              }`}
            >
              {isClaimed ? (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="text-crisis-gold">✓</span> CLAIMED
                </motion.span>
              ) : (
                'CLAIM'
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedProduct(product);
                setView('product');
              }}
              className="px-4 py-3 rounded-lg border border-white/20 text-white/70 font-bold text-sm hover:bg-white/5 transition-colors"
            >
              Details
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Floating particles on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-crisis-pink/50"
              initial={{ 
                x: '50%', 
                y: '50%', 
                opacity: 1,
                scale: 0,
              }}
              animate={{ 
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: 0,
                scale: Math.random() * 2 + 1,
              }}
              transition={{ 
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
