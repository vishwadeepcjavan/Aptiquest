import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { useTest } from '../context/TestContext';

export function Timer() {
  const { timeLeft, totalTime } = useTest();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressFraction = Math.max(0, Math.min(1, timeLeft / totalTime));

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  const isCritical = timeLeft <= 60; // < 1 min: red + pulse
  const isWarning = timeLeft <= 300 && timeLeft > 60; // < 5 min: amber

  let strokeColor = '#8b5cf6'; // default brand purple
  let textColor = 'text-slate-800 dark:text-slate-100';

  if (isCritical) {
    strokeColor = '#ef4444';
    textColor = 'text-red-600 dark:text-red-400 font-bold';
  } else if (isWarning) {
    strokeColor = '#f59e0b';
    textColor = 'text-amber-600 dark:text-amber-400 font-bold';
  }

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={isCritical ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : {}}
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-colors ${
        isCritical
          ? 'bg-red-500/10 border-red-500/40 shadow-lg shadow-red-500/10'
          : isWarning
          ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
          : 'bg-white/70 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/70 shadow-sm'
      }`}
      role="timer"
      aria-label={`Time remaining: ${minutes} minutes and ${seconds} seconds`}
      aria-live="polite"
    >
      {/* Circular SVG Progress Ring */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="w-10 h-10 transform -rotate-90">
          {/* Background track */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-700/60"
            strokeWidth="3.5"
            fill="transparent"
          />
          {/* Animated active ring */}
          <motion.circle
            cx="20"
            cy="20"
            r={radius}
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Clock Icon or Alert Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
          ) : (
            <Clock className={`w-4 h-4 ${isWarning ? 'text-amber-500' : 'text-brand-500'}`} />
          )}
        </div>
      </div>

      {/* Numerical Timer Display */}
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
          Time Left
        </span>
        <span className={`text-base font-mono font-bold tracking-tight ${textColor}`}>
          {formattedTime}
        </span>
      </div>
    </motion.div>
  );
}

export default Timer;
