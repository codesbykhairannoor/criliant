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
import {
  INITIAL_POSTS,
  EXAM_MODES
} from '@/data/constants';
import questionsData from '@/data/questions.json';

import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { FeedHeader } from '@/components/feed/FeedHeader';
import { CreatePostBox } from '@/components/feed/CreatePostBox';
import { PostCard } from '@/components/feed/PostCard';
import { ExamModal } from '@/components/exam/ExamModal';
import { ExamResultModal } from '@/components/exam/ExamResultModal';
import { BankModal } from '@/components/bank/BankModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ArenaView } from '@/components/arena/ArenaView';
import { AuthModal, AuthTriggerReason } from '@/components/auth/AuthModal';
import { validateVoteAction, validateReportAction } from '@/utils/antiBot';
import { Swords, BookOpen, Bookmark, Sparkles, Flame, CheckCircle2, ShieldAlert, X } from 'lucide-react';

export default function HomePage() {
  // 1. Local-First State (Persisted in LocalStorage)
  const [activeTrack, setActiveTrack] = useState<StudyTrack>('cpns');
  const [currentNavTab, setCurrentNavTab] = useState<string>('feed');
  const [feedCategoryTab, setFeedCategoryTab] = useState<string>('all');
  const [selectedCashtag, setSelectedCashtag] = useState<string>('#Semua');

  // 1. Authenticated User Profile (null = Public Guest / Lurker Mode like Reddit & TikTok)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<AuthTriggerReason>('general');

  const openAuthModal = (reason: AuthTriggerReason = 'general') => {
    setAuthTriggerReason(reason);
    setIsAuthModalOpen(true);
  };

  const handleLogin = (user: UserProfile) => {
    setUserProfile(user);
    setActiveTrack(user.studyTrack);
    localStorage.setItem('criliant_user_profile', JSON.stringify(user));
    showToast(
      `👋 Selamat Datang, ${user.name}!`,
      'Akunmu aktif. Seluruh progres dan hak interaksi telah terbuka.',
      'success'
    );
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('criliant_user_profile');
    showToast('Mode Tamu Aktif', 'Kamu telah keluar dan berada dalam mode penjelajah.', 'info');
  };

  const [posts, setPosts] = useState<StreamPost[]>(INITIAL_POSTS);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['q_twk_01', 'q_tiu_02']));

  // Modals State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examMode, setExamMode] = useState<ExamMode>('TRYOUT_FULL');
  const [examDuration, setExamDuration] = useState(6000);

  const [lastExamResult, setLastExamResult] = useState<ExamResultSummary | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Anti-Bot & Proof of Competence Toast Feedback
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastNotification({ title, message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Cast parsed questions
  const allQuestions = questionsData as unknown as Question[];

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

  // Save changes to LocalStorage
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

  // Clean Twitter/X Style: Like Post Handler (Instant & Authenticated)
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

  // Shadow-Report Protection Handler (Anti-Competitor Bot Attack)
  const handleReportPost = (postId: string, reason: string) => {
    if (!userProfile) {
      openAuthModal('general');
      return;
    }

    const reportCheck = validateReportAction(userProfile);

    // Give courteous feedback to the user (Bot thinks it succeeded, but low-trust reports are shadow-dropped)
    showToast(
      '🛡️ Laporan Diterima',
      'Terima kasih telah menjaga ekosistem Criliant. Tim moderator akan meninjau postingan ini.',
      'info'
    );
  };

  // Proof of Competence: Handle answering micro-quiz directly in feed
  const handleAnswerQuiz = (postId: string, selectedIndex: number, isCorrect: boolean) => {
    // 1. Update post state
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

    // 2. If user is logged in, update User Profile with Proof of Competence & Karma
    if (userProfile) {
      const wasAlreadyVerified = userProfile.isCompetenceVerified || (userProfile.quizzesSolvedCount ?? 0) >= 1;
      const newCount = (userProfile.quizzesSolvedCount || 0) + 1;
      const karmaBonus = isCorrect ? 15 : 5;
      const newKarma = (userProfile.reputationKarma || 10) + karmaBonus;

      const updatedProfile: UserProfile = {
        ...userProfile,
        quizzesSolvedCount: newCount,
        isCompetenceVerified: true,
        reputationKarma: newKarma,
      };

      setUserProfile(updatedProfile);
      localStorage.setItem('criliant_user_profile', JSON.stringify(updatedProfile));

      if (!wasAlreadyVerified) {
        showToast(
          '🎉 Proof of Competence Terverifikasi!',
          'Kamu terbukti manusia asli (Anti-Bot lulus)! Hak interaksi aktif penuh.',
          'success'
        );
      } else {
        showToast(
          isCorrect ? '🎯 Jawaban Benar (+15 Karma)!' : '💡 Jawaban Tersimpan (+5 Karma)!',
          isCorrect
            ? 'Insting kamu tajam! Skor reputasi karma bertambah.'
            : 'Pelajari pembahasan resmi untuk memperkuat pemahaman.',
          'info'
        );
      }
    } else {
      // Guest answered: encourage sign in to claim karma points
      showToast(
        isCorrect ? '🎯 Jawabanmu Benar!' : '💡 Jawaban Tersimpan!',
        'Masuk akunmu untuk mengklaim +15 Karma dan menyimpan riwayat belajar.',
        'info'
      );
    }
  };

  // Add Comment (Authenticated)
  const handleAddComment = (postId: string, commentText: string) => {
    if (!userProfile) {
      openAuthModal('comment');
      return;
    }

    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentCount: p.commentCount + 1,
            comments: [
              ...p.comments,
              {
                id: `c_${Date.now()}`,
                authorName: userProfile.name,
                authorBadge: userProfile.isCompetenceVerified ? 'Verified Human' : 'Pejuang Aktif',
                text: commentText,
                timeAgo: 'Baru saja',
                avatarInitial: userProfile.avatarInitial,
              },
            ],
          };
        }
        return p;
      });
      localStorage.setItem('criliant_stream_posts', JSON.stringify(updated));
      return updated;
    });
  };

  // Add New Post to Feed
  const handleAddPost = (newPost: StreamPost) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      localStorage.setItem('criliant_stream_posts', JSON.stringify(updated));
      return updated;
    });
  };

  // Start Exam Launcher
  const handleStartExam = (modeId: string) => {
    const config = EXAM_MODES.find((m) => m.id === modeId) || EXAM_MODES[5];
    setExamMode(config.id);
    setExamDuration(config.durationSeconds);

    let selected: Question[] = [];
    if (config.id === 'TRYOUT_FULL') {
      // 30 TWK, 35 TIU, 45 TKP
      const twk = allQuestions.filter((q) => q.category === 'TWK').slice(0, 30);
      const tiu = allQuestions.filter((q) => q.category === 'TIU').slice(0, 35);
      const tkp = allQuestions.filter((q) => q.category === 'TKP').slice(0, 45);
      selected = [...twk, ...tiu, ...tkp];
      if (selected.length < 110) {
        selected = allQuestions.slice(0, 110);
      }
    } else {
      selected = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, config.questionCount);
    }

    setExamQuestions(selected);
    setIsExamModalOpen(true);
  };

  // Start Custom Drill
  const handleStartCustomDrill = (drillQuestions: Question[]) => {
    setExamMode('NORMAL');
    setExamDuration(drillQuestions.length * 60);
    setExamQuestions(drillQuestions);
    setIsExamModalOpen(true);
  };

  // Finish Exam Handler
  const handleFinishExam = (summary: ExamResultSummary) => {
    setIsExamModalOpen(false);
    setLastExamResult(summary);
    setIsResultModalOpen(true);

    // Increment streak if passed and user is logged in
    if (summary.isOverallPassed && userProfile) {
      setUserProfile((prev) => {
        if (!prev) return null;
        const up = { ...prev, streakDays: prev.streakDays + 1 };
        localStorage.setItem('criliant_user_profile', JSON.stringify(up));
        return up;
      });
    }
  };

  // Filter Posts
  const filteredPosts = posts.filter((post) => {
    // 1. Track filter
    if (post.track !== activeTrack) return false;

    // 2. Feed Tab Filter
    if (feedCategoryTab === 'quiz' && !post.microQuiz) return false;
    if (feedCategoryTab === 'flex' && !post.verifiedScore) return false;
    if (feedCategoryTab === 'discuss' && (post.microQuiz || post.verifiedScore)) return false;

    // 3. Cashtag filter
    if (selectedCashtag !== '#Semua' && !selectedCashtag.includes('Trending')) {
      const pureTag = selectedCashtag.replace('$', '');
      if (!post.cashtag.includes(pureTag) && !post.content.includes(pureTag)) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex transition-colors relative">
      {/* 1. LEFT SIDEBAR (Docked flush to the left edge like Reddit) */}
      <LeftSidebar
        currentTab={currentNavTab}
        setCurrentTab={(tab) => {
          setCurrentNavTab(tab);
          if (tab === 'bank') setIsBankModalOpen(true);
          if (tab === 'bookmarks') {
            if (!userProfile) {
              openAuthModal('bookmark');
            } else {
              setIsBankModalOpen(true);
            }
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
          if (!userProfile) {
            openAuthModal('general');
          } else {
            setIsEditProfileModalOpen(true);
          }
        }}
        onOpenAuthModal={openAuthModal}
        onLogout={handleLogout}
      />

      {/* 2. MAIN VIEWPORT (Feed + Right Sidebar centered in remaining canvas) */}
      <div className="flex-1 flex justify-center min-h-screen overflow-x-hidden">
        <div className="w-full max-w-[960px] xl:max-w-[1020px] flex justify-center min-h-screen">
          {/* CENTER STAGE (Feed or Arena Hub) */}
          <main className="w-full max-w-[580px] xl:max-w-[620px] flex-shrink-0 min-h-screen border-r border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] pb-20 md:pb-6 transition-colors">
            {currentNavTab === 'arena' ? (
              <ArenaView
                activeTrack={activeTrack}
                setActiveTrack={setActiveTrack}
                onStartExam={handleStartExam}
                totalQuestionsAvailable={allQuestions.length}
              />
            ) : (
              <>
                {/* Clean Sticky Feed Header */}
                <FeedHeader
                  activeTab={feedCategoryTab}
                  setActiveTab={setFeedCategoryTab}
                  selectedCashtag={selectedCashtag}
                  setSelectedCashtag={setSelectedCashtag}
                  activeTrack={activeTrack}
                  setActiveTrack={setActiveTrack}
                />

                {/* Create Post / Compose Box */}
                <CreatePostBox
                  userProfile={userProfile}
                  activeTrack={activeTrack}
                  onAddPost={handleAddPost}
                  onRequireAuth={openAuthModal}
                />

                {/* Feed Post List */}
                <div className="divide-y divide-[#EFF3F4] dark:divide-[#1E293B]">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        userProfile={userProfile}
                        onLike={handleLike}
                        onAddComment={handleAddComment}
                        onStartExam={handleStartExam}
                        onAnswerQuiz={handleAnswerQuiz}
                        onReportPost={handleReportPost}
                        onToggleBookmark={handleToggleBookmark}
                        isBookmarked={bookmarkedIds.has(post.id)}
                        onRequireAuth={openAuthModal}
                      />
                    ))
                  ) : (
                    <div className="text-center py-16 px-4 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center mx-auto font-black text-xl">
                        #
                      </div>
                      <h4 className="font-extrabold text-[#0F1419] dark:text-white text-sm">
                        Belum ada diskusi untuk topik {selectedCashtag}
                      </h4>
                      <p className="text-xs text-[#536471] dark:text-slate-400 max-w-sm mx-auto">
                        Jadilah pejuang pertama yang memulai diskusi atau membagikan kuis mikro untuk topik ini!
                      </p>
                      <button
                        onClick={() => setSelectedCashtag('#Semua')}
                        className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        Kembali ke Semua Postingan
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>

          {/* 3. RIGHT SIDEBAR (Widgets & Trends) */}
          <RightSidebar
            onSelectCashtag={(tag) => setSelectedCashtag(tag)}
            onStartExam={handleStartExam}
            streakDays={userProfile?.streakDays ?? 0}
          />
        </div>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION (Visible only on phone) */}
      <MobileBottomNav
        currentTab={currentNavTab}
        setCurrentTab={(tab) => {
          setCurrentNavTab(tab);
          if (tab === 'bank') setIsBankModalOpen(true);
          if (tab === 'bookmarks') {
            if (!userProfile) {
              openAuthModal('bookmark');
            } else {
              setIsBankModalOpen(true);
            }
          }
        }}
        onStartExam={handleStartExam}
        onOpenEditProfile={() => {
          if (!userProfile) {
            openAuthModal('general');
          } else {
            setIsEditProfileModalOpen(true);
          }
        }}
      />

      {/* 5. FULLSCREEN EXAM SIMULATOR MODAL */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        questions={examQuestions}
        mode={examMode}
        durationSeconds={examDuration}
        onFinishExam={handleFinishExam}
      />

      {/* 6. EXAM RESULT RAPOR MODAL */}
      <ExamResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        result={lastExamResult}
        userProfile={userProfile}
        onFlexToStream={handleAddPost}
        onRequireAuth={openAuthModal}
      />

      {/* 7. BANK SOAL & DRILLING MODAL */}
      <BankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        questions={allQuestions}
        onStartCustomDrill={handleStartCustomDrill}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* 8. EDIT PROFILE MODAL */}
      {isEditProfileModalOpen && userProfile && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {/* 9. AUTHENTICATION & LOGIN GATE MODAL (The Reddit & TikTok Paradigm) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleLogin}
        triggerReason={authTriggerReason}
      />

      {/* 10. FLOATING TOAST NOTIFICATION (Proof of Competence & Anti-Bot Alerts) */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#0B0F19] p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1E293B] flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-2 rounded-xl flex-shrink-0 bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]">
            {toastNotification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : toastNotification.type === 'warning' ? (
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#2563EB] dark:text-[#38BDF8]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-extrabold text-xs text-[#0F1419] dark:text-white leading-tight">
              {toastNotification.title}
            </h5>
            <p className="text-[11px] text-[#536471] dark:text-slate-400 mt-0.5 leading-snug">
              {toastNotification.message}
            </p>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

