'use client';

import React, { useMemo } from 'react';
import { StudyTrack, UserProfile } from '@/types';
import { EXAM_PACKAGES, SPECIAL_EXAM_PACKAGES, ExamPackage } from '@/data/examPackages';
import {
  Flame,
  Zap,
  Target,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface LatihanViewProps {
  activeTrack: StudyTrack;
  onStartExam: (packageId: string) => void;
  userProfile: UserProfile | null;
  onRequireAuth?: () => void;
}

export const LatihanView: React.FC<LatihanViewProps> = ({
  activeTrack,
  onStartExam,
  userProfile,
  onRequireAuth,
}) => {
  const packages = EXAM_PACKAGES[activeTrack] || EXAM_PACKAGES.cpns;
  const drillPackages = packages.slice(1);

  // Flash bites sesuai jalur aktif
  const flashBites: ExamPackage[] = useMemo(() => {
    if (activeTrack === 'cpns') {
      return [
        SPECIAL_EXAM_PACKAGES.DAILY_TWK,
        SPECIAL_EXAM_PACKAGES.DAILY_TIU,
        SPECIAL_EXAM_PACKAGES.DAILY_TKP,
      ].filter(Boolean);
    }
    if (activeTrack === 'snbt') {
      return [
        SPECIAL_EXAM_PACKAGES.DAILY_SNBT_PU,
        SPECIAL_EXAM_PACKAGES.DAILY_SNBT_PM,
        SPECIAL_EXAM_PACKAGES.DAILY_SNBT_LIT,
      ].filter(Boolean);
    }
    if (activeTrack === 'kedinasan') {
      return [
        SPECIAL_EXAM_PACKAGES.DAILY_KED_TBI,
        SPECIAL_EXAM_PACKAGES.DAILY_KED_TPA,
        SPECIAL_EXAM_PACKAGES.DAILY_KED_MTK,
      ].filter(Boolean);
    }
    return [];
  }, [activeTrack]);

  const trackLabels = {
    cpns: 'SKD CPNS',
    snbt: 'SNBT UTBK',
    kedinasan: 'Sekolah Kedinasan',
  };

  return (
    <div className="space-y-6 max-w-4xl xl:max-w-5xl w-full mx-auto pb-12 select-none">
      {/* 1. HERO BANNER: LATIHAN & TANTANGAN HARIAN */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/40 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Pusat Latihan &amp; Habit Belajar
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Jalur: {trackLabels[activeTrack]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Streak Pejuang: {userProfile?.streakDays ?? 0} Hari</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Latihan Mandiri &amp; Tantangan Harian
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
          Bangun konsistensi belajar setiap hari. Pilih Daily Challenge 10 soal untuk menjaga streak, pemanasan kilat 3 menit, atau drilling mendalam per satu sub-materi.
        </p>
      </div>

      {/* 2. SECTION 1: DAILY CHALLENGE HERO SPRINT (10 SOAL) */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-orange-500/15 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-black/25 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              <span>Tantangan Resmi Hari Ini • Reset Pukul 00:00 WIB</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Daily Challenge {trackLabels[activeTrack]}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              10 butir soal kurasi acak sesuai standar ujian 2026. Selesaikan dalam 10 menit untuk mempertahankan rantai streak dan menajamkan intuisi pengerjaan.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 bg-black/20 p-3 sm:px-5 sm:py-3.5 rounded-2xl backdrop-blur-xs flex-shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-3xl sm:text-4xl font-black block leading-none">10</span>
              <span className="text-[11px] text-white/80 font-bold block mt-0.5">Menit • 10 Soal</span>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white/20 rounded-md">
              +1 Streak Day
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/20">
          <div className="flex items-center gap-2 text-xs text-white/90">
            <Clock className="w-4 h-4 text-amber-200" />
            <span>Format santai tanpa penalti waktu untuk memaksimalkan retensi materi.</span>
          </div>

          <button
            onClick={() => onStartExam('DAILY')}
            className="w-full sm:w-auto py-3 px-6 bg-white hover:bg-slate-50 text-orange-700 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 flex-shrink-0"
          >
            <Zap className="w-4 h-4 fill-orange-600 text-orange-600" />
            <span>Mulai Tantangan Hari Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. SECTION 2: FLASH BITES (3-5 MENIT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Flash Bites Pemanasan Kilat (3–5 Menit)</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5 soal pemanasan cepat saat jeda istirahat atau sebelum memulai sesi belajar panjang.
            </p>
          </div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200/50 flex-shrink-0">
            5 Butir Soal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {flashBites.map((bite) => (
            <div
              key={bite.id}
              className="bg-white dark:bg-[#111726] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-xl">{bite.iconEmoji}</span>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {bite.badge}
                  </span>
                </div>
                <h5 className="font-black text-sm text-slate-900 dark:text-white leading-snug">
                  {bite.title}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {bite.description}
                </p>
              </div>

              <button
                onClick={() => onStartExam(bite.id)}
                className="w-full py-2.5 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-200/60 dark:border-amber-900/50 transition-colors flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>Mulai Flash Bite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION 3: DRILLING SUB-TES TERFOKUS (20-30 SOAL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Drilling Terfokus Sub-Tes ({trackLabels[activeTrack]})</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih satu materi spesifik untuk dikuasai mendalam tanpa terganggu materi lainnya.
            </p>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200/50 flex-shrink-0">
            Fokus 1 Sub-Materi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {drillPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-[#111726] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-2xl">{pkg.iconEmoji}</span>
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-200/40">
                    {pkg.badge}
                  </span>
                </div>
                <h5 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                  {pkg.title}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Sub-test points */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  {pkg.subTests.slice(0, 2).map((sub, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{sub.name}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartExam(pkg.id)}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>Mulai Drilling ({pkg.questionCount} Soal)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
