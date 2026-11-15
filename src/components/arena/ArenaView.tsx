import React, { useState } from 'react';
import { StudyTrack, UserProfile, ScheduledContest } from '@/types';
import { EXAM_PACKAGES, SPECIAL_EXAM_PACKAGES, ExamPackage } from '@/data/examPackages';
import { SCHEDULED_CONTESTS } from '@/data/contests';
import { ContestArenaTab } from './ContestArenaTab';
import {
  Swords,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  BookOpen,
  Trophy,
  Layers,
  Zap,
  Target,
  Sparkles,
  HelpCircle,
  Timer,
  Check,
} from 'lucide-react';

interface ArenaViewProps {
  activeTrack: StudyTrack;
  setActiveTrack: (track: StudyTrack) => void;
  onStartExam: (packageId: string) => void;
  totalQuestionsAvailable: number;
  userProfile: UserProfile | null;
  onEnterContest?: (contest: ScheduledContest) => void;
  onRegisterToggleContest?: (contestId: string) => void;
}

type ArenaSubTab = 'simulasi_akbar' | 'daily' | 'contests' | 'drilling';

export const ArenaView: React.FC<ArenaViewProps> = ({
  activeTrack,
  setActiveTrack,
  onStartExam,
  totalQuestionsAvailable,
  userProfile,
  onEnterContest,
  onRegisterToggleContest,
}) => {
  const [arenaSubTab, setArenaSubTab] = useState<ArenaSubTab>('simulasi_akbar');
  const packages = EXAM_PACKAGES[activeTrack] || EXAM_PACKAGES.cpns;
  const flagshipPackage = packages[0];
  const drillPackages = packages.slice(1);
  const trackContests = SCHEDULED_CONTESTS.filter((c) => c.track === activeTrack);

  // Get flash bites for current track
  const flashBites: ExamPackage[] = React.useMemo(() => {
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
          accent: 'blue',
        };
      case 'kedinasan':
        return {
          title: 'Arena Kedinasan 2026',
          badge: 'Standar SPMB PKN STAN & STIS',
          passingSummary: 'Nilai Mati TBI & Ambang Batas SKD',
          accent: 'blue',
        };
      default:
        return {
          title: 'Arena CAT SKD CPNS 2026',
          badge: 'Standar BKN KepmenPAN-RB',
          passingSummary: 'Passing Grade: TWK 65 • TIU 80 • TKP 166',
          accent: 'blue',
        };
    }
  };

  const trackMeta = getTrackMeta();

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12 select-none">
      {/* 1. ARENA HERO BANNER & ROOM SELECTOR */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            Arena Kompetisi &amp; Uji Mandiri
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            {totalQuestionsAvailable} Soal Siap Uji
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {trackMeta.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          Pusat simulasi resmi, tantangan harian streak, kontes berjadwal ELO, dan drilling sub-tes terfokus.
        </p>

        {/* Track / Kamar Switcher */}
        <div className="grid grid-cols-3 gap-1.5 mt-3.5 p-1 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/70 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTrack('cpns')}
            className={`py-1.5 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
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
            className={`py-1.5 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
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
            className={`py-1.5 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTrack === 'kedinasan'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🛡️</span>
            <span>Kedinasan</span>
          </button>
        </div>

        {/* 4-Way Clean Sub-Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-3 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <button
            onClick={() => setArenaSubTab('simulasi_akbar')}
            className={`py-2 px-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              arenaSubTab === 'simulasi_akbar'
                ? 'bg-white dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Simulasi Akbar</span>
          </button>

          <button
            onClick={() => setArenaSubTab('daily')}
            className={`py-2 px-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              arenaSubTab === 'daily'
                ? 'bg-white dark:bg-[#162137] text-amber-500 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">Daily Challenge</span>
          </button>

          <button
            onClick={() => setArenaSubTab('contests')}
            className={`py-2 px-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              arenaSubTab === 'contests'
                ? 'bg-white dark:bg-[#162137] text-rose-500 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="truncate">Kontes ELO</span>
            <span className="text-[8px] font-black uppercase px-1 py-0.2 bg-rose-500 text-white rounded-full">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setArenaSubTab('drilling')}
            className={`py-2 px-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              arenaSubTab === 'drilling'
                ? 'bg-white dark:bg-[#162137] text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Drill Sub-Tes</span>
          </button>
        </div>
      </div>

      {/* 2. SUBTAB 1: SIMULASI CAT AKBAR (Format Resmi Penuh) */}
      {arenaSubTab === 'simulasi_akbar' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {/* Flagship Package Card */}
          <div className="bg-white dark:bg-[#111726] rounded-3xl p-5 sm:p-6 border-2 border-blue-600/30 dark:border-blue-500/40 shadow-xs relative overflow-hidden space-y-4 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40">
                    {trackMeta.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Paket Akbar 01</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {flagshipPackage.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {flagshipPackage.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
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

            {/* Passing grade notice */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>{trackMeta.passingSummary}</span>
            </div>

            {/* Start Button */}
            <button
              onClick={() => onStartExam(flagshipPackage.id)}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Swords className="w-4 h-4" />
              <span>Mulai {flagshipPackage.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tips Ujian Resmi */}
          <div className="bg-slate-50 dark:bg-[#0D1322] rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Fitur Standar Resmi CAT Criliant:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 pl-1">
              <li>Penyimpanan otomatis (Crash Recovery) jika koneksi terputus.</li>
              <li>Pintasan keyboard CAT BKN: Tombol 1-5 atau A-E, R (Ragu-ragu), Panah Kiri/Kanan.</li>
              <li>Evaluasi hasil instan dengan lencana terverifikasi untuk dipamerkan ke feed.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. SUBTAB 2: TANTANGAN HARIAN (Daily Challenge & Flash Bites) */}
      {arenaSubTab === 'daily' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {/* Main Daily Sprint Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-orange-500/15 relative overflow-hidden space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-black/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                  <span>Streak Booster Harian</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Tantangan Harian {activeTrack.toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 mt-1 leading-relaxed">
                  10 butir soal pilihan kurasi hari ini. Selesaikan dalam 10 menit untuk mempertahankan streak belajarmu!
                </p>
              </div>
              <div className="text-right flex-shrink-0 bg-white/15 px-3 py-2 rounded-2xl backdrop-blur-xs">
                <span className="text-xl sm:text-2xl font-black block">10</span>
                <span className="text-[10px] text-white/80 font-bold block leading-none">Menit</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-white/85 flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Reset otomatis tiap pukul 00:00 WIB</span>
              </span>
              <span className="font-bold bg-white/20 px-2.5 py-0.5 rounded-lg">
                🔥 Streak Aktif: {userProfile?.streakDays ?? 0} Hari
              </span>
            </div>

            <button
              onClick={() => onStartExam('DAILY')}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-orange-700 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Zap className="w-4 h-4 fill-orange-600 text-orange-600" />
              <span>Ambil Tantangan Harian (10 Soal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Flash Bites Pemanasan Kilat (3-5 Menit) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between px-1">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Flash Bites Pemanasan (3–5 Menit)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Latihan kilat 5 soal saat waktu luang untuk menjaga ketajaman ingatan materi.
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200/50 flex-shrink-0">
                Pemanasan Kilat
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {flashBites.map((bite) => (
                <div
                  key={bite.id}
                  className="bg-white dark:bg-[#111726] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between space-y-2.5"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-base">{bite.iconEmoji}</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {bite.badge}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                      {bite.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {bite.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onStartExam(bite.id)}
                    className="w-full py-2 px-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold text-[11px] rounded-xl border border-amber-200/60 dark:border-amber-900/50 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Mulai ({bite.questionCount} Soal)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBTAB 3: KONTES ELO BERJADWAL */}
      {arenaSubTab === 'contests' && (
        <div className="animate-in fade-in-50 duration-200">
          <ContestArenaTab
            contests={trackContests}
            userProfile={userProfile}
            onEnterContest={handleContestEnter}
            onRegisterToggle={handleRegisterToggle}
          />
        </div>
      )}

      {/* 5. SUBTAB 4: DRILLING SUB-TES (Latihan 1 Kategori) */}
      {arenaSubTab === 'drilling' && (
        <div className="space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between px-1">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Latihan Terfokus Sub-Tes ({activeTrack.toUpperCase()})
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Kuasai materi satu per satu secara mendalam tanpa distraksi dari materi lain.
              </p>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200/50 flex-shrink-0">
              Fokus 1 Materi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {drillPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white dark:bg-[#111726] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between space-y-3"
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
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Mulai Drilling ({pkg.questionCount} Soal)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
