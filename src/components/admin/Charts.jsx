import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export function Charts({ scoredSubmissions = [] }) {
  if (scoredSubmissions.length === 0) return null;

  // 1. Score Distribution Data
  const scoreBuckets = [
    { range: '0 - 5', count: 0 },
    { range: '6 - 10', count: 0 },
    { range: '11 - 15', count: 0 },
    { range: '16 - 20', count: 0 },
    { range: '21 - 25', count: 0 },
    { range: '26 - 27', count: 0 },
  ];

  scoredSubmissions.forEach(sub => {
    const s = sub.score;
    if (s <= 5) scoreBuckets[0].count++;
    else if (s <= 10) scoreBuckets[1].count++;
    else if (s <= 15) scoreBuckets[2].count++;
    else if (s <= 20) scoreBuckets[3].count++;
    else if (s <= 25) scoreBuckets[4].count++;
    else scoreBuckets[5].count++;
  });

  // 2. Category Accuracy Averages
  const categoryTotals = {
    Arithmetic: { correct: 0, total: 0 },
    Verbal: { correct: 0, total: 0 },
    Logical: { correct: 0, total: 0 },
    Riddles: { correct: 0, total: 0 },
  };

  scoredSubmissions.forEach(sub => {
    if (sub.categoryBreakdown) {
      Object.entries(sub.categoryBreakdown).forEach(([cat, stats]) => {
        if (!categoryTotals[cat]) {
          categoryTotals[cat] = { correct: 0, total: 0 };
        }
        categoryTotals[cat].correct += stats.correct;
        categoryTotals[cat].total += stats.total;
      });
    }
  });

  const categoryData = Object.entries(categoryTotals).map(([name, data]) => ({
    name,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    totalAttempted: data.total,
  }));

  // 3. Submissions Over Time
  const timelineMap = {};
  scoredSubmissions.forEach(sub => {
    const date = new Date(sub.submitted_at || Date.now());
    const hourKey = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timelineMap[hourKey] = (timelineMap[hourKey] || 0) + 1;
  });

  const timelineData = Object.entries(timelineMap).map(([time, count]) => ({
    time,
    submissions: count,
  }));

  const categoryColors = ['#10b981', '#a855f7', '#6366f1', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Score Distribution Histogram */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Score Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            (Marks out of 27)
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Category Accuracy Breakdown */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Category Accuracy Rate (%)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Average Conceptual Mastery
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val) => [`${val}%`, 'Accuracy']}
              />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Submissions Velocity (if multiple timepoints) */}
      {timelineData.length > 1 && (
        <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Submission Velocity
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Submissions received across time
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="subGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#subGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Charts;
