import React, { useState } from 'react';
import { StudyTrack, UserProfile, ScheduledContest } from '@/types';
import { EXAM_PACKAGES } from '@/data/examPackages';
import { SCHEDULED_CONTESTS } from '@/data/contests';
import { ContestArenaTab } from './ContestArenaTab';
import {
  Swords,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

interface ArenaViewProps {
  activeTrack: StudyTrack;
  setActiveTrack?: (track: StudyTrack) => void;
  onStartExam: (packageId: string) => void;
  totalQuestionsAvailable: number;
  userProfile: UserProfile | null;
  onEnterContest?: (contest: ScheduledContest) => void;
  onRegisterToggleContest?: (contestId: string) => void;
}

type ArenaFocusTab = 'simulasi_akbar' | 'contests';

export const ArenaView: React.FC<ArenaViewProps> = ({
  activeTrack,
  onStartExam,
  totalQuestionsAvailable,
  userProfile,
  onEnterContest,
  onRegisterToggleContest,
}) => {
  const [arenaTab, setArenaTab] = useState<ArenaFocusTab>('simulasi_akbar');
  const packages = EXAM_PACKAGES[activeTrack] || EXAM_PACKAGES.cpns;
  const flagshipPackage = packages[0];
  const trackContests = SCHEDULED_CONTESTS.filter((c) => c.track === activeTrack);

  const handleContestEnter = (contest: ScheduledContest) => {
    if (onEnterContest) {
      onEnterContest(contest);
    } else {
      onStartExam(flagshipPackage.id);
    }
  };

  const handleRegisterToggle = (contestId: string) => {
    if (onRegisterToggleContest) {
      onRegisterToggleContest(contestId);
    }
  };

  const getTrackMeta = () => {
    switch (activeTrack) {
      case 'snbt':
        return {
          title: 'Arena UTBK SNBT 2026',
          badge: 'Standar BPPP Kemendikbud',
          passingSummary: 'Penilaian Sistem IRT (Item Response Theory)',
        };
      case 'kedinasan':
        return {
          title: 'Arena Kedinasan 2026',
          badge: 'Standar SPMB PKN STAN & STIS',
          passingSummary: 'Nilai Mati TBI & Ambang Batas SKD',
        };
      default:
        return {
          title: 'Arena CAT SKD CPNS 2026',
          badge: 'Standar BKN KepmenPAN-RB',
          passingSummary: 'Passing Grade: TWK 65 • TIU 80 • TKP 166',
        };
    }
  };

  const trackMeta = getTrackMeta();

  return (
    <div className="space-y-6 max-w-4xl xl:max-w-5xl w-full mx-auto pb-12 select-none">
      {/* 1. CLEAN BORDERLESS PAGE HEADER */}
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-[-0.025em] leading-[1.2] text-slate-900 dark:text-white">
              {trackMeta.title}
            </h1>
            <p className="text-sm sm:text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Ikuti simulasi penuh standar resmi atau bersaing di kontes mingguan untuk menaikkan ELO rating.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums flex-shrink-0">
            {totalQuestionsAvailable} soal siap uji
          </span>
        </div>

        {/* 2-Way Focused Arena Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 dark:bg-[#111726] rounded-xl border border-slate-200/80 dark:border-slate-800 max-w-md">
          <button
            type="button"
            onClick={() => setArenaTab('simulasi_akbar')}
            className={`h-10 px-3 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              arenaTab === 'simulasi_akbar'
                ? 'bg-white dark:bg-[#182235] text-[#2563EB] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Simulasi Akbar</span>
          </button>

          <button
            type="button"
            onClick={() => setArenaTab('contests')}
            className={`h-10 px-3 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              arenaTab === 'contests'
                ? 'bg-white dark:bg-[#182235] text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
            <span className="truncate">Kontes ELO</span>
          </button>
        </div>
      </header>

      {/* 2. MODE 1: SIMULASI CAT AKBAR */}
      {arenaTab === 'simulasi_akbar' && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <section className="bg-white dark:bg-[#111726] rounded-2xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800/90 space-y-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400 px-2.5 py-0.5 rounded-lg">
                    {trackMeta.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Paket Resmi 01
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {flagshipPackage.title}
                </h2>
                <p className="text-sm sm:text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {flagshipPackage.description}
                </p>
              </div>

              <div className="text-left sm:text-right flex-shrink-0 bg-slate-50 dark:bg-[#0D1322] px-4 py-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
                <span className="text-2xl sm:text-3xl font-bold text-[#2563EB] dark:text-blue-400 leading-none block tabular-nums">
                  {Math.round(flagshipPackage.durationSeconds / 60)} Menit
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mt-1 tabular-nums">
                  {flagshipPackage.questionCount} Soal Resmi
                </span>
              </div>
            </div>

            {/* Sub-test Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {flagshipPackage.subTests.map((sub, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-[#0D1322] p-4 rounded-xl border border-slate-200/70 dark:border-slate-800"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white text-sm">{sub.name}</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">{sub.note}</span>
                </div>
              ))}
            </div>

            {/* Passing grade notice */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-2.5 text-sm text-blue-900 dark:text-blue-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400 flex-shrink-0" />
              <span>{trackMeta.passingSummary}</span>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={() => onStartExam(flagshipPackage.id)}
              className="w-full h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Mulai {flagshipPackage.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          {/* Standard CAT Guidelines */}
          <div className="bg-white dark:bg-[#111726] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/90 text-sm text-slate-600 dark:text-slate-300 space-y-2.5">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span>Standar Sistem CAT Criliant</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400 pl-1 leading-relaxed">
              <li><strong className="text-slate-700 dark:text-slate-200">Crash Recovery</strong>: Sesi tersimpan otomatis setiap detik jika tab tertutup.</li>
              <li><strong className="text-slate-700 dark:text-slate-200">Pintasan Keyboard CAT</strong>: Tekan 1–5 atau A–E untuk memilih opsi, R untuk ragu-ragu, dan panah kiri/kanan untuk navigasi.</li>
              <li><strong className="text-slate-700 dark:text-slate-200">Lencana Terverifikasi</strong>: Hasil skor ujian dapat dibagikan langsung ke feed publik.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. MODE 2: KONTES ELO BERJADWAL */}
      {arenaTab === 'contests' && (
        <div className="animate-in fade-in-50 duration-200">
          <ContestArenaTab
            contests={trackContests}
            userProfile={userProfile}
            onEnterContest={handleContestEnter}
            onRegisterToggle={handleRegisterToggle}
          />
        </div>
      )}
    </div>
  );
};
