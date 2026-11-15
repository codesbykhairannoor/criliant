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
import { ShareModal } from '@/components/ui/ShareModal';
import { formatCompactTime, formatUsername } from '@/utils/formatters';

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
    setIsShareModalOpen(true);
  };

  return (
    <article className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 p-4 sm:p-5 transition-colors">
      {/* 1. Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onOpenProfile?.(post.authorId || post.authorName, post.authorName)}
            className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-semibold text-sm flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity overflow-hidden"
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
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <button
                type="button"
                onClick={() => onOpenProfile?.(post.authorId || post.authorName, post.authorName)}
                className="font-bold text-[15px] text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-[220px] hover:underline text-left"
                title={post.authorName}
              >
                {post.authorName}
              </button>
              <span
                onClick={() => onOpenProfile?.(post.authorId || post.authorName, post.authorName)}
                className="text-sm text-slate-500 dark:text-slate-400 font-normal truncate max-w-[110px] sm:max-w-[150px] cursor-pointer hover:underline"
                title={`@${formatUsername(post.authorUsername, post.authorName)}`}
              >
                @{formatUsername(post.authorUsername, post.authorName)}
              </span>
              <span className="text-slate-300 dark:text-slate-600 text-xs flex-shrink-0">·</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-normal flex-shrink-0 tabular-nums">
                {formatCompactTime(post.createdAt || post.timeAgo)}
              </span>
              {userProfile?.name.toLowerCase() !== post.authorName.toLowerCase() && onToggleFollow && (
                <button
                  type="button"
                  onClick={() => onToggleFollow(post.authorId || post.authorName)}
                  className={`text-[13px] font-semibold px-2 py-0.5 rounded-lg transition-colors flex-shrink-0 ${
                    isFollowingAuthor
                      ? 'text-slate-500 bg-slate-100 dark:bg-slate-800 hover:text-rose-500'
                      : 'text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/15'
                  }`}
                >
                  {isFollowingAuthor ? 'Mengikuti' : 'Ikuti'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Top-Right: Cashtag Chip & Options */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-[#2563EB] dark:text-blue-400 max-w-[130px] sm:max-w-none truncate">
            {post.cashtag}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              title="Opsi Postingan"
              aria-label="Opsi Postingan"
            >
              <MoreHorizontal className="w-[18px] h-[18px]" strokeWidth={1.85} />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-50 w-52 bg-white dark:bg-[#162137] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-sm text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsShareModalOpen(true);
                    }}
                    className="w-full h-10 px-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                  >
                    <Share2 className="w-4 h-4 text-blue-500" />
                    <span>Bagikan Postingan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        const url = typeof window !== 'undefined' ? `${window.location.origin}/?post=${post.id}` : '';
                        navigator.clipboard.writeText(url);
                        setCopiedToast(true);
                        setTimeout(() => setCopiedToast(false), 2000);
                      }
                    }}
                    className="w-full h-10 px-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                  >
                    <Link2 className="w-4 h-4 text-slate-400" />
                    <span>Salin Tautan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (!userProfile) {
                        onRequireAuth?.('general');
                        return;
                      }
                      onReportPost?.(post.id, 'soal_keliru');
                    }}
                    className="w-full h-10 px-3.5 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2.5 font-medium"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Laporkan Soal</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Text Content (Crisp 15px-16px Readable Copy) */}
      <p className="text-[15px] sm:text-base text-slate-800 dark:text-slate-100 leading-[1.6] mb-3.5 whitespace-pre-line font-normal">
        {post.content}
      </p>

      {/* 3. Image (if attached) */}
      {post.imageUrl && (
        <div
          className="mb-3.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] relative group cursor-pointer"
          onClick={() => setIsImageZoomed(true)}
        >
          <img
            src={post.imageUrl}
            alt="Foto Soal Terlampir"
            className="w-full max-h-80 object-cover object-top hover:scale-[1.01] transition-transform"
          />
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" />
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
        <div className="bg-slate-900 dark:bg-[#0D1322] rounded-2xl p-4 sm:p-5 text-white border border-slate-800 mb-3.5 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Rapor Terverifikasi
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                post.verifiedScore.isPassed
                  ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                  : 'text-amber-300 bg-amber-950/60 border-amber-500/30'
              }`}
            >
              {post.verifiedScore.isPassed ? 'Lulus Target' : 'Progres Latihan'}
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-3xl font-bold tracking-tight text-white tabular-nums">
              {post.verifiedScore.totalScore}
            </span>
            <span className="text-sm font-medium text-slate-400">Skor Evaluasi</span>
            <span className="text-xs font-semibold text-amber-300 ml-auto">
              {post.verifiedScore.percentileText}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 border border-white/10 break-words tabular-nums">
            <span>{post.verifiedScore.breakdownText}</span>
          </div>

          <button
            type="button"
            onClick={() => onStartExam('TRYOUT_FULL')}
            className="w-full h-10 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4 text-[#2563EB]" />
            <span>Tantang Skor Ini (Coba Tryout)</span>
          </button>
        </div>
      )}

      {/* 6. Action Bar (Standard Touch Targets & Readable Counts) */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/90 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={handleLikeClick}
            className={`h-9 px-2 -ml-2 rounded-xl flex items-center gap-2 text-[13px] font-medium tabular-nums transition-colors group ${
              isLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500 hover:bg-rose-50/60 dark:hover:bg-rose-950/30'
            }`}
            title={isLiked ? 'Batal Suka' : 'Suka'}
          >
            <div className={`transition-transform duration-200 ${isHeartAnimating ? 'scale-125' : ''}`}>
              <Heart
                className={`w-[18px] h-[18px] transition-colors ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover:text-rose-500'
                }`}
                strokeWidth={1.85}
              />
            </div>
            <span>{likeCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="h-9 px-2 rounded-xl flex items-center gap-2 text-[13px] font-medium tabular-nums hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-colors group"
            title="Diskusi"
          >
            <MessageCircle className="w-[18px] h-[18px] text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors" strokeWidth={1.85} />
            <span>{post.comments.length || post.commentCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (!userProfile) {
                onRequireAuth?.('bookmark');
                return;
              }
              onToggleBookmark?.(post.id);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isBookmarked
                ? 'text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15'
                : 'hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Soal'}
            aria-label={isBookmarked ? 'Hapus Simpanan' : 'Simpan Soal'}
          >
            <Bookmark className={`w-[18px] h-[18px] ${isBookmarked ? 'fill-current' : ''}`} strokeWidth={1.85} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Bagikan Postingan"
            aria-label="Bagikan Postingan"
          >
            <Share2 className="w-[18px] h-[18px]" strokeWidth={1.85} />
            {copiedToast && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-900 text-white font-semibold px-2.5 py-1 rounded-lg shadow whitespace-nowrap">
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

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Bagikan Postingan"
        shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/?post=${post.id}` : ''}
        shareText={`[${post.cashtag}] ${post.content.slice(0, 100)}... - Diskusi di Criliant`}
        previewAuthor={`${post.authorName} (@${formatUsername(post.authorUsername, post.authorName)})`}
        previewDetails={post.content}
      />
    </article>
  );
};
