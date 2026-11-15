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
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center mx-auto text-2xl shadow-inner">
          👤
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Akses Profil Pejuang
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Masuk atau daftarkan akunmu untuk menyimpan riwayat kuis, mencatat rapor resmi simulasi CAT, mengumpulkan ELO rating, dan berinteraksi di feed.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-xs mx-auto">
          <button
            onClick={() => (onRequireAuth ? onRequireAuth('general') : null)}
            className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            Masuk / Daftar Akun
          </button>
          <button
            onClick={onBackToFeed}
            className="w-full py-3 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all"
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
    <div className="space-y-4 max-w-4xl xl:max-w-5xl w-full mx-auto pb-12">
      {/* Back to Feed Button */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onBackToFeed}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Feed</span>
        </button>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Profil Pejuang
        </span>
      </div>

      {/* Hero Card: ID Card Pejuang */}
      <div className="bg-white dark:bg-[#111726] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className={`h-24 sm:h-32 bg-gradient-to-r ${bannerGradient} relative p-4 flex justify-between items-start transition-all`}>
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
            {profileToDisplay.studyTrack === 'snbt'
              ? '🎓 SNBT UTBK 2026'
              : profileToDisplay.studyTrack === 'kedinasan'
                ? '🛡️ SPMB Kedinasan'
                : '🏛️ SKD BKN 2026'}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="bg-white/80 hover:bg-white text-slate-800 p-1.5 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center"
              title="Bagikan Profil"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {isSelf ? (
              <button
                onClick={onOpenEditProfile}
                className="bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profil</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!currentUser) {
                    onRequireAuth?.('general');
                    return;
                  }
                  onToggleFollow(profileToDisplay.id);
                }}
                className={`text-xs font-bold px-4 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 ${
                  isFollowing
                    ? 'bg-white/90 text-slate-800 hover:bg-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Mengikuti</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Ikuti</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Identity & Avatar Section */}
        <div className="px-4 sm:px-5 pb-5 pt-0 relative">
          <div className="flex justify-between items-end -mt-9 sm:-mt-12 mb-3">
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 border-4 border-white dark:border-[#111726] text-white font-black text-2xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
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

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 border ${
                  profileToDisplay.isCompetenceVerified
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800'
                }`}
              >
                {profileToDisplay.isCompetenceVerified ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Human</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Perlu PoC</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h2
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-[420px]"
                title={profileToDisplay.name}
              >
                {profileToDisplay.name}
              </h2>
              {profileToDisplay.highestExamScore && profileToDisplay.highestExamScore >= 450 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 flex-shrink-0">
                  🏆 Top Scorer
                </span>
              )}
              {profileToDisplay.dailyGoalQuestions && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 flex-shrink-0">
                  🎯 Target {profileToDisplay.dailyGoalQuestions} Soal/Hari
                </span>
              )}
            </div>

            <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold mt-0.5 truncate">
              @{formatUsername(profileToDisplay.username, profileToDisplay.name)}
            </p>

            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Target: {profileToDisplay.targetAgency}</span>
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-normal">
              {profileToDisplay.bio || 'Pejuang konsisten yang sedang mempersiapkan diri menghadapi seleksi nasional bersama Criliant.'}
            </p>

            {/* Social Handles if Present */}
            {(profileToDisplay.telegramUsername || profileToDisplay.instagramUsername) && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {profileToDisplay.telegramUsername && (
                  <a
                    href={`https://t.me/${profileToDisplay.telegramUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/50 hover:underline"
                  >
                    <Send className="w-3 h-3" />
                    <span>t.me/{profileToDisplay.telegramUsername.replace('@', '')}</span>
                  </a>
                )}
                {profileToDisplay.instagramUsername && (
                  <a
                    href={`https://instagram.com/${profileToDisplay.instagramUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-200/50 hover:underline"
                  >
                    <InstagramIcon className="w-3 h-3" />
                    <span>@{profileToDisplay.instagramUsername.replace('@', '')}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Followers & Streak Row */}
          <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 dark:text-white">
                {profileToDisplay.followersCount ?? 0}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Pengikut</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 dark:text-white">
                {profileToDisplay.followingIds?.length ?? profileToDisplay.followingCount ?? 0}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Mengikuti</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-amber-500 font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{profileToDisplay.streakDays} Hari Streak</span>
            </div>
          </div>

          {/* 4 Study Dossier Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-900/50 text-center">
              <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <span>{tierInfo.icon}</span> ELO Rating
              </p>
              <p className="text-base font-black text-indigo-700 dark:text-indigo-300 mt-0.5">
                {rating}
              </p>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                {tierInfo.label}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Skor Terbaik</p>
              <p className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {profileToDisplay.highestExamScore ?? 0}
              </p>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block">
                Simulasi Terbaik
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Soal Selesai</p>
              <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {profileToDisplay.quizzesSolvedCount ?? 0}
              </p>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block">
                Proof of Comp.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Apresiasi</p>
              <p className="text-base font-black text-rose-500 mt-0.5">
                ❤️ {totalHeartsReceived}
              </p>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block">
                Total Love
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Tabs on Mobile */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-1.5 flex gap-1 text-xs select-none overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 min-w-[92px] py-2 px-2 font-bold rounded-xl transition-all text-center whitespace-nowrap ${
            activeTab === 'posts'
              ? 'bg-slate-100 dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Postingan ({profilePosts.length})
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[92px] py-2 px-2 font-bold rounded-xl transition-all text-center whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-slate-100 dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Kuis Mikro ({profileQuizzes.length})
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 min-w-[96px] py-2 px-2 font-bold rounded-xl transition-all text-center whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'bg-slate-100 dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Disimpan ({bookmarkedPosts.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('rating')}
          className={`flex-1 min-w-[110px] py-2 px-2 font-bold rounded-xl transition-all text-center whitespace-nowrap ${
            activeTab === 'rating'
              ? 'bg-slate-100 dark:bg-[#162137] text-amber-500 dark:text-amber-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          🏆 Rating ({ratingHistory.length})
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
            <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
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
            <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
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
            <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
              Belum ada soal atau trik yang kamu simpan. Tekan ikon bookmark di feed untuk menyimpan materi penting!
            </div>
          )
        )}

        {/* Real Rating History Sub-Tab */}
        {activeTab === 'rating' && (
          <div className="bg-white dark:bg-[#111726] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>👑</span> Riwayat Rating Kontes Resmi
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Perkembangan ELO Rating dari Weekly Grand Prix & Night Clash
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xl font-black text-amber-500">{rating}</span>
                <span className="text-[10px] text-slate-400 block font-bold">{tierInfo.label}</span>
              </div>
            </div>

            {ratingHistory.length > 0 ? (
              <div className="space-y-2 pt-2">
                {ratingHistory.map((item, idx) => (
                  <div
                    key={`${item.contestId}_${idx}`}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 block">{item.date}</span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5 truncate">
                        {item.contestTitle}
                      </h5>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Peringkat #{item.rank} dari {item.totalParticipants.toLocaleString('id-ID')} Peserta
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-xs font-black block ${
                          item.deltaRating >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-500'
                        }`}
                      >
                        {item.deltaRating >= 0 ? `+${item.deltaRating}` : item.deltaRating} ELO
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Skor: {item.score} • ELO {item.newRating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Belum ada riwayat pertandingan kontes
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 px-4">
                    Ikuti Weekly Contest atau Night Clash di Arena untuk mendapatkan perubahan ELO Rating pertamamu!
                  </p>
                </div>
                {onGoToArena && (
                  <button
                    onClick={onGoToArena}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
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
