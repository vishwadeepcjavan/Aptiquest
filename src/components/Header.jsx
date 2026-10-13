import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, User, Lock } from 'lucide-react';
import { useTest } from '../context/TestContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { studentInfo, isTestActive } = useTest();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="glass-nav sticky top-0 z-40 w-full transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-10 h-10 rounded-xl accent-gradient-bg flex items-center justify-center text-white shadow-md shadow-indigo-500/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Brain className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
                Apti<span className="accent-gradient-text">Quest</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                PRO
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Standardized Aptitude & Reasoning Evaluation
            </p>
          </div>
        </Link>

        {/* Right side items */}
        <div className="flex items-center gap-3 sm:gap-4">
          {studentInfo?.name && isTestActive && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <User className="w-3.5 h-3.5 text-brand-500" />
              <span className="truncate max-w-[120px]">{studentInfo.name}</span>
            </motion.div>
          )}

          {!isAdminRoute && !isTestActive && (
            <Link
              to="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Teacher Login</span>
            </Link>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
