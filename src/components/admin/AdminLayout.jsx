import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';
import { isSupabaseReady } from '../../lib/supabase';

export function AdminLayout({ children, onRefresh, isRefreshing = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const teacherEmail = user?.email || 'teacher@institution.edu';
  const isLive = isSupabaseReady();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* ---------------------------------------------------- */}
      {/* DESKTOP SIDEBAR */}
      {/* ---------------------------------------------------- */}
      <aside className="hidden lg:flex w-64 flex-col justify-between glass-nav border-r border-slate-200/80 dark:border-slate-800 p-6 sticky top-0 h-screen z-30">
        <div className="flex flex-col gap-6">
          {/* Logo & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl accent-gradient-bg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-display">
                  Apti<span className="accent-gradient-text">Quest</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Teacher Management
              </p>
            </div>
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-700 dark:text-slate-300">
              {isLive ? 'Supabase Live Sync' : 'Demo Local Mode'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              to="/admin"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl accent-gradient-bg text-white font-semibold text-sm shadow-md shadow-brand-500/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Assessment Results</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
                <span>Student View</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {teacherEmail}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Instructor
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MOBILE TOP NAVIGATION BAR */}
      {/* ---------------------------------------------------- */}
      <header className="lg:hidden glass-nav sticky top-0 z-30 w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg accent-gradient-bg flex items-center justify-center text-white">
            <Brain className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-slate-900 dark:text-white font-display">
            Apti<span className="accent-gradient-text">Quest</span> Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-14 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl space-y-3"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Logged in as: <span className="font-semibold text-slate-900 dark:text-white">{teacherEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 px-3 rounded-xl accent-gradient-bg text-white text-xs font-semibold text-center"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2 px-3 rounded-xl border border-red-500/30 text-red-600 text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
