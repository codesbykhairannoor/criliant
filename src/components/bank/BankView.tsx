'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Question, Category, StudyTrack } from '@/types';
import {
  BookOpen,
  Search,
  Swords,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface BankViewProps {
  questions: Question[];
  initialGroup?: string;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (questionId: string) => void;
  onStartCustomDrill: (filteredQuestions: Question[]) => void;
  activeTrack?: StudyTrack;
  setActiveTrack?: (track: StudyTrack) => void;
  onRequireAuth?: () => void;
}

const ITEMS_PER_PAGE = 15;

export const BankView: React.FC<BankViewProps> = ({
  questions,
  initialGroup = 'SEMUA',
  bookmarkedIds,
  onToggleBookmark,
  onStartCustomDrill,
  activeTrack,
  setActiveTrack,
  onRequireAuth,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Synchronize when initialGroup prop changes
  useEffect(() => {
    setSelectedGroup(initialGroup);
    setCurrentPage(1);
  }, [initialGroup]);

  // Reset to page 1 whenever filters change
  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setSelectedCategory('ALL');
    setCurrentPage(1);
  };

  const groups = [
    { id: 'SEMUA', label: 'Semua Materi', count: questions.length },
    {
      id: 'SKD_CPNS',
      label: '🏛️ SKD CPNS',
      count: questions.filter((q) => ['TWK', 'TIU', 'TKP'].includes(q.category)).length,
    },
    {
      id: 'SNBT_UTBK',
      label: '🎓 SNBT UTBK',
      count: questions.filter((q) =>
        ['TPS_PENALARAN_UMUM', 'TPS_KUANTITATIF', 'LITERASI_INDONESIA', 'PENALARAN_MATEMATIKA'].includes(q.category)
      ).length,
    },
    {
      id: 'KEDINASAN',
      label: '🛡️ Kedinasan',
      count: questions.filter((q) =>
        ['MTK_KEDINASAN', 'TPA', 'PSIKOTES', 'BAHASA_INGGRIS'].includes(q.category)
      ).length,
    },
    {
      id: 'BOOKMARKS',
      label: `⭐ Tersimpan`,
      count: bookmarkedIds.size,
    },
  ];

  // Dynamic Sub-category list based on selected group
  const availableCategories = useMemo(() => {
    let pool = questions;
    if (selectedGroup === 'SKD_CPNS') {
      pool = questions.filter((q) => ['TWK', 'TIU', 'TKP'].includes(q.category));
    } else if (selectedGroup === 'SNBT_UTBK') {
      pool = questions.filter((q) =>
        ['TPS_PENALARAN_UMUM', 'TPS_KUANTITATIF', 'LITERASI_INDONESIA', 'PENALARAN_MATEMATIKA'].includes(q.category)
      );
    } else if (selectedGroup === 'KEDINASAN') {
      pool = questions.filter((q) =>
        ['MTK_KEDINASAN', 'TPA', 'PSIKOTES', 'BAHASA_INGGRIS'].includes(q.category)
      );
    } else if (selectedGroup === 'BOOKMARKS') {
      pool = questions.filter((q) => bookmarkedIds.has(q.id));
    }

    const uniqueCats = Array.from(new Set(pool.map((q) => q.category)));
    return uniqueCats;
  }, [questions, selectedGroup, bookmarkedIds]);

  // Filtering Logic
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Group Filter
      if (selectedGroup === 'BOOKMARKS' && !bookmarkedIds.has(q.id)) return false;
      if (selectedGroup === 'SKD_CPNS' && !['TWK', 'TIU', 'TKP'].includes(q.category)) return false;
      if (
        selectedGroup === 'KEDINASAN' &&
        !['MTK_KEDINASAN', 'TPA', 'PSIKOTES', 'BAHASA_INGGRIS'].includes(q.category)
      )
        return false;
      if (
        selectedGroup === 'SNBT_UTBK' &&
        !['TPS_PENALARAN_UMUM', 'TPS_KUANTITATIF', 'LITERASI_INDONESIA', 'PENALARAN_MATEMATIKA'].includes(q.category)
      )
        return false;

      // 2. Specific Sub-Category Filter
      if (selectedCategory !== 'ALL' && q.category !== selectedCategory) return false;

      // 3. Difficulty Filter
      if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) return false;

      // 4. Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const haystack = `${q.text} ${q.subTopic} ${q.category} ${q.explanation || ''}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [questions, selectedGroup, selectedCategory, selectedDifficulty, searchQuery, bookmarkedIds]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, currentPage]);

  const toggleExpand = (questionId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleToggleExpandAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(paginatedQuestions.map((q) => q.id)));
    }
  };

  const getCategoryBadgeClass = (category: Category) => {
    if (['TWK'].includes(category)) return 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200/60 dark:border-red-900/40';
    if (['TIU', 'TPS_KUANTITATIF', 'PENALARAN_MATEMATIKA'].includes(category))
      return 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40';
    if (['TKP'].includes(category)) return 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/40';
    if (['TPS_PENALARAN_UMUM', 'LITERASI_INDONESIA'].includes(category))
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40';
    return 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40';
  };

  const getDifficultyLabel = (diff: Question['difficulty']) => {
    switch (diff) {
      case 'easy':
        return { label: 'Mudah', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' };
      case 'medium':
        return { label: 'Sedang', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' };
      case 'hard':
        return { label: 'Sulit', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' };
      case 'hard_hots':
        return { label: 'HOTS', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40' };
      default:
        return { label: 'Standar', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' };
    }
  };

  const getScoringStandard = (cat: Question['category']) => {
    if (['TWK', 'TIU', 'TKP'].includes(cat)) return 'Standar BKN CAT';
    if (['MTK_KEDINASAN', 'TPA', 'PSIKOTES', 'BAHASA_INGGRIS'].includes(cat)) return 'Standar SPMB Kedinasan';
    return 'Standar UTBK IRT';
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-4 max-w-3xl mx-auto pb-12 select-none">
      {/* 1. TOP HERO HEADER */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Repositori Resmi Soal
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {questions.length}+ Soal Terkurasi
            </span>
          </div>

          {bookmarkedIds.size > 0 && (
            <button
              onClick={() => handleGroupChange('BOOKMARKS')}
              className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
                selectedGroup === 'BOOKMARKS'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{bookmarkedIds.size} Tersimpan</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Bank Soal &amp; Drilling Terfokus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Jelajahi ratusan butir soal terstandarisasi, pelajari pembahasannya, atau mulai drilling acak untuk memperkuat konsep materi.
            </p>
          </div>

          {filteredQuestions.length > 0 && (
            <button
              onClick={() => onStartCustomDrill(filteredQuestions)}
              className="flex-shrink-0 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Drill Hasil Filter ({filteredQuestions.length})</span>
            </button>
          )}
        </div>

        {/* 2. GROUP SELECTOR TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80">
          {groups.map((g) => {
            const isActive = selectedGroup === g.id;
            return (
              <button
                key={g.id}
                onClick={() => handleGroupChange(g.id)}
                className={`text-xs font-extrabold px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                <span>{g.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {g.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & ADVANCED FILTERS */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari kata kunci materi, silogisme, UUD 1945, TPA, sinonim..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-[#0D1322] text-xs font-semibold rounded-xl border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills: Sub-Kategori & Tingkat Kesulitan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          {/* Sub-Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setCurrentPage(1);
              }}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Kategori
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap uppercase ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Difficulty & Toggle All Answers */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold py-1 px-2.5 rounded-lg border border-transparent focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Tingkat</option>
              <option value="easy">Mudah</option>
              <option value="medium">Sedang</option>
              <option value="hard">Sulit</option>
              <option value="hard_hots">HOTS</option>
            </select>

            <button
              onClick={handleToggleExpandAll}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
              title={expandedIds.size > 0 ? 'Sembunyikan semua pembahasan' : 'Lihat semua pembahasan'}
            >
              {expandedIds.size > 0 ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Tutup Kunci</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka Kunci</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. RESULTS COUNT & ACTIVE FILTER PILL */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Menampilkan <strong>{filteredQuestions.length}</strong> butir soal
          {selectedGroup === 'BOOKMARKS' && ' (Tersimpan)'}
        </span>
        {totalPages > 1 && (
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
        )}
      </div>

      {/* 5. QUESTION LIST CARDS */}
      <div className="space-y-3">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((q, idx) => {
            const isSaved = bookmarkedIds.has(q.id);
            const isExpanded = expandedIds.has(q.id);
            const diffInfo = getDifficultyLabel(q.difficulty);
            const questionNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden"
              >
                {/* Question Card Header */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-black text-slate-400 w-5">
                        #{questionNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                          q.category
                        )}`}
                      >
                        {q.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {q.subTopic}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${diffInfo.color}`}
                      >
                        {diffInfo.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors flex-shrink-0"
                      title={isSaved ? 'Hapus dari tersimpan' : 'Simpan soal ini'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Question Stem Text */}
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                    {q.text}
                  </p>

                  {/* Footer Meta & Accordion Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {getScoringStandard(q.category)} • {q.options.length} Opsi
                    </span>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className={`font-bold flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
                        isExpanded
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{isExpanded ? 'Tutup Jawaban' : 'Kunci & Pembahasan'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Options & Explanation Block */}
                {isExpanded && (
                  <div className="bg-slate-50 dark:bg-[#0D1322] px-4 sm:px-5 py-4 border-t border-slate-200/70 dark:border-slate-800/80 space-y-3.5 animate-in slide-in-from-top-1 duration-200">
                    {/* Options List */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Pilihan Jawaban:
                      </p>
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctOptionIndex;
                        const tkpScore = q.tkpOptionPoints ? q.tkpOptionPoints[optIdx] : null;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 transition-all ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                                : 'bg-white dark:bg-[#111726] border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {optionLabels[optIdx]}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>
                            {isCorrect && (
                              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 flex-shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Kunci</span>
                              </span>
                            )}
                            {tkpScore !== null && (
                              <span
                                className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                  tkpScore === 5
                                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                              >
                                {tkpScore} Poin
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed Explanation / Pembahasan */}
                    {q.explanation && (
                      <div className="bg-white dark:bg-[#111726] p-3.5 rounded-xl border border-blue-200/60 dark:border-blue-900/40 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-black">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pembahasan Resmi &amp; Rasional:</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-[#111726] rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200">
              Tidak Ada Soal yang Sesuai Filter
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian, ubah sub-kategori, atau reset filter untuk menampilkan semua bank soal.
            </p>
            <button
              onClick={() => {
                setSelectedGroup('SEMUA');
                setSelectedCategory('ALL');
                setSelectedDifficulty('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* 6. PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 text-xs font-bold">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, and current +- 1
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="text-slate-400 px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
