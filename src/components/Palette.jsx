import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useTest } from '../context/TestContext';

export function Palette({ isOpenMobile = false, onCloseMobile = () => {} }) {
  const {
    questions,
    currentIndex,
    answers,
    markedForReview,
    goToQuestion,
    setIsConfirmOpen,
  } = useTest();

  // Statistics
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.length;
  const unansweredCount = questions.length - answeredCount;

  const content = (
    <div className="flex flex-col h-full gap-4">
      {/* Palette Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Question Palette
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {answeredCount} of {questions.length} answered
          </p>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close question palette"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Marked ({markedCount})</span>
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>Unanswered ({unansweredCount})</span>
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300">
          <span className="w-2.5 h-2.5 rounded-full ring-2 ring-brand-500 bg-white dark:bg-slate-900" />
          <span>Current</span>
        </div>
      </div>

      {/* Question Number Grid */}
      <div className="flex-1 overflow-y-auto pr-1 py-2">
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = answers[q.id] !== undefined;
            const isMarked = markedForReview.includes(q.id);

            let btnStyle =
              'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700';

            if (isAnswered && isMarked) {
              btnStyle =
                'bg-gradient-to-br from-emerald-500/30 to-amber-500/30 text-amber-900 dark:text-amber-200 border-amber-500 font-bold';
            } else if (isAnswered) {
              btnStyle =
                'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/50 hover:bg-emerald-500/30 font-semibold';
            } else if (isMarked) {
              btnStyle =
                'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/50 hover:bg-amber-500/30 font-semibold';
            }

            return (
              <motion.button
                key={q.id}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  goToQuestion(idx);
                  onCloseMobile();
                }}
                className={`relative h-10 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center transition-all ${btnStyle} ${
                  isCurrent
                    ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-md font-extrabold text-brand-600 dark:text-brand-300'
                    : ''
                }`}
                aria-label={`Jump to question ${idx + 1}`}
              >
                {idx + 1}

                {/* Micro indicators */}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                )}
                {isAnswered && !isMarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Palette Footer Button */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onCloseMobile();
            setIsConfirmOpen(true);
          }}
          className="w-full py-3 px-4 rounded-xl accent-gradient-bg text-white font-semibold text-sm shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Submit Test</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="glass-card rounded-3xl p-5 sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col shadow-lg">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer / Sheet */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Bottom Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-h-[82vh] bg-white dark:bg-slate-900 rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            >
              {/* Drawer Handle */}
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-3" />
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Palette;
