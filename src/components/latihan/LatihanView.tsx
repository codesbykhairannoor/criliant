'use client';

import React, { useState, useMemo } from 'react';
import { StudyTrack, UserProfile, Question, Category } from '@/types';
import { TRACK_CATEGORIES, EXAM_PACKAGES, SPECIAL_EXAM_PACKAGES, ExamPackage } from '@/data/examPackages';
import { CustomWorkoutConfig } from '@/hooks/useExamController';
import {
  Flame,
  Zap,
  Target,
  ArrowRight,
  Clock,
  Sparkles,
  Sliders,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  Layers,
  Timer,
  Play,
  HelpCircle,
} from 'lucide-react';

interface LatihanViewProps {
  activeTrack: StudyTrack;
  allQuestions: Question[];
  onStartExam: (packageId: string) => void;
  onStartCustomWorkout: (config: CustomWorkoutConfig) => void;
  userProfile: UserProfile | null;
  onRequireAuth?: () => void;
}

export const LatihanView: React.FC<LatihanViewProps> = ({
  activeTrack,
  allQuestions,
  onStartExam,
  onStartCustomWorkout,
  userProfile,
  onRequireAuth,
}) => {
  // Configurator state
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [isTimed, setIsTimed] = useState<boolean>(true);

  const trackCategories = TRACK_CATEGORIES[activeTrack] || TRACK_CATEGORIES.cpns;
  const packages = EXAM_PACKAGES[activeTrack] || EXAM_PACKAGES.cpns;
  const drillPackages = packages.slice(1);

  // Category label and meta mapping
  const categoryMeta: Record<string, { label: string; icon: string; desc: string }> = {
    TWK: { label: 'TWK (Wawasan Kebangsaan)', icon: '🏛️', desc: 'Pilar Negara, UUD 1945, Integritas' },
    TIU: { label: 'TIU (Intelegensia Umum)', icon: '⚡', desc: 'Silogisme, Deret Angka, Analogi' },
    TKP: { label: 'TKP (Karakteristik Pribadi)', icon: '🛡️', desc: 'Pelayanan Publik, Anti-Radikalisme' },
    TPS_PENALARAN_UMUM: { label: 'Penalaran Umum (TPS)', icon: '🧠', desc: 'Logika Deduktif & Induktif' },
    TPS_KUANTITATIF: { label: 'Pengetahuan Kuantitatif', icon: '📊', desc: 'Aritmetika, Aljabar & Geometri' },
    LITERASI_INDONESIA: { label: 'Literasi Bahasa', icon: '📖', desc: 'Wacana Teks & Pemahaman Kritis' },
    PENALARAN_MATEMATIKA: { label: 'Penalaran Matematika', icon: '📐', desc: 'HOTS Kontekstual UTBK' },
    TPA: { label: 'TPA (Potensi Akademik)', icon: '🔢', desc: 'Matriks Angka & Ketelitian' },
    BAHASA_INGGRIS: { label: 'Bahasa Inggris (SPMB)', icon: '🌐', desc: 'Grammar, Inversion & Reading' },
    MTK_KEDINASAN: { label: 'Matematika Diskrit STIS', icon: '📐', desc: 'Kombinatorika & Peluang' },
    PSIKOTES: { label: 'Psikotes Spasial & Gambar', icon: '🧩', desc: 'Visual 3D & Pola Spasial' },
  };

  const trackLabels = {
    cpns: 'SKD CPNS (BKN)',
    snbt: 'SNBT UTBK (BPPP)',
    kedinasan: 'Sekolah Kedinasan (SPMB)',
  };

  // Flash bites per track
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

  // Live count of matching questions in pool
  const matchingQuestionsCount = useMemo(() => {
    let pool = allQuestions.filter((q) => trackCategories.includes(q.category));
    if (selectedCategory !== 'ALL') {
      pool = pool.filter((q) => q.category === selectedCategory);
    }
    if (selectedDifficulty !== 'ALL') {
      pool = pool.filter((q) => q.difficulty === selectedDifficulty);
    }
    return pool.length;
  }, [allQuestions, trackCategories, selectedCategory, selectedDifficulty]);

  const handleLaunchCustomWorkout = () => {
    const categoriesToDrill =
      selectedCategory === 'ALL' ? trackCategories : [selectedCategory as Category];

    const diffTitle =
      selectedDifficulty === 'ALL'
        ? 'Campuran'
        : selectedDifficulty === 'easy'
        ? 'Mudah'
        : selectedDifficulty === 'medium'
        ? 'Sedang'
        : selectedDifficulty === 'hard'
        ? 'Sulit'
        : 'HOTS';

    const catTitle =
      selectedCategory === 'ALL'
        ? `Materi ${trackLabels[activeTrack]}`
        : categoryMeta[selectedCategory]?.label || selectedCategory;

    onStartCustomWorkout({
      categories: categoriesToDrill,
      difficulty: selectedDifficulty,
      count: selectedCount,
      isTimed,
      title: `Latihan Mandiri: ${catTitle} (${diffTitle} • ${selectedCount} Soal)`,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl xl:max-w-5xl w-full mx-auto pb-12 select-none">
      {/* 1. CLEAN BORDERLESS PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-[-0.025em] leading-[1.2] text-slate-900 dark:text-white">
            Latihan &amp; Studio Kustom
          </h1>
          <p className="text-sm sm:text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Atur sesi latihan {trackLabels[activeTrack]} sesuai targetmu hari ini: pilih sub-materi, tingkat kesulitan, dan durasi.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 px-3.5 h-10 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 tabular-nums self-start sm:self-auto flex-shrink-0">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Streak: {userProfile?.streakDays ?? 0} Hari</span>
        </div>
      </header>

      {/* 2. STUDIO LATIHAN MANDIRI (CUSTOM WORKOUT CONFIGURATOR) */}
      <section className="bg-white dark:bg-[#111726] rounded-2xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800/90 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-[-0.02em]">
              <SlidersHorizontal className="w-5 h-5 text-[#2563EB] dark:text-blue-400" strokeWidth={1.85} />
              <span>Studio Latihan Kustom</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Materi tersaring otomatis untuk Kamar {trackLabels[activeTrack]}.
            </p>
          </div>

          <div className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 px-3 py-1.5 rounded-lg tabular-nums self-start sm:self-auto">
            {matchingQuestionsCount} soal tersedia
          </div>
        </div>

        {/* STEP 1: PILIH SUB-MATERI */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
            1. Sub-Materi
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`p-3.5 rounded-xl text-left border transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-50/80 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="font-semibold text-sm block leading-snug">Semua Materi</span>
              <span className={`text-xs block mt-1 truncate ${selectedCategory === 'ALL' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                Campuran kurikulum
              </span>
            </button>

            {trackCategories.map((cat) => {
              const info = categoryMeta[cat] || { label: cat, icon: '📝', desc: 'Materi Ujian' };
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3.5 rounded-xl text-left border transition-colors ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-slate-50/80 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-semibold text-sm block leading-snug truncate">{info.label}</span>
                  <span className={`text-xs block mt-1 truncate ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {info.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: PILIH TINGKAT KESULITAN */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
            2. Tingkat Kesulitan
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'ALL', label: 'Campuran', desc: 'Semua level' },
              { id: 'easy', label: 'Mudah', desc: 'Konsep dasar' },
              { id: 'medium', label: 'Sedang', desc: 'Standar resmi' },
              { id: 'hard', label: 'Sulit', desc: 'Pengecoh tinggi' },
              { id: 'hard_hots', label: 'HOTS', desc: 'Penalaran lanjut' },
            ].map((diff) => {
              const isSelected = selectedDifficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-3 rounded-xl text-left border transition-colors ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                      : 'bg-slate-50/80 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-semibold text-sm block">{diff.label}</span>
                  <span className={`text-xs block mt-0.5 ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                    {diff.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3 & 4: JUMLAH SOAL & MODE TIMER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Jumlah Soal */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              3. Jumlah Soal
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setSelectedCount(cnt)}
                  className={`h-10 px-2 text-sm font-semibold rounded-xl border transition-colors tabular-nums ${
                    selectedCount === cnt
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-slate-50/80 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cnt} soal
                </button>
              ))}
            </div>
          </div>

          {/* Mode Waktu */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              4. Mode Waktu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsTimed(true)}
                className={`h-10 px-3 rounded-xl border transition-colors flex items-center justify-center gap-2 text-sm ${
                  isTimed
                    ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 text-[#2563EB] dark:text-blue-400 font-semibold'
                    : 'bg-slate-50/80 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="tabular-nums">Berwaktu ({selectedCount} mnt)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTimed(false)}
                className={`h-10 px-3 rounded-xl border transition-colors flex items-center justify-center gap-2 text-sm ${
                  !isTimed
                    ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 text-[#2563EB] dark:text-blue-400 font-semibold'
                    : 'bg-slate-50/80 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Mode Santai</span>
              </button>
            </div>
          </div>
        </div>

        {/* LAUNCH BUTTON */}
        <button
          type="button"
          onClick={handleLaunchCustomWorkout}
          className="w-full h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Mulai Latihan Mandiri ({selectedCount} Soal)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 3. DAILY CHALLENGE SPRINT */}
      <section className="bg-slate-900 dark:bg-[#111726] text-white rounded-2xl p-5 sm:p-7 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 text-xs font-semibold px-3 py-1 rounded-lg border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              <span>Daily Challenge · Reset 00:00 WIB</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Tantangan Harian {trackLabels[activeTrack]}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              10 soal kurasi acak harian untuk mempertahankan streak belajar dan mengasah kecepatan analisis tanpa penalti waktu.
            </p>
          </div>

          <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 flex-shrink-0 text-left sm:text-right">
            <span className="text-2xl sm:text-3xl font-bold block leading-none tabular-nums">10 Soal</span>
            <span className="text-xs text-slate-300 font-medium block mt-1 tabular-nums">10 Menit · +1 Streak</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Format santai untuk retensi materi maksimal setiap hari.</span>
          </div>

          <button
            type="button"
            onClick={() => onStartExam('DAILY')}
            className="w-full sm:w-auto h-11 px-5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Mulai Tantangan Hari Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. FLASH BITES PEMANASAN KILAT */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-[-0.02em]">
              Flash Bites Pemanasan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              5 soal pemanasan cepat 3–5 menit sebelum sesi panjang.
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-900/50 flex-shrink-0 tabular-nums">
            5 soal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {flashBites.map((bite) => (
            <div
              key={bite.id}
              className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-xl">{bite.iconEmoji}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                    {bite.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white leading-snug">
                  {bite.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {bite.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onStartExam(bite.id)}
                className="w-full h-10 px-4 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Mulai Flash Bite</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRESET PAKET DRILLING SUB-TES */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-[-0.02em]">
              Paket Drilling Sub-Tes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Latihan terfokus 20–30 soal untuk penguasaan mendalam per sub-tes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {drillPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-2xl">{pkg.iconEmoji}</span>
                  <span className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 px-2.5 py-0.5 rounded-lg">
                    {pkg.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white leading-snug">
                  {pkg.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  {pkg.subTests.slice(0, 2).map((sub, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{sub.name}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">{sub.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartExam(pkg.id)}
                className="w-full h-10 px-4 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="tabular-nums">Mulai ({pkg.questionCount} Soal)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
