import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[9995] bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo placeholder - replace with your actual logo */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-10 h-10 bg-gradient-to-br from-crisis-pink to-crisis-purple rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">OK</span>
          </motion.div>
          
          {/* Replace this img with your actual logo */}
          <div className="relative">
            <img 
              src="/logo/logo.svg" 
              alt="Crisis Design Logo"
              className="h-8 w-auto brightness-100 hover:brightness-110 transition-all duration-300"
              onError={(e) => {
                // Fallback to text if logo not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback text logo */}
            <span className="hidden text-white font-black text-xl tracking-tight">
              CRISIS
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-8">
          <motion.a
            href="#home"
            whileHover={{ scale: 1.05, color: '#ff2d95' }}
            className="text-white/80 hover:text-crisis-pink transition-colors text-sm font-medium"
          >
            Home
          </motion.a>
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05, color: '#ff2d95' }}
            className="text-white/80 hover:text-crisis-pink transition-colors text-sm font-medium"
          >
            Products
          </motion.a>
          <motion.a
            href="#archives"
            whileHover={{ scale: 1.05, color: '#ff2d95' }}
            className="text-white/80 hover:text-crisis-pink transition-colors text-sm font-medium"
          >
            Archives
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, color: '#ff2d95' }}
            className="text-white/80 hover:text-crisis-pink transition-colors text-sm font-medium"
          >
            Contact
          </motion.a>
        </nav>

        {/* Mobile menu button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
}
