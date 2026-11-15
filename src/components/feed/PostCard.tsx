'use client';

import React, { useState } from 'react';
import { StreamPost, UserProfile } from '@/types';
import {
  MessageCircle,
  Share2,
  Award,
  Swords,
  Bookmark,
  Heart,
  MoreHorizontal,
  Flag,
  Link2,
  Maximize2,
} from 'lucide-react';
import { AuthTriggerReason } from '@/components/auth/AuthModal';
import { MicroQuizCard } from './MicroQuizCard';
import { PostCommentsSection } from './PostCommentsSection';

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
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const isBookmarked = externalIsBookmarked ?? false;
  const isLiked = post.isLiked ?? post.isUpvoted ?? false;
  const likeCount = post.likeCount ?? post.score ?? post.upvoteCount ?? 0;

  const handleLikeClick = () => {
    if (!userProfile) {
      onRequireAuth?.('like');
      return;
    }
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);
    onLike(post.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <article className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-3.5 sm:p-5 mb-3.5 hover:shadow-md transition-shadow">
      {/* 1. Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            onClick={() => onOpenProfile?.(post.authorId || post.authorName, post.authorName)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
          >
            {post.authorPhotoUrl ? (
              <img
                src={post.authorPhotoUrl}
                alt={post.authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              post.avatarInitial
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                onClick={() => onOpenProfile?.(post.authorId || post.authorName, post.authorName)}
                className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-none cursor-pointer hover:underline"
              >
                {post.authorName}
              </span>
              {post.authorBadge && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 truncate max-w-[120px] sm:max-w-none">
                  {post.authorBadge}
                </span>
              )}
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
            <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {post.timeAgo}
            </p>
          </div>
        </div>

        {/* Top-Right: Cashtag Chip & Options */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono max-w-[110px] sm:max-w-none truncate">
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
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
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
      <p className="text-[13px] sm:text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed mb-3 whitespace-pre-line font-normal">
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
        <MicroQuizCard
          postId={post.id}
          quiz={post.microQuiz}
          onAnswerQuiz={onAnswerQuiz}
        />
      )}

      {/* 5. Verified Score Flex Card */}
      {post.verifiedScore && (
        <div className="bg-[#0B0F19] rounded-xl p-3.5 sm:p-4 text-white shadow-sm border border-slate-800 mb-3 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-wider bg-white/10 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              Rapor Terverifikasi Criliant
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                post.verifiedScore.isPassed
                  ? 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30'
                  : 'text-amber-300 bg-amber-950/80 border-amber-500/30'
              }`}
            >
              {post.verifiedScore.isPassed ? 'LULUS TARGET' : 'PROGRES LATIHAN'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {post.verifiedScore.totalScore}
            </span>
            <span className="text-xs font-bold text-slate-400">Skor Evaluasi</span>
            <span className="text-[10px] font-bold text-amber-300 ml-auto">
              🏆 {post.verifiedScore.percentileText}
            </span>
          </div>

          <div className="bg-white/5 rounded-lg p-2.5 text-[11px] sm:text-xs font-mono font-medium text-slate-300 border border-white/5 break-words">
            <span>{post.verifiedScore.breakdownText}</span>
          </div>

          <button
            onClick={() => onStartExam('TRYOUT_FULL')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <Swords className="w-3.5 h-3.5 text-blue-600" />
            <span>Tantang Skor Ini (Coba Tryout)</span>
          </button>
        </div>
      )}

      {/* 6. Action Bar */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
        <div className="flex items-center gap-5">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-all group ${
              isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
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
          <button
            onClick={() => {
              if (!userProfile) {
                onRequireAuth?.('bookmark');
                return;
              }
              onToggleBookmark?.(post.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Soal'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

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

      {/* 7. Comments Section */}
      {isCommentsOpen && (
        <PostCommentsSection
          postId={post.id}
          comments={post.comments}
          userProfile={userProfile}
          onAddComment={onAddComment}
          onRequireAuth={onRequireAuth}
        />
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
