'use client';

import React, { useState } from 'react';
import { UserProfile, StreamPost, StudyTrack } from '@/types';
import { PostCard } from '@/components/feed/PostCard';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  UserPlus,
  UserCheck,
  Edit3,
  Target,
  ArrowLeft,
  Trophy,
  Send,
  Share2,
} from 'lucide-react';
import { AuthTriggerReason } from '@/components/auth/AuthModal';
import { CONTEST_TIER_CONFIG, getTierFromRating } from '@/data/contests';
import { BANNER_THEMES, InstagramIcon } from '@/components/profile/EditProfileModal';
import { ShareModal } from '@/components/ui/ShareModal';
import { formatUsername } from '@/utils/formatters';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  currentUser: UserProfile | null;
  targetUser?: UserProfile | null;
  posts: StreamPost[];
  bookmarkedIds: Set<string>;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onStartExam: (modeId: string) => void;
  onAnswerQuiz?: (postId: string, selectedIndex: number, isCorrect: boolean) => void;
  onReportPost?: (postId: string) => void;
  onToggleBookmark?: (postId: string) => void;
  onOpenEditProfile: () => void;
  onToggleFollow: (targetUserId: string) => void;
  onRequireAuth?: (reason: AuthTriggerReason) => void;
  onBackToFeed: () => void;
  onGoToArena?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  targetUser,
  posts,
  bookmarkedIds,
  onLike,
  onAddComment,
  onStartExam,
  onAnswerQuiz,
  onReportPost,
  onToggleBookmark,
  onOpenEditProfile,
  onToggleFollow,
  onRequireAuth,
  onBackToFeed,
  onGoToArena,
}) => {
  // If not viewing someone else's public profile and not logged in, enforce authentication
  if (!targetUser && !currentUser) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center mx-auto text-2xl">
          👤
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Akses Profil Pejuang
          </h1>
          <p className="text-sm sm:text-[15px] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Masuk atau daftarkan akunmu untuk menyimpan riwayat kuis, mencatat rapor simulasi CAT, dan mengumpulkan ELO rating.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => (onRequireAuth ? onRequireAuth('general') : null)}
            className="w-full h-11 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Masuk / Daftar
          </button>
          <button
            type="button"
            onClick={onBackToFeed}
            className="w-full h-11 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors"
          >
            Kembali ke Feed
          </button>
        </div>
      </div>
    );
  }

  const profileToDisplay: UserProfile = (targetUser || currentUser)!;

  const isSelf = currentUser?.id === profileToDisplay.id;
  const isFollowing = currentUser?.followingIds?.includes(profileToDisplay.id) ?? false;

  const [activeTab, setActiveTab] = useState<'posts' | 'quiz' | 'bookmarks' | 'rating'>('posts');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const profilePosts = posts.filter(
    (p) => p.authorName.toLowerCase() === profileToDisplay.name.toLowerCase() || p.authorId === profileToDisplay.id
  );
  const profileQuizzes = profilePosts.filter((p) => p.microQuiz !== null);
  const bookmarkedPosts = posts.filter((p) => bookmarkedIds.has(p.id));
  const totalHeartsReceived = profilePosts.reduce((acc, p) => acc + (p.likeCount ?? p.score ?? 0), 0);

  const rating = profileToDisplay.contestRating ?? 1500;
  const tierInfo = CONTEST_TIER_CONFIG[getTierFromRating(rating)];
  const ratingHistory = profileToDisplay.ratingHistory || [];

  const bannerGradient =
    BANNER_THEMES[profileToDisplay.bannerTheme || 'default']?.class || BANNER_THEMES.default.class;

  return (
    <div className="space-y-5 max-w-4xl xl:max-w-5xl w-full mx-auto pb-12">
      {/* Back Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToFeed}
          className="h-9 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-2 -ml-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Feed</span>
        </button>
      </div>

      {/* Hero Card: Profile */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 overflow-hidden transition-colors">
        <div className={`h-28 sm:h-36 bg-gradient-to-r ${bannerGradient} relative p-4 sm:p-5 flex justify-between items-start`}>
          <span className="bg-black/25 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg border border-white/15">
            {profileToDisplay.studyTrack === 'snbt'
              ? 'SNBT UTBK 2026'
              : profileToDisplay.studyTrack === 'kedinasan'
                ? 'SPMB Kedinasan'
                : 'SKD BKN 2026'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-xl flex items-center justify-center transition-colors"
              title="Bagikan Profil"
              aria-label="Bagikan Profil"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {isSelf ? (
              <button
                type="button"
                onClick={onOpenEditProfile}
                className="h-9 bg-white/95 hover:bg-white text-slate-900 text-xs sm:text-sm font-semibold px-3.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profil</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onRequireAuth?.('general');
                    return;
                  }
                  onToggleFollow(profileToDisplay.id);
                }}
                className={`h-9 text-xs sm:text-sm font-semibold px-4 rounded-xl transition-colors flex items-center gap-1.5 ${
                  isFollowing
                    ? 'bg-white/95 text-slate-800 hover:bg-white'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Mengikuti</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Ikuti</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Identity & Avatar Section */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          <div className="flex justify-between items-end -mt-10 sm:-mt-12 mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#2563EB] border-4 border-white dark:border-[#111726] text-white font-bold text-2xl flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              {profileToDisplay.avatarPhotoUrl ? (
                <img
                  src={profileToDisplay.avatarPhotoUrl}
                  alt={profileToDisplay.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                profileToDisplay.avatarInitial
              )}
            </div>

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 border ${
                profileToDisplay.isCompetenceVerified
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800'
              }`}
            >
              {profileToDisplay.isCompetenceVerified ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Terverifikasi</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Perlu Verifikasi</span>
                </>
              )}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate max-w-[300px] sm:max-w-[440px]"
                title={profileToDisplay.name}
              >
                {profileToDisplay.name}
              </h1>
              {profileToDisplay.highestExamScore && profileToDisplay.highestExamScore >= 450 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400">
                  Top Scorer
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
              @{formatUsername(profileToDisplay.username, profileToDisplay.name)}
            </p>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 pt-0.5">
              <Target className="w-4 h-4 text-[#2563EB] dark:text-blue-400 flex-shrink-0" />
              <span>Target: {profileToDisplay.targetAgency}</span>
            </p>

            <p className="text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
              {profileToDisplay.bio || 'Pejuang konsisten yang sedang mempersiapkan diri menghadapi seleksi nasional bersama Criliant.'}
            </p>

            {/* Social Handles */}
            {(profileToDisplay.telegramUsername || profileToDisplay.instagramUsername) && (
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                {profileToDisplay.telegramUsername && (
                  <a
                    href={`https://t.me/${profileToDisplay.telegramUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:underline"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-500" />
                    <span>t.me/{profileToDisplay.telegramUsername.replace('@', '')}</span>
                  </a>
                )}
                {profileToDisplay.instagramUsername && (
                  <a
                    href={`https://instagram.com/${profileToDisplay.instagramUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:underline"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                    <span>@{profileToDisplay.instagramUsername.replace('@', '')}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Followers & Streak Row */}
          <div className="flex items-center gap-5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm flex-wrap tabular-nums">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white">
                {profileToDisplay.followersCount ?? 0}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Pengikut</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white">
                {profileToDisplay.followingIds?.length ?? profileToDisplay.followingCount ?? 0}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Mengikuti</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-amber-600 dark:text-amber-400 font-semibold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{profileToDisplay.streakDays} Hari Streak</span>
            </div>
          </div>

          {/* 4 Study Dossier Metrics (>=12px floor, Tabular Numerals) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ELO Rating
              </p>
              <p className="text-xl font-bold text-[#2563EB] dark:text-blue-400 mt-1 tabular-nums">
                {rating}
              </p>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                {tierInfo.label}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Skor Terbaik</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                {profileToDisplay.highestExamScore ?? 0}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                Simulasi terbaik
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Soal Selesai</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                {profileToDisplay.quizzesSolvedCount ?? 0}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                Total terjawab
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Apresiasi</p>
              <p className="text-xl font-bold text-rose-500 mt-1 tabular-nums">
                {totalHeartsReceived}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                Total Love
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 p-1.5 flex gap-1 text-sm select-none overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex-1 min-w-[105px] h-10 px-3 font-semibold rounded-xl transition-colors text-center whitespace-nowrap tabular-nums ${
            activeTab === 'posts'
              ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Postingan ({profilePosts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[105px] h-10 px-3 font-semibold rounded-xl transition-colors text-center whitespace-nowrap tabular-nums ${
            activeTab === 'quiz'
              ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Kuis ({profileQuizzes.length})
        </button>

        {isSelf && (
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 min-w-[110px] h-10 px-3 font-semibold rounded-xl transition-colors text-center whitespace-nowrap tabular-nums ${
              activeTab === 'bookmarks'
                ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Disimpan ({bookmarkedPosts.length})
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('rating')}
          className={`flex-1 min-w-[115px] h-10 px-3 font-semibold rounded-xl transition-colors text-center whitespace-nowrap tabular-nums ${
            activeTab === 'rating'
              ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Rating ({ratingHistory.length})
        </button>
      </div>

      {/* Feed List Render */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          profilePosts.length > 0 ? (
            profilePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userProfile={currentUser}
                onLike={onLike}
                onAddComment={onAddComment}
                onStartExam={onStartExam}
                onAnswerQuiz={onAnswerQuiz}
                onReportPost={onReportPost}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.has(post.id)}
                onRequireAuth={onRequireAuth}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 text-center text-sm text-slate-400">
              Belum ada postingan trik materi yang dibagikan.
            </div>
          )
        )}

        {activeTab === 'quiz' && (
          profileQuizzes.length > 0 ? (
            profileQuizzes.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userProfile={currentUser}
                onLike={onLike}
                onAddComment={onAddComment}
                onStartExam={onStartExam}
                onAnswerQuiz={onAnswerQuiz}
                onReportPost={onReportPost}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.has(post.id)}
                onRequireAuth={onRequireAuth}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 text-center text-sm text-slate-400">
              Belum ada kuis mikro yang dibuat oleh profil ini.
            </div>
          )
        )}

        {activeTab === 'bookmarks' && (
          bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userProfile={currentUser}
                onLike={onLike}
                onAddComment={onAddComment}
                onStartExam={onStartExam}
                onAnswerQuiz={onAnswerQuiz}
                onReportPost={onReportPost}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={true}
                onRequireAuth={onRequireAuth}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 text-center text-sm text-slate-400">
              Belum ada soal atau trik yang kamu simpan.
            </div>
          )
        )}

        {/* Rating History Sub-Tab */}
        {activeTab === 'rating' && (
          <div className="bg-white dark:bg-[#111726] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Riwayat Rating Kontes
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Perkembangan ELO Rating dari Weekly Grand Prix &amp; Night Clash
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-2xl font-bold text-amber-500 tabular-nums">{rating}</span>
                <span className="text-xs text-slate-500 block font-medium">{tierInfo.label}</span>
              </div>
            </div>

            {ratingHistory.length > 0 ? (
              <div className="space-y-2.5 pt-2">
                {ratingHistory.map((item, idx) => (
                  <div
                    key={`${item.contestId}_${idx}`}
                    className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-slate-400 block">{item.date}</span>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white mt-0.5 truncate">
                        {item.contestTitle}
                      </h4>
                      <span className="text-xs text-slate-500 tabular-nums">
                        Peringkat #{item.rank} dari {item.totalParticipants.toLocaleString('id-ID')} peserta
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 tabular-nums">
                      <span
                        className={`text-sm font-bold block ${
                          item.deltaRating >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-500'
                        }`}
                      >
                        {item.deltaRating >= 0 ? `+${item.deltaRating}` : item.deltaRating} ELO
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Skor {item.score} · {item.newRating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Belum ada riwayat pertandingan kontes
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5 px-4">
                    Ikuti Weekly Contest atau Night Clash di Arena untuk mendapatkan ELO Rating pertamamu.
                  </p>
                </div>
                {onGoToArena && (
                  <button
                    type="button"
                    onClick={onGoToArena}
                    className="h-10 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Buka Arena Kontes
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Share Profile Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Bagikan Profil Pejuang"
        shareUrl={
          typeof window !== 'undefined'
            ? `${window.location.origin}/?pejuang=${formatUsername(profileToDisplay.username, profileToDisplay.name)}`
            : ''
        }
        shareText={`Profil Pejuang: ${profileToDisplay.name} (@${formatUsername(profileToDisplay.username, profileToDisplay.name)}) - Target: ${profileToDisplay.targetAgency} | Belajar bareng di Criliant!`}
        previewAuthor={`${profileToDisplay.name} (@${formatUsername(profileToDisplay.username, profileToDisplay.name)})`}
        previewDetails={`Target: ${profileToDisplay.targetAgency} • ${profileToDisplay.streakDays} Hari Streak • ELO Rating: ${rating}`}
      />
    </div>
  );
};
