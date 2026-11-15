'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ExamResultSummary, StreamPost, UserProfile, StudyTrack } from '@/types';
import {
  Award,
  CheckCircle2,
  XCircle,
  Share2,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PASSING_GRADE_TWK,
  PASSING_GRADE_TIU,
  PASSING_GRADE_TKP,
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

  // Reset modal internal state & trigger confetti when a fresh result opens (ALWAYS before early return!)
  useEffect(() => {
    if (!isOpen || !result) return;
    setActiveTab('summary');
    setExpandedIndex(null);
    setHasFlexed(false);

    if (result.isOverallPassed) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, result]);

  // Dynamic category stats for drills / SNBT / Kedinasan
  const categoryBreakdown = useMemo(() => {
    if (!result) return [];
    const grouped: Record<string, { category: string; score: number; maxScore: number; correct: number; total: number }> = {};

    result.reviewItems.forEach((item) => {
      const cat = item.question.category;
      if (!grouped[cat]) {
        grouped[cat] = { category: cat, score: 0, maxScore: 0, correct: 0, total: 0 };
      }
      grouped[cat].score += item.earnedScore;
      grouped[cat].maxScore += 5;
      grouped[cat].total += 1;
      if (item.isCorrect) grouped[cat].correct += 1;
    });

    return Object.values(grouped);
  }, [result]);

  if (!isOpen || !result) return null;

  const track: StudyTrack = result.track || 'cpns';
  const maxScore = result.maxPossibleScore || result.totalQuestions * 5;
  const accuracyPct = result.totalQuestions > 0
    ? Math.round((result.correctCount / result.totalQuestions) * 100)
    : 0;

  const cashtagByTrack: Record<StudyTrack, string> = {
    cpns: result.isFullCpnsSkd ? '$Kemenkeu' : `$${categoryBreakdown[0]?.category || 'TIU'}`,
    snbt: '$TPS-PU',
    kedinasan: '$STAN',
  };

  const handleFlexToFeed = () => {
    if (hasFlexed) return;
    if (!userProfile) {
      onRequireAuth?.('exam');
      return;
    }

    const breakdown = result.isFullCpnsSkd
      ? `TWK ${result.twkScore} • TIU ${result.tiuScore} • TKP ${result.tkpScore}`
      : categoryBreakdown
          .map((c) => `${c.category.replace(/_/g, ' ')} ${c.score}/${c.maxScore}`)
          .join(' • ');

    const newPost: StreamPost = {
      id: `flex_${Date.now()}`,
      authorId: userProfile.id,
      authorName: userProfile.name,
      authorBadge: result.isOverallPassed ? 'Verified Top Scorer' : 'Pejuang Tangguh',
      avatarInitial: userProfile.avatarInitial,
      timeAgo: 'Baru saja',
      cashtag: cashtagByTrack[track],
      track,
      content: result.isOverallPassed
        ? `Baru menyelesaikan ${result.examTitle || 'Latihan Criliant'} dengan skor ${result.totalScore}/${maxScore} (Akurasi ${accuracyPct}%)! 🔥 Konsisten asah logika setiap hari.`
        : `Evaluasi ${result.examTitle || 'Latihan Criliant'}: skor ${result.totalScore}/${maxScore} (${accuracyPct}%). Saatnya bedah soal & perbaiki topik lemah! 💪`,
      verifiedScore: {
        totalScore: result.totalScore,
        breakdownText: breakdown || `${result.correctCount}/${result.totalQuestions} Benar`,
        percentileText: result.isOverallPassed ? `Akurasi ${accuracyPct}%` : 'Pejuang 2026',
        isPassed: result.isOverallPassed,
      },
      upvoteCount: 1,
      likeCount: 1,
      score: 1,
      commentCount: 0,
      isLiked: true,
      isUpvoted: true,
      comments: [],
    };

    onFlexToStream(newPost);
    setHasFlexed(true);
  };

  const handleShareWhatsApp = () => {
    const detail = result.isFullCpnsSkd
      ? `TWK: ${result.twkScore}, TIU: ${result.tiuScore}, TKP: ${result.tkpScore}`
      : `${result.correctCount}/${result.totalQuestions} Benar (${accuracyPct}%)`;
    const text = `Saya baru menyelesaikan ${result.examTitle || 'Simulasi Criliant'} dengan Skor: ${result.totalScore}/${maxScore} (${detail}). Status: ${result.isOverallPassed ? 'LULUS TARGET' : 'PERLU LATIHAN LAGI'}!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const headerTitle = result.isFullCpnsSkd
    ? 'RAPOR RESMI EVALUASI CAT BKN'
    : `RAPOR EVALUASI ${track.toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col justify-between shadow-2xl border border-slate-200 dark:border-[#1E293B] overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 dark:bg-[#0F172A] text-white flex items-center justify-between border-b dark:border-[#1E293B]">
          <div className="flex items-center gap-2 min-w-0">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <h3 className="font-black text-xs sm:text-base truncate">{headerTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 border-b border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#090D16] text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-2 text-center transition-colors ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#38BDF8] border-b-2 border-[#2563EB] dark:border-[#38BDF8]'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Ringkasan Skor
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 px-2 text-center transition-colors ${
              activeTab === 'review'
                ? 'bg-white dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#38BDF8] border-b-2 border-[#2563EB] dark:border-[#38BDF8]'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Bedah Soal ({result.reviewItems.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          {activeTab === 'summary' ? (
            <>
              {/* Overall Status Banner */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border text-center space-y-1.5 ${
                  result.isOverallPassed
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-gradient-to-br from-rose-500 to-red-600 text-white border-red-400 shadow-lg shadow-red-500/20'
                }`}
              >
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full inline-block">
                  {result.isOverallPassed
                    ? result.isFullCpnsSkd
                      ? '🎉 MEMENUHI PASSING GRADE SKD'
                      : '🎉 TARGET TERCAPAI (≥ 65%)'
                    : result.isFullCpnsSkd
                      ? '⚠️ BELUM MEMENUHI PASSING GRADE'
                      : '📈 TERUS ASAH KETELITIAN'}
                </span>
                <div className="text-4xl sm:text-5xl font-black tracking-tight pt-1">
                  {result.totalScore}
                  <span className="text-lg sm:text-xl font-bold opacity-80"> / {maxScore}</span>
                </div>
                <p className="text-xs font-medium text-white/90">
                  {result.examTitle} • {result.correctCount}/{result.totalQuestions} Optimal ({accuracyPct}%)
                </p>
              </div>

              {/* Contest ELO Delta Banner (shown only after Contest sessions) */}
              {result.contestDeltaRating !== undefined && result.contestNewRating !== undefined && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 block">
                        Update ELO Rating Kontes
                      </span>
                      <span className="text-[11px] text-indigo-700 dark:text-indigo-400">
                        Rating Terbaru: <strong>{result.contestNewRating} ELO</strong>
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-black px-3 py-1 rounded-xl ${
                      result.contestDeltaRating >= 0
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {result.contestDeltaRating >= 0 ? `+${result.contestDeltaRating}` : result.contestDeltaRating} ELO
                  </span>
                </div>
              )}

              {/* Category Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {result.isFullCpnsSkd ? 'Rincian Nilai Ambang Batas BKN' : 'Rincian Performa Sub-Tes'}
                </h4>

                {result.isFullCpnsSkd ? (
                  <>
                    <div className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">🏛️ TWK (Wawasan Kebangsaan)</span>
                        <span className={`font-black ${result.isTwkPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {result.twkScore} / Min {PASSING_GRADE_TWK}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${result.isTwkPassed ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (result.twkScore / 150) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">⚡ TIU (Intelegensi Umum)</span>
                        <span className={`font-black ${result.isTiuPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {result.tiuScore} / Min {PASSING_GRADE_TIU}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${result.isTiuPassed ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (result.tiuScore / 175) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">🌱 TKP (Karakteristik Pribadi)</span>
                        <span className={`font-black ${result.isTkpPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {result.tkpScore} / Min {PASSING_GRADE_TKP}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${result.isTkpPassed ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (result.tkpScore / 225) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  categoryBreakdown.map((cat) => {
                    const pct = cat.maxScore > 0 ? Math.round((cat.score / cat.maxScore) * 100) : 0;
                    const passedCat = pct >= 65;
                    return (
                      <div
                        key={cat.category}
                        className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
                            {cat.category.replace(/_/g, ' ')} ({cat.correct}/{cat.total} benar)
                          </span>
                          <span className={`font-black flex-shrink-0 ${passedCat ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                            {cat.score} / {cat.maxScore} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${passedCat ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Flex to Stream Callout */}
              <div className="bg-blue-50/70 dark:bg-blue-950/30 p-3.5 sm:p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Pamerkan Rapor ke Feed Komunitas
                  </h5>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                    Bagikan hasil evaluasimu ke stream agar pejuang lain bisa ikut tertantang.
                  </p>
                </div>
                <button
                  onClick={handleFlexToFeed}
                  disabled={hasFlexed}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-shrink-0 ${
                    hasFlexed
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
                    key={`${item.question.id}_${idx}`}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-slate-50/60 dark:bg-[#0F172A] space-y-2"
                  >
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="flex items-center justify-between cursor-pointer gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            item.isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                          [{item.question.category.replace(/_/g, ' ')}] {item.question.subTopic}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {item.selectedOptionIndex === null && (
                          <span className="text-[10px] font-bold text-slate-400">Kosong</span>
                        )}
                        <span className={`text-xs font-black ${item.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          +{item.earnedScore} Poin
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] text-xs space-y-2">
                        <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {item.question.text}
                        </p>

                        <div className="space-y-1">
                          {item.question.options.map((opt, optIdx) => {
                            const isUserChoice = item.selectedOptionIndex === optIdx;
                            const isCorrectOpt =
                              item.question.category === 'TKP' && item.question.tkpOptionPoints
                                ? item.question.tkpOptionPoints[optIdx] === 5
                                : optIdx === item.question.correctOptionIndex;
                            const tkpPoint = item.question.tkpOptionPoints?.[optIdx];

                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 ${
                                  isCorrectOpt
                                    ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800'
                                    : isUserChoice
                                      ? 'bg-red-100/70 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold border border-red-300 dark:border-red-800'
                                      : 'text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                <span className="flex-1">
                                  {String.fromCharCode(65 + optIdx)}. {opt}
                                </span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {tkpPoint !== undefined && (
                                    <span className="text-[10px] font-mono opacity-80">({tkpPoint}p)</span>
                                  )}
                                  {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                                  {isUserChoice && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 text-blue-950 dark:text-blue-200">
                          <span className="font-bold block mb-0.5">💡 Pembahasan:</span>
                          <p className="leading-relaxed">{item.question.explanation}</p>
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
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between gap-2.5">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 py-2.5 px-3.5 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bagikan WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 sm:px-5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-[#0F1419] font-black text-xs shadow-sm transition-all"
          >
            Kembali ke Hub
          </button>
        </div>
      </div>
    </div>
  );
};
