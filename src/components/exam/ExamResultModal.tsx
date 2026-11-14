'use client';

import React, { useState } from 'react';
import { ExamResultSummary, StreamPost, UserProfile } from '@/types';
import {
  Award,
  CheckCircle2,
  XCircle,
  Share2,
  Flame,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PASSING_GRADE_TWK,
  PASSING_GRADE_TIU,
  PASSING_GRADE_TKP
} from '@/data/constants';
import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface ExamResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExamResultSummary | null;
  userProfile: UserProfile | null;
  onFlexToStream: (post: StreamPost) => void;
  onRequireAuth?: (reason: AuthTriggerReason) => void;
}

export const ExamResultModal: React.FC<ExamResultModalProps> = ({
  isOpen,
  onClose,
  result,
  userProfile,
  onFlexToStream,
  onRequireAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'review'>('summary');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hasFlexed, setHasFlexed] = useState(false);

  if (!isOpen || !result) return null;

  // Trigger celebration confetti if passed
  React.useEffect(() => {
    if (result.isOverallPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result]);

  const handleFlexToFeed = () => {
    if (hasFlexed) return;
    if (!userProfile) {
      onRequireAuth?.('exam');
      return;
    }

    const breakdown = `TWK ${result.twkScore} • TIU ${result.tiuScore} • TKP ${result.tkpScore}`;
    const newPost: StreamPost = {
      id: `flex_${Date.now()}`,
      authorName: userProfile.name,
      authorBadge: result.isOverallPassed ? 'Verified NIP Ready' : 'Pejuang Tangguh',
      avatarInitial: userProfile.avatarInitial,
      timeAgo: 'Baru saja',
      cashtag: '$Kemenkeu',
      track: 'cpns',
      content: result.isOverallPassed
        ? `Alhamdulillah tryout ${result.mode} tembus skor ${result.totalScore} dan lolos passing grade! 🔥 Tetap konsisten drilling soal setiap hari.`
        : `Evaluasi tryout ${result.mode} dapat skor ${result.totalScore}. Masih perlu asah di beberapa sub-topik. Semangat pejuang! 💪`,
      verifiedScore: {
        totalScore: result.totalScore,
        breakdownText: breakdown,
        percentileText: result.isOverallPassed ? 'Top 3% Nasional' : 'Pejuang 2026',
        isPassed: result.isOverallPassed,
      },
      upvoteCount: 1,
      commentCount: 0,
      isUpvoted: true,
      comments: [],
    };

    onFlexToStream(newPost);
    setHasFlexed(true);
  };

  const handleShareWhatsApp = () => {
    const text = `Saya baru saja menyelesaikan Simulasi CAT BKN di Criliant dengan Skor Total: ${result.totalScore} (TWK: ${result.twkScore}, TIU: ${result.tiuScore}, TKP: ${result.tkpScore}). Status: ${result.isOverallPassed ? 'LULUS PASSING GRADE' : 'BELUM LULUS'}!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col justify-between shadow-2xl border border-slate-200 dark:border-[#1E293B] overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-[#0F172A] text-white flex items-center justify-between border-b dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-sm sm:text-base">RAPOR RESMI EVALUASI CAT BKN</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (Summary vs Detailed Review) */}
        <div className="grid grid-cols-2 border-b border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#090D16] text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 text-center transition-colors ${activeTab === 'summary' ? 'bg-white dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#38BDF8] border-b-2 border-[#2563EB] dark:border-[#38BDF8]' : 'text-slate-500 dark:text-slate-400'
              }`}
          >
            Ringkasan & Passing Grade
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 text-center transition-colors ${activeTab === 'review' ? 'bg-white dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#38BDF8] border-b-2 border-[#2563EB] dark:border-[#38BDF8]' : 'text-slate-500 dark:text-slate-400'
              }`}
          >
            Bedah Soal & Kunci ({result.reviewItems.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'summary' ? (
            <>
              {/* Overall Status Banner */}
              <div className={`p-5 rounded-2xl border text-center space-y-1.5 ${result.isOverallPassed
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-gradient-to-br from-rose-500 to-red-600 text-white border-red-400 shadow-lg shadow-red-500/20'
                }`}>
                <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full inline-block">
                  {result.isOverallPassed ? '🎉 MEMENUHI SYARAT KELULUSAN' : '⚠️ BELUM MEMENUHI PASSING GRADE'}
                </span>
                <div className="text-4xl sm:text-5xl font-black tracking-tight pt-1">
                  {result.totalScore}
                </div>
                <p className="text-xs font-medium text-white/90">
                  Total Nilai Kumulatif SKD BKN (Maksimal 550)
                </p>
              </div>

              {/* Category Breakdown (TWK, TIU, TKP) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Rincian Nilai per Pilar Materi
                </h4>

                {/* 1. TWK */}
                <div className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200">🏛️ Tes Wawasan Kebangsaan (TWK)</span>
                    <span className={`font-black ${result.isTwkPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {result.twkScore} / Ambang Batas {PASSING_GRADE_TWK}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${result.isTwkPassed ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${Math.min(100, (result.twkScore / 150) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 2. TIU */}
                <div className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200">⚡ Tes Intelegensi Umum (TIU)</span>
                    <span className={`font-black ${result.isTiuPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {result.tiuScore} / Ambang Batas {PASSING_GRADE_TIU}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${result.isTiuPassed ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${Math.min(100, (result.tiuScore / 175) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 3. TKP */}
                <div className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200">🌱 Tes Karakteristik Pribadi (TKP)</span>
                    <span className={`font-black ${result.isTkpPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {result.tkpScore} / Ambang Batas {PASSING_GRADE_TKP}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${result.isTkpPassed ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${Math.min(100, (result.tkpScore / 225) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Flex to Stream Callout */}
              <div className="bg-blue-50/70 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Pamerkan Rapor Resmi ke Feed Komunitas
                  </h5>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                    Bagikan hasil evaluasimu langsung ke stream agar bisa saling semangati dengan pejuang lainnya.
                  </p>
                </div>
                <button
                  onClick={handleFlexToFeed}
                  disabled={hasFlexed}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${hasFlexed
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20 active:scale-95'
                    }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{hasFlexed ? 'Sudah Di-Flex!' : 'Flex ke Feed'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Detailed Question Review Tab */
            <div className="space-y-3">
              {result.reviewItems.map((item, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={item.question.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-slate-50/60 dark:bg-[#0F172A] space-y-2"
                  >
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${item.isCorrect ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                          }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          [{item.question.category}] {item.question.subTopic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${item.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          +{item.earnedScore} Poin
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] text-xs space-y-2">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{item.question.text}</p>

                        <div className="space-y-1">
                          {item.question.options.map((opt, optIdx) => {
                            const isUserChoice = item.selectedOptionIndex === optIdx;
                            const isCorrectOpt = optIdx === item.question.correctOptionIndex;
                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-xl text-xs flex items-center justify-between ${isCorrectOpt
                                  ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800'
                                  : isUserChoice
                                    ? 'bg-red-100/70 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold border border-red-300 dark:border-red-800'
                                    : 'text-slate-600 dark:text-slate-400'
                                  }`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                                {isUserChoice && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 text-blue-950 dark:text-blue-200">
                          <span className="font-bold block mb-0.5">💡 Pembahasan:</span>
                          <p>{item.question.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between gap-3">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-[#0F1419] font-black text-xs shadow-sm transition-all"
          >
            Kembali ke Hub
          </button>
        </div>
      </div>
    </div>
  );
};
