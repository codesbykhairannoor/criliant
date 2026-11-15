'use client';

import React from 'react';
import { StudyTrack, UserProfile, StreamPost } from '@/types';
import { FeedHeader } from '@/components/feed/FeedHeader';
import { DailyFlashBites } from '@/components/feed/DailyFlashBites';
import { CreatePostBox } from '@/components/feed/CreatePostBox';
import { PostCard } from '@/components/feed/PostCard';
import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface FeedStageProps {
  activeTrack: StudyTrack;
  setActiveTrack: (track: StudyTrack) => void;
  feedCategoryTab: string;
  setFeedCategoryTab: (tab: string) => void;
  selectedCashtag: string;
  setSelectedCashtag: (tag: string) => void;
  userProfile: UserProfile | null;
  filteredPosts: StreamPost[];
  bookmarkedIds: Set<string>;
  onAddPost: (post: StreamPost) => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onStartExam: (modeOrPackageId: string) => void;
  onAnswerQuiz: (postId: string, selectedIndex: number, isCorrect: boolean) => void;
  onReportPost: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onRequireAuth: (reason: AuthTriggerReason) => void;
  onToggleFollow: (authorId: string) => void;
  onOpenProfile: (authorId: string, authorName: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const FeedStage: React.FC<FeedStageProps> = ({
  activeTrack,
  setActiveTrack,
  feedCategoryTab,
  setFeedCategoryTab,
  selectedCashtag,
  setSelectedCashtag,
  userProfile,
  filteredPosts,
  bookmarkedIds,
  onAddPost,
  onLike,
  onAddComment,
  onStartExam,
  onAnswerQuiz,
  onReportPost,
  onToggleBookmark,
  onRequireAuth,
  onToggleFollow,
  onOpenProfile,
  searchQuery = '',
  onClearSearch,
}) => {
  return (
    <>
      {/* 1. Course Switcher & Category Tabs */}
      <FeedHeader
        activeTab={feedCategoryTab}
        setActiveTab={setFeedCategoryTab}
        selectedCashtag={selectedCashtag}
        setSelectedCashtag={setSelectedCashtag}
        activeTrack={activeTrack}
        setActiveTrack={setActiveTrack}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
      />

      {/* 2. Daily Flash Bites (3 Kapsul Tantangan Cepat Hari Ini) */}
      <DailyFlashBites
        activeTrack={activeTrack}
        onStartExam={onStartExam}
      />

      {/* 3. Create Post / Compose Box */}
      <CreatePostBox
        userProfile={userProfile}
        activeTrack={activeTrack}
        onAddPost={onAddPost}
        onRequireAuth={onRequireAuth}
      />

      {/* 4. Feed Stream Cards */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const authorId = post.authorId || post.authorName;
            const isFollowingAuthor = userProfile?.followingIds?.includes(authorId) ?? false;

            return (
              <PostCard
                key={post.id}
                post={post}
                userProfile={userProfile}
                onLike={onLike}
                onAddComment={onAddComment}
                onStartExam={onStartExam}
                onAnswerQuiz={onAnswerQuiz}
                onReportPost={onReportPost}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.has(post.id)}
                onRequireAuth={onRequireAuth}
                onToggleFollow={onToggleFollow}
                onOpenProfile={onOpenProfile}
                isFollowingAuthor={isFollowingAuthor}
              />
            );
          })
        ) : (
          <div className="text-center py-16 px-4 space-y-3 bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto font-black text-xl">
              #
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Belum ada materi untuk kamar {activeTrack.toUpperCase()} ({selectedCashtag})
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Jadilah pejuang pertama yang memulai diskusi atau membagikan kuis mikro untuk topik ini!
            </p>
            <button
              onClick={() => setSelectedCashtag('#Semua')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Kembali ke Semua Postingan
            </button>
          </div>
        )}
      </div>
    </>
  );
};
