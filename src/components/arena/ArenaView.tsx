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
      {/* 1. ARENA HERO BANNER (Tanpa duplikat kamar selector) */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            Arena Kompetisi Berperingkat
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            {totalQuestionsAvailable} Soal Siap Uji
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {trackMeta.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
          Pusat uji kompetisi resmi. Ikuti Simulasi Penuh standar CAT BKN / UTBK atau bersaing di Weekly Contest berhadiah kenaikan ELO rating.
        </p>

        {/* 2-Way Focused Arena Switcher: Simulasi Akbar vs Kontes ELO */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1.5 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 max-w-md">
          <button
            onClick={() => setArenaTab('simulasi_akbar')}
            className={`py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              arenaTab === 'simulasi_akbar'
                ? 'bg-white dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Simulasi Akbar CAT</span>
          </button>

          <button
            onClick={() => setArenaTab('contests')}
            className={`py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              arenaTab === 'contests'
                ? 'bg-white dark:bg-[#162137] text-rose-500 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span className="truncate">Kontes ELO</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-rose-500 text-white rounded-full">
              LIVE
            </span>
          </button>
        </div>
      </div>

      {/* 2. MODE 1: SIMULASI CAT AKBAR (Format Resmi Penuh 110/145 Soal) */}
      {arenaTab === 'simulasi_akbar' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="bg-white dark:bg-[#111726] rounded-3xl p-6 sm:p-8 border-2 border-blue-600/30 dark:border-blue-500/40 shadow-xs relative overflow-hidden space-y-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40">
                    {trackMeta.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Paket Resmi 01</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {flagshipPackage.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
                  {flagshipPackage.description}
                </p>
              </div>

              <div className="text-left sm:text-right flex-shrink-0 bg-blue-50 dark:bg-blue-950/40 p-3 sm:px-4 sm:py-3 rounded-2xl border border-blue-200/50 dark:border-blue-900/40">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none block">
                  {Math.round(flagshipPackage.durationSeconds / 60)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mt-0.5">
                  Menit • {flagshipPackage.questionCount} Soal
                </span>
              </div>
            </div>

            {/* Sub-test Breakdown Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              {flagshipPackage.subTests.map((sub, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-[#0D1322] p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800"
                >
                  <span className="block font-black text-slate-900 dark:text-white text-sm">{sub.name}</span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">{sub.note}</span>
                </div>
              ))}
            </div>

            {/* Passing grade notice */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>{trackMeta.passingSummary}</span>
            </div>

            {/* Start Button */}
            <button
              onClick={() => onStartExam(flagshipPackage.id)}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Swords className="w-5 h-5" />
              <span>Mulai {flagshipPackage.title}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Standard CAT Guidelines */}
          <div className="bg-slate-50 dark:bg-[#0D1322] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Standar Sistem CAT Criliant:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400 pl-1">
              <li><strong>Crash Recovery</strong>: Sesi tersimpan otomatis setiap detik jika tab tertutup atau listrik padam.</li>
              <li><strong>Pintasan Keyboard CAT</strong>: Tekan 1–5 atau A–E untuk memilih opsi, R untuk ragu-ragu, dan panah kiri/kanan untuk navigasi.</li>
              <li><strong>Lencana Terverifikasi</strong>: Hasil skor ujian dapat dipamerkan langsung ke feed publik.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. MODE 2: KONTES ELO BERJADWAL ALA LEETCODE */}
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
