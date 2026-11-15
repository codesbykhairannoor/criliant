'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Question, Category, StudyTrack } from '@/types';
import { TRACK_CATEGORIES } from '@/data/examPackages';
import {
  BookOpen,
  Search,
  Swords,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';

interface BankViewProps {
  questions: Question[];
  initialGroup?: string;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (questionId: string) => void;
  onStartCustomDrill: (filteredQuestions: Question[]) => void;
  activeTrack: StudyTrack;
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
  onRequireAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowingBookmarksOnly, setIsShowingBookmarksOnly] = useState(initialGroup === 'BOOKMARKS');

  // Synchronize initialGroup
  useEffect(() => {
    if (initialGroup === 'BOOKMARKS') {
      setIsShowingBookmarksOnly(true);
    } else {
      setIsShowingBookmarksOnly(false);
    }
    setCurrentPage(1);
  }, [initialGroup, activeTrack]);

  // Scoped categories for active track
  const trackCategories = TRACK_CATEGORIES[activeTrack] || TRACK_CATEGORIES.cpns;

  const trackLabels = {
    cpns: 'SKD CPNS',
    snbt: 'SNBT UTBK',
    kedinasan: 'Sekolah Kedinasan',
  };

  const categoryMeta: Record<string, { label: string; icon: string }> = {
    TWK: { label: 'TWK (Wawasan Kebangsaan)', icon: '🏛️' },
    TIU: { label: 'TIU (Intelegensia Umum)', icon: '⚡' },
    TKP: { label: 'TKP (Karakteristik Pribadi)', icon: '🛡️' },
    TPS_PENALARAN_UMUM: { label: 'Penalaran Umum (TPS)', icon: '🧠' },
    TPS_KUANTITATIF: { label: 'Pengetahuan Kuantitatif', icon: '📊' },
    LITERASI_INDONESIA: { label: 'Literasi Bahasa', icon: '📖' },
    PENALARAN_MATEMATIKA: { label: 'Penalaran Matematika', icon: '📐' },
    TPA: { label: 'TPA (Potensi Akademik)', icon: '🔢' },
    BAHASA_INGGRIS: { label: 'Bahasa Inggris SPMB', icon: '🌐' },
    MTK_KEDINASAN: { label: 'Matematika Diskrit STIS', icon: '📐' },
    PSIKOTES: { label: 'Psikotes Spasial', icon: '🧩' },
  };

  // Base pool: strictly scoped to current active track (or bookmarks if selected)
  const trackPool = useMemo(() => {
    return questions.filter((q) => trackCategories.includes(q.category));
  }, [questions, trackCategories]);

  // Bookmarks count within active track
  const bookmarksCountInTrack = useMemo(() => {
    return trackPool.filter((q) => bookmarkedIds.has(q.id)).length;
  }, [trackPool, bookmarkedIds]);

  // Filtering Logic
  const filteredQuestions = useMemo(() => {
    return trackPool.filter((q) => {
      // 1. Bookmarks only toggle
      if (isShowingBookmarksOnly && !bookmarkedIds.has(q.id)) return false;

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
  }, [trackPool, isShowingBookmarksOnly, selectedCategory, selectedDifficulty, searchQuery, bookmarkedIds]);

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

  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-6 max-w-5xl w-full mx-auto pb-12 select-none">
      {/* 1. CLEAN BORDERLESS PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-[-0.025em] leading-[1.2] text-slate-900 dark:text-white">
            Bank Soal {trackLabels[activeTrack]}
          </h1>
          <p className="text-sm sm:text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Jelajahi {trackPool.length} butir soal resmi dan parametrik untuk Kamar {trackLabels[activeTrack]}, lengkap dengan kunci dan pembahasan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          {bookmarksCountInTrack > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsShowingBookmarksOnly(!isShowingBookmarksOnly);
                setCurrentPage(1);
              }}
              className={`h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors border ${
                isShowingBookmarksOnly
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-[#111726] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="tabular-nums">Tersimpan ({bookmarksCountInTrack})</span>
            </button>
          )}

          {filteredQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => onStartCustomDrill(filteredQuestions)}
              className="h-10 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span className="tabular-nums">Drill ({filteredQuestions.length})</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. FILTER BAR & CATEGORY TABS */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/90 space-y-4 transition-colors">
        {/* Sub-category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setIsShowingBookmarksOnly(false);
              setCurrentPage(1);
            }}
            className={`h-9 px-3.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedCategory === 'ALL' && !isShowingBookmarksOnly
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-100 dark:bg-[#0D1322] text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            <span>Semua Materi</span>
            <span className="text-xs opacity-80 tabular-nums">{trackPool.length}</span>
          </button>

          {trackCategories.map((cat) => {
            const info = categoryMeta[cat] || { label: cat, icon: '📝' };
            const isActive = selectedCategory === cat && !isShowingBookmarksOnly;
            const countInCat = trackPool.filter((q) => q.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsShowingBookmarksOnly(false);
                  setCurrentPage(1);
                }}
                className={`h-9 px-3.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-100 dark:bg-[#0D1322] text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <span>{info.label}</span>
                <span className="text-xs opacity-80 tabular-nums">{countInCat}</span>
              </button>
            );
          })}
        </div>

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
            placeholder="Cari kata kunci soal, silogisme, UUD 1945, TPA, aritmetika..."
            className="w-full h-11 pl-10 pr-10 bg-slate-50 dark:bg-[#0D1322] text-[15px] sm:text-sm font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="w-8 h-8 flex items-center justify-center absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              aria-label="Reset pencarian"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Difficulty Selector & Toggle All Answers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
              Tingkat:
            </span>
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'easy', label: 'Mudah' },
              { id: 'medium', label: 'Sedang' },
              { id: 'hard', label: 'Sulit' },
              { id: 'hard_hots', label: 'HOTS' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setSelectedDifficulty(d.id);
                  setCurrentPage(1);
                }}
                className={`h-9 px-3 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                  selectedDifficulty === d.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleToggleExpandAll}
            className="h-9 px-3 rounded-lg text-[13px] font-semibold text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/15 flex items-center gap-1.5 transition-colors self-end sm:self-auto"
          >
            {expandedIds.size > 0 ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Tutup Semua Kunci</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Buka Semua Kunci</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. RESULTS COUNT */}
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-1">
        <span className="tabular-nums">
          Menampilkan <strong className="text-slate-900 dark:text-white">{filteredQuestions.length}</strong> soal
          {isShowingBookmarksOnly && ' tersimpan'}
        </span>
        {totalPages > 1 && (
          <span className="tabular-nums text-xs sm:text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
        )}
      </div>

      {/* 4. QUESTION LIST CARDS */}
      <div className="space-y-4">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((q, idx) => {
            const isSaved = bookmarkedIds.has(q.id);
            const isExpanded = expandedIds.has(q.id);
            const diffInfo = getDifficultyLabel(q.difficulty);
            const questionNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition-colors overflow-hidden"
              >
                {/* Question Card Header & Stem */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-400 tabular-nums">
                        #{questionNumber}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${getCategoryBadgeClass(
                          q.category
                        )}`}
                      >
                        {q.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {q.subTopic}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg ${diffInfo.color}`}
                      >
                        {diffInfo.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleBookmark(q.id)}
                      className="w-9 h-9 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-center transition-colors flex-shrink-0"
                      title={isSaved ? 'Hapus dari tersimpan' : 'Simpan soal ini'}
                      aria-label={isSaved ? 'Hapus dari tersimpan' : 'Simpan soal ini'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-[18px] h-[18px] text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-[18px] h-[18px]" />
                      )}
                    </button>
                  </div>

                  {/* Readable 15px-16px Question Stem */}
                  <p className="text-[15px] sm:text-base font-normal text-slate-900 dark:text-slate-100 leading-[1.6] whitespace-pre-line">
                    {q.text}
                  </p>

                  {/* Footer Meta & Accordion Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                      {q.options.length} pilihan jawaban
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className={`h-9 px-3 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors ${
                        isExpanded
                          ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{isExpanded ? 'Tutup Jawaban' : 'Kunci & Pembahasan'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Options & Explanation Block */}
                {isExpanded && (
                  <div className="bg-slate-50 dark:bg-[#0D1322] px-5 py-4 border-t border-slate-200/70 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-1 duration-200">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Pilihan Jawaban
                      </p>
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctOptionIndex;
                        const tkpScore = q.tkpOptionPoints ? q.tkpOptionPoints[optIdx] : null;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl text-sm flex items-start gap-3 transition-colors ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-semibold'
                                : 'bg-white dark:bg-[#111726] border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {optionLabels[optIdx]}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>
                            {isCorrect && (
                              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Kunci</span>
                              </span>
                            )}
                            {tkpScore !== null && (
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-md tabular-nums ${
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

                    {q.explanation && (
                      <div className="bg-white dark:bg-[#111726] p-4 rounded-xl border border-blue-200/60 dark:border-blue-900/40 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 text-sm font-semibold">
                          <Sparkles className="w-4 h-4" />
                          <span>Pembahasan Resmi</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
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
          <div className="bg-white dark:bg-[#111726] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Tidak ada soal yang sesuai filter
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter tingkat kesulitan.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedDifficulty('ALL');
                  setIsShowingBookmarksOnly(false);
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="text-slate-400 px-1.5">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
