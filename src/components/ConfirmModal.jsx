import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Bookmark,
  HelpCircle,
  X,
  Check,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useTest } from '../context/TestContext';

export function ConfirmModal() {
  const navigate = useNavigate();
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    submitTest,
    questions,
    answers,
    markedForReview,
    isSubmitting,
    submitError,
    isDuplicateRollNo,
    setSubmitError,
  } = useTest();

  // Close on Escape key (if not actively submitting)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isConfirmOpen && !isSubmitting) {
        setIsConfirmOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfirmOpen, isSubmitting, setIsConfirmOpen]);

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const marked = markedForReview.length;
  const unanswered = total - answered;

  const handleSubmit = async () => {
    const result = await submitTest();
    if (result && result.success) {
      navigate('/submitted');
    }
  };

  return (
    <AnimatePresence>
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && setIsConfirmOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg glass-card bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
          >
            {/* Close Button */}
            {!isSubmitting && (
              <button
                type="button"
                onClick={() => {
                  setSubmitError(null);
                  setIsConfirmOpen(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="text-center sm:text-left mb-6">
              <div className="w-12 h-12 rounded-2xl accent-gradient-bg flex items-center justify-center text-white mb-3 shadow-md shadow-brand-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 id="confirm-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Submit Your Assessment?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your responses will be transmitted to the database and locked.
              </p>
            </div>

            {/* Progress Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                  {answered}
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                  Answered
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-center">
                <Bookmark className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300">
                  {marked}
                </span>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                  Marked
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex flex-col items-center justify-center text-center">
                <HelpCircle className="w-5 h-5 text-slate-500 mb-1" />
                <span className="text-xl font-extrabold text-slate-700 dark:text-slate-300">
                  {unanswered}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Unanswered
                </span>
              </div>
            </div>

            {/* Unanswered warning */}
            {unanswered > 0 && !submitError && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  <span className="font-semibold">Notice:</span> You have{' '}
                  <span className="font-bold">{unanswered}</span> unanswered question
                  {unanswered > 1 ? 's' : ''}. There is no negative marking, so answering all is recommended.
                </div>
              </div>
            )}

            {/* Error Banner (e.g. Duplicate roll no or network error) */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 ${
                  isDuplicateRollNo
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : 'bg-red-500/15 border-red-500/30 text-red-900 dark:text-red-200'
                }`}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                <div className="text-xs">
                  <p className="font-bold mb-1">
                    {isDuplicateRollNo ? 'Submission Blocked' : 'Transmission Error'}
                  </p>
                  <p>{submitError}</p>
                  {!isDuplicateRollNo && (
                    <p className="mt-1 opacity-80">
                      Your answers remain saved safely on this device. Click Retry to re-send.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setSubmitError(null);
                  setIsConfirmOpen(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
              >
                Keep Working
              </button>

              <motion.button
                type="button"
                disabled={isSubmitting || isDuplicateRollNo}
                whileHover={!isSubmitting && !isDuplicateRollNo ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && !isDuplicateRollNo ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 rounded-xl accent-gradient-bg text-white font-semibold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : submitError && !isDuplicateRollNo ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Submission</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Yes, Submit Now</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
