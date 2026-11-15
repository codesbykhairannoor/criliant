'use client';

import React from 'react';
import { ShieldAlert, Sparkles, CheckCircle2, ArrowRight, X, BrainCircuit } from 'lucide-react';

interface ProofOfCompetenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectToQuiz: () => void;
}

export const ProofOfCompetenceModal: React.FC<ProofOfCompetenceModalProps> = ({
  isOpen,
  onClose,
  onDirectToQuiz,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111726] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200 transition-colors">
        {/* Header with Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" strokeWidth={1.85} />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block">
                Anti-Bot & Keamanan Akun
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg mt-0.5 leading-snug tracking-tight">
                Verifikasi Proof of Competence
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
          </button>
        </div>

        {/* Value Proposition & Logic */}
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Aksi apresiasi <span className="font-semibold text-slate-900 dark:text-white">Love</span> dan komentar terbuka penuh setelah verifikasi singkat untuk mencegah spam serta menjaga kualitas diskusi pejuang.
          </p>

          <div className="bg-slate-50 dark:bg-[#0B0F19] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-start gap-2.5">
              <BrainCircuit className="w-[18px] h-[18px] text-[#2563EB] dark:text-[#38BDF8] flex-shrink-0 mt-0.5" strokeWidth={1.85} />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block text-sm">Tanpa CAPTCHA Menyebalkan</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Tidak perlu klik gambar lampu merah atau tebak huruf bengkok.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={1.85} />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block text-sm">Cukup Jawab 1 Kuis Mikro</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Jawab minimal 1 kuis di stream untuk membuktikan kamu pejuang sungguhan.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="w-[18px] h-[18px] text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={1.85} />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block text-sm">Reward +15 Reputasi Karma</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Akunmu langsung berstatus <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Human</strong> dan seluruh interaksi terbuka permanen.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onDirectToQuiz();
            }}
            className="w-full h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Kerjakan Kuis Mikro Sekarang (15 Detik)</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={onClose}
            className="w-full h-10 px-4 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
};

