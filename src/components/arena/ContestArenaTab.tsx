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
    <div className="space-y-7 select-none">
      {/* 1. CLEAN COMPETITIVE RATING CARD */}
      <div className="bg-slate-900 dark:bg-[#111726] text-white rounded-2xl p-5 sm:p-7 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Competitive Rating · Musim 2026
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Peringkat Kompetitif</span>
              <span>{tierConfig.icon}</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Ikuti Weekly Grand Prix dan Night Clash untuk menaikkan ELO rating dan menembus Tier Grandmaster.
            </p>
          </div>

          {/* User ELO Score Block */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between sm:justify-start gap-5 flex-shrink-0">
            <div>
              <span className="text-xs font-medium text-slate-400 block">
                Rating ELO
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums block mt-0.5">
                {userRating}
              </span>
              <span className="inline-block text-xs font-semibold text-slate-200 mt-1">
                {tierConfig.label}
              </span>
            </div>
            <div className="h-10 w-px bg-white/15" />
            <div className="text-right">
              <span className="text-xs font-medium text-slate-400 block">
                Kontes Diikuti
              </span>
              <span className="text-2xl font-bold text-white tabular-nums block mt-0.5">
                {contestsAttended}
              </span>
              <span className="text-xs text-emerald-400 font-medium mt-1 flex items-center justify-end gap-1 tabular-nums">
                <TrendingUp className="w-3.5 h-3.5" />
                {contestsAttended > 0 ? `Top ${estimatedTopPct}%` : 'Belum tanding'}
              </span>
            </div>
          </div>
        </div>

        {/* Clean Monochrome Tier Roadmap */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-medium text-slate-300 tabular-nums">
          <div className="py-2 px-2 rounded-lg bg-white/5 border border-white/10">
            Novice (&lt;1400)
          </div>
          <div className="py-2 px-2 rounded-lg bg-white/5 border border-white/10">
            Fighter (1400+)
          </div>
          <div className="py-2 px-2 rounded-lg bg-white/5 border border-white/10">
            Expert (1600+)
          </div>
          <div className="py-2 px-2 rounded-lg bg-white/5 border border-white/10">
            Master (1850+)
          </div>
          <div className="py-2 px-2 rounded-lg bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
            Grandmaster (2100+)
          </div>
        </div>
      </div>

      {/* 2. LIVE CONTESTS */}
      {liveContests.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Sedang Berlangsung
            </h3>
          </div>

          {liveContests.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#111726] rounded-2xl p-5 sm:p-6 border border-rose-300 dark:border-rose-800/70 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                      Live
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      {c.durationMinutes} Menit
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {c.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-[#0D1322] px-3.5 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 self-start flex-shrink-0">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block tabular-nums">
                      {c.registeredCount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Terdaftar</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onEnterContest(c)}
                  className="flex-1 h-11 px-5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span className="tabular-nums">Masuk Ruang Ujian ({c.questionCount} Soal)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenStandings(c)}
                  className="h-11 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Klasemen</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 3. UPCOMING CONTESTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            <span>Jadwal Kontes Mendatang</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Waktu WIB</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingContests.map((c) => {
            const isRegistered = userProfile?.registeredContestIds?.includes(c.id);

            return (
              <div
                key={c.id}
                className="bg-white dark:bg-[#111726] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400 truncate">
                      {c.badgeTag}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 flex-shrink-0 tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      {c.durationMinutes} mnt
                    </span>
                  </div>

                  <h4 className="font-semibold text-base text-slate-900 dark:text-white leading-snug">
                    {c.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-slate-400" />
                      {c.registeredCount.toLocaleString('id-ID')} pendaftar
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {c.questionCount} soal
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRegisterToggle(c.id)}
                    className={`w-full h-10 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                      isRegistered
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
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
                        <span>Daftar Kontes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PAST CONTESTS / VIRTUAL CONTEST ARCHIVE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <span>Arsip Virtual Contest</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Latihan Mandiri</span>
        </div>

        <div className="space-y-3">
          {finishedContests.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#111726] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                    Selesai
                  </span>
                  <span className="text-xs font-medium text-slate-500 tabular-nums">
                    {c.registeredCount.toLocaleString('id-ID')} peserta
                  </span>
                </div>
                <h4 className="font-semibold text-base text-slate-900 dark:text-white">{c.title}</h4>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenStandings(c)}
                  className="h-10 px-3.5 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Papan Skor</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEnterContest(c)}
                  className="h-10 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Virtual Test</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
