'use client';

import React, { useState } from 'react';
import { ScheduledContest, ContestParticipantStanding, UserProfile } from '@/types';
import { CONTEST_TIER_CONFIG, getTierFromRating } from '@/data/contests';
import { ContestStandingsModal } from './ContestStandingsModal';
import {
  Trophy,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  PlayCircle,
  History,
} from 'lucide-react';

interface ContestArenaTabProps {
  contests: ScheduledContest[];
  userProfile: UserProfile | null;
  onEnterContest: (contest: ScheduledContest) => void;
  onRegisterToggle: (contestId: string) => void;
}

export const ContestArenaTab: React.FC<ContestArenaTabProps> = ({
  contests,
  userProfile,
  onEnterContest,
  onRegisterToggle,
}) => {
  const [selectedContestForModal, setSelectedContestForModal] = useState<ScheduledContest | null>(null);
  const [standings, setStandings] = useState<ContestParticipantStanding[]>([]);
  const [isLoadingStandings, setIsLoadingStandings] = useState(false);

  const userRating = userProfile?.contestRating ?? 1500;
  const contestsAttended = userProfile?.contestsAttended ?? 0;
  const userTier = getTierFromRating(userRating);
  const tierConfig = CONTEST_TIER_CONFIG[userTier];
  const estimatedTopPct = Math.max(1, Math.min(99, Math.round(100 - ((userRating - 1000) / 1400) * 100)));

  const liveContests = contests.filter((c) => c.status === 'LIVE');
  const upcomingContests = contests.filter((c) => c.status === 'UPCOMING');
  const finishedContests = contests.filter((c) => c.status === 'FINISHED');

  const handleOpenStandings = async (contest: ScheduledContest) => {
    setSelectedContestForModal(contest);
    setIsLoadingStandings(true);
    try {
      const res = await fetch(`/api/contests?contestId=${contest.id}`);
      const json = await res.json();
      if (json.success && json.data.standings) {
        setStandings(json.data.standings);
      }
    } catch (e) {
      console.error('Failed to load standings:', e);
    } finally {
      setIsLoadingStandings(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. LEETCODE ELO RATING HERO CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-6 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Competitive Arena
              </span>
              <span className="text-xs text-slate-400 font-bold">Musim 2026/2027</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Peringkat Kompetitif</span>
              <span className="text-2xl">{tierConfig.icon}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
              Ikuti Weekly Grand Prix dan Night Clash untuk mendongkrak skor ELO Rating dan memperebutkan Tier Grandmaster Nasional.
            </p>
          </div>

          {/* User ELO Score Card */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/15 flex items-center justify-between sm:justify-start gap-4 flex-shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Contest Rating
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-amber-400">{userRating}</span>
                <span className="text-xs font-bold text-slate-300">ELO</span>
              </div>
              <span className={`inline-block text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md mt-1 border ${tierConfig.badgeBg}`}>
                {tierConfig.label}
              </span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Kontes Diikuti
              </span>
              <span className="text-xl font-black text-white">{contestsAttended}</span>
              <span className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center justify-end gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {contestsAttended > 0 ? `Top ${estimatedTopPct}%` : 'Belum tanding'}
              </span>
            </div>
          </div>
        </div>

        {/* Tier Roadmap Mini Bar */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-bold">
          <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300">
            🟤 Novice (&lt;1400)
          </div>
          <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
            🟢 Fighter (1400+)
          </div>
          <div className="p-1.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300">
            🔵 Expert (1600+)
          </div>
          <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300">
            🟣 Master (1850+)
          </div>
          <div className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 col-span-2 sm:col-span-1">
            👑 Grandmaster (2100+)
          </div>
        </div>
      </div>

      {/* 2. LIVE CONTESTS */}
      {liveContests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Live Contest Sekarang
            </h4>
          </div>

          {liveContests.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#111726] rounded-3xl p-4 sm:p-5 border-2 border-rose-500 shadow-lg shadow-rose-500/10 relative overflow-hidden space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-800 animate-pulse">
                      🔴 SEDANG BERLANGSUNG
                    </span>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {c.durationMinutes} Menit Presisi
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0D1322] px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 self-start">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {c.registeredCount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-bold">Peserta Terdaftar</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={() => onEnterContest(c)}
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Masuk Ruang Ujian Live ({c.questionCount} Soal)</span>
                </button>
                <button
                  onClick={() => handleOpenStandings(c)}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Klasemen Sementara</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. UPCOMING CONTESTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 gap-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Jadwal Kontes Mendatang
          </h4>
          <span className="text-[10px] text-slate-400 font-bold">Waktu WIB</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {upcomingContests.map((c) => {
            const isRegistered = userProfile?.registeredContestIds?.includes(c.id);

            return (
              <div
                key={c.id}
                className="bg-white dark:bg-[#111726] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2 gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 truncate">
                      {c.badgeTag}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {c.durationMinutes}m
                    </span>
                  </div>

                  <h5 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                    {c.title}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {c.registeredCount.toLocaleString('id-ID')} Pendaftar
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {c.questionCount} Soal
                    </span>
                  </div>

                  <button
                    onClick={() => onRegisterToggle(c.id)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isRegistered
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-[0.98]'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Sudah Terdaftar</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Daftar Kontes Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PAST CONTESTS / VIRTUAL CONTEST ARCHIVE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 gap-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-400" />
            Arsip Virtual Contest
          </h4>
          <span className="text-[10px] text-slate-400 font-bold">Latihan Mandiri</span>
        </div>

        <div className="space-y-2.5">
          {finishedContests.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#111726] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                    Selesai
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {c.registeredCount.toLocaleString('id-ID')} Peserta
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</h5>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpenStandings(c)}
                  className="py-2 px-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Papan Skor</span>
                </button>
                <button
                  onClick={() => onEnterContest(c)}
                  className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <span>Virtual Test</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. STANDINGS MODAL */}
      <ContestStandingsModal
        contest={selectedContestForModal}
        standings={standings}
        isLoading={isLoadingStandings}
        onClose={() => setSelectedContestForModal(null)}
      />
    </div>
  );
};
