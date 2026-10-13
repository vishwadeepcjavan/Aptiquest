import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, animate } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Home,
} from 'lucide-react';
import { useTest } from '../context/TestContext';
import { ReviewList } from './ReviewList';

export function Result() {
  const { testResult, retakeTest, goHome } = useTest();
  const shouldReduceMotion = useReducedMotion();
  const score = testResult?.score || 0;
  const percentage = testResult?.percentage || 0;
  const [displayedScore, setDisplayedScore] = useState(() => (shouldReduceMotion ? score : 0));

  // Animated Count-up for Score
  useEffect(() => {
    if (!testResult || shouldReduceMotion) return;
    const controls = animate(0, score, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayedScore(Math.round(latest)),
    });
    return () => controls.stop();
  }, [score, shouldReduceMotion, testResult]);

  // Confetti trigger if score >= 60%
  useEffect(() => {
    if (!testResult) return;
    if (percentage >= 60 && !shouldReduceMotion) {
      // Primary center burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'],
      });

      // Second burst after 300ms from sides
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.15, y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#06b6d4'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.85, y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#06b6d4'],
        });
      }, 350);

      return () => clearTimeout(timeout);
    }
  }, [percentage, shouldReduceMotion, testResult]);

  if (!testResult) return null;

  const {
    userName,
    totalQuestions,
    correctCount,
    wrongCount,
    skippedCount,
    timeSpent,
    categoryStats,
    questions,
    answers,
    markedForReview,
  } = testResult;

  // Performance Rating details
  let performanceTitle = 'Keep Practicing!';
  let performanceSubtitle = 'Every attempt builds stronger reasoning and problem-solving skills.';
  let badgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';

  if (percentage >= 90) {
    performanceTitle = 'Outstanding Performance! 🏆';
    performanceSubtitle = 'Exceptional analytical agility and mastery across all categories.';
    badgeColor = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  } else if (percentage >= 75) {
    performanceTitle = 'Excellent Work! 🌟';
    performanceSubtitle = 'High aptitude with strong conceptual accuracy and speed.';
    badgeColor = 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
  } else if (percentage >= 60) {
    performanceTitle = 'Good Job! 🎯';
    performanceSubtitle = 'Solid foundation. A bit more practice on challenging areas will take you to the top.';
    badgeColor = 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
  }

  // Format time spent: e.g. "14m 22s"
  const minutesSpent = Math.floor(timeSpent / 60);
  const secondsSpent = timeSpent % 60;
  const timeFormatted = `${minutesSpent}m ${secondsSpent}s`;
  const avgSecondsPerQ = Math.round(timeSpent / totalQuestions);

  // Circular Percentage Ring Parameters
  const circleRadius = 54;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Top Hero Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Summary */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border mb-4 ${badgeColor}`}
            >
              <span>{performanceTitle}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mb-2">
              Well Done, <span className="accent-gradient-text">{userName}</span>!
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mb-6">
              {performanceSubtitle}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={retakeTest}
                className="px-5 py-3 rounded-2xl accent-gradient-bg text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Test (New Shuffle)</span>
              </motion.button>

              <button
                type="button"
                onClick={goHome}
                className="px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>

          {/* Right Circular Percentage & Score Ring */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={circleRadius}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r={circleRadius}
                  stroke="url(#resultGradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                  {displayedScore}
                  <span className="text-base text-slate-400 font-semibold">/{totalQuestions}</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                  {percentage}% Accuracy
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Row: 4 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Correct Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {correctCount}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Correct Answers
            </div>
          </div>
        </motion.div>

        {/* Incorrect Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {wrongCount}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Incorrect
            </div>
          </div>
        </motion.div>

        {/* Skipped Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {skippedCount}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Skipped
            </div>
          </div>
        </motion.div>

        {/* Time Taken Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {timeFormatted}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg {avgSecondsPerQ}s / Q
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category-wise Breakdown Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl"
      >
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <span>Category-Wise Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {Object.entries(categoryStats).map(([catName, stats]) => {
            const catPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

            let barColor = 'from-emerald-500 to-teal-400';
            if (catName === 'Verbal') barColor = 'from-purple-500 to-pink-500';
            if (catName === 'Logical') barColor = 'from-indigo-500 to-blue-500';
            if (catName === 'Riddles') barColor = 'from-amber-500 to-orange-500';

            return (
              <div
                key={catName}
                className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {catName}
                  </span>
                  <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-slate-900 dark:text-white font-bold">{stats.correct}</span> / {stats.total} Correct ({catPct}%)
                  </span>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${catPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Answer Review & Explanation Section */}
      <ReviewList
        questions={questions}
        answers={answers}
        markedForReview={markedForReview}
      />
    </div>
  );
}

export default Result;
