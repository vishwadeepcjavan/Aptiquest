import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Hash,
  GraduationCap,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function StudentDetail({
  student,
  isOpen,
  onClose,
  onDeleteSubmission,
}) {
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !student) return null;

  const {
    id,
    name,
    roll_no,
    class_name,
    time_taken_seconds,
    score,
    total,
    percentage,
    isPassed,
    categoryBreakdown,
    questionResults,
  } = student;

  const minutes = Math.floor(time_taken_seconds / 60);
  const seconds = time_taken_seconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDeleteSubmission(id);
    setIsDeleting(false);
    setIsConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
      />

      {/* Modal / Drawer Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[92vh] glass-card bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {name}
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isPassed
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30'
                }`}
              >
                {isPassed ? 'PASS' : 'FAIL'} ({percentage}%)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{roll_no}</span>
              </span>
              {class_name && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
                  <span>{class_name}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>Time: {timeFormatted}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Delete button (allows re-attempt) */}
            <button
              type="button"
              onClick={() => setIsConfirmDelete(true)}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Delete submission to allow student to re-take"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Allow Retake (Delete)</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
              <span className="block text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                {score} / {total}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Total Score
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="block text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {student.correctCount}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Correct Answers
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
              <span className="block text-2xl font-extrabold text-red-700 dark:text-red-300">
                {student.wrongCount}
              </span>
              <span className="text-[11px] font-semibold text-red-700 dark:text-red-400">
                Incorrect Answers
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
              <span className="block text-2xl font-extrabold text-slate-700 dark:text-slate-300">
                {student.skippedCount}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Skipped
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          {categoryBreakdown && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Category-Wise Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(categoryBreakdown).map(([cat, stats]) => (
                  <div key={cat} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cat}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {stats.correct} / {stats.total} ({stats.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Full Attempt Analysis ({questionResults?.length || 0} Questions)
            </h4>

            <div className="space-y-4">
              {questionResults?.map((q, idx) => {
                return (
                  <div
                    key={q.question_id}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm transition-all ${
                      q.isCorrect
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : q.isWrong
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40'
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Q{idx + 1}.
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {q.category}
                        </span>
                      </div>

                      <div>
                        {q.isCorrect && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Correct (+1)
                          </span>
                        )}
                        {q.isWrong && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                            <XCircle className="w-3.5 h-3.5" />
                            Incorrect (0)
                          </span>
                        )}
                        {q.isSkipped && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <HelpCircle className="w-3.5 h-3.5" />
                            Skipped
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question text */}
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      {q.q}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {q.options?.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        const isStudentChoice = optIdx === q.userAnswer;

                        let cardClass =
                          'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300';
                        if (isCorrect) {
                          cardClass = 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold';
                        } else if (isStudentChoice && !isCorrect) {
                          cardClass = 'bg-red-500/15 border-red-500 text-red-950 dark:text-red-200 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${cardClass}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded flex items-center justify-center font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                                {OPTION_LETTERS[optIdx]}
                              </span>
                              <span>{opt}</span>
                            </span>
                            {isCorrect && <span className="text-[10px] text-emerald-600 font-bold">Key</span>}
                            {isStudentChoice && !isCorrect && <span className="text-[10px] text-red-600 font-bold">Student Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-brand-700 dark:text-brand-300">Explanation: </span>
                        <span className="text-slate-700 dark:text-slate-300">{q.explanation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal Overlay */}
        <AnimatePresence>
          {isConfirmDelete && (
            <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm glass-card bg-white dark:bg-slate-900 rounded-3xl p-6 text-center space-y-4 border border-red-500/30"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Allow Student Retake?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This will permanently delete <span className="font-bold text-slate-800 dark:text-slate-200">{name}</span>'s submission (Roll No: <span className="font-mono font-bold">{roll_no}</span>). The student will then be able to take the assessment again.
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setIsConfirmDelete(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete & Allow'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default StudentDetail;
