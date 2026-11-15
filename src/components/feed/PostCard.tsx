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
  Sparkles
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
  onToggleFollow?: (authorId: string) => void;
  onOpenProfile?: (authorId: string, authorName: string) => void;
  isFollowingAuthor?: boolean;
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
  onToggleFollow,
  onOpenProfile,
  isFollowingAuthor = false,
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
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  // Pure Like / Love State
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

  const handleLikeClick = () => {
    if (!userProfile) {
      onRequireAuth?.('like');
      return;
    }
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);
    onLike(post.id);
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
    <article className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-5 mb-4 hover:shadow-md transition-shadow">
      {/* 1. Header Row: Author Avatar, Badges, Follow button & Options */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => onOpenProfile?.(post.authorId || post.authorName, post.authorName)}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            {post.avatarInitial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                onClick={() => onOpenProfile?.(post.authorId || post.authorName, post.authorName)}
                className="font-bold text-sm text-slate-900 dark:text-white truncate cursor-pointer hover:underline"
              >
                {post.authorName}
              </span>
              {post.authorBadge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  {post.authorBadge}
                </span>
              )}
              {/* Quick Follow Button (if not self) */}
              {userProfile?.name.toLowerCase() !== post.authorName.toLowerCase() && onToggleFollow && (
                <button
                  onClick={() => onToggleFollow(post.authorId || post.authorName)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                    isFollowingAuthor
                      ? 'text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-rose-500'
                      : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                  }`}
                >
                  {isFollowingAuthor ? '✓ Mengikuti' : '+ Ikuti'}
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {post.timeAgo}
            </p>
          </div>
        </div>

        {/* Top-Right: Cashtag Chip & Options */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono">
            {post.cashtag}
          </span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                <div className="absolute right-0 top-8 z-50 w-48 bg-white dark:bg-[#162137] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 text-xs text-slate-700 dark:text-slate-200">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleShare();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
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

      {/* 2. Main Text Content */}
      <p className="text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed mb-3 whitespace-pre-line font-normal">
        {post.content}
      </p>

      {/* 3. Image (if attached) */}
      {post.imageUrl && (
        <div
          className="mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E1524] relative group cursor-pointer"
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

      {/* 4. Native Interactive MicroQuiz Card */}
      {post.microQuiz && (
        <div className="bg-slate-50/90 dark:bg-[#0D1322] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800/90 mb-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Kuis Mikro</span>
            </div>
            <span className="text-[11px] font-medium">
              {post.microQuiz.totalVotes + (selectedQuizOption !== null ? 1 : 0)} votes
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
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
                  className={`w-full relative overflow-hidden rounded-xl border p-2.5 text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    hasAnswered
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold'
                        : isSelected
                        ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162137] text-slate-400 dark:text-slate-500 opacity-70'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162137] text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {hasAnswered && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-700 ${
                        isCorrect ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${opt.votePercentage}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                        hasAnswered && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : hasAnswered && isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + opt.index)}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {hasAnswered && (
                    <span className="relative z-10 text-[11px] font-mono font-bold">
                      {opt.votePercentage}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Accordion */}
          {selectedQuizOption !== null && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
              <button
                onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                className="flex items-center justify-between w-full font-bold text-blue-600 dark:text-blue-400"
              >
                <span>{isExplanationOpen ? 'Tutup Pembahasan' : '💡 Buka Kunci Jawaban & Pembahasan'}</span>
                {isExplanationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {isExplanationOpen && (
                <div className="mt-2 p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 text-slate-700 dark:text-slate-200 border border-blue-200/50 dark:border-blue-900/50 leading-relaxed animate-in fade-in duration-200">
                  <p>{post.microQuiz.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. Verified Score Flex Card */}
      {post.verifiedScore && (
        <div className="bg-[#0B0F19] rounded-xl p-4 text-white shadow-sm border border-slate-800 mb-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-wider bg-white/10 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              Rapor Terverifikasi SKD
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

          <div className="bg-white/5 rounded-lg p-2.5 text-xs font-mono font-medium text-slate-300 flex items-center justify-between border border-white/5">
            <span>{post.verifiedScore.breakdownText}</span>
          </div>

          <button
            onClick={() => onStartExam('TRYOUT_FULL')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-sm active:scale-98"
          >
            <Swords className="w-3.5 h-3.5 text-blue-600" />
            <span>Tantang Skor Ini (Coba Tryout)</span>
          </button>
        </div>
      )}

      {/* 6. Action Bar: Murni Love (❤️) + Komentar + Simpan + Share */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
        <div className="flex items-center gap-5">
          {/* Love Button with Micro-Bounce */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-all group ${
              isLiked
                ? 'text-rose-500 font-bold'
                : 'hover:text-rose-500'
            }`}
            title={isLiked ? 'Batal Suka' : 'Suka'}
          >
            <div className={`transition-transform duration-200 ${isHeartAnimating ? 'scale-125' : ''}`}>
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover:text-rose-500'
                }`}
              />
            </div>
            <span>{likeCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            title="Diskusi"
          >
            <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span>{post.comments.length || post.commentCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Bookmark Button */}
          <button
            onClick={() => {
              if (!userProfile) {
                onRequireAuth?.('bookmark');
                return;
              }
              setIsBookmarked(!isBookmarked);
              onToggleBookmark?.(post.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-blue-600 dark:text-blue-400'
                : 'hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Soal'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative"
            title="Salin Tautan"
          >
            <Share2 className="w-4 h-4" />
            {copiedToast && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                Tersalin!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 7. Comments Accordion */}
      {isCommentsOpen && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
          {post.comments.length > 0 ? (
            <div className="space-y-2">
              {post.comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-50 dark:bg-[#0E1524] p-2.5 rounded-xl text-xs space-y-1 border border-slate-200/70 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {c.authorName}
                      </span>
                      {c.authorBadge && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {c.authorBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{c.timeAgo}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              Belum ada diskusi. Jadilah yang pertama memberikan solusi!
            </p>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis tanggapan atau cara cepatmu..."
              className="flex-1 bg-slate-50 dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {isImageZoomed && post.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={post.imageUrl}
              alt="Zoomed Question"
              className="max-h-[85vh] w-auto rounded-xl object-contain mx-auto shadow-2xl"
            />
            <p className="text-center text-white/70 text-xs mt-3">
              Klik di mana saja untuk menutup tampilan penuh
            </p>
          </div>
        </div>
      )}
    </article>
  );
};
