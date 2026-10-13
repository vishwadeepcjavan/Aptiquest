import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, User, Hash, GraduationCap, Home, ShieldCheck } from 'lucide-react';
import { useTest } from '../context/TestContext';

export function Submitted() {
  const { lastSubmissionInfo } = useTest();

  const name = lastSubmissionInfo?.name || 'Candidate';
  const rollNo = lastSubmissionInfo?.rollNo || 'N/A';
  const className = lastSubmissionInfo?.className || '';
  const timeTaken = lastSubmissionInfo?.timeTakenSeconds || 0;
  const attempted = lastSubmissionInfo?.attemptedCount ?? 0;
  const total = lastSubmissionInfo?.totalQuestions ?? 27;

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const formattedTime = `${minutes}m ${seconds}s`;

  // Draw-on SVG checkmark path variants
  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { delay: 0.6, duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Animated Draw-On Success Checkmark */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-full h-full text-emerald-500"
            viewBox="0 0 100 100"
            fill="none"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              variants={circleVariants}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M30 52 L43 65 L70 36"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkVariants}
              initial="hidden"
              animate="visible"
            />
          </svg>
        </div>

        {/* Confirmation Message */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-2">
          Assessment Submitted!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
          Thank you, <span className="font-bold text-slate-900 dark:text-white">{name}</span>! Your answers have been safely received. Your instructor will review the submissions and publish the final evaluation.
        </p>

        {/* Verified Submission Metadata Card */}
        <div className="p-5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 mb-8 text-left space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-700/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Candidate Information
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              <ShieldCheck className="w-3 h-3" />
              Verified & Locked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Name:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{name}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Hash className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Roll No:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{rollNo}</span>
            </div>

            {className && (
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Class:</span>
                <span className="font-medium text-slate-900 dark:text-white">{className}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Time Taken:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{formattedTime}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 sm:col-span-2">
              <HelpCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Attempted:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {attempted} of {total} Questions
              </span>
            </div>
          </div>
        </div>

        {/* Note on single submission & results */}
        <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300 mb-6">
          Your attempt is permanently registered. Individual scores and rank lists will be provided directly by your teacher.
        </div>

        {/* Action Button: Return to Home */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default Submitted;
