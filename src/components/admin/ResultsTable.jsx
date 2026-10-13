import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export function ResultsTable({ scoredSubmissions = [], onSelectStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [sortField, setSortField] = useState('score'); // 'rank' | 'name' | 'roll_no' | 'score' | 'percentage' | 'time' | 'date'
  const [sortAsc, setSortAsc] = useState(false); // default descending for score
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique classes for filter dropdown
  const classOptions = useMemo(() => {
    const classes = new Set();
    scoredSubmissions.forEach(s => {
      if (s.class_name && s.class_name.trim()) {
        classes.add(s.class_name.trim());
      }
    });
    return Array.from(classes);
  }, [scoredSubmissions]);

  // Filter and search
  const filteredSubmissions = useMemo(() => {
    return scoredSubmissions.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roll_no.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        selectedClass === 'ALL' ||
        (s.class_name && s.class_name.trim() === selectedClass);

      return matchesSearch && matchesClass;
    });
  }, [scoredSubmissions, searchTerm, selectedClass]);

  // Sort logic
  const sortedSubmissions = useMemo(() => {
    const list = [...filteredSubmissions];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'score') {
        comparison = a.score - b.score;
      } else if (sortField === 'percentage') {
        comparison = a.percentage - b.percentage;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'roll_no') {
        comparison = a.roll_no.localeCompare(b.roll_no);
      } else if (sortField === 'time') {
        comparison = a.time_taken_seconds - b.time_taken_seconds;
      } else if (sortField === 'date') {
        comparison = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      } else if (sortField === 'rank') {
        comparison = (a.rank || 0) - (b.rank || 0);
      }
      return sortAsc ? comparison : -comparison;
    });
    return list;
  }, [filteredSubmissions, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage) || 1;
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedSubmissions.slice(start, start + itemsPerPage);
  }, [sortedSubmissions, currentPage, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(prev => !prev);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'roll_no' || field === 'rank');
    }
    setCurrentPage(1);
  };

  // CSV Export Helper
  const exportToCSV = () => {
    if (sortedSubmissions.length === 0) return;

    const headers = [
      'Rank',
      'Name',
      'Roll Number',
      'Class/Batch',
      'Score',
      'Total',
      'Percentage',
      'Status',
      'Time Taken (s)',
      'Submitted At',
    ];

    const rows = sortedSubmissions.map(s => [
      s.rank || 'N/A',
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.roll_no.replace(/"/g, '""')}"`,
      `"${(s.class_name || '').replace(/"/g, '""')}"`,
      s.score,
      s.total,
      `${s.percentage}%`,
      s.isPassed ? 'PASS' : 'FAIL',
      s.time_taken_seconds,
      s.submitted_at || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AptiQuest_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40 ml-1 inline" />;
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-brand-500 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-500 ml-1 inline" />
    );
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Table Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by student name or roll no..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs sm:text-sm bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-2">
          {/* Class Filter */}
          {classOptions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2 px-3 rounded-xl border text-xs font-semibold bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Classes ({classOptions.length})</option>
                {classOptions.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          )}

          {/* Download CSV */}
          <button
            type="button"
            onClick={exportToCSV}
            disabled={sortedSubmissions.length === 0}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/75 dark:bg-slate-800/75 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-3 sm:px-4 cursor-pointer hover:text-brand-500 transition-colors w-16"
              >
                Rank {getSortIcon('rank')}
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-3 sm:px-4 cursor-pointer hover:text-brand-500 transition-colors"
              >
                Student Name {getSortIcon('name')}
              </th>
              <th
                onClick={() => handleSort('roll_no')}
                className="py-3 px-3 sm:px-4 cursor-pointer hover:text-brand-500 transition-colors"
              >
                Roll Number {getSortIcon('roll_no')}
              </th>
              <th className="hidden md:table-cell py-3 px-3 sm:px-4">
                Class / Batch
              </th>
              <th
                onClick={() => handleSort('score')}
                className="py-3 px-3 sm:px-4 cursor-pointer hover:text-brand-500 transition-colors text-right"
              >
                Score (x/27) {getSortIcon('score')}
              </th>
              <th
                onClick={() => handleSort('percentage')}
                className="py-3 px-3 sm:px-4 cursor-pointer hover:text-brand-500 transition-colors text-right"
              >
                Accuracy {getSortIcon('percentage')}
              </th>
              <th className="py-3 px-3 sm:px-4 text-center">
                Status
              </th>
              <th
                onClick={() => handleSort('time')}
                className="hidden lg:table-cell py-3 px-3 sm:px-4 cursor-pointer hover:text-brand-500 transition-colors"
              >
                Time Taken {getSortIcon('time')}
              </th>
              <th
                onClick={() => handleSort('date')}
                className="hidden sm:table-cell py-3 px-3 sm:px-4 cursor-pointer hover:text-brand-500 transition-colors"
              >
                Submitted At {getSortIcon('date')}
              </th>
              <th className="py-3 px-3 sm:px-4 text-center">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {paginatedSubmissions.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 dark:text-slate-400">
                  No submissions match the current query or filter.
                </td>
              </tr>
            ) : (
              paginatedSubmissions.map((sub) => {
                const mins = Math.floor(sub.time_taken_seconds / 60);
                const secs = sub.time_taken_seconds % 60;
                const formattedTime = `${mins}m ${secs}s`;
                const dateFormatted = new Date(sub.submitted_at || Date.now()).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr
                    key={sub.id}
                    onClick={() => onSelectStudent(sub)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-slate-500">
                      #{sub.rank}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white">
                      {sub.name}
                    </td>

                    {/* Roll No */}
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-slate-600 dark:text-slate-300">
                      {sub.roll_no}
                    </td>

                    {/* Class */}
                    <td className="hidden md:table-cell py-3.5 px-3 sm:px-4 text-slate-500 dark:text-slate-400">
                      {sub.class_name || '—'}
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-extrabold text-slate-900 dark:text-white">
                      {sub.score} <span className="text-xs text-slate-400 font-normal">/ {sub.total}</span>
                    </td>

                    {/* Percentage */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-bold text-brand-600 dark:text-brand-400">
                      {sub.percentage}%
                    </td>

                    {/* Pass/Fail Status */}
                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                          sub.isPassed
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30'
                        }`}
                      >
                        {sub.isPassed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> PASS
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> FAIL
                          </>
                        )}
                      </span>
                    </td>

                    {/* Time Taken */}
                    <td className="hidden lg:table-cell py-3.5 px-3 sm:px-4 text-slate-500 font-mono text-xs">
                      {formattedTime}
                    </td>

                    {/* Submitted At */}
                    <td className="hidden sm:table-cell py-3.5 px-3 sm:px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {dateFormatted}
                    </td>

                    {/* Action Icon */}
                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(sub);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 group-hover:text-brand-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="View Full Attempt Analysis"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
        <div>
          Showing {sortedSubmissions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, sortedSubmissions.length)} of {sortedSubmissions.length} submissions
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsTable;
