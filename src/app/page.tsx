'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StudyTrack } from '@/types';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileTopHeader } from '@/components/layout/MobileTopHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { FeedStage } from '@/components/feed/FeedStage';
import { ProfileView } from '@/components/profile/ProfileView';
import { ArenaView } from '@/components/arena/ArenaView';
import { LatihanView } from '@/components/latihan/LatihanView';
import { ExamModal } from '@/components/exam/ExamModal';
import { ExamResultModal } from '@/components/exam/ExamResultModal';
import { BankView } from '@/components/bank/BankView';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { AuthModal, AuthTriggerReason } from '@/components/auth/AuthModal';
import { ReportModal } from '@/components/modals/ReportModal';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { useCriliantStore } from '@/hooks/useCriliantStore';
import { useExamController } from '@/hooks/useExamController';
import { X } from 'lucide-react';

export default function HomePage() {
  const [activeTrack, setActiveTrack] = useState<StudyTrack>('cpns');
  const [currentNavTab, setCurrentNavTab] = useState<string>('feed');
  const [feedCategoryTab, setFeedCategoryTab] = useState<string>('all');
  const [selectedCashtag, setSelectedCashtag] = useState<string>('#Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<AuthTriggerReason>('general');
  const [bankInitialGroup, setBankInitialGroup] = useState<string>('SEMUA');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);

  const openAuthModal = useCallback((reason: AuthTriggerReason = 'general') => {
    setAuthTriggerReason(reason);
    setIsAuthModalOpen(true);
  }, []);

  const navigateToProfile = useCallback(() => {
    setCurrentNavTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const store = useCriliantStore(activeTrack, setActiveTrack, openAuthModal, navigateToProfile);

  // Handle direct links to user profiles (e.g. ?pejuang=rian_pratama)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUser = urlParams.get('pejuang') || urlParams.get('user');
    if (sharedUser) {
      store.handleOpenUserProfile(sharedUser, sharedUser);
    }
  }, []);

  const exam = useExamController(
    activeTrack,
    store.allQuestions,
    store.userProfile,
    store.recordExamCompletion,
    store.showToast
  );

  const handleNavAction = useCallback(
    (tab: string) => {
      if (tab === 'profile') {
        if (!store.userProfile) {
          openAuthModal('general');
          return;
        }
        store.setViewingProfileUser(store.userProfile);
        setCurrentNavTab('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (tab === 'latihan') {
        setCurrentNavTab('latihan');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (tab === 'bank') {
        setBankInitialGroup('SEMUA');
        setCurrentNavTab('bank');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (tab === 'bookmarks') {
        if (!store.userProfile) {
          openAuthModal('bookmark');
          return;
        }
        setBankInitialGroup('BOOKMARKS');
        setCurrentNavTab('bank');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setCurrentNavTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        currentTab={currentNavTab === 'bank' && bankInitialGroup === 'BOOKMARKS' ? 'bookmarks' : currentNavTab}
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
        <div
          className={`w-full ${
            currentNavTab === 'feed'
              ? 'max-w-6xl xl:max-w-7xl'
              : 'max-w-5xl xl:max-w-6xl'
          } flex justify-center min-h-screen`}
        >
          <main
            className={`w-full ${
              currentNavTab === 'feed'
                ? 'max-w-[660px] xl:max-w-[700px]'
                : 'max-w-full'
            } flex-shrink-0 min-h-screen px-3 sm:px-6 py-3 sm:py-5 pb-24 md:pb-8 transition-colors`}
          >
            {currentNavTab === 'latihan' ? (
              <LatihanView
                activeTrack={activeTrack}
                onStartExam={exam.handleStartExam}
                userProfile={store.userProfile}
                onRequireAuth={() => openAuthModal('general')}
              />
            ) : currentNavTab === 'arena' ? (
              <ArenaView
                activeTrack={activeTrack}
                onStartExam={exam.handleStartExam}
                totalQuestionsAvailable={store.allQuestions.length}
                userProfile={store.userProfile}
                onEnterContest={exam.handleEnterContest}
                onRegisterToggleContest={store.handleRegisterToggleContest}
              />
            ) : currentNavTab === 'bank' ? (
              <BankView
                questions={store.allQuestions}
                initialGroup={bankInitialGroup}
                bookmarkedIds={store.bookmarkedIds}
                onToggleBookmark={store.handleToggleBookmark}
                onStartCustomDrill={exam.handleStartCustomDrill}
                activeTrack={activeTrack}
                setActiveTrack={setActiveTrack}
                onRequireAuth={() => openAuthModal('bookmark')}
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

          {/* 3. RIGHT SIDEBAR (Only visible on Feed tab) */}
          {currentNavTab === 'feed' && (
            <RightSidebar
              activeTrack={activeTrack}
              onSelectCashtag={(tag) => setSelectedCashtag(tag)}
              onStartExam={exam.handleStartExam}
              streakDays={store.userProfile?.streakDays ?? 0}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </div>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        currentTab={currentNavTab === 'bank' && bankInitialGroup === 'BOOKMARKS' ? 'bookmarks' : currentNavTab}
        bankInitialGroup={bankInitialGroup}
        onSelectTab={handleNavAction}
        onOpenProfile={() => handleNavAction('profile')}
      />

      {/* 4.5. CRASH RECOVERY SESSION PROMPT DOCK */}
      {exam.pendingResumeSession && !exam.isExamModalOpen && (
        <aside
          aria-label="Sesi simulasi tersimpan"
          className="fixed bottom-16 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-3 animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
        >
          <div className="bg-[#0B0F19]/95 dark:bg-[#070D18]/95 text-white p-3.5 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="min-w-0 flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping flex-shrink-0" />
              <div className="truncate">
                <p className="text-xs font-black truncate">{exam.pendingResumeSession.examTitle}</p>
                <p className="text-[10px] text-slate-400">
                  No. {exam.pendingResumeSession.currentIndex + 1} dari {exam.pendingResumeSession.questions.length} • Sisa ~{Math.round(exam.pendingResumeSession.remainingSeconds / 60)} mnt
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={exam.handleResumeActiveSession}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Lanjutkan</span>
              </button>
              <button
                type="button"
                onClick={exam.handleDismissResumeSession}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Hapus Sesi"
                aria-label="Hapus Sesi Tersimpan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

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
        initialSession={exam.initialSessionForExam}
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

      {isEditProfileModalOpen && store.userProfile && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          userProfile={store.userProfile}
          onSaveProfile={store.handleSaveProfile}
          onResetQuestionHistory={store.handleResetQuestionHistory}
          onVacuumStorage={store.handleVacuumStorage}
          onClearMediaCache={store.handleClearMediaCache}
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
