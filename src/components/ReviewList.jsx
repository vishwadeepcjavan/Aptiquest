import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  Lightbulb,
  Check,
  X,
  Filter,
} from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function ReviewList({ questions, answers, markedForReview }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'skipped'

  // Pre-calculate status for each question
  const questionsWithStatus = questions.map((q, idx) => {
    const userChoice = answers[q.id];
    const isSkipped = userChoice === undefined || userChoice === null;
    const isCorrect = !isSkipped && userChoice === q.answer;
    const isWrong = !isSkipped && userChoice !== q.answer;
    const isMarked = markedForReview.includes(q.id);

    return {
      ...q,
      originalIndex: idx + 1,
      userChoice,
      isSkipped,
      isCorrect,
      isWrong,
      isMarked,
    };
  });

  const counts = {
    all: questionsWithStatus.length,
    correct: questionsWithStatus.filter(q => q.isCorrect).length,
    wrong: questionsWithStatus.filter(q => q.isWrong).length,
    skipped: questionsWithStatus.filter(q => q.isSkipped).length,
  };

  const filteredQuestions = questionsWithStatus.filter(q => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'wrong') return q.isWrong;
    if (filter === 'skipped') return q.isSkipped;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Detailed Answers & Explanations
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'correct'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            Correct ({counts.correct})
          </button>
          <button
            type="button"
            onClick={() => setFilter('wrong')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'wrong'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-red-700 dark:text-red-400 hover:bg-red-500/10'
            }`}
          >
            Incorrect ({counts.wrong})
          </button>
          <button
            type="button"
            onClick={() => setFilter('skipped')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'skipped'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Skipped ({counts.skipped})
          </button>
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-3xl p-6 text-slate-500 dark:text-slate-400">
            No questions found in this filter category.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border transition-all ${
                  q.isCorrect
                    ? 'border-emerald-500/30'
                    : q.isWrong
                    ? 'border-red-500/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Q{q.originalIndex}.
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {q.category}
                    </span>
                    {q.isMarked && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Bookmark className="w-3 h-3 fill-amber-500" />
                        Marked
                      </span>
                    )}
                  </div>

                  {/* Outcome Tag */}
                  <div>
                    {q.isCorrect && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Correct (+1)
                      </span>
                    )}
                    {q.isWrong && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30">
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        Incorrect (0)
                      </span>
                    )}
                    {q.isSkipped && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        Skipped (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-4">
                  {q.q}
                </p>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isCorrectAnswer = optIdx === q.answer;
                    const isUserChoice = optIdx === q.userChoice;

                    let optCardClass =
                      'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                    let badgeClass = 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

                    if (isCorrectAnswer) {
                      optCardClass =
                        'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/50';
                      badgeClass = 'bg-emerald-500 text-white';
                    } else if (isUserChoice && !isCorrectAnswer) {
                      optCardClass =
                        'bg-red-500/15 border-red-500 text-red-950 dark:text-red-200 line-through ring-1 ring-red-500/50';
                      badgeClass = 'bg-red-500 text-white';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${optCardClass}`}
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${badgeClass}`}
                          >
                            {OPTION_LETTERS[optIdx]}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </div>

                        {/* Badges for answer state */}
                        {isCorrectAnswer && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 flex-shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Correct Answer
                          </span>
                        )}
                        {isUserChoice && !isCorrectAnswer && (
                          <span className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 flex-shrink-0">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-3.5 rounded-xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 text-xs sm:text-sm flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-700 dark:text-brand-300">Explanation: </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.explanation}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ReviewList;
