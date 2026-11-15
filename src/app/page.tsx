'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { StudyTrack } from '@/types';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileTopHeader } from '@/components/layout/MobileTopHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { FeedStage } from '@/components/feed/FeedStage';
import { ProfileView } from '@/components/profile/ProfileView';
import { ArenaView } from '@/components/arena/ArenaView';
import { ExamModal } from '@/components/exam/ExamModal';
import { ExamResultModal } from '@/components/exam/ExamResultModal';
import { BankModal } from '@/components/bank/BankModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { AuthModal, AuthTriggerReason } from '@/components/auth/AuthModal';
import { ReportModal } from '@/components/modals/ReportModal';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { useCriliantStore } from '@/hooks/useCriliantStore';
import { useExamController } from '@/hooks/useExamController';

export default function HomePage() {
  const [activeTrack, setActiveTrack] = useState<StudyTrack>('cpns');
  const [currentNavTab, setCurrentNavTab] = useState<string>('feed');
  const [feedCategoryTab, setFeedCategoryTab] = useState<string>('all');
  const [selectedCashtag, setSelectedCashtag] = useState<string>('#Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<AuthTriggerReason>('general');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankInitialGroup, setBankInitialGroup] = useState<string>('SEMUA');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);

  const openAuthModal = useCallback((reason: AuthTriggerReason = 'general') => {
    setAuthTriggerReason(reason);
    setIsAuthModalOpen(true);
  }, []);

  const navigateToProfile = useCallback(() => {
    setCurrentNavTab('profile');
  }, []);

  const store = useCriliantStore(activeTrack, setActiveTrack, openAuthModal, navigateToProfile);

  const exam = useExamController(
    activeTrack,
    store.allQuestions,
    store.userProfile,
    store.recordExamCompletion,
    store.showToast
  );

  const handleNavAction = useCallback(
    (tab: string) => {
      if (tab === 'bank') {
        setBankInitialGroup('SEMUA');
        setIsBankModalOpen(true);
        return;
      }
      if (tab === 'bookmarks') {
        if (!store.userProfile) {
          openAuthModal('bookmark');
          return;
        }
        setBankInitialGroup('BOOKMARKS');
        setIsBankModalOpen(true);
        return;
      }
      setIsBankModalOpen(false);
      setCurrentNavTab(tab);
      if (tab === 'profile') {
        store.setViewingProfileUser(store.userProfile);
      }
    },
    [store, openAuthModal]
  );

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return store.posts.filter((post) => {
      if (post.track !== activeTrack) return false;
      if (feedCategoryTab === 'following') {
        const followingList = store.userProfile?.followingIds || [];
        const isAuthorFollowed =
          followingList.includes(post.authorId || '') || followingList.includes(post.authorName);
        if (!isAuthorFollowed) return false;
      }
      if (feedCategoryTab === 'quiz' && !post.microQuiz) return false;
      if (feedCategoryTab === 'flex' && !post.verifiedScore) return false;

      if (selectedCashtag !== '#Semua' && !selectedCashtag.includes('Trending')) {
        const pureTag = selectedCashtag.replace('$', '');
        if (!post.cashtag.includes(pureTag) && !post.content.includes(pureTag)) return false;
      }

      if (query) {
        const haystack = `${post.authorName} ${post.cashtag} ${post.content} ${
          post.microQuiz?.questionText || ''
        }`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [store.posts, store.userProfile, activeTrack, feedCategoryTab, selectedCashtag, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col md:flex-row transition-colors relative">
      {/* MOBILE TOP HEADER (Search, Theme Toggle, Profile/Auth) */}
      <MobileTopHeader
        activeTrack={activeTrack}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userProfile={store.userProfile}
        onOpenAuthModal={openAuthModal}
        onOpenProfile={() => handleNavAction('profile')}
        onGoHome={() => {
          setCurrentNavTab('feed');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 1. LEFT SIDEBAR (Desktop/Tablet) */}
      <LeftSidebar
        currentTab={isBankModalOpen ? (bankInitialGroup === 'BOOKMARKS' ? 'bookmarks' : 'bank') : currentNavTab}
        setCurrentTab={handleNavAction}
        activeTrack={activeTrack}
        setActiveTrack={setActiveTrack}
        userProfile={store.userProfile}
        totalQuestionsCount={store.allQuestions.length}
        onOpenCreatePost={() => {
          if (!store.userProfile) {
            openAuthModal('post');
            return;
          }
          setCurrentNavTab('feed');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartExam={exam.handleStartExam}
        onOpenEditProfile={() => {
          if (!store.userProfile) openAuthModal('general');
          else setIsEditProfileModalOpen(true);
        }}
        onOpenAuthModal={openAuthModal}
        onLogout={store.handleLogout}
      />

      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 flex justify-center min-h-screen overflow-x-hidden">
        <div className="w-full max-w-[960px] xl:max-w-[1020px] flex justify-center min-h-screen">
          <main className="w-full max-w-[620px] xl:max-w-[660px] flex-shrink-0 min-h-screen px-3 sm:px-4 py-3 sm:py-4 pb-24 md:pb-8 transition-colors">
            {currentNavTab === 'arena' ? (
              <ArenaView
                activeTrack={activeTrack}
                setActiveTrack={setActiveTrack}
                onStartExam={exam.handleStartExam}
                totalQuestionsAvailable={store.allQuestions.length}
                userProfile={store.userProfile}
                onEnterContest={exam.handleEnterContest}
                onRegisterToggleContest={store.handleRegisterToggleContest}
              />
            ) : currentNavTab === 'profile' ? (
              <ProfileView
                userProfile={store.userProfile}
                currentUser={store.userProfile}
                targetUser={store.viewingProfileUser}
                posts={store.posts}
                bookmarkedIds={store.bookmarkedIds}
                onLike={store.handleLike}
                onAddComment={store.handleAddComment}
                onStartExam={exam.handleStartExam}
                onAnswerQuiz={store.handleAnswerQuiz}
                onReportPost={(postId) => setReportingPostId(postId)}
                onToggleBookmark={store.handleToggleBookmark}
                onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
                onToggleFollow={store.handleToggleFollow}
                onRequireAuth={openAuthModal}
                onBackToFeed={() => setCurrentNavTab('feed')}
                onGoToArena={() => setCurrentNavTab('arena')}
              />
            ) : (
              <FeedStage
                activeTrack={activeTrack}
                setActiveTrack={setActiveTrack}
                feedCategoryTab={feedCategoryTab}
                setFeedCategoryTab={setFeedCategoryTab}
                selectedCashtag={selectedCashtag}
                setSelectedCashtag={setSelectedCashtag}
                userProfile={store.userProfile}
                filteredPosts={filteredPosts}
                bookmarkedIds={store.bookmarkedIds}
                onAddPost={store.handleAddPost}
                onLike={store.handleLike}
                onAddComment={store.handleAddComment}
                onStartExam={exam.handleStartExam}
                onAnswerQuiz={store.handleAnswerQuiz}
                onReportPost={(postId) => setReportingPostId(postId)}
                onToggleBookmark={store.handleToggleBookmark}
                onRequireAuth={openAuthModal}
                onToggleFollow={store.handleToggleFollow}
                onOpenProfile={store.handleOpenUserProfile}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            )}
          </main>

          {/* 3. RIGHT SIDEBAR */}
          <RightSidebar
            activeTrack={activeTrack}
            onSelectCashtag={(tag) => setSelectedCashtag(tag)}
            onStartExam={exam.handleStartExam}
            streakDays={store.userProfile?.streakDays ?? 0}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        currentTab={currentNavTab}
        isBankModalOpen={isBankModalOpen}
        bankInitialGroup={bankInitialGroup}
        onSelectTab={handleNavAction}
        onOpenProfile={() => handleNavAction('profile')}
      />

      {/* 5. SIMULATOR & EVALUATION MODALS */}
      <ExamModal
        isOpen={exam.isExamModalOpen}
        onClose={() => exam.setIsExamModalOpen(false)}
        questions={exam.examQuestions}
        mode={exam.examMode}
        track={exam.examTrack}
        examTitle={exam.examTitle}
        isFullCpnsSkd={exam.examIsFullCpnsSkd}
        contestId={exam.activeContest?.id}
        durationSeconds={exam.examDuration}
        onFinishExam={exam.handleFinishExam}
      />

      <ExamResultModal
        isOpen={exam.isResultModalOpen && Boolean(exam.lastExamResult)}
        onClose={() => exam.setIsResultModalOpen(false)}
        result={exam.lastExamResult}
        userProfile={store.userProfile}
        onFlexToStream={(post) => {
          store.handleAddPost(post);
          exam.setIsResultModalOpen(false);
          store.showToast(
            '🎉 Rapor Resmi Dibagikan!',
            'Hasil skormu telah tampil di feed dengan lencana terverifikasi.',
            'success'
          );
        }}
        onRequireAuth={openAuthModal}
      />

      <BankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        questions={store.allQuestions}
        initialGroup={bankInitialGroup}
        bookmarkedIds={store.bookmarkedIds}
        onToggleBookmark={store.handleToggleBookmark}
        onStartCustomDrill={exam.handleStartCustomDrill}
      />

      {isEditProfileModalOpen && store.userProfile && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          userProfile={store.userProfile}
          onSaveProfile={store.handleSaveProfile}
          onResetQuestionHistory={store.handleResetQuestionHistory}
        />
      )}

      <ReportModal
        isOpen={reportingPostId !== null}
        onClose={() => setReportingPostId(null)}
        postId={reportingPostId}
        onSubmitReport={store.handleSubmitReport}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={store.handleLogin}
        triggerReason={authTriggerReason}
      />

      <ToastNotification
        toast={store.toastNotification}
        onClose={() => store.setToastNotification(null)}
      />
    </div>
  );
}
