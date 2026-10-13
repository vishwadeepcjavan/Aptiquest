import { createClient } from '@supabase/supabase-js';
import { studentQuestions } from '../data/studentQuestions';
import { mockAnswerKey } from './mockAnswerKey';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid credentials are provided
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isSupabaseReady() {
  return isConfigured;
}

// --------------------------------------------------------------------------
// MOCK STORAGE HELPERS (FOR IMMEDIATE LOCAL PREVIEW & DEMO TESTING)
// --------------------------------------------------------------------------
const MOCK_SUBMISSIONS_KEY = 'aptiquest_mock_submissions';
const MOCK_AUTH_KEY = 'aptiquest_mock_teacher_auth';

function getMockSubmissions() {
  try {
    const raw = localStorage.getItem(MOCK_SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: 'mock-sub-1',
        name: 'Sarah Connor',
        roll_no: 'CS2026-101',
        class_name: 'Batch A - CS',
        answers: { 1: 2, 2: 3, 3: 0, 6: 1, 7: 1, 8: 3, 9: 2, 10: 1, 16: 1, 17: 2, 18: 3, 4: 0, 5: 0, 11: 1, 12: 1, 13: 1, 14: 3, 15: 1, 20: 2, 21: 1, 22: 2, 23: 3, 24: 2, 19: 2, 25: 3, 26: 0, 27: 2 },
        time_taken_seconds: 1120,
        submitted_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'mock-sub-2',
        name: 'David Miller',
        roll_no: 'CS2026-102',
        class_name: 'Batch B - IT',
        answers: { 1: 2, 2: 1, 3: 0, 6: 1, 7: 0, 8: 3, 9: 2, 10: 1, 16: 0, 17: 2, 18: 3, 4: 0, 5: 1, 11: 1, 12: 1, 13: 1, 14: 2, 15: 1, 20: 2, 21: 1, 22: 1, 23: 3, 24: 2, 19: 1, 25: 3, 26: 0, 27: 1 },
        time_taken_seconds: 1450,
        submitted_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'mock-sub-3',
        name: 'Emma Watson',
        roll_no: 'CS2026-103',
        class_name: 'Batch A - CS',
        answers: { 1: 0, 2: 1, 3: 2, 6: 1, 7: 1, 8: 0, 9: 2, 10: 1, 16: 1, 17: 0, 18: 3, 4: 1, 5: 0, 11: 0, 12: 1, 13: 0, 14: 3, 15: 1, 20: 0, 21: 1, 22: 2, 23: 0, 24: 2, 19: 2, 25: 0, 26: 0, 27: 2 },
        time_taken_seconds: 1780,
        submitted_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ];
  } catch {
    return [];
  }
}

function saveMockSubmissions(submissions) {
  try {
    localStorage.setItem(MOCK_SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// --------------------------------------------------------------------------
// 1. STUDENT API
// --------------------------------------------------------------------------

/**
 * Fetch questions for the student assessment.
 * Note: Questions table has RLS allowing public read, and contains NO answers or explanations.
 */
export async function getQuestions() {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('id, category, q, options, sort_order')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return { data, error: null };
      }
    } catch (err) {
      console.warn('Supabase questions fetch failed, falling back to local public questions:', err);
    }
  }

  // Safe fallback: sanitized public questions
  return { data: studentQuestions, error: null };
}

/**
 * Submit student test attempt.
 * Enforces single submission per roll number.
 */
export async function submitTestResults({ name, roll_no, class_name, answers, time_taken_seconds }) {
  const trimmedRoll = roll_no.trim();
  const trimmedName = name.trim();
  const trimmedClass = class_name ? class_name.trim() : '';

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([
          {
            name: trimmedName,
            roll_no: trimmedRoll,
            class_name: trimmedClass,
            answers: answers || {},
            time_taken_seconds: Math.max(0, time_taken_seconds || 0),
          }
        ])
        .select()
        .single();

      if (error) {
        // Postgres 23505 = unique_violation
        const isDuplicate =
          error.code === '23505' ||
          error.message?.toLowerCase().includes('duplicate') ||
          error.message?.toLowerCase().includes('unique') ||
          error.message?.toLowerCase().includes('roll_no');

        return {
          success: false,
          isDuplicate,
          error: isDuplicate
            ? 'This roll number has already submitted the test.'
            : (error.message || 'Submission failed. Please try again.')
        };
      }

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        isDuplicate: false,
        error: err.message || 'Network error while submitting. Please check connection and retry.'
      };
    }
  }

  // Mock / offline mode submission:
  const mockSubs = getMockSubmissions();
  const existing = mockSubs.find(
    s => s.roll_no.toLowerCase() === trimmedRoll.toLowerCase()
  );

  if (existing) {
    return {
      success: false,
      isDuplicate: true,
      error: 'This roll number has already submitted the test.'
    };
  }

  const newSubmission = {
    id: 'sub-' + Date.now(),
    name: trimmedName,
    roll_no: trimmedRoll,
    class_name: trimmedClass,
    answers: answers || {},
    time_taken_seconds: Math.max(0, time_taken_seconds || 0),
    submitted_at: new Date().toISOString(),
  };

  mockSubs.unshift(newSubmission);
  saveMockSubmissions(mockSubs);

  return { success: true, data: newSubmission };
}

// --------------------------------------------------------------------------
// 2. TEACHER AUTH & ADMIN API
// --------------------------------------------------------------------------

export async function signInTeacher(email, password) {
  if (isConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user, session: data.session };
  }

  // Mock auth for preview demo (e.g. teacher@aptiquest.edu / admin123)
  if (
    (email.trim().toLowerCase() === 'teacher@aptiquest.edu' || email.trim().toLowerCase() === 'admin@aptiquest.com') &&
    password === 'admin123'
  ) {
    const mockUser = {
      id: 'mock-teacher-1',
      email: email.trim(),
      user_metadata: { role: 'teacher', name: 'Instructor' }
    };
    localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  }

  return {
    success: false,
    error: 'Invalid credentials. For offline demo mode, use teacher@aptiquest.edu / admin123'
  };
}

export async function signOutTeacher() {
  if (isConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(MOCK_AUTH_KEY);
  return { success: true };
}

export async function getCurrentTeacherSession() {
  if (isConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return data.session?.user || null;
  }

  try {
    const raw = localStorage.getItem(MOCK_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch official answer key (TEACHERS ONLY).
 */
export async function getAnswerKey() {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('answer_key')
        .select('*');

      if (!error && data && data.length > 0) {
        return { data, error: null };
      }
    } catch (err) {
      console.warn('Supabase answer_key fetch error:', err);
    }
  }

  // Mock / demo fallback answer key
  return { data: mockAnswerKey, error: null };
}

/**
 * Fetch all student submissions (TEACHERS ONLY).
 */
export async function getSubmissions() {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: data || [], error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  }

  // Mock submissions
  return { data: getMockSubmissions(), error: null };
}

/**
 * Delete a submission (TEACHERS ONLY).
 */
export async function deleteSubmission(id) {
  if (isConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Mock delete
  const subs = getMockSubmissions().filter(s => s.id !== id);
  saveMockSubmissions(subs);
  return { success: true };
}

/**
 * Realtime subscription to submissions table.
 */
export function subscribeToSubmissions(onChange) {
  if (!isConfigured || !supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('public:submissions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'submissions' },
      payload => {
        onChange(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
