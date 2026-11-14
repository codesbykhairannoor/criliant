'use client';

import React from 'react';
import { TICKER_UPDATES } from '@/data/constants';

export const LiveTickerTape: React.FC = () => {
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#090D16] text-[#536471] dark:text-slate-400 py-1.5 px-3.5 overflow-hidden border-b border-[#EFF3F4] dark:border-[#1E293B] flex items-center gap-2 select-none transition-colors">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2563EB] dark:text-[#38BDF8] flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#38BDF8] animate-pulse" />
        <span className="uppercase tracking-wider text-[9px] font-black">Live</span>
      </div>
      <div className="overflow-hidden relative w-full text-[11px] font-medium text-[#536471] dark:text-slate-400">
        <div className="animate-ticker space-x-8">
          {[...TICKER_UPDATES, ...TICKER_UPDATES].map((text, idx) => (
            <span key={idx} className="inline-block hover:text-[#0F1419] dark:hover:text-white transition-colors cursor-default">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
