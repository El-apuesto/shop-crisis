import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCrisisStore } from '@/store';
import { ArrowLeft, Trash2, Plus, Minus, AlertCircle, Sparkles } from 'lucide-react';

export default function CheckoutSection() {
  const { cart, removeFromCart, updateQuantity, cartTotal, setView, addPopup } = useCrisisStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [delayShipping, setDelayShipping] = useState(false);
  
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(true);
  };
  
  const handleCheckout = () => {
    addPopup({
      title: 'Payment Processing...',
      message: "Just kidding! This is a demo. But imagine how cool you'd look in these shirts.",
      type: 'chaos',
    });
  };
  
  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-panel flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-crisis-pink/50" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">YOUR CART IS EMPTY</h2>
          <p className="text-white/50 mb-8 max-w-sm mx-auto">
            Not panicking about your empty wardrobe? You should be. The crisis waits for no one.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('landing')}
            className="px-8 py-4 bg-crisis-pink/20 border border-crisis-pink rounded-lg text-crisis-pink font-bold tracking-wider uppercase hover:bg-crisis-pink/30 transition-colors"
          >
            Start Shopping
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }
  
  const subtotal = cartTotal();
  const shipping = subtotal > 50 ? 0 : delayShipping ? 5 : 8;
  const total = subtotal + shipping;
  
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
        <span className="text-sm font-medium">Continue Shopping</span>
      </motion.button>
      
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-white text-center mb-12"
        >
          YOUR <span className="text-crisis-pink">CRISIS</span> CART
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                  className="glass-panel rounded-xl p-4 flex gap-4"
                >
                  {/* Product image placeholder */}
                  <div 
                    className="w-24 h-24 rounded-lg flex-shrink-0"
                    style={{
                      background: item.color.toLowerCase().includes('black')
                        ? '#0a0a0a'
                        : item.color.toLowerCase().includes('pink')
                        ? '#ff2d95'
                        : item.color.toLowerCase().includes('white')
                        ? '#f5f5f5'
                        : item.color.toLowerCase().includes('grey')
                        ? '#4a4a4a'
                        : '#666666',
                    }}
                  />
                  
                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-white/50">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-white/30 hover:text-crisis-red transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded glass-panel flex items-center justify-center text-white/50 hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="text-sm font-bold text-white w-6 text-center">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded glass-panel flex items-center justify-center text-white/50 hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </motion.button>
                      </div>
                      
                      {/* Price */}
                      <span className="font-bold text-crisis-pink">
                        ${(item.product.salePrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Promo code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-xl p-4"
            >
              <form onSubmit={handlePromoSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError(false);
                  }}
                  placeholder="Enter promo code (try 'PAYMORE')"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-crisis-pink/50"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-white/10 rounded-lg text-white font-bold text-sm hover:bg-white/20 transition-colors"
                >
                  Apply
                </motion.button>
              </form>
              
              <AnimatePresence>
                {promoError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-crisis-red/10 border border-crisis-red/30 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-crisis-red flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-crisis-red">
                          Code expired or incorrect.
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                          Want to learn how to do one thing right? Join our 'Life Skills Workshop'
                        </p>
                        <motion.button
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          onClick={() => setView('contact')}
                          className="mt-2 text-xs text-crisis-pink hover:underline"
                        >
                          Contact Support
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass-panel rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-white tracking-wider uppercase">
                Order Summary
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {delayShipping && (
                  <div className="flex justify-between text-crisis-cyan text-xs">
                    <span>Anticipation Fee</span>
                    <span>+$5.00</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-crisis-pink">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Delay shipping option */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={delayShipping}
                    onChange={(e) => setDelayShipping(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-crisis-pink focus:ring-crisis-pink"
                  />
                  <span className="text-xs text-white/50">
                    Pay $5 extra to delay shipping (for anticipation)
                  </span>
                </label>
              </div>
              
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 15px 40px rgba(255,45,149,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full py-4 bg-crisis-pink rounded-lg text-white font-bold text-lg tracking-wider uppercase hover:bg-crisis-pink/90 transition-colors"
              >
                Complete Crisis
              </motion.button>
              
              <p className="text-[10px] text-white/30 text-center">
                By checking out, you agree that existence is meaningless 
                but looking good helps.
              </p>
            </div>
            
            {/* Trust badges (ironic) */}
            <div className="glass-panel rounded-xl p-4">
              <div className="flex justify-center gap-4 text-[10px] text-white/30 uppercase tracking-wider">
                <span>Secure-ish</span>
                <span>•</span>
                <span>Probably Encrypted</span>
                <span>•</span>
                <span>No Refunds</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
