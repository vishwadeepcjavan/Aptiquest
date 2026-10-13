import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseReady, signInTeacher, signOutTeacher, getCurrentTeacherSession } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseReady() && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user || null);

          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              setUser(session?.user || null);
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Check mock session
          const sessionUser = await getCurrentTeacherSession();
          setUser(sessionUser);
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const result = await signInTeacher(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await signOutTeacher();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
