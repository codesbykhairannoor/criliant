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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col justify-between shadow-2xl border border-slate-200 dark:border-[#1E293B] overflow-hidden transition-colors">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 dark:bg-[#0F172A] text-white flex items-center justify-between border-b dark:border-[#1E293B]">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-5 h-5 text-[#38BDF8] flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-black text-xs sm:text-base truncate">BANK SOAL & DRILLING MATERI</h3>
              <p className="text-[11px] text-slate-400 truncate">
                Tersedia {questions.length}+ bank soal resmi & parametrik terkurasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-[#090D16] border-b border-slate-200 dark:border-[#1E293B] space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci soal, silogisme, UUD, TPA..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0F172A] text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#1E293B] focus:outline-none focus:border-[#2563EB] text-[#0F1419] dark:text-white placeholder:text-[#536471] dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedGroup === g.id
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1E293B] hover:bg-slate-100 dark:hover:bg-slate-800'
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
            <span>
              Ditemukan <strong>{filteredQuestions.length}</strong> butir soal
            </span>
            <span className="hidden sm:inline">Klik ikon simpan untuk bookmark soal</span>
          </div>

          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => {
              const isSaved = bookmarkedIds.has(q.id);
              return (
                <div
                  key={q.id}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0F172A] hover:bg-white dark:hover:bg-[#131D31] hover:border-blue-300 dark:hover:border-blue-500 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]">
                        {q.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {q.subTopic}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      className="text-slate-400 hover:text-amber-500 transition-colors flex-shrink-0"
                      title={isSaved ? 'Hapus dari tersimpan' : 'Simpan soal ini'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">
                    {q.text}
                  </p>

                  <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Opsi: {q.options.length} Pilihan</span>
                    <span className="text-[#2563EB] dark:text-[#38BDF8] font-bold">
                      {getScoringBadgeLabel(q.category)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs">Tidak ada soal yang cocok dengan filter kamu.</p>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>Siap drilling </span>
            <strong className="text-slate-800 dark:text-white">{filteredQuestions.length} soal</strong>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartCustomDrill(filteredQuestions);
            }}
            disabled={filteredQuestions.length === 0}
            className="flex items-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Mulai Drill ({filteredQuestions.length} Soal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
