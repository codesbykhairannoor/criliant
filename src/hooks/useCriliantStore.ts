'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  StudyTrack,
  UserProfile,
  StreamPost,
  Question,
  ExamResultSummary,
  ScheduledContest,
  ContestRatingHistoryItem,
} from '@/types';
import { INITIAL_POSTS } from '@/data/constants';
import { calculateContestRatingDelta } from '@/data/contests';
import { QuestionService } from '@/services/questionService';
import { QuestionRepository } from '@/server/questions/repository';
import { ToastData } from '@/components/ui/ToastNotification';
import { validateReportAction } from '@/utils/antiBot';
import { AuthTriggerReason } from '@/components/auth/AuthModal';
import { formatUsername } from '@/utils/formatters';
import { StorageEngine } from '@/utils/storageEngine';

export function useCriliantStore(
  activeTrack: StudyTrack,
  setActiveTrack: (t: StudyTrack) => void,
  openAuthModal: (reason?: AuthTriggerReason) => void,
  onNavigateProfile: () => void
) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [viewingProfileUser, setViewingProfileUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<StreamPost[]>(INITIAL_POSTS);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['TWK-01', 'TWK-02']));
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => QuestionRepository.getAll());
  const [toastNotification, setToastNotification] = useState<ToastData | null>(null);

  const showToast = useCallback(
    (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
      setToastNotification({ title, message, type });
      setTimeout(() => setToastNotification(null), 4500);
    },
    []
  );

  // Load questions from backend API
  useEffect(() => {
    QuestionService.getQuestions()
      .then((qs) => {
        if (qs && qs.length > 0) setAllQuestions(qs);
      })
      .catch((err) => console.error('Failed to load questions from QuestionService:', err));
  }, []);

  // Load local-first persisted state (IndexedDB with safe fallback)
  useEffect(() => {
    StorageEngine.getItem<UserProfile>('criliant_user_profile')
      .then((saved) => {
        if (saved) setUserProfile(saved);
      })
      .catch((e) => console.error('[StorageEngine] Error loading profile:', e));

    StorageEngine.getItem<StreamPost[]>('criliant_stream_posts')
      .then((saved) => {
        if (saved && saved.length > 0) setPosts(saved);
      })
      .catch((e) => console.error('[StorageEngine] Error loading posts:', e));

    StorageEngine.getItem<string[]>('criliant_bookmarks')
      .then((saved) => {
        if (saved) setBookmarkedIds(new Set(saved));
      })
      .catch((e) => console.error('[StorageEngine] Error loading bookmarks:', e));
  }, []);

  const handleLogin = useCallback(
    (user: UserProfile) => {
      const cleanUser = StorageEngine.prepareProfilePayload(user);
      setUserProfile(cleanUser);
      setActiveTrack(cleanUser.studyTrack);
      StorageEngine.setItem('criliant_user_profile', cleanUser);
      showToast(`👋 Selamat Datang, ${cleanUser.name}!`, 'Akunmu aktif. Seluruh hak interaksi telah terbuka.', 'success');
    },
    [setActiveTrack, showToast]
  );

  const handleLogout = useCallback(() => {
    setUserProfile(null);
    StorageEngine.removeItem('criliant_user_profile');
    showToast('Mode Tamu Aktif', 'Kamu telah keluar dan berada dalam mode penjelajah.', 'info');
  }, [showToast]);

  const handleSaveProfile = useCallback(
    (updated: UserProfile) => {
      const cleanUser = StorageEngine.prepareProfilePayload(updated);
      setUserProfile(cleanUser);
      setActiveTrack(cleanUser.studyTrack);
      StorageEngine.setItem('criliant_user_profile', cleanUser);

      // Synchronize updated profile (name, username, photo, initial) across existing posts by this user
      setPosts((prevPosts) => {
        const synced = prevPosts.map((p) => {
          if (p.authorId === cleanUser.id || (userProfile && p.authorName === userProfile.name)) {
            return {
              ...p,
              authorId: cleanUser.id,
              authorName: cleanUser.name,
              authorUsername: cleanUser.username || formatUsername(null, cleanUser.name),
              avatarInitial: cleanUser.avatarInitial,
              authorPhotoUrl: cleanUser.avatarPhotoUrl || null,
            };
          }
          return p;
        });
        StorageEngine.setItem('criliant_stream_posts', StorageEngine.preparePostsPayload(synced));
        return synced;
      });

      setViewingProfileUser((prev) => (prev && prev.id === cleanUser.id ? cleanUser : prev));
    },
    [setActiveTrack, userProfile]
  );

  const handleResetQuestionHistory = useCallback(() => {
    if (!userProfile) return;
    const updated: UserProfile = { ...userProfile, questionHistory: {} };
    setUserProfile(updated);
    StorageEngine.setItem('criliant_user_profile', updated);
    showToast('🔄 Riwayat Soal Direset', 'Bank soal akan diacak ulang dari awal.', 'info');
  }, [userProfile, showToast]);

  const handleToggleBookmark = useCallback(
    (questionId: string) => {
      if (!userProfile) {
        openAuthModal('bookmark');
        return;
      }
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(questionId)) next.delete(questionId);
        else next.add(questionId);
        StorageEngine.setItem('criliant_bookmarks', Array.from(next));
        return next;
      });
    },
    [userProfile, openAuthModal]
  );

  const handleLike = useCallback(
    (postId: string) => {
      if (!userProfile) {
        openAuthModal('like');
        return;
      }
      setPosts((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== postId) return p;
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
        });
        StorageEngine.setItem('criliant_stream_posts', StorageEngine.preparePostsPayload(updated));
        return updated;
      });
    },
    [userProfile, openAuthModal]
  );

  const handleAddComment = useCallback(
    (postId: string, text: string) => {
      if (!userProfile) {
        openAuthModal('comment');
        return;
      }
      setPosts((prev) => {
        const updated = prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                commentCount: p.commentCount + 1,
                comments: [
                  ...p.comments,
                  {
                    id: `c_${Date.now()}`,
                    authorName: userProfile.name,
                    authorUsername: userProfile.username || formatUsername(null, userProfile.name),
                    text,
                    timeAgo: '1m',
                    createdAt: Date.now(),
                    avatarInitial: userProfile.avatarInitial,
                    authorPhotoUrl: userProfile.avatarPhotoUrl || null,
                  },
                ],
              }
            : p
        );
        StorageEngine.setItem('criliant_stream_posts', StorageEngine.preparePostsPayload(updated));
        return updated;
      });
    },
    [userProfile, openAuthModal]
  );

  const handleAddPost = useCallback((newPost: StreamPost) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      StorageEngine.setItem('criliant_stream_posts', StorageEngine.preparePostsPayload(updated));
      return updated;
    });
  }, []);

  const handleToggleFollow = useCallback(
    (targetAuthorId: string) => {
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

      const cleanProfile = StorageEngine.prepareProfilePayload(updatedProfile);
      setUserProfile(cleanProfile);
      StorageEngine.setItem('criliant_user_profile', cleanProfile);
      showToast(
        isAlreadyFollowing ? 'Batal Mengikuti' : '✓ Mengikuti Kreator',
        isAlreadyFollowing
          ? 'Kamu berhenti mengikuti pembaruan dari kreator ini.'
          : 'Berhasil mengikuti! Konten kreator ini akan muncul di tab Mengikuti.',
        'info'
      );
    },
    [userProfile, openAuthModal, showToast]
  );

  const handleOpenUserProfile = useCallback(
    (authorId: string, authorName: string) => {
      if (userProfile && (userProfile.id === authorId || userProfile.name === authorName)) {
        setViewingProfileUser(userProfile);
      } else {
        const matchingPost = posts.find(
          (p) => (p.authorId === authorId || p.authorName === authorName) && p.authorPhotoUrl
        );
        const derivedUsername =
          matchingPost?.authorUsername || formatUsername(null, authorName);
        setViewingProfileUser({
          id: authorId,
          name: authorName,
          username: derivedUsername,
          targetAgency: authorName.includes('STAN') ? 'PKN STAN' : authorName.includes('ITB') ? 'STEI ITB' : 'Kementerian Keuangan',
          avatarInitial: authorName.charAt(0).toUpperCase(),
          avatarPhotoUrl: matchingPost?.authorPhotoUrl || null,
          bio: 'Mentor & kreator materi edukasi di Criliant. Berbagi tips dan bedah soal HOTS persiapan seleksi nasional 🚀',
          streakDays: 14,
          studyTrack: activeTrack,
          quizzesSolvedCount: 45,
          isCompetenceVerified: true,
          reputationKarma: 320,
          followersCount: 1420,
          followingCount: 38,
          followingIds: [],
          highestExamScore: 485,
          contestRating: 1840,
          contestsAttended: 6,
          ratingHistory: [],
        });
      }
      onNavigateProfile();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [userProfile, posts, activeTrack, onNavigateProfile]
  );

  const handleSubmitReport = useCallback(
    (postId: string, category: string, reasonDetails: string) => {
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
    },
    [userProfile, showToast]
  );

  const handleAnswerQuiz = useCallback(
    (postId: string, selectedIndex: number, isCorrect: boolean) => {
      setPosts((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== postId || !p.microQuiz) return p;
          const currentTotal = p.microQuiz.totalVotes;
          const updatedOptions = p.microQuiz.options.map((opt) =>
            opt.index === selectedIndex
              ? { ...opt, votePercentage: Math.min(100, opt.votePercentage + 1) }
              : opt
          );
          return {
            ...p,
            microQuiz: {
              ...p.microQuiz,
              userSelectedIndex: selectedIndex,
              totalVotes: currentTotal + 1,
              options: updatedOptions,
            },
          };
        });
        StorageEngine.setItem('criliant_stream_posts', StorageEngine.preparePostsPayload(updated));
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
        const cleanProfile = StorageEngine.prepareProfilePayload(updatedProfile);
        setUserProfile(cleanProfile);
        StorageEngine.setItem('criliant_user_profile', cleanProfile);
        if (!wasAlreadyVerified) {
          showToast('🎉 Proof of Competence Terverifikasi!', 'Kamu terbukti manusia asli! Hak interaksi aktif penuh.', 'success');
        } else {
          showToast(
            isCorrect ? '🎯 Jawaban Benar (+15 Karma)!' : '💡 Jawaban Tersimpan (+5 Karma)!',
            isCorrect ? 'Insting tajam!' : 'Pelajari pembahasannya.',
            'info'
          );
        }
      } else {
        showToast(isCorrect ? '🎯 Jawabanmu Benar!' : '💡 Jawaban Tersimpan!', 'Masuk akunmu untuk mengklaim +15 Karma.', 'info');
      }
    },
    [userProfile, showToast]
  );

  const handleRegisterToggleContest = useCallback(
    (contestId: string) => {
      if (!userProfile) {
        openAuthModal('general');
        return;
      }
      const currentRegistered = userProfile.registeredContestIds || [];
      const isRegistered = currentRegistered.includes(contestId);
      const updatedRegistered = isRegistered
        ? currentRegistered.filter((id) => id !== contestId)
        : [...currentRegistered, contestId];

      const updatedProfile: UserProfile = {
        ...userProfile,
        registeredContestIds: updatedRegistered,
      };
      const cleanProfile = StorageEngine.prepareProfilePayload(updatedProfile);
      setUserProfile(cleanProfile);
      StorageEngine.setItem('criliant_user_profile', cleanProfile);

      showToast(
        isRegistered ? 'Pendaftaran Dibatalkan' : '🎯 Berhasil Terdaftar!',
        isRegistered
          ? 'Kamu membatalkan keikutsertaan kontes ini.'
          : 'Notifikasi dan pengingat kontes telah disiapkan. Selamat berjuang!',
        isRegistered ? 'info' : 'success'
      );
    },
    [userProfile, openAuthModal, showToast]
  );

  const recordExamCompletion = useCallback(
    (summary: ExamResultSummary, activeContest: ScheduledContest | null): { deltaRating?: number; newRating?: number } => {
      let eloOutcome: { deltaRating?: number; newRating?: number } = {};

      if (activeContest) {
        const currentRating = userProfile?.contestRating ?? 1500;
        const maxScore = summary.maxPossibleScore || summary.totalQuestions * 5;
        const scoreRatio = maxScore > 0 ? summary.totalScore / maxScore : 0;
        const totalParticipants = activeContest.registeredCount;
        const estimatedRank = Math.max(1, Math.round((1 - scoreRatio * 0.92) * totalParticipants));
        const { delta, newRating } = calculateContestRatingDelta(
          currentRating,
          summary.totalScore,
          maxScore,
          estimatedRank,
          totalParticipants
        );
        eloOutcome = { deltaRating: delta, newRating };
      }

      if (userProfile) {
        setUserProfile((prev) => {
          if (!prev) return null;
          const currentHistory = { ...(prev.questionHistory || {}) };
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

          const updatedRatingHistory: ContestRatingHistoryItem[] = [...(prev.ratingHistory || [])];
          if (activeContest && eloOutcome.deltaRating !== undefined && eloOutcome.newRating !== undefined) {
            const maxScore = summary.maxPossibleScore || summary.totalQuestions * 5;
            const scoreRatio = maxScore > 0 ? summary.totalScore / maxScore : 0;
            const estRank = Math.max(1, Math.round((1 - scoreRatio * 0.92) * activeContest.registeredCount));
            updatedRatingHistory.unshift({
              contestId: activeContest.id,
              contestTitle: activeContest.title,
              rank: estRank,
              totalParticipants: activeContest.registeredCount,
              score: summary.totalScore,
              deltaRating: eloOutcome.deltaRating,
              newRating: eloOutcome.newRating,
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            });
          }

          const up: UserProfile = {
            ...prev,
            streakDays: summary.isOverallPassed ? prev.streakDays + 1 : prev.streakDays,
            highestExamScore: Math.max(prev.highestExamScore || 0, summary.totalScore),
            quizzesSolvedCount: (prev.quizzesSolvedCount || 0) + summary.answeredCount,
            isCompetenceVerified: true,
            questionHistory: currentHistory,
            contestRating: eloOutcome.newRating ?? prev.contestRating,
            contestsAttended: activeContest ? (prev.contestsAttended || 0) + 1 : prev.contestsAttended,
            ratingHistory: updatedRatingHistory,
          };
          const cleanUp = StorageEngine.prepareProfilePayload(up);
          StorageEngine.setItem('criliant_user_profile', cleanUp);
          return cleanUp;
        });

        showToast(
          activeContest
            ? `⚔️ Kontes Selesai! (${eloOutcome.deltaRating! >= 0 ? '+' : ''}${eloOutcome.deltaRating} ELO)`
            : summary.isOverallPassed
              ? '🎉 Selamat Target Tercapai!'
              : '📊 Simulasi Selesai!',
          `Skor: ${summary.totalScore}/${summary.maxPossibleScore || summary.totalQuestions * 5} | Riwayat soal tersimpan untuk sesi berikutnya.`,
          summary.isOverallPassed ? 'success' : 'info'
        );
      } else {
        showToast(
          '📊 Simulasi Selesai!',
          `Skor: ${summary.totalScore}. Masuk akun untuk menyimpan riwayat soal & ELO Rating.`,
          'info'
        );
      }

      return eloOutcome;
    },
    [userProfile, showToast]
  );

  const handleVacuumStorage = useCallback(async () => {
    try {
      const stats = await StorageEngine.vacuumCache();
      showToast(
        '🧹 Storage Engine Dioptimalkan',
        `Pembersihan selesai! Hemat ~${stats.freedKb} KB. Ukuran memori saat ini: ${stats.formattedSize}.`,
        'success'
      );
    } catch (e) {
      console.error('Failed to vacuum storage:', e);
      showToast('⚠️ Gagal Mengoptimalkan', 'Terjadi kesalahan saat merapikan database.', 'warning');
    }
  }, [showToast]);

  const handleClearMediaCache = useCallback(async () => {
    try {
      const stats = await StorageEngine.clearMediaCache();
      const freshPosts = await StorageEngine.getItem<StreamPost[]>('criliant_stream_posts');
      if (freshPosts) setPosts(freshPosts);
      const freshProfile = await StorageEngine.getItem<UserProfile>('criliant_user_profile');
      if (freshProfile) setUserProfile(freshProfile);

      showToast(
        '🖼️ Cache Media Berhasil Dihapus',
        `Blob gambar stream dibersihkan! Ukuran saat ini: ${stats.formattedSize}.`,
        'success'
      );
    } catch (e) {
      console.error('Failed to clear media cache:', e);
      showToast('⚠️ Gagal Menghapus Cache', 'Terjadi kesalahan saat membersihkan gambar.', 'warning');
    }
  }, [showToast]);

  return {
    userProfile,
    viewingProfileUser,
    setViewingProfileUser,
    posts,
    bookmarkedIds,
    allQuestions,
    toastNotification,
    setToastNotification,
    showToast,
    handleLogin,
    handleLogout,
    handleSaveProfile,
    handleResetQuestionHistory,
    handleToggleBookmark,
    handleLike,
    handleAddComment,
    handleAddPost,
    handleToggleFollow,
    handleOpenUserProfile,
    handleSubmitReport,
    handleAnswerQuiz,
    handleRegisterToggleContest,
    recordExamCompletion,
    handleVacuumStorage,
    handleClearMediaCache,
  };
}
