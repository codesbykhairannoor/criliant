'use client';

import React, { useState } from 'react';
import { UserProfile, StreamPost, StudyTrack } from '@/types';
import { PostCard } from '@/components/feed/PostCard';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Award,
  BookOpen,
  Heart,
  UserPlus,
  UserCheck,
  Edit3,
  Calendar,
  Target,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  currentUser: UserProfile | null;
  targetUser?: UserProfile | null; // Profile being viewed (can be self or another creator)
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
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
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
}) => {
  // If targetUser is null, view self profile
  const profileToDisplay = targetUser || currentUser || {
    id: 'guest_user',
    name: 'Pejuang Tamu',
    targetAgency: 'Kementerian Keuangan (DJP)',
    avatarInitial: 'P',
    bio: 'Pejuang NIP 2026. Belajar konsisten bersama ribuan pejuang lainnya di Criliant! 🎯',
    streakDays: 1,
    studyTrack: 'cpns' as StudyTrack,
    quizzesSolvedCount: 0,
    isCompetenceVerified: false,
    reputationKarma: 10,
    followersCount: 142,
    followingCount: 28,
    followingIds: [],
    highestExamScore: 485,
  };

  const isSelf = currentUser?.id === profileToDisplay.id;
  const isFollowing = currentUser?.followingIds?.includes(profileToDisplay.id) ?? false;

  const [activeTab, setActiveTab] = useState<'posts' | 'quiz' | 'bookmarks'>('posts');

  // Filter posts created by this profile
  const profilePosts = posts.filter(
    (p) => p.authorName.toLowerCase() === profileToDisplay.name.toLowerCase() || p.authorId === profileToDisplay.id
  );

  const profileQuizzes = profilePosts.filter((p) => p.microQuiz !== null);

  const bookmarkedPosts = posts.filter((p) => bookmarkedIds.has(p.id));

  const totalHeartsReceived = profilePosts.reduce((acc, p) => acc + (p.likeCount || p.score || 0), 0);

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
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
        {/* Dynamic Gradient Banner */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative p-4 flex justify-between items-start">
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
            {profileToDisplay.studyTrack === 'snbt' ? '🎓 SNBT UTBK 2026' : profileToDisplay.studyTrack === 'kedinasan' ? '🛡️ SPMB Kedinasan' : '🏛️ SKD BKN 2026'}
          </span>

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

        {/* Identity & Avatar Section */}
        <div className="px-5 pb-5 pt-0 relative">
          <div className="flex justify-between items-end -mt-10 sm:-mt-12 mb-3">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 border-4 border-white dark:border-[#111726] text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {profileToDisplay.avatarInitial}
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
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {profileToDisplay.name}
              </h2>
              {profileToDisplay.highestExamScore && profileToDisplay.highestExamScore >= 450 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50">
                  🏆 Top Scorer
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Target: {profileToDisplay.targetAgency}</span>
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-normal">
              {profileToDisplay.bio || 'Pejuang konsisten yang sedang mempersiapkan diri menghadapi seleksi nasional bersama Criliant.'}
            </p>
          </div>

          {/* Followers & Following Row */}
          <div className="flex items-center gap-6 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <span className="font-black text-slate-900 dark:text-white">
                {profileToDisplay.followersCount || 142}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Pengikut</span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <span className="font-black text-slate-900 dark:text-white">
                {profileToDisplay.followingCount || (profileToDisplay.followingIds?.length || 24)}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Mengikuti</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-amber-500 font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{profileToDisplay.streakDays} Hari Streak</span>
            </div>
          </div>

          {/* 3 Study Dossier Metrics */}
          <div className="grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skor Terbaik</p>
              <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {profileToDisplay.highestExamScore || 485} SKD
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Soal Terjawab</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {profileToDisplay.quizzesSolvedCount || 14} Soal
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-[#0D1322] rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Apresiasi</p>
              <p className="text-sm font-black text-rose-500 mt-0.5">
                ❤️ {totalHeartsReceived || 428}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Feed Filter Tabs */}
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-1.5 flex gap-1 text-xs select-none">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 font-bold rounded-xl transition-all text-center ${
            activeTab === 'posts'
              ? 'bg-slate-100 dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Postingan ({profilePosts.length})
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2 font-bold rounded-xl transition-all text-center ${
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
            className={`flex-1 py-2 font-bold rounded-xl transition-all text-center ${
              activeTab === 'bookmarks'
                ? 'bg-slate-100 dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Disimpan ({bookmarkedPosts.length})
          </button>
        )}
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
      </div>
    </div>
  );
};
