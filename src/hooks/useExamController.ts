'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  StudyTrack,
  Question,
  ExamMode,
  ExamResultSummary,
  ScheduledContest,
  UserProfile,
  ActiveExamSession,
} from '@/types';
import { resolveExamPackage, getFilteredQuestionsForTrack } from '@/data/examPackages';
import { QuestionService } from '@/services/questionService';
import { StorageEngine } from '@/utils/storageEngine';

export function useExamController(
  activeTrack: StudyTrack,
  allQuestions: Question[],
  userProfile: UserProfile | null,
  recordExamCompletion: (
    summary: ExamResultSummary,
    contest: ScheduledContest | null
  ) => { deltaRating?: number; newRating?: number },
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void
) {
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examMode, setExamMode] = useState<ExamMode>('TRYOUT_FULL');
  const [examTrack, setExamTrack] = useState<StudyTrack>(activeTrack);
  const [examTitle, setExamTitle] = useState<string>('Simulasi Criliant');
  const [examIsFullCpnsSkd, setExamIsFullCpnsSkd] = useState<boolean>(false);
  const [activeContest, setActiveContest] = useState<ScheduledContest | null>(null);
  const [examDuration, setExamDuration] = useState(6000);
  const [lastExamResult, setLastExamResult] = useState<ExamResultSummary | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Crash Recovery State
  const [pendingResumeSession, setPendingResumeSession] = useState<ActiveExamSession | null>(null);
  const [initialSessionForExam, setInitialSessionForExam] = useState<ActiveExamSession | null>(null);

  // Check for saved exam session on startup (within last 24 hours)
  useEffect(() => {
    StorageEngine.getItem<ActiveExamSession>('criliant_active_exam_session')
      .then((saved) => {
        if (saved && saved.questions && saved.questions.length > 0) {
          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
          if (saved.lastSavedAt && saved.lastSavedAt > oneDayAgo && saved.remainingSeconds > 10) {
            setPendingResumeSession(saved);
          } else {
            StorageEngine.removeItem('criliant_active_exam_session');
          }
        }
      })
      .catch((e) => console.warn('[StorageEngine] Error reading active exam session:', e));
  }, []);

  const handleResumeActiveSession = useCallback(() => {
    if (!pendingResumeSession) return;
    setInitialSessionForExam(pendingResumeSession);
    setExamQuestions(pendingResumeSession.questions);
    setExamTrack(pendingResumeSession.track);
    setExamTitle(pendingResumeSession.examTitle);
    setExamIsFullCpnsSkd(pendingResumeSession.isFullCpnsSkd);
    setExamMode(pendingResumeSession.mode);
    setExamDuration(pendingResumeSession.durationSeconds);
    setActiveContest(null);
    setIsExamModalOpen(true);
    setPendingResumeSession(null);
    showToast(
      '⚡ Sesi Simulasi Dipulihkan!',
      `Melanjutkan dari soal No. ${pendingResumeSession.currentIndex + 1} dengan sisa waktu ${Math.round(pendingResumeSession.remainingSeconds / 60)} menit.`,
      'success'
    );
  }, [pendingResumeSession, showToast]);

  const handleDismissResumeSession = useCallback(() => {
    StorageEngine.removeItem('criliant_active_exam_session');
    setPendingResumeSession(null);
    showToast('Sesi Tersimpan Dihapus', 'Kamu dapat memulai sesi simulasi baru.', 'info');
  }, [showToast]);

  const handleStartExam = useCallback(
    async (packageOrModeId: string) => {
      setInitialSessionForExam(null);
      const selectedPkg = resolveExamPackage(activeTrack, packageOrModeId);
      const seenQuestionIds = userProfile?.questionHistory ? Object.keys(userProfile.questionHistory) : [];
      const isDaily = packageOrModeId === 'DAILY' || packageOrModeId.startsWith('DAILY_');
      const isFullSkd = selectedPkg.id === 'CPNS_TRYOUT_FULL';

      setActiveContest(null);
      setExamTrack(selectedPkg.track);
      setExamTitle(selectedPkg.title);
      setExamIsFullCpnsSkd(isFullSkd);
      setExamMode(isDaily ? 'DAILY' : 'TRYOUT_FULL');
      setExamDuration(selectedPkg.durationSeconds);

      try {
        const questionsForExam = await QuestionService.generateExamSession(
          selectedPkg.track,
          selectedPkg.questionCount,
          selectedPkg.targetedCategories,
          false,
          seenQuestionIds
        );
        setExamQuestions(questionsForExam);
        setIsExamModalOpen(true);
      } catch (err) {
        console.warn('Using sync fallback for exam session:', err);
        const fallbackQuestions = getFilteredQuestionsForTrack(
          allQuestions,
          selectedPkg.track,
          selectedPkg.questionCount,
          selectedPkg.targetedCategories
        );
        setExamQuestions(fallbackQuestions);
        setIsExamModalOpen(true);
      }
    },
    [activeTrack, allQuestions, userProfile]
  );

  const handleEnterContest = useCallback(
    async (contest: ScheduledContest) => {
      setInitialSessionForExam(null);
      const seenQuestionIds = userProfile?.questionHistory ? Object.keys(userProfile.questionHistory) : [];
      const isFullSkd = contest.track === 'cpns' && contest.questionCount >= 90;

      setActiveContest(contest);
      setExamTrack(contest.track);
      setExamTitle(contest.title);
      setExamIsFullCpnsSkd(isFullSkd);
      setExamMode('TRYOUT_FULL');
      setExamDuration(contest.durationMinutes * 60);

      try {
        const questions = await QuestionService.generateExamSession(
          contest.track,
          contest.questionCount,
          contest.targetCategories,
          false,
          seenQuestionIds
        );
        setExamQuestions(questions);
        setIsExamModalOpen(true);
        showToast('⚔️ Masuk Ruang Kontes!', `Memulai ${contest.title} (${contest.durationMinutes} Menit)`, 'info');
      } catch (e) {
        console.error('Failed to start contest session:', e);
        const fallback = getFilteredQuestionsForTrack(
          allQuestions,
          contest.track,
          contest.questionCount,
          contest.targetCategories
        );
        setExamQuestions(fallback);
        setIsExamModalOpen(true);
      }
    },
    [allQuestions, userProfile, showToast]
  );

  const handleStartCustomDrill = useCallback(
    (selectedQuestions: Question[]) => {
      if (selectedQuestions.length === 0) return;
      setInitialSessionForExam(null);
      setActiveContest(null);
      setExamTrack(activeTrack);
      setExamTitle(`Drilling Bank Soal (${selectedQuestions.length} Soal)`);
      setExamIsFullCpnsSkd(false);
      setExamMode('NORMAL');
      setExamDuration(selectedQuestions.length * 60);
      setExamQuestions(selectedQuestions);
      setIsExamModalOpen(true);
    },
    [activeTrack]
  );

  const handleFinishExam = useCallback(
    (summary: ExamResultSummary) => {
      setIsExamModalOpen(false);
      setInitialSessionForExam(null);
      const eloOutcome = recordExamCompletion(summary, activeContest);
      const enrichedSummary: ExamResultSummary = {
        ...summary,
        contestDeltaRating: eloOutcome.deltaRating,
        contestNewRating: eloOutcome.newRating,
      };
      setLastExamResult(enrichedSummary);
      setIsResultModalOpen(true);
      setActiveContest(null);
    },
    [activeContest, recordExamCompletion]
  );

  return {
    isExamModalOpen,
    setIsExamModalOpen,
    examQuestions,
    examMode,
    examTrack,
    examTitle,
    examIsFullCpnsSkd,
    activeContest,
    examDuration,
    lastExamResult,
    isResultModalOpen,
    setIsResultModalOpen,
    pendingResumeSession,
    initialSessionForExam,
    handleResumeActiveSession,
    handleDismissResumeSession,
    handleStartExam,
    handleEnterContest,
    handleStartCustomDrill,
    handleFinishExam,
  };
}
