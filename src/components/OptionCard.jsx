import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function OptionCard({
  index,
  text,
  isSelected,
  onSelect,
}) {
  const label = OPTION_LABELS[index] || String.fromCharCode(65 + index);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3, scale: 1.008 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      role="radio"
      aria-checked={isSelected}
      className={`group relative w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/60 ${
        isSelected
          ? 'bg-gradient-to-r from-brand-500/15 via-purple-500/10 to-cyan-500/10 dark:from-brand-500/25 dark:via-purple-500/15 dark:to-cyan-500/15 border-brand-500 dark:border-brand-400 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/40'
          : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/60 hover:border-brand-300 dark:hover:border-brand-600/60 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
        {/* Letter Badge */}
        <div
          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${
            isSelected
              ? 'accent-gradient-bg text-white shadow-md shadow-brand-500/30'
              : 'bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:group-hover:text-brand-300'
          }`}
        >
          {label}
        </div>

        {/* Option Text */}
        <div className="flex-1 font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-snug">
          {text}
        </div>
      </div>

      {/* Right Indicator: Checkmark or Shortcut Hint */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="hidden md:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          key {label}
        </span>

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
            isSelected
              ? 'bg-brand-500 border-brand-500 text-white shadow-sm'
              : 'border-slate-300 dark:border-slate-600 group-hover:border-brand-400'
          }`}
        >
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}

export default OptionCard;
