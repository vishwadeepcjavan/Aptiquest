import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  Send,
  Grid3X3,
  Keyboard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { Palette } from './Palette';
import { ConfirmModal } from './ConfirmModal';

export function Test() {
  const navigate = useNavigate();
  const {
    studentInfo,
    isTestActive,
    questions,
    currentIndex,
    answers,
    markedForReview,
    selectOption,
    clearAnswer,
    toggleMarkForReview,
    nextQuestion,
    prevQuestion,
    setIsConfirmOpen,
    isConfirmOpen,
  } = useTest();

  // Redirect if test is not active
  useEffect(() => {
    if (!isTestActive && !studentInfo.rollNo) {
      navigate('/');
    }
  }, [isTestActive, studentInfo.rollNo, navigate]);

  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const currentQ = questions[currentIndex];
  const isMarked = currentQ ? markedForReview.includes(currentQ.id) : false;
  const isAnswered = currentQ ? answers[currentQ.id] !== undefined : false;

  // Answered progress calculation
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / total) * 100);

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      // Don't intercept if confirmation modal is active or active element is an input
      if (isConfirmOpen) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const key = e.key;

      if (key === 'ArrowLeft') {
        e.preventDefault();
        prevQuestion();
      } else if (key === 'ArrowRight') {
        e.preventDefault();
        nextQuestion();
      } else if (key === 'm' || key === 'M') {
        e.preventDefault();
        if (currentQ) toggleMarkForReview(currentQ.id);
      } else if (key === 'a' || key === 'A' || key === '1') {
        if (currentQ && currentQ.options.length > 0) {
          selectOption(currentQ.id, 0);
        }
      } else if (key === 'b' || key === 'B' || key === '2') {
        if (currentQ && currentQ.options.length > 1) {
          selectOption(currentQ.id, 1);
        }
      } else if (key === 'c' || key === 'C' || key === '3') {
        if (currentQ && currentQ.options.length > 2) {
          selectOption(currentQ.id, 2);
        }
      } else if (key === 'd' || key === 'D' || key === '4') {
        if (currentQ && currentQ.options.length > 3) {
          selectOption(currentQ.id, 3);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isConfirmOpen,
    currentIndex,
    currentQ,
    selectOption,
    toggleMarkForReview,
    nextQuestion,
    prevQuestion,
  ]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Test Top Control Bar */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-6 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Title & Quick Counter */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  General Aptitude Assessment
                </h2>
                {studentInfo.rollNo && (
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {studentInfo.rollNo}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Candidate: <span className="font-semibold text-slate-700 dark:text-slate-200">{studentInfo.name || 'Student'}</span> • {answeredCount} of {total} Answered ({progressPercent}%)
              </p>
            </div>
          </div>

          {/* Right: Timer and Mobile Palette button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Timer />

            {/* Mobile Palette Trigger */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobilePaletteOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              aria-label="Open question palette"
            >
              <Grid3X3 className="w-4 h-4 text-brand-500" />
              <span>Palette</span>
            </motion.button>
          </div>
        </div>

        {/* Smooth Animated Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full accent-gradient-bg rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Content Layout: Question Card on left/center, Palette on right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Question + Action Controls */}
        <div className="w-full lg:flex-1 flex flex-col gap-5">
          <QuestionCard />

          {/* Action Buttons Bar */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left side actions: Prev / Next */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800'
                    : 'bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
                aria-label="Previous question"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={nextQuestion}
                disabled={currentIndex === total - 1}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                  currentIndex === total - 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800'
                    : 'bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
                aria-label="Next question"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Middle & Right actions: Mark for review, Clear answer, Submit */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {/* Mark for review toggle */}
              <button
                type="button"
                onClick={() => currentQ && toggleMarkForReview(currentQ.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                  isMarked
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                aria-label={isMarked ? 'Unmark review' : 'Mark for review'}
              >
                <Bookmark className={`w-4 h-4 ${isMarked ? 'fill-amber-500' : ''}`} />
                <span>{isMarked ? 'Marked' : 'Mark for Review'}</span>
              </button>

              {/* Clear answer */}
              {isAnswered && (
                <button
                  type="button"
                  onClick={() => currentQ && clearAnswer(currentQ.id)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  aria-label="Clear answer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}

              {/* Submit Test Trigger */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsConfirmOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl accent-gradient-bg text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 hover:shadow-brand-500/40"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </motion.button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint Bar */}
          <div className="px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-brand-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Keyboard Shortcuts:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">A-D</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">1-4</kbd> Select</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">→</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">M</kbd> Mark</span>
            </div>
          </div>
        </div>

        {/* Right Column: Palette Component (Desktop sidebar & Mobile Drawer) */}
        <Palette
          isOpenMobile={mobilePaletteOpen}
          onCloseMobile={() => setMobilePaletteOpen(false)}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal />
    </div>
  );
}

export default Test;
