import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCrisisStore } from '@/store';
import { ArrowLeft, Send } from 'lucide-react';

export default function ContactSection() {
  const { setView, addConfession, addPopup } = useCrisisStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: "Hi, I can't seem to do anything right…",
  });
  const [confessionData, setConfessionData] = useState({
    name: '',
    reason: '',
    exName: '',
  });
  const [needsCredit, setNeedsCredit] = useState(false);
  const [showConfession, setShowConfession] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNeedsCredit(true);
  };
  
  const handleEarnCredit = () => {
    setShowConfession(true);
  };
  
  const handleConfessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addConfession({
      name: confessionData.name,
      reason: confessionData.reason,
      exName: confessionData.exName,
    });
    setShowConfession(false);
    setNeedsCredit(false);
    
    addPopup({
      title: 'Credit Earned!',
      message: `Your confession has been added to the crisis ticker. Your message will be sent... eventually.`,
      type: 'info',
    });
  };
  
  const handleSkipCredit = () => {
    addPopup({
      title: 'Free Credit!',
      message: "Fine, we're feeling generous — free credit on us. But promise you'll tell a friend about our chaos?",
      type: 'chaos',
    });
    setNeedsCredit(false);
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
        onClick={() => setView('landing')}
        className="fixed top-24 left-6 z-30 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            CONTACT <span className="text-crisis-cyan">SUPPORT</span>
          </h1>
          <p className="mt-4 text-white/50">
            Have a crisis? We have answers. They might not be good answers, but they're answers.
          </p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {!needsCredit && !showConfession && (
            <motion.form
              key="contact-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="glass-panel rounded-xl p-6 md:p-8 space-y-6"
            >
              <div>
                <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="The name your mother gave you"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-crisis-cyan/50"
                />
              </div>
              
              <div>
                <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@existential.crisis"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-crisis-cyan/50"
                />
              </div>
              
              <div>
                <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                  Your Crisis
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-crisis-cyan/50 resize-none"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-crisis-cyan/20 border border-crisis-cyan rounded-lg text-crisis-cyan font-bold tracking-wider uppercase hover:bg-crisis-cyan/30 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </motion.button>
            </motion.form>
          )}
          
          {needsCredit && !showConfession && (
            <motion.div
              key="credit-gate"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel rounded-xl p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-crisis-pink/20 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  You Need Credits to Send Mail
                </h3>
                <p className="text-white/50">
                  Earn one by sharing: Name of a cute coworker you'd binge-watch the apocalypse with?
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEarnCredit}
                  className="w-full py-3 bg-crisis-pink/20 border border-crisis-pink rounded-lg text-crisis-pink font-bold hover:bg-crisis-pink/30 transition-colors"
                >
                  Earn a Credit (Share Drama)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkipCredit}
                  className="w-full py-3 glass-panel rounded-lg text-white/50 font-bold hover:bg-white/5 transition-colors"
                >
                  Skip (We're Feeling Generous)
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {showConfession && (
            <motion.form
              key="confession-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              onSubmit={handleConfessionSubmit}
              className="glass-panel rounded-xl p-6 md:p-8 space-y-6 border-crisis-pink/30"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-crisis-pink mb-2">
                  Crisis Confession
                </h3>
                <p className="text-sm text-white/50">
                  Your secrets are safe with us (and our ticker)
                </p>
              </div>
              
              <div>
                <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                  Your Name (or alias)
                </label>
                <input
                  type="text"
                  value={confessionData.name}
                  onChange={(e) => setConfessionData({ ...confessionData, name: e.target.value })}
                  placeholder="Anonymous Coward"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-crisis-pink/50"
                />
              </div>
              
              <div>
                <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                  What's the pettiest reason you broke up with someone?
                </label>
                <textarea
                  value={confessionData.reason}
                  onChange={(e) => setConfessionData({ ...confessionData, reason: e.target.value })}
                  placeholder="They put pineapple on pizza..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-crisis-pink/50 resize-none"
                />
              </div>
              
              <div>
                <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                  What was their name?
                </label>
                <input
                  type="text"
                  value={confessionData.exName}
                  onChange={(e) => setConfessionData({ ...confessionData, exName: e.target.value })}
                  placeholder="First name only (we're petty, not evil)"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-crisis-pink/50"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-crisis-pink rounded-lg text-white font-bold tracking-wider uppercase hover:bg-crisis-pink/90 transition-colors"
              >
                Confess & Send Message
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
        
        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-white/30"
        >
          Response time: 24-48 hours, or never. Depends on our mood.
        </motion.p>
      </div>
    </motion.div>
  );
}
