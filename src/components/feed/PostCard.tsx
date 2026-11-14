'use client';

import React, { useState } from 'react';
import { StreamPost, UserProfile } from '@/types';
import {
  MessageCircle,
  Share2,
  Award,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Swords,
  Send,
  Bookmark,
  Heart,
  MoreHorizontal,
  Flag,
  Link2,
  Maximize2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface PostCardProps {
  post: StreamPost;
  userProfile: UserProfile | null;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onStartExam: (modeId: string) => void;
  onAnswerQuiz?: (postId: string, selectedIndex: number, isCorrect: boolean) => void;
  onReportPost?: (postId: string, reason: string) => void;
  onToggleBookmark?: (postId: string) => void;
  isBookmarked?: boolean;
  onRequireAuth?: (reason: AuthTriggerReason) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  userProfile,
  onLike,
  onAddComment,
  onStartExam,
  onAnswerQuiz,
  onReportPost,
  onToggleBookmark,
  isBookmarked: externalIsBookmarked,
  onRequireAuth,
}) => {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(
    post.microQuiz?.userSelectedIndex ?? null
  );
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(externalIsBookmarked ?? false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Like State (Clean Twitter/X Style)
  const isLiked = post.isLiked ?? post.isUpvoted ?? false;
  const likeCount = post.likeCount ?? post.score ?? post.upvoteCount ?? 0;

  const handleSelectQuiz = (index: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(index);

    const isCorrect = post.microQuiz ? index === post.microQuiz.correctIndex : false;

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    if (onAnswerQuiz) {
      onAnswerQuiz(post.id, index, isCorrect);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      onRequireAuth?.('comment');
      return;
    }
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <article className="bg-white dark:bg-[#0B0F19] border-b border-[#EFF3F4] dark:border-[#1E293B] p-3.5 sm:p-4 hover:bg-[#F8FAFC]/50 dark:hover:bg-[#0F172A]/40 transition-colors">
      <div className="flex gap-3">
        {/* Left Column: Author Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#0F1419] dark:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 cursor-pointer select-none shadow-sm">
          {post.avatarInitial}
        </div>

        {/* Right Column: Main Post Body */}
        <div className="flex-1 min-w-0">
          {/* Header Row: Author Info & Cashtag */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap leading-none">
              <span className="font-extrabold text-sm text-[#0F1419] dark:text-white hover:underline cursor-pointer">
                {post.authorName}
              </span>
              {post.authorBadge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#536471] dark:text-slate-400">
                  {post.authorBadge}
                </span>
              )}
              <span className="text-[#536471] dark:text-slate-500 text-xs">·</span>
              <span className="text-xs text-[#536471] dark:text-slate-400">{post.timeAgo}</span>
            </div>

            {/* Header Right: Clickable Cashtag & More Options Menu */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-bold text-[#2563EB] dark:text-[#38BDF8] hover:underline cursor-pointer">
                {post.cashtag}
              </span>

              {/* Three dots menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="p-1 rounded-full text-[#536471] hover:text-[#0F1419] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Opsi Postingan"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-7 z-50 w-48 bg-white dark:bg-[#0B0F19] rounded-2xl shadow-xl border border-slate-200 dark:border-[#1E293B] py-1 text-xs text-[#0F1419] dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleShare();
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-[#0F172A] flex items-center gap-2"
                      >
                        <Link2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin Tautan Soal</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (!userProfile) {
                            onRequireAuth?.('general');
                            return;
                          }
                          onReportPost?.(post.id, 'soal_keliru');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>Laporkan Soal / Hoaks</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Post Text Content */}
          <p className="text-[14px] sm:text-[15px] text-[#0F1419] dark:text-slate-200 leading-relaxed mb-3 whitespace-pre-line font-normal">
            {post.content}
          </p>

          {/* Post Image (Ultra-Compressed WebP Photo of Math/Question) */}
          {post.imageUrl && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-[#EFF3F4] dark:border-[#1E293B] bg-slate-50 dark:bg-[#090D16] relative group max-w-lg cursor-pointer"
              onClick={() => setIsImageZoomed(true)}
            >
              <img
                src={post.imageUrl}
                alt="Foto Soal Terlampir"
                className="w-full max-h-80 object-cover object-top hover:scale-[1.01] transition-transform"
              />
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3 h-3" />
                <span>Perbesar</span>
              </div>
            </div>
          )}

          {/* 1. NATIVE INTERACTIVE MICRO-QUIZ (Twitter / LinkedIn Poll Style) */}
          {post.microQuiz && (
            <div className="bg-[#F8FAFC] dark:bg-[#090D16] rounded-2xl p-3.5 border border-[#EFF3F4] dark:border-[#1E293B] mb-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#536471] dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#0F1419] dark:text-white">Kuis Mikro</span>
                  {!userProfile?.isCompetenceVerified && selectedQuizOption === null && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                      🛡️ PoC Verifier
                    </span>
                  )}
                </div>
                <span className="text-[11px]">
                  {post.microQuiz.totalVotes + (selectedQuizOption !== null ? 1 : 0)} suara
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#0F1419] dark:text-slate-100 leading-snug">
                {post.microQuiz.questionText}
              </p>

              {/* Options */}
              <div className="space-y-1.5 pt-1">
                {post.microQuiz.options.map((opt) => {
                  const isSelected = selectedQuizOption === opt.index;
                  const hasAnswered = selectedQuizOption !== null;
                  const isCorrect = opt.index === post.microQuiz?.correctIndex;

                  return (
                    <button
                      key={opt.index}
                      onClick={() => handleSelectQuiz(opt.index)}
                      disabled={hasAnswered}
                      className={`w-full relative overflow-hidden rounded-xl border p-2.5 text-left text-xs font-semibold transition-all flex items-center justify-between ${hasAnswered
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold'
                          : isSelected
                            ? 'border-red-400 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-bold'
                            : 'border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#536471] dark:text-slate-400 opacity-75'
                        : 'border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#0F1419] dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20'
                        }`}
                    >
                      {/* Smooth Voting Bar */}
                      {hasAnswered && (
                        <div
                          className={`absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-700 ${isCorrect ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          style={{ width: `${opt.votePercentage}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${hasAnswered && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-[#0F1419] dark:text-slate-200'
                          }`}>
                          {String.fromCharCode(65 + opt.index)}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      <div className="relative z-10 flex items-center gap-1.5 flex-shrink-0">
                        {hasAnswered && (
                          <span className="text-[11px] font-black text-[#536471] dark:text-slate-400">
                            {opt.votePercentage}%
                          </span>
                        )}
                        {hasAnswered && isCorrect && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Accordion */}
              {selectedQuizOption !== null && (
                <div className="pt-2 border-t border-[#EFF3F4] dark:border-[#1E293B]">
                  <button
                    onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                    className="w-full flex items-center justify-between text-xs font-bold text-[#2563EB] dark:text-[#38BDF8] hover:underline py-0.5"
                  >
                    <span>💡 Lihat Pembahasan Resmi</span>
                    {isExplanationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {isExplanationOpen && (
                    <div className="mt-2 p-3 bg-white dark:bg-[#0F172A] rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] text-xs text-[#0F1419] dark:text-slate-200 leading-relaxed">
                      {post.microQuiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. VERIFIED SCORE EMBED (Official Prestigious Card) */}
          {post.verifiedScore && (
            <div className="bg-[#0B0F19] rounded-2xl p-4 text-white shadow-sm border border-slate-800 mb-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider bg-white/10 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  Rapor Resmi SKD
                </span>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  LULUS PASSING GRADE
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white">
                  {post.verifiedScore.totalScore}
                </span>
                <span className="text-xs font-bold text-slate-400">Skor Total SKD</span>
                <span className="text-[10px] font-bold text-amber-300 ml-auto">
                  🏆 {post.verifiedScore.percentileText}
                </span>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 text-xs font-mono font-medium text-slate-300 flex items-center justify-between border border-white/5">
                <span>{post.verifiedScore.breakdownText}</span>
              </div>

              <button
                onClick={() => onStartExam('TRYOUT_FULL')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-[#0F1419] font-extrabold text-xs rounded-xl transition-all shadow-sm active:scale-98"
              >
                <Swords className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Tantang Skor Ini (Coba Tryout)</span>
              </button>
            </div>
          )}

          {/* Footer Actions (Clean Twitter/X Style: Comment, Like, Bookmark, Share) */}
          <div className="flex items-center justify-between text-[#536471] dark:text-slate-400 pt-1 max-w-sm sm:max-w-md">
            {/* 1. Comment / Diskusi */}
            <button
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="flex items-center gap-1.5 hover:text-[#2563EB] dark:hover:text-[#38BDF8] transition-colors group text-xs"
              title="Lihat & Tulis Komentar"
            >
              <div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">{post.comments.length || post.commentCount}</span>
            </button>

            {/* 2. Like (❤️ Twitter / X Heart) */}
            <button
              onClick={() => {
                if (!userProfile) {
                  onRequireAuth?.('like');
                  return;
                }
                onLike(post.id);
              }}
              className={`flex items-center gap-1.5 transition-colors group text-xs ${isLiked
                ? 'text-rose-600 dark:text-rose-500 font-bold'
                : 'hover:text-rose-600 dark:hover:text-rose-500'
                }`}
              title={isLiked ? 'Batal Suka' : 'Suka / Bermanfaat'}
            >
              <div className={`p-1.5 rounded-full transition-transform group-hover:bg-rose-50 dark:group-hover:bg-rose-950/50 ${isLiked ? 'scale-110' : ''}`}>
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 dark:fill-rose-500' : ''}`} />
              </div>
              <span className="font-semibold text-xs">{likeCount}</span>
            </button>

            {/* 3. Bookmark / Simpan Soal */}
            <button
              onClick={() => {
                if (!userProfile) {
                  onRequireAuth?.('bookmark');
                  return;
                }
                setIsBookmarked(!isBookmarked);
                onToggleBookmark?.(post.id);
              }}
              className={`flex items-center gap-1.5 transition-colors group text-xs ${isBookmarked
                ? 'text-[#2563EB] dark:text-[#38BDF8] font-bold'
                : 'hover:text-[#2563EB] dark:hover:text-[#38BDF8]'
                }`}
              title={isBookmarked ? 'Hapus dari Simpanan' : 'Simpan Soal'}
            >
              <div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#2563EB] dark:fill-[#38BDF8]' : ''}`} />
              </div>
            </button>

            {/* 4. Share / Bagikan */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group text-xs relative"
              title="Salin Tautan Soal"
            >
              <div className="p-1.5 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 transition-colors">
                <Share2 className="w-4 h-4" />
              </div>
              {copiedToast && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-[#0F1419] dark:bg-white text-white dark:text-[#0F1419] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Tersalin!
                </span>
              )}
            </button>
          </div>

          {/* Expandable Comments Section */}
          {isCommentsOpen && (
            <div className="mt-3 pt-3 border-t border-[#EFF3F4] dark:border-[#1E293B] space-y-2.5">
              {post.comments.length > 0 ? (
                <div className="space-y-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="bg-[#F8FAFC] dark:bg-[#090D16] p-2.5 rounded-xl text-xs space-y-0.5 border border-[#EFF3F4] dark:border-[#1E293B]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#0F1419] dark:text-white">{c.authorName}</span>
                          {c.authorBadge && (
                            <span className="text-[9px] font-bold px-1 rounded bg-slate-200 dark:bg-slate-800 text-[#536471] dark:text-slate-400">
                              {c.authorBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#536471] dark:text-slate-500">{c.timeAgo}</span>
                      </div>
                      <p className="text-[#0F1419] dark:text-slate-200 leading-normal">{c.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#536471] dark:text-slate-400 italic text-center py-1">
                  Belum ada komentar. Jadilah pejuang pertama yang menanggapi!
                </p>
              )}

              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis tanggapan atau trik cepatmu..."
                  className="flex-1 text-xs px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl border border-transparent focus:border-[#2563EB] focus:bg-white dark:focus:bg-[#0F172A] focus:outline-none text-[#0F1419] dark:text-white placeholder:text-[#536471] dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Zooming Attached Question Photos */}
      {isImageZoomed && post.imageUrl && (
        <div
          className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={post.imageUrl}
              alt="Foto Soal Full Resolution"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute -top-10 right-0 text-white text-xs font-bold flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
              <span>Tutup</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
