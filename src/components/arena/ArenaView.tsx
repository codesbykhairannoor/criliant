'use client';

import React, { useState } from 'react';
import { StudyTrack } from '@/types';
import { EXAM_MODES, PASSING_GRADE_TWK, PASSING_GRADE_TIU, PASSING_GRADE_TKP } from '@/data/constants';
import {
  Swords,
  Timer,
  ShieldCheck,
  Award,
  ArrowRight,
  Flame,
  Skull,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ArenaViewProps {
  activeTrack: StudyTrack;
  setActiveTrack: (track: StudyTrack) => void;
  onStartExam: (modeId: string) => void;
  totalQuestionsAvailable: number;
}

export const ArenaView: React.FC<ArenaViewProps> = ({
  activeTrack,
  setActiveTrack,
  onStartExam,
  totalQuestionsAvailable,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<StudyTrack>(activeTrack);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0B0F19] text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-[#38BDF8] px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1.5">
              <Swords className="w-3 h-3 text-[#38BDF8]" />
              Arena Simulasi Resmi
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {totalQuestionsAvailable} Bank Soal Siap Diuji
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Uji Kesiapan Tempur Aslimu
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Simulasi presisi dengan sistem penilaian bobot KepmenPAN-RB, matriks navigasi Sudoku, dan ambang batas Passing Grade BKN nasional.
          </p>
        </div>

        {/* Track Filter Segmented Control */}
        <div className="grid grid-cols-3 gap-1.5 mt-5 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setSelectedTrack('cpns')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 ${selectedTrack === 'cpns'
                ? 'bg-white text-[#0F1419] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
          >
            <span>🏛️</span>
            <span>SKD CPNS</span>
          </button>
          <button
            onClick={() => setSelectedTrack('snbt')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 ${selectedTrack === 'snbt'
                ? 'bg-white text-[#0F1419] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
          >
            <span>🎓</span>
            <span>SNBT UTBK</span>
          </button>
          <button
            onClick={() => setSelectedTrack('kedinasan')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 ${selectedTrack === 'kedinasan'
                ? 'bg-white text-[#0F1419] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
          >
            <span>🛡️</span>
            <span>Kedinasan</span>
          </button>
        </div>
      </div>

      {/* Flagship Paket: 110 Soal CAT BKN Resmi */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl p-5 sm:p-6 border-2 border-[#2563EB]/40 dark:border-blue-500/40 shadow-md relative overflow-hidden space-y-4 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40">
                Standar BKN 2026
              </span>
              <span className="text-xs font-bold text-slate-400">Paket Resmi 01</span>
            </div>
            <h3 className="text-lg font-black text-[#0F1419] dark:text-white tracking-tight">
              Simulasi Penuh CAT BKN (110 Soal)
            </h3>
            <p className="text-xs text-[#536471] dark:text-slate-400 mt-0.5">
              Format lengkap: 30 TWK, 35 TIU, dan 45 TKP dengan durasi 100 menit tanpa jeda.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xl font-black text-[#2563EB] dark:text-[#38BDF8]">100</span>
            <span className="text-xs text-[#536471] dark:text-slate-400 block font-bold leading-none">Menit</span>
          </div>
        </div>

        {/* Sub-Test Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#F8FAFC] dark:bg-[#0F172A] p-2.5 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B]">
            <span className="block font-black text-red-600 dark:text-red-400">30 TWK</span>
            <span className="text-[11px] font-bold text-[#536471] dark:text-slate-400">Min. {PASSING_GRADE_TWK} Poin</span>
          </div>
          <div className="bg-[#F8FAFC] dark:bg-[#0F172A] p-2.5 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B]">
            <span className="block font-black text-sky-600 dark:text-sky-400">35 TIU</span>
            <span className="text-[11px] font-bold text-[#536471] dark:text-slate-400">Min. {PASSING_GRADE_TIU} Poin</span>
          </div>
          <div className="bg-[#F8FAFC] dark:bg-[#0F172A] p-2.5 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B]">
            <span className="block font-black text-emerald-600 dark:text-emerald-400">45 TKP</span>
            <span className="text-[11px] font-bold text-[#536471] dark:text-slate-400">Min. {PASSING_GRADE_TKP} Poin</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStartExam('TRYOUT_FULL')}
          className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Swords className="w-4 h-4" />
          <span>Mulai Simulasi 110 Soal Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Ujian Alternatif (Grid 2 Kolom) */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#536471] dark:text-slate-400">
          Pilihan Mode Latihan Lainnya
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Daily Challenge */}
          <div className="bg-white dark:bg-[#0B0F19] p-4 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Harian
                </span>
                <span className="text-[10px] text-[#536471] dark:text-slate-400 font-bold">10 Menit</span>
              </div>
              <h5 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Teka-Teki Harian</h5>
              <p className="text-xs text-[#536471] dark:text-slate-400 mt-0.5">
                10 soal acak kurasi hari ini untuk asah insting dan pertahankan streak.
              </p>
            </div>
            <button
              onClick={() => onStartExam('DAILY')}
              className="w-full py-2 px-3 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Mainkan 10 Soal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Survival 3 Nyawa */}
          <div className="bg-white dark:bg-[#0B0F19] p-4 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <Skull className="w-3.5 h-3.5" />
                  Hardcore
                </span>
                <span className="text-[10px] text-[#536471] dark:text-slate-400 font-bold">3 Nyawa ❤️❤️❤️</span>
              </div>
              <h5 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Survival 3 Nyawa</h5>
              <p className="text-xs text-[#536471] dark:text-slate-400 mt-0.5">
                Uji ketelitian ekstrem: 50 soal, salah 3 kali langsung gugur di tempat!
              </p>
            </div>
            <button
              onClick={() => onStartExam('SURVIVAL')}
              className="w-full py-2 px-3 bg-[#0F1419] dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-[#0F1419] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Tantang Survival</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Expert HOTS */}
          <div className="bg-white dark:bg-[#0B0F19] p-4 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#2563EB] dark:text-[#38BDF8] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Level 4
                </span>
                <span className="text-[10px] text-[#536471] dark:text-slate-400 font-bold">20 Menit</span>
              </div>
              <h5 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Expert HOTS</h5>
              <p className="text-xs text-[#536471] dark:text-slate-400 mt-0.5">
                Penalaran silogisme bertingkat & soal analisis data kompleks.
              </p>
            </div>
            <button
              onClick={() => onStartExam('HARD_HOTS')}
              className="w-full py-2 px-3 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Mulai HOTS (20 Soal)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4. Pemanasan Santai */}
          <div className="bg-white dark:bg-[#0B0F19] p-4 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Santai
                </span>
                <span className="text-[10px] text-[#536471] dark:text-slate-400 font-bold">20 Menit</span>
              </div>
              <h5 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Pemanasan (Easy)</h5>
              <p className="text-xs text-[#536471] dark:text-slate-400 mt-0.5">
                15 soal fondasi materi tanpa tekanan tinggi untuk pemula.
              </p>
            </div>
            <button
              onClick={() => onStartExam('EASY')}
              className="w-full py-2 px-3 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Mulai Pemanasan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Aturan Resmi KepmenPAN-RB Info Card */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-4 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B] text-xs space-y-2 text-[#536471] dark:text-slate-400 transition-colors">
        <div className="flex items-center gap-2 text-[#0F1419] dark:text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Aturan Penilaian Resmi BKN / MenPAN-RB:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
          <li><strong>TWK & TIU:</strong> Benar mendapat 5 poin, salah atau tidak menjawab mendapat 0 poin.</li>
          <li><strong>TKP:</strong> Seluruh opsi bernilai 1 s/d 5 (tidak ada nilai 0). Nilai optimal adalah 5.</li>
          <li><strong>Passing Grade Kumulatif:</strong> TWK ≥ {PASSING_GRADE_TWK}, TIU ≥ {PASSING_GRADE_TIU}, TKP ≥ {PASSING_GRADE_TKP}. Wajib memenuhi ketiga ambang batas untuk dinyatakan <strong>LULUS</strong>.</li>
        </ul>
      </div>
    </div>
  );
};
