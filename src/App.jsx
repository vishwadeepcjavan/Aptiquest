import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { TestProvider } from './context/TestContext';
import BackgroundMesh from './components/BackgroundMesh';
import Header from './components/Header';
import Landing from './components/Landing';
import Test from './components/Test';
import Submitted from './components/Submitted';
import AdminLogin from './components/admin/AdminLogin';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen relative flex flex-col transition-colors duration-300">
      <BackgroundMesh />
      {!isAdminRoute && <Header />}

      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Student Flow */}
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <Landing />
                </motion.div>
              }
            />

            <Route
              path="/test"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <Test />
                </motion.div>
              }
            />

            <Route
              path="/submitted"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <Submitted />
                </motion.div>
              }
            />

            {/* Admin Flow */}
            <Route
              path="/admin/login"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminLogin />
                </motion.div>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminRoute && (
        <footer className="relative z-10 py-6 border-t border-slate-200/60 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 AptiQuest Assessment Engine • Powered by Vite, React & Supabase</span>
            <div className="flex items-center gap-4">
              <span>Standardized Cognitive Evaluation</span>
              <a
                href="/admin/login"
                className="hover:text-brand-500 font-semibold transition-colors"
              >
                Teacher Portal
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TestProvider>
          <AnimatedRoutes />
        </TestProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
