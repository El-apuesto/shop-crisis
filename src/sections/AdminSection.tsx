import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCrisisStore } from '@/store';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  AlertTriangle,
  LogOut,
  Shield,
  Flame,
  MessageSquare,
  Eye
} from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { loginAdmin } = useCrisisStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <div className="glass-panel rounded-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-crisis-red/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-crisis-red" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Admin Access
          </h2>
          <p className="text-white/50 text-sm">
            Restricted area. Puppet masters only.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                error 
                  ? 'border-crisis-red animate-pulse' 
                  : 'border-white/10 focus:border-crisis-red/50'
              }`}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-crisis-red text-xs mt-2"
              >
                Incorrect. Try harder.
              </motion.p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-crisis-red/20 border border-crisis-red rounded-lg text-crisis-red font-bold hover:bg-crisis-red/30 transition-colors"
          >
            Access Dashboard
          </motion.button>
        </form>
        
        <p className="text-[10px] text-white/20">
          Hint: It's not 'password123'
        </p>
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ label, value, trend, icon, color }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-panel rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-crisis-red' : 'text-white/40'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            {trend === 'up' ? '+12%' : trend === 'down' ? '-8%' : '0%'}
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

export default function AdminSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { metrics, confessions, logoutAdmin, setView } = useCrisisStore();
  
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <LoginForm onLogin={() => setIsLoggedIn(true)} />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen pt-24 pb-12 px-4 md:px-8"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-crisis-red" />
              <span className="text-crisis-red text-xs tracking-[0.3em] uppercase">
                Restricted Access
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              CRISIS <span className="text-crisis-red">CONTROL</span>
            </h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              logoutAdmin();
              setView('landing');
            }}
            className="flex items-center gap-2 px-4 py-2 glass-panel rounded-lg text-white/50 hover:text-crisis-red transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Exit</span>
          </motion.button>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            label="Total Sales"
            value={metrics.totalSales}
            trend="up"
            icon={<ShoppingCart className="w-5 h-5" />}
            color="#ff2d95"
          />
          <MetricCard
            label="Cart Abandonment"
            value={`${metrics.cartAbandonment}%`}
            trend="down"
            icon={<TrendingDown className="w-5 h-5" />}
            color="#ff0040"
          />
          <MetricCard
            label="Popup Dismissal"
            value={`${metrics.popupDismissalRate}%`}
            trend="up"
            icon={<Eye className="w-5 h-5" />}
            color="#00f0ff"
          />
          <MetricCard
            label="Avg Chaos Level"
            value={metrics.averageChaosLevel}
            trend="up"
            icon={<Flame className="w-5 h-5" />}
            color="#ffd700"
          />
          <MetricCard
            label="Active Users"
            value={metrics.activeUsers}
            trend="neutral"
            icon={<Users className="w-5 h-5" />}
            color="#c0c0c0"
          />
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crisis Confessions */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-crisis-pink" />
                Recent Confessions
              </h3>
              <span className="text-xs text-white/40">{confessions.length} total</span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {confessions.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8">
                  No confessions yet. The drama is coming.
                </p>
              ) : (
                confessions.slice(0, 10).map((confession, idx) => (
                  <motion.div
                    key={confession.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 bg-white/5 rounded-lg"
                  >
                    <p className="text-sm text-white/70">
                      <span className="text-crisis-pink font-bold">{confession.name}</span> says: 
                      "The pettiest breakup? {confession.reason} over {confession.exName}."
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                      {new Date(confession.timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          {/* System Status */}
          <div className="space-y-4">
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-crisis-red" />
                System Alerts
              </h3>
              
              <div className="space-y-3">
                {[
                  { level: 'high', message: 'Chaos levels exceeding normal parameters' },
                  { level: 'medium', message: 'Popup dismissal rate above threshold' },
                  { level: 'low', message: 'New confession submitted 2 minutes ago' },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center gap-3 ${
                      alert.level === 'high' ? 'bg-crisis-red/10 border border-crisis-red/30' :
                      alert.level === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                      'bg-white/5'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      alert.level === 'high' ? 'bg-crisis-red' :
                      alert.level === 'medium' ? 'bg-yellow-500' :
                      'bg-green-400'
                    }`} />
                    <p className="text-sm text-white/70">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Trigger Popup Storm',
                  'Reset Metrics',
                  'Export Data',
                  'Emergency Shutdown',
                ].map((action) => (
                  <motion.button
                    key={action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 glass-panel rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors text-left"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-white/20">
            "With great power comes great ability to mess things up."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
