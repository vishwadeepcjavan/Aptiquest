import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTest } from '../context/TestContext';

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTest();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-2.5 rounded-xl border transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
        isDark
          ? 'bg-slate-800/80 border-slate-700/60 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
          : 'bg-white/90 border-slate-200 text-indigo-600 hover:bg-slate-50 hover:text-indigo-700 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.div>
    </motion.button>
  );
}
export default ThemeToggle;
