'use client';

import React from 'react';
import { StudyTrack } from '@/types';
import {
  TrendingUp,
  Award,
  Search,
  ShieldCheck,
  GraduationCap,
  Shield,
  X
} from 'lucide-react';
import {
  PASSING_GRADE_TWK,
  PASSING_GRADE_TIU,
  PASSING_GRADE_TKP
} from '@/data/constants';

interface RightSidebarProps {
  activeTrack: StudyTrack;
  onSelectCashtag: (tag: string) => void;
  onStartExam: (modeId: string) => void;
  streakDays: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTrack,
  onSelectCashtag,
  searchQuery,
  onSearchChange,
}) => {
  // 1. Trending tags 100% tersaring per jalur aktif
  const trendingTagsByTrack: Record<StudyTrack, Array<{ tag: string; posts: string; sub: string }>> = {
    cpns: [
      { tag: '$TIU-Silogisme', posts: '2.4k pejuang', sub: 'Hukum Kesimpulan BKN' },
      { tag: '$Kemenkeu', posts: '1.8k peminat', sub: 'Formasi Kuota Terbesar' },
      { tag: '$TKP-AntiRadikalisme', posts: '950 soal', sub: 'Skor Skala 1-5' },
      { tag: '$TWK-UUD1945', posts: '840 materi', sub: 'Pasal & Amandemen' },
    ],
    snbt: [
      { tag: '$PenalaranMTK', posts: '1.9k pejuang', sub: 'Model Aljabar & Fungsi' },
      { tag: '$TPS-PenalaranUmum', posts: '1.5k pejuang', sub: 'Logika Deduktif' },
      { tag: '$LiterasiBahasa', posts: '1.1k materi', sub: 'Analisis Wacana Kritis' },
      { tag: '$FK-UI', posts: '920 peminat', sub: 'Target Passing UTBK 750+' },
    ],
    kedinasan: [
      { tag: '$TBI-STAN', posts: '1.6k pejuang', sub: 'Syarat Nilai Mati ≥ 60' },
      { tag: '$TPA-AngkaHilang', posts: '1.2k soal', sub: 'Psikotes Spasial & Matriks' },
      { tag: '$STIS-Statistika', posts: '980 pejuang', sub: 'Matematika Diskrit SPMB' },
      { tag: '$IPDN', posts: '850 pejuang', sub: 'Persiapan Tes Fisik & SKD' },
    ],
  };

  const trendingTags = trendingTagsByTrack[activeTrack] || trendingTagsByTrack.cpns;

  // 2. Leaderboard Skor 100% per jalur
  const topScorersByTrack: Record<StudyTrack, Array<{ name: string; score: string; target: string; rank: number }>> = {
    cpns: [
      { name: 'Rian Pratama', score: '485 SKD', target: 'Kemenkeu', rank: 1 },
      { name: 'Dina Safitri', score: '472 SKD', target: 'BKN RI', rank: 2 },
      { name: 'Fajar Nugraha', score: '465 SKD', target: 'Kejaksaan', rank: 3 },
    ],
    snbt: [
      { name: 'Kak Dimas UTBK', score: '782 UTBK', target: 'STEI ITB', rank: 1 },
      { name: 'Alya Zahra', score: '764 UTBK', target: 'FK UI', rank: 2 },
      { name: 'Rizky Fadilah', score: '748 UTBK', target: 'Teknik UGM', rank: 3 },
    ],
    kedinasan: [
      { name: 'Sarah Amalia', score: 'TBI 95 • TPA 160', target: 'PKN STAN', rank: 1 },
      { name: 'Kevin Halim', score: 'TBI 90 • TPA 155', target: 'Polstat STIS', rank: 2 },
      { name: 'Aditya Pratama', score: 'TBI 88 • TPA 150', target: 'STIN', rank: 3 },
    ],
  };

  const topScorers = topScorersByTrack[activeTrack] || topScorersByTrack.cpns;

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[300px] xl:w-[320px] flex-shrink-0 h-screen sticky top-0 p-4 overflow-y-auto border-l border-slate-200/80 dark:border-slate-800/90 bg-slate-50/40 dark:bg-[#090D16] transition-colors select-none">
      {/* 1. SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Cari di ${activeTrack.toUpperCase()}...`}
          className="w-full h-10 pl-10 pr-9 bg-white dark:bg-[#111726] text-sm font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="w-7 h-7 flex items-center justify-center rounded-lg absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Hapus pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. TRENDING TOPICS */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/90 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#2563EB] dark:text-blue-400" strokeWidth={2} />
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
            Topik Hangat {activeTrack.toUpperCase()}
          </h4>
        </div>
        <div className="space-y-1">
          {trendingTags.map((t) => (
            <button
              key={t.tag}
              type="button"
              onClick={() => onSelectCashtag(t.tag)}
              className="w-full text-left flex items-center justify-between gap-2 group py-2 px-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors block truncate">
                  {t.tag}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                  {t.sub}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums flex-shrink-0">
                {t.posts}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. RULE / REFERENCE CARD */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/90 space-y-3">
        {activeTrack === 'cpns' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
                  Passing Grade SKD
                </h4>
              </div>
              <span className="text-xs font-medium text-slate-400 tabular-nums">100 mnt</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800 py-2.5 px-2 rounded-xl">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">TWK</span>
                <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums block mt-0.5">
                  ≥ {PASSING_GRADE_TWK}
                </span>
                <span className="block text-xs text-slate-400 tabular-nums mt-0.5">30 soal</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800 py-2.5 px-2 rounded-xl">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">TIU</span>
                <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums block mt-0.5">
                  ≥ {PASSING_GRADE_TIU}
                </span>
                <span className="block text-xs text-slate-400 tabular-nums mt-0.5">35 soal</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800 py-2.5 px-2 rounded-xl">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">TKP</span>
                <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums block mt-0.5">
                  ≥ {PASSING_GRADE_TKP}
                </span>
                <span className="block text-xs text-slate-400 tabular-nums mt-0.5">45 soal</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Standar KepmenPAN-RB · 110 Soal CAT
            </p>
          </>
        )}

        {activeTrack === 'snbt' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
                  Struktur UTBK SNBT
                </h4>
              </div>
              <span className="text-xs font-medium text-slate-400">BPPP</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">TPS (Umum &amp; Kuantitatif)</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">40 soal</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Literasi B.Indo &amp; B.Inggris</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">50 soal</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Penalaran Matematika</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">20 soal</span>
              </div>
            </div>
          </>
        )}

        {activeTrack === 'kedinasan' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" strokeWidth={2} />
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
                  Ambang Batas SPMB
                </h4>
              </div>
              <span className="text-xs font-medium text-slate-400">STAN &amp; STIS</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Nilai Mati TBI</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">≥ 60.00</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">TPA &amp; Matematika</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">≥ 67.00</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200/70 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Kesehatan &amp; Psikotes</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lulus Fisik</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 4. LEADERBOARD TOP SKOR */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/90 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" strokeWidth={2} />
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
              Top Skor {activeTrack.toUpperCase()}
            </h4>
          </div>
          <span className="text-xs text-slate-400">Minggu ini</span>
        </div>
        <div className="space-y-2.5">
          {topScorers.map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs tabular-nums flex-shrink-0 ${
                    s.rank === 1
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {s.rank}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.target}</p>
                </div>
              </div>
              <span className="font-semibold text-xs text-[#2563EB] dark:text-blue-400 tabular-nums flex-shrink-0">
                {s.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
