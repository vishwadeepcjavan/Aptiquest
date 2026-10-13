import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calculator, MessageSquare, Compass, HelpCircle, Bookmark, CheckCircle2 } from 'lucide-react';
import { OptionCard } from './OptionCard';
import { useTest } from '../context/TestContext';

const categoryMeta = {
  Arithmetic: {
    icon: Calculator,
    gradient: 'from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dotColor: 'bg-emerald-500',
  },
  Verbal: {
    icon: MessageSquare,
    gradient: 'from-purple-500/15 to-pink-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    dotColor: 'bg-purple-500',
  },
  Logical: {
    icon: Compass,
    gradient: 'from-indigo-500/15 to-blue-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    dotColor: 'bg-indigo-500',
  },
  Riddles: {
    icon: HelpCircle,
    gradient: 'from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dotColor: 'bg-amber-500',
  },
};

export function QuestionCard() {
  const {
    questions,
    currentIndex,
    direction,
    answers,
    markedForReview,
    selectOption,
  } = useTest();

  const shouldReduceMotion = useReducedMotion();
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const currentAnswer = answers[currentQ.id];
  const isMarked = markedForReview.includes(currentQ.id);

  const meta = categoryMeta[currentQ.category] || {
    icon: HelpCircle,
    gradient: 'from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    dotColor: 'bg-brand-500',
  };
  const CategoryIcon = meta.icon;

  const slideVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -40 : 40,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const optionItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="w-full relative min-h-[460px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQ.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden"
        >
          {/* Top metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              {/* Category pill */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.gradient}`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{currentQ.category}</span>
              </div>

              {/* Status tags */}
              {isMarked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Bookmark className="w-3 h-3 fill-amber-500" />
                  Marked for Review
                </span>
              )}

              {currentAnswer !== undefined && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Answered
                </span>
              )}
            </div>

            {/* Question Index counter */}
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Question <span className="text-slate-900 dark:text-white font-bold">{currentIndex + 1}</span> of{' '}
              {questions.length}
            </div>
          </div>

          {/* Question Text */}
          <div className="py-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-snug sm:leading-relaxed">
              {currentQ.q}
            </h2>
          </div>

          {/* Options Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-3 sm:gap-3.5 pt-1"
            role="radiogroup"
            aria-label={`Options for question ${currentIndex + 1}`}
          >
            {currentQ.options.map((optText, optIdx) => (
              <motion.div key={optIdx} variants={optionItemVariants}>
                <OptionCard
                  index={optIdx}
                  text={optText}
                  isSelected={currentAnswer === optIdx}
                  onSelect={() => selectOption(currentQ.id, optIdx)}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default QuestionCard;
