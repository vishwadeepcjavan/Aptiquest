-- ==============================================================================
-- AptiQuest — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ==============================================================================

-- 1. Create questions table (Public access - NO ANSWERS)
CREATE TABLE IF NOT EXISTS public.questions (
  id INT PRIMARY KEY,
  category TEXT NOT NULL,
  q TEXT NOT NULL,
  options JSONB NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- 2. Create answer_key table (TEACHERS ONLY - NO PUBLIC ACCESS)
CREATE TABLE IF NOT EXISTS public.answer_key (
  question_id INT PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
  answer INT NOT NULL,
  explanation TEXT NOT NULL
);

-- 3. Create submissions table (Student attempts)
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL UNIQUE,
  class_name TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  time_taken_seconds INT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance and sorting
CREATE INDEX IF NOT EXISTS idx_submissions_roll_no ON public.submissions(roll_no);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_sort_order ON public.questions(sort_order);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_key ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to ensure clean idempotency
DROP POLICY IF EXISTS "Allow public read of questions" ON public.questions;
DROP POLICY IF EXISTS "Allow authenticated read of answer_key" ON public.answer_key;
DROP POLICY IF EXISTS "Allow anonymous and authenticated insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow authenticated select submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow authenticated delete submissions" ON public.submissions;

-- Table: questions
-- Anyone (students / anonymous) can read questions
CREATE POLICY "Allow public read of questions"
  ON public.questions
  FOR SELECT
  USING (true);

-- Table: answer_key
-- ONLY authenticated users (teachers) can read answers and explanations
CREATE POLICY "Allow authenticated read of answer_key"
  ON public.answer_key
  FOR SELECT
  TO authenticated
  USING (true);

-- Table: submissions
-- Anonymous and authenticated users can INSERT (submit their test)
CREATE POLICY "Allow anonymous and authenticated insert submissions"
  ON public.submissions
  FOR INSERT
  WITH CHECK (true);

-- ONLY authenticated users (teachers) can SELECT submissions
CREATE POLICY "Allow authenticated select submissions"
  ON public.submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- ONLY authenticated users (teachers) can DELETE submissions (to allow re-attempts)
CREATE POLICY "Allow authenticated delete submissions"
  ON public.submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Enable Realtime for submissions (Optional, enables live admin dashboard updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
