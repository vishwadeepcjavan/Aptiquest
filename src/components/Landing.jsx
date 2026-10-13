import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  User,
  Hash,
  GraduationCap,
  AlertTriangle,
  Award,
  Zap,
} from 'lucide-react';
import { useTest } from '../context/TestContext';

export function Landing() {
  const navigate = useNavigate();
  const {
    startTest,
    hasSavedSession,
    savedSessionData,
    resumeSavedSession,
    discardSavedSession,
  } = useTest();

  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [className, setClassName] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const handleStart = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedRoll = rollNo.trim();

    if (!trimmedName) {
      setErrorShake(true);
      setErrorMessage('Please enter your full name');
      setTimeout(() => setErrorShake(false), 600);
      return;
    }

    if (!trimmedRoll) {
      setErrorShake(true);
      setErrorMessage('Please enter your roll number or student ID');
      setTimeout(() => setErrorShake(false), 600);
      return;
    }

    setErrorMessage('');
    await startTest({
      name: trimmedName,
      rollNo: trimmedRoll,
      className: className.trim(),
    });
    navigate('/test');
  };

  const handleResume = () => {
    resumeSavedSession();
    navigate('/test');
  };

  const titleWords = ['Master', 'Your', 'Aptitude', '&', 'Logical', 'Thinking'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 200 },
    },
  };

  const floatingIconVariants = {
    animate1: {
      y: shouldReduceMotion ? 0 : [-8, 8, -8],
      rotate: shouldReduceMotion ? 0 : [0, 8, 0],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
    animate2: {
      y: shouldReduceMotion ? 0 : [10, -10, 10],
      rotate: shouldReduceMotion ? 0 : [0, -10, 0],
      transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 },
    },
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10">
      {/* Floating Decorative Badges */}
      <motion.div
        variants={floatingIconVariants}
        animate="animate1"
        className="hidden lg:flex absolute top-16 left-12 p-3.5 rounded-2xl glass-card text-brand-500 shadow-xl items-center gap-2 pointer-events-none"
      >
        <Zap className="w-5 h-5 text-amber-500" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Official Institutional Assessment
        </span>
      </motion.div>

      <motion.div
        variants={floatingIconVariants}
        animate="animate2"
        className="hidden lg:flex absolute bottom-24 right-14 p-3.5 rounded-2xl glass-card text-cyan-500 shadow-xl items-center gap-2 pointer-events-none"
      >
        <Award className="w-5 h-5 text-cyan-500" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Direct Teacher Evaluation
        </span>
      </motion.div>

      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Top Highlight Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-brand-600 dark:text-brand-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>General Aptitude & Reasoning Evaluation</span>
        </motion.div>

        {/* Animated Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center text-slate-900 dark:text-white tracking-tight font-display mb-4 max-w-3xl leading-tight"
        >
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className={`inline-block mr-2.5 sm:mr-3.5 ${
                word === 'Aptitude' || word === 'Logical' ? 'accent-gradient-text' : ''
              }`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8"
        >
          Please enter your credentials below. Complete all questions within the allotted 30 minutes. Your responses will be securely submitted to your instructor.
        </motion.p>

        {/* Saved Session Resume Card */}
        {hasSavedSession && savedSessionData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl mb-6 p-4 sm:p-5 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-brand-500/5"
          >
            <div>
              <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-sm">
                <RotateCcw className="w-4 h-4" />
                <span>Resume Ongoing Attempt</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Student: <span className="font-semibold">{savedSessionData.studentInfo?.name}</span> (
                {savedSessionData.studentInfo?.rollNo}) • {Object.keys(savedSessionData.answers || {}).length} answered •{' '}
                {Math.ceil((savedSessionData.remainingTime || 1800) / 60)} mins remaining.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={discardSavedSession}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleResume}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl accent-gradient-bg text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:scale-105 transition-transform"
              >
                Resume Test
              </button>
            </div>
          </motion.div>
        )}

        {/* Assessment Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative"
        >
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="block text-lg font-extrabold accent-gradient-text">27</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Questions</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="block text-lg font-extrabold text-amber-500">30 Min</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Time Limit</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="block text-lg font-extrabold text-emerald-500">0 Neg</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">No Penalty</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="block text-lg font-extrabold text-cyan-500">1x</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Single Attempt</span>
            </div>
          </div>

          {/* Test Guidelines */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Important Test Guidelines
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Arithmetic, Verbal Reasoning, Logical Deduction, and Lateral Thinking.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>You can skip, mark for review, and navigate between questions freely.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-900 dark:text-white">
                  Results and marks are confidential and will be reviewed and shared by your teacher.
                </span>
              </li>
            </ul>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleStart} className="space-y-4">
            <motion.div
              animate={
                errorShake && !shouldReduceMotion
                  ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className="space-y-3.5"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="student-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="student-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. Alex Hunter"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Roll Number / Student ID */}
              <div>
                <label
                  htmlFor="student-roll"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Roll Number / Student ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="student-roll"
                    type="text"
                    value={rollNo}
                    onChange={(e) => {
                      setRollNo(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. 2026-CS-42"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 border-slate-300 dark:border-slate-700"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Each roll number can submit the assessment exactly once.
                </p>
              </div>

              {/* Class / Batch (Optional) */}
              <div>
                <label
                  htmlFor="student-class"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Class / Batch <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="student-class"
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. Final Year CS - Section B"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Start Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-2xl accent-gradient-bg text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-3 group transition-shadow cursor-pointer mt-4"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </form>

          {/* Teacher Login Link in footer */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Teacher / Admin Portal</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;
