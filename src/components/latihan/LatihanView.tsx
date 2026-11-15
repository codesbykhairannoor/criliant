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
    <div className="space-y-6 max-w-4xl xl:max-w-5xl w-full mx-auto pb-12 select-none">
      {/* 1. HEADER BANNER */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/40 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Pusat Latihan Mandiri &amp; Habit
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Kamar: {trackLabels[activeTrack]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Streak Pejuang: {userProfile?.streakDays ?? 0} Hari</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Latihan Harian &amp; Studio Kustom
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
          Atur sesi latihan sesuai targetmu hari ini: pilih materi yang ingin dipoles, tentukan tingkat kesulitan (Easy, Medium, Hard, HOTS), dan mulai drill tanpa gangguan materi lain.
        </p>
      </div>

      {/* 2. STUDIO LATIHAN MANDIRI (CUSTOM WORKOUT CONFIGURATOR) */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-6 sm:p-8 border-2 border-blue-600/30 dark:border-blue-500/40 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Studio Latihan Kustom ({trackLabels[activeTrack]})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sesuaikan materi, kesulitan, dan timer sesuai gaya belajarmu hari ini.
            </p>
          </div>

          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200/50 flex items-center gap-1.5 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tersedia {matchingQuestionsCount} Soal Siap Uji</span>
          </div>
        </div>

        {/* STEP 1: PILIH SUB-MATERI */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            1. Pilih Sub-Materi yang Ingin Diasah:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-base block mb-1">🎯</span>
              <span className="font-black text-xs block leading-tight">Semua Materi</span>
              <span className={`text-[10px] block mt-0.5 truncate ${selectedCategory === 'ALL' ? 'text-white/80' : 'text-slate-400'}`}>
                Campuran kurikulum
              </span>
            </button>

            {trackCategories.map((cat) => {
              const info = categoryMeta[cat] || { label: cat, icon: '📝', desc: 'Materi Ujian' };
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base block mb-1">{info.icon}</span>
                  <span className="font-black text-xs block leading-tight truncate">{info.label}</span>
                  <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {info.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: PILIH TINGKAT KESULITAN */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            2. Pilih Tingkat Kesulitan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'ALL', label: 'Campuran', emoji: '🎲', desc: 'Semua Level' },
              { id: 'easy', label: 'Mudah', emoji: '🟢', desc: 'Konsep Dasar' },
              { id: 'medium', label: 'Sedang', emoji: '🟡', desc: 'Standar Resmi' },
              { id: 'hard', label: 'Sulit', emoji: '🔴', desc: 'Pengecoh Tinggi' },
              { id: 'hard_hots', label: 'HOTS', emoji: '🔥', desc: 'Penalaran Lanjut' },
            ].map((diff) => {
              const isSelected = selectedDifficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-2.5 rounded-2xl text-center border transition-all ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm block">{diff.emoji}</span>
                  <span className="font-black text-xs block mt-0.5">{diff.label}</span>
                  <span className={`text-[9px] block ${isSelected ? 'text-white/70 dark:text-slate-600' : 'text-slate-400'}`}>
                    {diff.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3 & 4: JUMLAH SOAL & MODE TIMER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Jumlah Soal */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              3. Jumlah Soal:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 15, 20].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setSelectedCount(cnt)}
                  className={`py-2 px-1 text-xs font-extrabold rounded-xl border transition-all text-center ${
                    selectedCount === cnt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cnt} Butir</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Waktu */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              4. Mode Waktu Pengerjaan:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsTimed(true)}
                className={`p-2 rounded-xl text-center border transition-all flex items-center justify-center gap-1.5 ${
                  isTimed
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-500 font-medium'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">Berwaktu ({selectedCount} Mnt)</span>
              </button>

              <button
                onClick={() => setIsTimed(false)}
                className={`p-2 rounded-xl text-center border transition-all flex items-center justify-center gap-1.5 ${
                  !isTimed
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-[#0D1322] border-slate-200/80 dark:border-slate-800 text-slate-500 font-medium'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs">Mode Santai</span>
              </button>
            </div>
          </div>
        </div>

        {/* LAUNCH BUTTON */}
        <button
          onClick={handleLaunchCustomWorkout}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Mulai Latihan Mandiri ({selectedCount} Soal)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. DAILY CHALLENGE HERO SPRINT (10 SOAL) */}
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
              10 butir soal kurasi acak harian sesuai standar ujian 2026. Selesaikan dalam 10 menit untuk mempertahankan rantai streak dan menajamkan intuisi pengerjaan.
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
            <span>Ambil Tantangan Hari Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. FLASH BITES PEMANASAN KILAT (3-5 MENIT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Flash Bites Pemanasan Kilat (3–5 Menit)</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5 butir soal pemanasan instan saat jeda istirahat atau sebelum mulai sesi panjang.
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

      {/* 5. PRESET PAKET DRILLING SUB-TES (20-30 SOAL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Paket Drilling Sub-Tes Siap Pakai ({trackLabels[activeTrack]})</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Paket latihan terfokus 20–30 butir soal untuk penguasaan mendalam 1 topik.
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
