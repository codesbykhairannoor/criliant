'use client';

import React from 'react';
import { StudyTrack } from '@/types';
import { EXAM_PACKAGES, ExamPackage } from '@/data/examPackages';
import {
  Swords,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

interface ArenaViewProps {
  activeTrack: StudyTrack;
  setActiveTrack: (track: StudyTrack) => void;
  onStartExam: (packageId: string) => void;
  totalQuestionsAvailable: number;
}

export const ArenaView: React.FC<ArenaViewProps> = ({
  activeTrack,
  setActiveTrack,
  onStartExam,
  totalQuestionsAvailable,
}) => {
  const packages = EXAM_PACKAGES[activeTrack] || EXAM_PACKAGES.cpns;
  const flagshipPackage = packages[0];
  const drillPackages = packages.slice(1);

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-12 select-none">
      {/* 1. ARENA HERO BANNER */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            Arena Simulasi Resmi
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            {totalQuestionsAvailable} Soal Siap Uji
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Simulasi Ujian {activeTrack.toUpperCase()}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          Pengerjaan dengan timer presisi, navigasi kisi soal, dan sistem penilaian resmi standar nasional.
        </p>

        {/* Segmented Room Selector */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <button
            onClick={() => setActiveTrack('cpns')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTrack === 'cpns'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span>SKD CPNS</span>
          </button>
          <button
            onClick={() => setActiveTrack('snbt')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTrack === 'snbt'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🎓</span>
            <span>SNBT UTBK</span>
          </button>
          <button
            onClick={() => setActiveTrack('kedinasan')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTrack === 'kedinasan'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🛡️</span>
            <span>Kedinasan</span>
          </button>
        </div>
      </div>

      {/* 2. FLAGSHIP PACKAGE CARD (Simulasi Utama Sesuai Jalur) */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-6 border-2 border-blue-600/30 dark:border-blue-500/40 shadow-sm relative overflow-hidden space-y-4 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40">
                Format Resmi 2026
              </span>
              <span className="text-xs font-bold text-slate-400">Paket Akbar 01</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {flagshipPackage.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {flagshipPackage.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {Math.round(flagshipPackage.durationSeconds / 60)}
            </span>
            <span className="text-[10px] text-slate-400 block font-bold leading-none">Menit</span>
          </div>
        </div>

        {/* Sub-test Breakdown Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
          {flagshipPackage.subTests.map((sub, i) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-[#0D1322] p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-800"
            >
              <span className="block font-black text-slate-900 dark:text-white text-xs">{sub.name}</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">{sub.note}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onStartExam(flagshipPackage.id)}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Swords className="w-4 h-4" />
          <span>Mulai {flagshipPackage.title}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. DRILLING SPESIFIK MATERI (Bukan Easy/Hard Generic) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Paket Drilling Khusus {activeTrack.toUpperCase()}
          </h4>
          <span className="text-[11px] font-semibold text-slate-500">Materi Terfokus</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {drillPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-[#111726] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-base">{pkg.iconEmoji}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {pkg.badge}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {pkg.title}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <button
                onClick={() => onStartExam(pkg.id)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5"
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
