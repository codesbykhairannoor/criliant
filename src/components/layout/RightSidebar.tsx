'use client';

import React from 'react';
import { StudyTrack } from '@/types';
import {
  TrendingUp,
  Award,
  Search,
  ShieldCheck,
  ChevronRight,
  Target,
  GraduationCap,
  Shield
} from 'lucide-react';
import {
  PASSING_GRADE_TWK,
  PASSING_GRADE_TIU,
  PASSING_GRADE_TKP,
  CASHTAGS_BY_TRACK
} from '@/data/constants';

interface RightSidebarProps {
  activeTrack: StudyTrack;
  onSelectCashtag: (tag: string) => void;
  onStartExam: (modeId: string) => void;
  streakDays: number;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTrack,
  onSelectCashtag,
  onStartExam,
  streakDays,
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
    <aside className="hidden lg:flex flex-col gap-4 w-[290px] xl:w-[310px] flex-shrink-0 h-screen sticky top-0 p-4 overflow-y-auto border-l border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC]/50 dark:bg-[#090D16]/50 transition-colors select-none">
      {/* 1. SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={`Cari topik di Kamar ${activeTrack.toUpperCase()}...`}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#111726] hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-[#111726] text-xs font-semibold rounded-xl border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs"
        />
      </div>

      {/* 2. TRENDING TOPICS (100% Terisolasi per Kamar Ujian) */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
              Topik Hangat {activeTrack.toUpperCase()}
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Kamar Aktif</span>
        </div>
        <div className="space-y-2">
          {trendingTags.map((t, idx) => (
            <div
              key={t.tag}
              onClick={() => onSelectCashtag(t.tag)}
              className="flex items-center justify-between group cursor-pointer py-1.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.tag}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block pl-4">{t.sub}</span>
              </div>
              <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                {t.posts}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. RULE / REFERENCE CARD (100% Sesuai Kamar Ujian) */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        {activeTrack === 'cpns' && (
          <>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
                  Passing Grade SKD BKN
                </h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400">100 Menit</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center mb-2.5">
              <div className="bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800 p-2 rounded-xl">
                <span className="block text-[9px] font-bold text-slate-500">TWK</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">≥ {PASSING_GRADE_TWK}</span>
                <span className="block text-[8px] text-slate-400">30 Soal</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800 p-2 rounded-xl">
                <span className="block text-[9px] font-bold text-slate-500">TIU</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">≥ {PASSING_GRADE_TIU}</span>
                <span className="block text-[8px] text-slate-400">35 Soal</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800 p-2 rounded-xl">
                <span className="block text-[9px] font-bold text-slate-500">TKP</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">≥ {PASSING_GRADE_TKP}</span>
                <span className="block text-[8px] text-slate-400">45 Soal</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-tight">
              Standar KepmenPAN-RB • 110 Soal CAT Resmi
            </p>
          </>
        )}

        {activeTrack === 'snbt' && (
          <>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
                  Standar Ujian SNBT UTBK
                </h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400">Kemendikbud</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">TPS (Penalaran Umum & Kuantitatif)</span>
                <span className="font-bold text-slate-900 dark:text-white">40 Soal</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Literasi B.Indo & B.Inggris</span>
                <span className="font-bold text-slate-900 dark:text-white">50 Soal</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Penalaran Matematika</span>
                <span className="font-bold text-slate-900 dark:text-white">20 Soal</span>
              </div>
            </div>
          </>
        )}

        {activeTrack === 'kedinasan' && (
          <>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
                  Nilai Ambang Batas SPMB
                </h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400">STAN & STIS</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Nilai Mati TBI (B.Inggris)</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">Wajib ≥ 60.00</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">TPA & Logika Matematika</span>
                <span className="font-bold text-slate-900 dark:text-white">Minimal 67.00</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#0E1524] border border-slate-200/60 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-300">Tes Kesehatan & Psikotes</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Lulus Fisik</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 4. LEADERBOARD TOP SKOR (100% Sesuai Kamar Ujian) */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
              Top Skor {activeTrack.toUpperCase()}
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Minggu Ini</span>
        </div>
        <div className="space-y-2">
          {topScorers.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                  s.rank === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {s.rank}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{s.target}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs flex-shrink-0">
                {s.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
