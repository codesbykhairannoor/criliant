'use client';

import React, { useState, useEffect } from 'react';
import {
  StudyTrack,
  UserProfile,
  StreamPost,
  Question,
  ExamMode,
  ExamResultSummary
} from '@/types';
import { INITIAL_POSTS } from '@/data/constants';
import { EXAM_PACKAGES, getFilteredQuestionsForTrack } from '@/data/examPackages';
import { QuestionService } from '@/services/questionService';
import { QuestionRepository } from '@/server/questions/repository';

import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
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
import { ToastNotification, ToastData } from '@/components/ui/ToastNotification';
import { validateReportAction } from '@/utils/antiBot';

export default function HomePage() {
  // 1. Navigation & Track States (Isolasi Kamar Ujian)
  const [activeTrack, setActiveTrack] = useState<StudyTrack>('cpns');
  const [currentNavTab, setCurrentNavTab] = useState<string>('feed');
  const [feedCategoryTab, setFeedCategoryTab] = useState<string>('all');
  const [selectedCashtag, setSelectedCashtag] = useState<string>('#Semua');

  // 2. User & Auth States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [viewingProfileUser, setViewingProfileUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<AuthTriggerReason>('general');

  // 3. Modals & Notifications
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examMode, setExamMode] = useState<ExamMode>('TRYOUT_FULL');
  const [examDuration, setExamDuration] = useState(6000);
  const [lastExamResult, setLastExamResult] = useState<ExamResultSummary | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<ToastData | null>(null);

  // 4. Data Posts & Bank Soal (Dynamic Service Layer)
  const [posts, setPosts] = useState<StreamPost[]>(INITIAL_POSTS);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['TWK-01', 'TWK-02']));
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => QuestionRepository.getAll());

  // Load questions dynamically from API
  useEffect(() => {
    QuestionService.getQuestions()
      .then((qs) => {
        if (qs && qs.length > 0) {
          setAllQuestions(qs);
        }
      })
      .catch((err) => console.error('Failed to load questions from QuestionService:', err));
  }, []);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastNotification({ title, message, type });
    setTimeout(() => setToastNotification(null), 4500);
  };

  const openAuthModal = (reason: AuthTriggerReason = 'general') => {
    setAuthTriggerReason(reason);
    setIsAuthModalOpen(true);
  };

  // Load state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('criliant_user_profile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const savedPosts = localStorage.getItem('criliant_stream_posts');
      if (savedPosts) setPosts(JSON.parse(savedPosts));

      const savedBookmarks = localStorage.getItem('criliant_bookmarks');
      if (savedBookmarks) setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));
    } catch (e) {
      console.error('Error loading local storage data:', e);
    }
  }, []);

  const handleLogin = (user: UserProfile) => {
    setUserProfile(user);
    setActiveTrack(user.studyTrack);
    localStorage.setItem('criliant_user_profile', JSON.stringify(user));
    showToast(`👋 Selamat Datang, ${user.name}!`, 'Akunmu aktif. Seluruh hak interaksi telah terbuka.', 'success');
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('criliant_user_profile');
    showToast('Mode Tamu Aktif', 'Kamu telah keluar dan berada dalam mode penjelajah.', 'info');
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    setActiveTrack(updated.studyTrack);
    localStorage.setItem('criliant_user_profile', JSON.stringify(updated));
  };

  const handleToggleBookmark = (questionId: string) => {
    if (!userProfile) {
      openAuthModal('bookmark');
      return;
    }
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      localStorage.setItem('criliant_bookmarks', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleLike = (postId: string) => {
    if (!userProfile) {
      openAuthModal('like');
      return;
    }

    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const currentLiked = p.isLiked ?? p.isUpvoted ?? false;
          const currentCount = p.likeCount ?? p.score ?? p.upvoteCount ?? 0;
          const newLiked = !currentLiked;
          const newCount = newLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

          return {
            ...p,
            isLiked: newLiked,
            isUpvoted: newLiked,
            likeCount: newCount,
            score: newCount,
            upvoteCount: newCount,
          };
        }
        return p;
      });
      localStorage.setItem('criliant_stream_posts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleFollow = (targetAuthorId: string) => {
    if (!userProfile) {
      openAuthModal('general');
      return;
    }

    const currentFollowing = userProfile.followingIds || [];
    const isAlreadyFollowing = currentFollowing.includes(targetAuthorId);
    const updatedFollowing = isAlreadyFollowing
      ? currentFollowing.filter((id) => id !== targetAuthorId)
      : [...currentFollowing, targetAuthorId];

    const updatedProfile: UserProfile = {
      ...userProfile,
      followingIds: updatedFollowing,
      followingCount: updatedFollowing.length,
    };

    setUserProfile(updatedProfile);
    localStorage.setItem('criliant_user_profile', JSON.stringify(updatedProfile));
    showToast(
      isAlreadyFollowing ? 'Batal Mengikuti' : '✓ Mengikuti Kreator',
      isAlreadyFollowing
        ? 'Kamu berhenti mengikuti pembaruan dari kreator ini.'
        : 'Berhasil mengikuti! Soal & trik kreator ini akan muncul di tab Mengikuti.',
      'info'
    );
  };

  const handleOpenUserProfile = (authorId: string, authorName: string) => {
    if (userProfile && (userProfile.id === authorId || userProfile.name === authorName)) {
      setViewingProfileUser(userProfile);
    } else {
      setViewingProfileUser({
        id: authorId,
        name: authorName,
        targetAgency: authorName.includes('STAN') ? 'PKN STAN' : authorName.includes('ITB') ? 'STEI ITB' : 'Kementerian Keuangan',
        avatarInitial: authorName.charAt(0).toUpperCase(),
        bio: `Mentor & kreator materi edukasi di Criliant. Berbagi tips dan bedah soal HOTS persiapan seleksi nasional 🚀`,
        streakDays: 14,
        studyTrack: activeTrack,
        quizzesSolvedCount: 45,
        isCompetenceVerified: true,
        reputationKarma: 320,
        followersCount: 1420,
        followingCount: 38,
        followingIds: [],
        highestExamScore: 485,
      });
    }
    setCurrentNavTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitReport = (postId: string, category: string, reasonDetails: string) => {
    if (!userProfile) return;
    const reportCheck = validateReportAction(userProfile);

    try {
      const savedReports = JSON.parse(localStorage.getItem('criliant_reports') || '[]');
      savedReports.push({
        postId,
        category,
        details: reasonDetails,
        reporter: userProfile.id,
        isShadowDropped: reportCheck.isShadowDropped,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('criliant_reports', JSON.stringify(savedReports));
    } catch (e) {
      console.error('Error saving report:', e);
    }

    showToast('🛡️ Laporan Terkirim', reportCheck.message, 'info');
  };

  const handleAnswerQuiz = (postId: string, selectedIndex: number, isCorrect: boolean) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId && p.microQuiz) {
          const currentTotal = p.microQuiz.totalVotes;
          const updatedOptions = p.microQuiz.options.map((opt) => {
            if (opt.index === selectedIndex) {
              return { ...opt, votePercentage: Math.min(100, opt.votePercentage + 1) };
            }
            return opt;
          });

          return {
            ...p,
            microQuiz: {
              ...p.microQuiz,
              userSelectedIndex: selectedIndex,
              totalVotes: currentTotal + 1,
              options: updatedOptions,
            },
          };
        }
        return p;
      });
      localStorage.setItem('criliant_stream_posts', JSON.stringify(updated));
      return updated;
    });

    if (userProfile) {
      const wasAlreadyVerified = userProfile.isCompetenceVerified || (userProfile.quizzesSolvedCount ?? 0) >= 1;
      const updatedProfile: UserProfile = {
        ...userProfile,
        quizzesSolvedCount: (userProfile.quizzesSolvedCount || 0) + 1,
        isCompetenceVerified: true,
        reputationKarma: (userProfile.reputationKarma || 10) + (isCorrect ? 15 : 5),
      };

      setUserProfile(updatedProfile);
      localStorage.setItem('criliant_user_profile', JSON.stringify(updatedProfile));
      if (!wasAlreadyVerified) {
        showToast('🎉 Proof of Competence Terverifikasi!', 'Kamu terbukti manusia asli! Hak interaksi aktif penuh.', 'success');
      } else {
        showToast(isCorrect ? '🎯 Jawaban Benar (+15 Karma)!' : '💡 Jawaban Tersimpan (+5 Karma)!', isCorrect ? 'Insting tajam!' : 'Pelajari pembahasannya.', 'info');
      }
    } else {
      showToast(isCorrect ? '🎯 Jawabanmu Benar!' : '💡 Jawaban Tersimpan!', 'Masuk akunmu untuk mengklaim +15 Karma.', 'info');
    }
  };

  const handleAddPost = (newPost: StreamPost) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      localStorage.setItem('criliant_stream_posts', JSON.stringify(updated));
      return updated;
    });
  };

  // 5. Official Exam Package Launcher (100% Sesuai Kurikulum Kamar & Anti-Soal Berulang)
  const handleStartExam = async (packageOrModeId: string) => {
    const packagesForTrack = EXAM_PACKAGES[activeTrack] || EXAM_PACKAGES.cpns;
    const selectedPkg = packagesForTrack.find((p) => p.id === packageOrModeId) || packagesForTrack[0];

    // Ambil daftar ID soal yang pernah dikerjakan user dari profile
    const seenQuestionIds = userProfile?.questionHistory
      ? Object.keys(userProfile.questionHistory)
      : [];

    try {
      const questionsForExam = await QuestionService.generateExamSession(
        activeTrack,
        selectedPkg.questionCount,
        selectedPkg.targetedCategories,
        false,
        seenQuestionIds
      );

      setExamMode('TRYOUT_FULL');
      setExamDuration(selectedPkg.durationSeconds);
      setExamQuestions(questionsForExam);
      setIsExamModalOpen(true);
    } catch (err) {
      console.warn('Using sync fallback for exam session:', err);
      const fallbackQuestions = getFilteredQuestionsForTrack(
        allQuestions,
        activeTrack,
        selectedPkg.questionCount,
        selectedPkg.targetedCategories
      );
      setExamMode('TRYOUT_FULL');
      setExamDuration(selectedPkg.durationSeconds);
      setExamQuestions(fallbackQuestions);
      setIsExamModalOpen(true);
    }
  };

  const handleFinishExam = (summary: ExamResultSummary) => {
    setIsExamModalOpen(false);
    setLastExamResult(summary);
    setIsResultModalOpen(true);

    if (userProfile) {
      setUserProfile((prev) => {
        if (!prev) return null;
        const currentHistory = { ...(prev.questionHistory || {}) };

        // Catat setiap soal yang dikerjakan beserta status benar/salah dan timestamp
        summary.reviewItems.forEach((item) => {
          const qid = item.question.id;
          const prevRecord = currentHistory[qid];
          currentHistory[qid] = {
            questionId: qid,
            isCorrect: item.isCorrect,
            attemptedAt: Date.now(),
            timesSeen: (prevRecord?.timesSeen || 0) + 1,
          };
        });

        const updatedScore = Math.max(prev.highestExamScore || 0, summary.totalScore);
        const up: UserProfile = {
          ...prev,
          streakDays: summary.isOverallPassed ? prev.streakDays + 1 : prev.streakDays,
          highestExamScore: updatedScore,
          quizzesSolvedCount: (prev.quizzesSolvedCount || 0) + summary.answeredCount,
          isCompetenceVerified: true,
          questionHistory: currentHistory,
        };
        localStorage.setItem('criliant_user_profile', JSON.stringify(up));
        return up;
      });

      showToast(
        summary.isOverallPassed ? '🎉 Selamat Lulus Passing Grade!' : '📊 Tryout Selesai!',
        `Skor: ${summary.totalScore} | Riwayat soal tersimpan agar kamu dapat soal baru besok.`,
        summary.isOverallPassed ? 'success' : 'info'
      );
    }
  };

  // 6. Hard Boundary Filter (Konten Tidak Pernah Tercampur)
  const filteredPosts = posts.filter((post) => {
    if (post.track !== activeTrack) return false;
    if (feedCategoryTab === 'following') {
      const followingList = userProfile?.followingIds || [];
      const isAuthorFollowed = followingList.includes(post.authorId || '') || followingList.includes(post.authorName);
      if (!isAuthorFollowed) return false;
    }
    if (feedCategoryTab === 'quiz' && !post.microQuiz) return false;
    if (feedCategoryTab === 'flex' && !post.verifiedScore) return false;

    if (selectedCashtag !== '#Semua' && !selectedCashtag.includes('Trending')) {
      const pureTag = selectedCashtag.replace('$', '');
      if (!post.cashtag.includes(pureTag) && !post.content.includes(pureTag)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex transition-colors relative">
      {/* 1. LEFT SIDEBAR */}
      <LeftSidebar
        currentTab={currentNavTab}
        setCurrentTab={(tab) => {
          setCurrentNavTab(tab);
          if (tab === 'profile') setViewingProfileUser(userProfile);
          if (tab === 'bank') setIsBankModalOpen(true);
          if (tab === 'bookmarks') {
            if (!userProfile) openAuthModal('bookmark');
            else setIsBankModalOpen(true);
          }
        }}
        activeTrack={activeTrack}
        setActiveTrack={setActiveTrack}
        userProfile={userProfile}
        onOpenCreatePost={() => {
          if (!userProfile) {
            openAuthModal('post');
            return;
          }
          setCurrentNavTab('feed');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartExam={handleStartExam}
        onOpenEditProfile={() => {
          if (!userProfile) openAuthModal('general');
          else setIsEditProfileModalOpen(true);
        }}
        onOpenAuthModal={openAuthModal}
        onLogout={handleLogout}
      />

      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 flex justify-center min-h-screen overflow-x-hidden">
        <div className="w-full max-w-[960px] xl:max-w-[1020px] flex justify-center min-h-screen">
          <main className="w-full max-w-[620px] xl:max-w-[660px] flex-shrink-0 min-h-screen px-3 sm:px-4 py-4 pb-24 md:pb-8 transition-colors">
            {currentNavTab === 'arena' ? (
              <ArenaView
                activeTrack={activeTrack}
                setActiveTrack={setActiveTrack}
                onStartExam={handleStartExam}
                totalQuestionsAvailable={allQuestions.length}
              />
            ) : currentNavTab === 'profile' ? (
              <ProfileView
                userProfile={userProfile}
                currentUser={userProfile}
                targetUser={viewingProfileUser}
                posts={posts}
                bookmarkedIds={bookmarkedIds}
                onLike={handleLike}
                onAddComment={(postId, text) => {
                  setPosts((prev) => prev.map((p) => p.id === postId ? {
                    ...p,
                    commentCount: p.commentCount + 1,
                    comments: [...p.comments, {
                      id: `c_${Date.now()}`,
                      authorName: userProfile?.name || 'Pejuang',
                      text,
                      timeAgo: 'Baru saja',
                      avatarInitial: userProfile?.avatarInitial || 'P'
                    }]
                  } : p));
                }}
                onStartExam={handleStartExam}
                onAnswerQuiz={handleAnswerQuiz}
                onReportPost={(postId) => setReportingPostId(postId)}
                onToggleBookmark={handleToggleBookmark}
                onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
                onToggleFollow={handleToggleFollow}
                onRequireAuth={openAuthModal}
                onBackToFeed={() => setCurrentNavTab('feed')}
              />
            ) : (
              <FeedStage
                activeTrack={activeTrack}
                setActiveTrack={setActiveTrack}
                feedCategoryTab={feedCategoryTab}
                setFeedCategoryTab={setFeedCategoryTab}
                selectedCashtag={selectedCashtag}
                setSelectedCashtag={setSelectedCashtag}
                userProfile={userProfile}
                filteredPosts={filteredPosts}
                bookmarkedIds={bookmarkedIds}
                onAddPost={handleAddPost}
                onLike={handleLike}
                onAddComment={(postId, text) => {
                  setPosts((prev) => prev.map((p) => p.id === postId ? {
                    ...p,
                    commentCount: p.commentCount + 1,
                    comments: [...p.comments, {
                      id: `c_${Date.now()}`,
                      authorName: userProfile?.name || 'Pejuang',
                      text,
                      timeAgo: 'Baru saja',
                      avatarInitial: userProfile?.avatarInitial || 'P'
                    }]
                  } : p));
                }}
                onStartExam={handleStartExam}
                onAnswerQuiz={handleAnswerQuiz}
                onReportPost={(postId) => setReportingPostId(postId)}
                onToggleBookmark={handleToggleBookmark}
                onRequireAuth={openAuthModal}
                onToggleFollow={handleToggleFollow}
                onOpenProfile={handleOpenUserProfile}
              />
            )}
          </main>

          {/* 3. RIGHT SIDEBAR */}
          <RightSidebar
            activeTrack={activeTrack}
            onSelectCashtag={(tag) => setSelectedCashtag(tag)}
            onStartExam={handleStartExam}
            streakDays={userProfile?.streakDays ?? 0}
          />
        </div>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        currentTab={currentNavTab}
        setCurrentTab={(tab) => {
          setCurrentNavTab(tab);
          if (tab === 'bank') setIsBankModalOpen(true);
          if (tab === 'bookmarks') {
            if (!userProfile) openAuthModal('bookmark');
            else setIsBankModalOpen(true);
          }
        }}
        onStartExam={handleStartExam}
        onOpenEditProfile={() => {
          setViewingProfileUser(userProfile);
          setCurrentNavTab('profile');
        }}
      />

      {/* 5. MODALS & SIMULATOR */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        questions={examQuestions}
        mode={examMode}
        durationSeconds={examDuration}
        onFinishExam={handleFinishExam}
      />

      {lastExamResult && (
        <ExamResultModal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          result={lastExamResult}
          userProfile={userProfile}
          onFlexToStream={(post) => {
            handleAddPost(post);
            setIsResultModalOpen(false);
            showToast('🎉 Rapor Resmi Dibagikan!', 'Hasil skormu telah tampil di feed dengan lencana terverifikasi.', 'success');
          }}
          onRequireAuth={openAuthModal}
        />
      )}

      {/* 6. BANK SOAL MODAL */}
      <BankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        questions={allQuestions}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={handleToggleBookmark}
        onStartCustomDrill={(selectedQuestions: Question[]) => {
          setExamMode('NORMAL');
          setExamDuration(selectedQuestions.length * 60);
          setExamQuestions(selectedQuestions);
          setIsExamModalOpen(true);
        }}
      />

      {/* 7. PROFILE & REPORT MODALS */}
      {isEditProfileModalOpen && userProfile && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
        />
      )}

      <ReportModal
        isOpen={reportingPostId !== null}
        onClose={() => setReportingPostId(null)}
        postId={reportingPostId}
        onSubmitReport={handleSubmitReport}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleLogin}
        triggerReason={authTriggerReason}
      />

      {/* 8. FLOATING TOAST NOTIFICATION */}
      <ToastNotification
        toast={toastNotification}
        onClose={() => setToastNotification(null)}
      />
    </div>
  );
}
