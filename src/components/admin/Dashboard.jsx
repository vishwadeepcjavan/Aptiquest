import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import {
  Users,
  Trophy,
  Award,
  TrendingDown,
  Percent,
  RefreshCw,
  PlusCircle,
  FileCheck2,
  CheckCircle,
} from 'lucide-react';
import {
  getSubmissions,
  getAnswerKey,
  getQuestions,
  deleteSubmission,
  subscribeToSubmissions,
} from '../../lib/supabase';
import { scoreSubmission } from '../../utils/scoring';
import { AdminLayout } from './AdminLayout';
import { Charts } from './Charts';
import { ResultsTable } from './ResultsTable';
import { StudentDetail } from './StudentDetail';

export function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [answerKey, setAnswerKey] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // Load all required data
  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [subsRes, keyRes, qRes] = await Promise.all([
        getSubmissions(),
        getAnswerKey(),
        getQuestions(),
      ]);

      setSubmissions(subsRes.data || []);
      setAnswerKey(keyRes.data || []);
      setQuestions(qRes.data || []);
    } catch (e) {
      console.error('Error fetching admin dashboard data:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Setup Supabase Realtime subscription
    const unsubscribe = subscribeToSubmissions(() => {
      loadData(true);
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  // Compute scores for all submissions
  const scoredSubmissions = useMemo(() => {
    if (submissions.length === 0 || answerKey.length === 0) return [];

    const list = submissions.map((sub) => {
      const evaluation = scoreSubmission(sub.answers || {}, answerKey, questions);
      return {
        ...sub,
        ...evaluation,
      };
    });

    // Sort by score descending to calculate official rank
    list.sort((a, b) => b.score - a.score);
    list.forEach((sub, idx) => {
      sub.rank = idx + 1;
    });

    return list;
  }, [submissions, answerKey, questions]);

  // Global Aggregate Metrics
  const stats = useMemo(() => {
    const total = scoredSubmissions.length;
    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passPercentage: 0,
        passCount: 0,
      };
    }

    const scores = scoredSubmissions.map(s => s.score);
    const sumScore = scores.reduce((acc, curr) => acc + curr, 0);
    const avgScore = Number((sumScore / total).toFixed(1));
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const passCount = scoredSubmissions.filter(s => s.isPassed).length;
    const passPercentage = Math.round((passCount / total) * 100);

    return {
      total,
      avgScore,
      highestScore,
      lowestScore,
      passPercentage,
      passCount,
    };
  }, [scoredSubmissions]);

  // Handle deletion of a submission
  const handleDeleteSubmission = async (id) => {
    const result = await deleteSubmission(id);
    if (result.success) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
    }
  };

  return (
    <AdminLayout onRefresh={() => loadData(true)} isRefreshing={isRefreshing}>
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Aptitude Assessment Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Realtime institutional analytics, candidate rankings, and score distributions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-brand-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800/60" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800/60" />
            <div className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800/60" />
          </div>
        </div>
      ) : (
        <>
          {/* Animated Stat Cards Grid (5 core metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* 1. Total Submissions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Total Students</span>
                <Users className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {stats.total}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Completed attempts
                </span>
              </div>
            </motion.div>

            {/* 2. Average Score */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Average Score</span>
                <Award className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-display">
                  {stats.avgScore}
                  <span className="text-sm font-normal text-slate-400"> / 27</span>
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Mean class marks
                </span>
              </div>
            </motion.div>

            {/* 3. Highest Score */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Highest Score</span>
                <Trophy className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
                  {stats.highestScore}
                  <span className="text-sm font-normal text-slate-400"> / 27</span>
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Top performer
                </span>
              </div>
            </motion.div>

            {/* 4. Lowest Score */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Lowest Score</span>
                <TrendingDown className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-display">
                  {stats.lowestScore}
                  <span className="text-sm font-normal text-slate-400"> / 27</span>
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Lowest mark
                </span>
              </div>
            </motion.div>

            {/* 5. Pass Percentage */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm col-span-2 sm:col-span-1"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Pass Rate</span>
                <Percent className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-display">
                  {stats.passPercentage}%
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {stats.passCount} of {stats.total} passed (≥40%)
                </span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Charts Section */}
          <Charts scoredSubmissions={scoredSubmissions} />

          {/* Results Table Section */}
          <ResultsTable
            scoredSubmissions={scoredSubmissions}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />

          {/* Student Detail Modal */}
          <StudentDetail
            student={selectedStudent}
            isOpen={Boolean(selectedStudent)}
            onClose={() => setSelectedStudent(null)}
            onDeleteSubmission={handleDeleteSubmission}
          />
        </>
      )}
    </AdminLayout>
  );
}

export default Dashboard;
