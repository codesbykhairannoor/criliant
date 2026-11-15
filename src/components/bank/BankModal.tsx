'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/types';
import { BookOpen, Search, Swords, X, Bookmark, BookmarkCheck } from 'lucide-react';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  initialGroup?: string;
  onStartCustomDrill: (filteredQuestions: Question[]) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (questionId: string) => void;
}

export const BankModal: React.FC<BankModalProps> = ({
  isOpen,
  onClose,
  questions,
  initialGroup = 'SEMUA',
  onStartCustomDrill,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedGroup(initialGroup);
    }
  }, [isOpen, initialGroup]);

  if (!isOpen) return null;

  const groups = [
    { id: 'SEMUA', label: 'Semua Materi' },
    { id: 'SKD_CPNS', label: '🏛️ SKD CPNS (BKN)' },
    { id: 'KEDINASAN', label: '🛡️ Sekolah Kedinasan' },
    { id: 'SNBT_UTBK', label: '🎓 SNBT UTBK' },
    { id: 'BOOKMARKS', label: `⭐ Tersimpan (${bookmarkedIds.size})` },
  ];

  const filteredQuestions = questions.filter((q) => {
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

    if (searchQuery.trim()) {
      const qText = `${q.text} ${q.subTopic} ${q.category}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  const getScoringBadgeLabel = (cat: Question['category']) => {
    if (['TWK', 'TIU', 'TKP'].includes(cat)) return 'Standar BKN';
    if (['MTK_KEDINASAN', 'TPA', 'PSIKOTES', 'BAHASA_INGGRIS'].includes(cat)) return 'Standar SPMB';
    return 'Standar UTBK IRT';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#111726] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col justify-between shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 dark:bg-[#0B0F19] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-5 h-5 text-[#38BDF8] flex-shrink-0" strokeWidth={1.85} />
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">Bank Soal & Drilling Materi</h3>
              <p className="text-xs text-slate-400 truncate tabular-nums">
                Tersedia {questions.length}+ bank soal resmi terkurasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 transition-colors"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-[18px] h-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci soal, silogisme, UUD, TPA..."
              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#111726] text-[15px] sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#2563EB] text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`h-9 text-[13px] font-medium px-3.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedGroup === g.id
                    ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-[#111726] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question List View */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1 gap-2">
            <span className="tabular-nums">
              Ditemukan <strong className="text-slate-900 dark:text-white">{filteredQuestions.length}</strong> butir soal
            </span>
            <span className="hidden sm:inline">Klik ikon simpan untuk bookmark soal</span>
          </div>

          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => {
              const isSaved = bookmarkedIds.has(q.id);
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19] hover:bg-white dark:hover:bg-[#131D31] hover:border-blue-300 dark:hover:border-blue-500/60 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]">
                        {q.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                        {q.subTopic}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                      title={isSaved ? 'Hapus dari tersimpan' : 'Simpan soal ini'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-[18px] h-[18px] text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-[18px] h-[18px]" strokeWidth={1.85} />
                      )}
                    </button>
                  </div>

                  <p className="text-[15px] font-normal text-slate-800 dark:text-slate-100 leading-[1.6]">
                    {q.text}
                  </p>

                  <div className="pt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span className="tabular-nums">Opsi: {q.options.length} Pilihan</span>
                    <span className="text-[#2563EB] dark:text-[#38BDF8] font-semibold">
                      {getScoringBadgeLabel(q.category)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" strokeWidth={1.6} />
              <p className="text-sm">Tidak ada soal yang cocok dengan filter kamu.</p>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
            <span>Siap drilling </span>
            <strong className="text-slate-900 dark:text-white">{filteredQuestions.length} soal</strong>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartCustomDrill(filteredQuestions);
            }}
            disabled={filteredQuestions.length === 0}
            className="h-10 flex items-center gap-2 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white font-semibold text-sm shadow-sm active:scale-[0.98] transition-all"
          >
            <Swords className="w-4 h-4" strokeWidth={1.85} />
            <span className="tabular-nums">Mulai Drill ({filteredQuestions.length} Soal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
