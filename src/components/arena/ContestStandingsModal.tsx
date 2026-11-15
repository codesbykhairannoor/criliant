'use client';

import React from 'react';
import { ScheduledContest, ContestParticipantStanding } from '@/types';
import { CONTEST_TIER_CONFIG } from '@/data/contests';
import { X } from 'lucide-react';

interface ContestStandingsModalProps {
  contest: ScheduledContest | null;
  standings: ContestParticipantStanding[];
  isLoading: boolean;
  onClose: () => void;
}

export const ContestStandingsModal: React.FC<ContestStandingsModalProps> = ({
  contest,
  standings,
  isLoading,
  onClose,
}) => {
  if (!contest) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#111726] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
                Leaderboard Nasional
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tabular-nums">
                {contest.registeredCount.toLocaleString('id-ID')} Peserta
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
              {contest.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center flex-shrink-0 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
          </button>
        </div>

        {/* Standings Table Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
              Memuat peringkat klasemen...
            </div>
          ) : (
            standings.map((s) => {
              const sTier = CONTEST_TIER_CONFIG[s.tier];
              const minutes = Math.floor(s.penaltyTimeSeconds / 60);
              const seconds = s.penaltyTimeSeconds % 60;
              const timeFormatted = `${minutes}m ${seconds}s`;

              return (
                <div
                  key={s.userId}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    s.rank === 1
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
                      : s.rank <= 3
                        ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        : 'bg-white dark:bg-[#0B0F19] border-slate-200/80 dark:border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs tabular-nums flex-shrink-0 ${
                        s.rank === 1
                          ? 'bg-amber-500 text-white shadow-xs'
                          : s.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : s.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {s.rank}
                    </span>

                    <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-semibold text-sm flex items-center justify-center flex-shrink-0">
                      {s.avatarInitial}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {s.userName}
                        </span>
                        <span className="text-xs flex-shrink-0">{sTier.icon}</span>
                      </div>
                      <span className={`text-xs font-medium block truncate tabular-nums ${sTier.textColor}`}>
                        {s.rating} ELO · {sTier.label}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 tabular-nums">
                    <span className="text-sm font-bold text-[#2563EB] dark:text-[#38BDF8] block">
                      {s.score} Poin
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                      {timeFormatted}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="h-10 px-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors"
          >
            Tutup Klasemen
          </button>
        </div>
      </div>
    </div>
  );
};
