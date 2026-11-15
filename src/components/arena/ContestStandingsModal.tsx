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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl border border-slate-200 dark:border-[#1E293B] overflow-hidden transition-colors">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50">
                Leaderboard Nasional
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {contest.registeredCount.toLocaleString('id-ID')} Peserta
              </span>
            </div>
            <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {contest.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold flex-shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Standings Table Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
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
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-colors ${
                    s.rank === 1
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
                      : s.rank <= 3
                        ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        : 'bg-white dark:bg-[#111726] border-slate-100 dark:border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
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

                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      {s.avatarInitial}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {s.userName}
                        </span>
                        <span className="text-[10px] flex-shrink-0">{sTier.icon}</span>
                      </div>
                      <span className={`text-[10px] font-bold block truncate ${sTier.textColor}`}>
                        {s.rating} ELO • {sTier.label}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400 block">
                      {s.score} Poin
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 block">
                      ⏱️ {timeFormatted}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0D1322] border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
          >
            Tutup Klasemen
          </button>
        </div>
      </div>
    </div>
  );
};
