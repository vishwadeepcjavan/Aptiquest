import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseReady } from '../../lib/supabase';
import { ThemeToggle } from '../ThemeToggle';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorShake(true);
      setErrorMessage('Please provide both email and password');
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const result = await login(email, password);

    setIsLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorShake(true);
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Home Link & Theme Toggle */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Student Portal</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-700/80"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl accent-gradient-bg flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-brand-500/25">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Teacher Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Authorized access only. View submissions and score metrics.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              animate={
                errorShake && !shouldReduceMotion
                  ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Email Input */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Instructor Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="teacher@institution.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 border-slate-300 dark:border-slate-700"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-3.5 px-6 rounded-2xl accent-gradient-bg text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Teacher</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Demo Helper Hint */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              {isSupabaseReady() ? (
                <span>Connected to Supabase Auth. Use your registered teacher credentials.</span>
              ) : (
                <span>
                  Demo Mode Active: Use <code className="font-mono text-brand-600 dark:text-brand-300 font-semibold">teacher@aptiquest.edu</code> and password <code className="font-mono text-brand-600 dark:text-brand-300 font-semibold">admin123</code> to log in.
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-xs text-slate-400 py-4 z-10">
        AptiQuest Assessment System • Secure Supabase Backend
      </div>
    </div>
  );
}

export default AdminLogin;
