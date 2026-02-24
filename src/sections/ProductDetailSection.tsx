import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCrisisStore } from '@/store';
import { ArrowLeft, Plus, Minus, Check } from 'lucide-react';

interface ShirtModelProps {
  color: string;
}

function ShirtModel({ color }: ShirtModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  
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
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} scale={1.5}>
        <boxGeometry args={[1.5, 2, 0.3, 32, 32, 8]} />
        <meshPhysicalMaterial
          color={getColor(color)}
          roughness={0.6}
          metalness={0.1}
          clearcoat={0.3}
          sheen={0.5}
          sheenColor="#ffffff"
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

export default function ProductDetailSection() {
  const { selectedProduct, setView, setSelectedProduct, addToCart } = useCrisisStore();
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(selectedProduct?.sizes[2] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isClaimed, setIsClaimed] = useState(false);
  
  if (!selectedProduct) {
    setView('landing');
    return null;
  }
  
  const handleClaim = () => {
    setIsClaimed(true);
    addToCart({
      product: selectedProduct,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    setTimeout(() => setIsClaimed(false), 2000);
  };
  
  const handleBack = () => {
    setSelectedProduct(null);
    setView('landing');
  };
  
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
        onClick={handleBack}
        className="fixed top-24 left-6 z-30 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Shop</span>
      </motion.button>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 3D Product Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative aspect-square glass-panel rounded-2xl overflow-hidden"
          >
            <Canvas
              camera={{ position: [0, 0, 4], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff2d95" />
              <Environment preset="studio" />
              <ShirtModel color={selectedColor} />
            </Canvas>
            
            {/* Product badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 bg-crisis-pink/20 border border-crisis-pink/50 rounded-full text-xs font-bold text-crisis-pink">
                {selectedProduct.runNumber}
              </span>
              {selectedProduct.chaosLevel && (
                <span className="px-3 py-1 bg-crisis-cyan/20 border border-crisis-cyan/50 rounded-full text-xs font-bold text-crisis-cyan">
                  Chaos: {selectedProduct.chaosLevel}/10
                </span>
              )}
            </div>
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {selectedProduct.name}
              </h1>
              <p className="mt-2 text-lg text-white/60">
                {selectedProduct.description}
              </p>
            </div>
            
            {/* Full description */}
            <div className="glass-panel rounded-xl p-6">
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                {selectedProduct.fullDescription}
              </p>
            </div>
            
            {/* Color selection */}
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase mb-3 block">
                Color — {selectedColor}
              </label>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-crisis-pink scale-110 shadow-lg shadow-crisis-pink/30' 
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
                  />
                ))}
              </div>
            </div>
            
            {/* Size selection */}
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase mb-3 block">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg font-bold text-sm transition-all ${
                      selectedSize === size 
                        ? 'bg-crisis-pink text-white' 
                        : 'glass-panel text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase mb-3 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-white/70 hover:bg-white/10"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="text-xl font-bold text-white w-8 text-center">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-white/70 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            
            {/* Pricing & CTA */}
            <div className="glass-panel rounded-xl p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl text-white/40 line-through">
                    ${selectedProduct.originalPrice}
                  </span>
                  <span className="text-4xl font-black text-crisis-pink">
                    ${selectedProduct.salePrice}
                  </span>
                </div>
                <span className="text-xs text-white/40">
                  You save ${(selectedProduct.originalPrice - selectedProduct.salePrice).toFixed(2)}
                </span>
              </div>
              
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 15px 40px rgba(255,45,149,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                className={`w-full py-4 rounded-lg font-bold text-lg tracking-wider uppercase transition-all ${
                  isClaimed
                    ? 'bg-crisis-gold text-black'
                    : 'bg-crisis-pink text-white hover:bg-crisis-pink/90'
                }`}
              >
                {isClaimed ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" /> CLAIMED — ADDED TO CART
                  </motion.span>
                ) : (
                  'CLAIM THIS CRISIS'
                )}
              </motion.button>
              
              <p className="text-[10px] text-white/30 text-center">
                Free shipping on orders over $50. Or pay $5 to delay your shipment 
                for that extra anticipation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
