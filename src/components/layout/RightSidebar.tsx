'use client';

import React from 'react';
import {
  TrendingUp,
  Award,
  Search,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  PASSING_GRADE_TWK,
  PASSING_GRADE_TIU,
  PASSING_GRADE_TKP
} from '@/data/constants';

interface RightSidebarProps {
  onSelectCashtag: (tag: string) => void;
  onStartExam: (modeId: string) => void;
  streakDays: number;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onSelectCashtag,
  onStartExam,
  streakDays,
}) => {
  const trendingTags = [
    { tag: '$TIU-Silogisme', posts: '2.4k diskusi', track: 'CPNS' },
    { tag: '$Kemenkeu', posts: '1.8k pejuang', track: 'Formasi' },
    { tag: '$TKP-AntiRadikalisme', posts: '950 tips', track: 'CPNS' },
    { tag: '$STAN', posts: '840 pejuang', track: 'Kedinasan' },
    { tag: '$PenalaranMTK', posts: '720 soal', track: 'SNBT' },
  ];

  const topScorers = [
    { name: 'Rian Pratama', score: 485, target: 'Kemenkeu', rank: 1 },
    { name: 'Dina Safitri', score: 472, target: 'BKN RI', rank: 2 },
    { name: 'Fajar Nugraha', score: 465, target: 'Kejaksaan', rank: 3 },
  ];

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[290px] xl:w-[310px] flex-shrink-0 h-screen sticky top-0 p-4 overflow-y-auto border-l border-[#EFF3F4] dark:border-[#1E293B] bg-[#F8FAFC]/50 dark:bg-[#090D16]/50 transition-colors select-none">
      {/* 1. SEARCH BAR (Clean Twitter Style) */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#536471] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari cashtag, topik, atau soal..."
          className="w-full pl-9 pr-4 py-2 bg-[#EFF3F4] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-[#0F172A] text-xs font-semibold rounded-full border border-transparent focus:border-[#2563EB] dark:focus:border-[#38BDF8] focus:outline-none transition-all text-[#0F1419] dark:text-white placeholder:text-[#536471] dark:placeholder:text-slate-500"
        />
      </div>

      {/* 2. TRENDING TOPICS (Single Source of Truth for Cashtags) */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl p-4 border border-[#EFF3F4] dark:border-[#1E293B] shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EFF3F4] dark:border-[#1E293B]">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
            <h4 className="font-extrabold text-xs text-[#0F1419] dark:text-white tracking-tight">
              Topik Hangat (Cashtag)
            </h4>
          </div>
          <span className="text-[10px] text-[#536471] dark:text-slate-400 font-bold">Nasional</span>
        </div>
        <div className="space-y-2.5">
          {trendingTags.map((t, idx) => (
            <div
              key={t.tag}
              onClick={() => onSelectCashtag(t.tag)}
              className="flex items-center justify-between group cursor-pointer py-1 px-1 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#536471] dark:text-slate-500">#{idx + 1}</span>
                  <span className="text-xs font-extrabold text-[#0F1419] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8] transition-colors">
                    {t.tag}
                  </span>
                </div>
                <span className="text-[10px] text-[#536471] dark:text-slate-400 pl-4">{t.posts}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#536471] dark:text-slate-400">
                {t.track}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PASSING GRADE SKD BKN (KepmenPAN-RB 2026 Reference) */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl p-4 border border-[#EFF3F4] dark:border-[#1E293B] shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#EFF3F4] dark:border-[#1E293B]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-extrabold text-xs text-[#0F1419] dark:text-white tracking-tight">
              Passing Grade SKD BKN
            </h4>
          </div>
          <span className="text-[9px] font-mono font-bold text-[#536471] dark:text-slate-400">100 Menit</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center mb-2.5">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 p-2 rounded-xl">
            <span className="block text-[9px] font-extrabold text-red-600 dark:text-red-400">TWK</span>
            <span className="text-xs font-black text-red-950 dark:text-red-200">≥ {PASSING_GRADE_TWK}</span>
            <span className="block text-[8px] text-red-400">30 Soal</span>
          </div>

          <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 p-2 rounded-xl">
            <span className="block text-[9px] font-extrabold text-sky-600 dark:text-sky-400">TIU</span>
            <span className="text-xs font-black text-sky-950 dark:text-sky-200">≥ {PASSING_GRADE_TIU}</span>
            <span className="block text-[8px] text-sky-400">35 Soal</span>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-2 rounded-xl">
            <span className="block text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">TKP</span>
            <span className="text-xs font-black text-emerald-950 dark:text-emerald-200">≥ {PASSING_GRADE_TKP}</span>
            <span className="block text-[8px] text-emerald-400">45 Soal</span>
          </div>
        </div>

        <p className="text-[10px] text-[#536471] dark:text-slate-400 text-center leading-tight">
          Total 110 Soal Resmi • Wajib lulus 3 pilar materi
        </p>
      </div>

      {/* 4. LEADERBOARD TOP SKOR MINGGU INI */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl p-4 border border-[#EFF3F4] dark:border-[#1E293B] shadow-sm transition-colors">
        <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-[#EFF3F4] dark:border-[#1E293B]">
          <Award className="w-4 h-4 text-amber-500" />
          <h4 className="font-extrabold text-xs text-[#0F1419] dark:text-white tracking-tight">
            Top Skor Tryout Minggu Ini
          </h4>
        </div>
        <div className="space-y-2">
          {topScorers.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black text-[10px] ${s.rank === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 dark:bg-slate-800 text-[#536471] dark:text-slate-400'
                  }`}>
                  {s.rank}
                </span>
                <div>
                  <span className="font-extrabold text-[#0F1419] dark:text-white block leading-tight">{s.name}</span>
                  <span className="text-[10px] text-[#536471] dark:text-slate-400">{s.target}</span>
                </div>
              </div>
              <span className="font-mono font-extrabold text-xs text-[#2563EB] dark:text-[#38BDF8]">
                {s.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
