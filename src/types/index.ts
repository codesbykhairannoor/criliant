export type StudyTrack = 'cpns' | 'snbt' | 'kedinasan';

export interface StudyTrackInfo {
  id: StudyTrack;
  title: string;
  shortLabel: string;
  subtitle: string;
  iconEmoji: string;
  targetExamples: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
}

export type Category = 
  | 'TWK' 
  | 'TIU' 
  | 'TKP' 
  | 'MTK_KEDINASAN' 
  | 'TPA' 
  | 'PSIKOTES' 
  | 'BAHASA_INGGRIS' 
  | 'TPS_PENALARAN_UMUM' 
  | 'TPS_KUANTITATIF' 
  | 'LITERASI_INDONESIA' 
  | 'PENALARAN_MATEMATIKA' 
  | 'MANDIRI_MATEMATIKA_DASAR' 
  | 'MANDIRI_SAINTEK' 
  | 'MANDIRI_SOSHUM';

export type CategoryGroup = 'SKD_CPNS' | 'KEDINASAN' | 'SNBT_UTBK' | 'UJIAN_MANDIRI';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'hard_hots';

export interface Question {
  id: string;
  text: string;
  category: Category;
  subTopic: string;
  options: string[];
  correctOptionIndex: number;
  tkpOptionPoints?: number[];
  explanation: string;
  difficulty: DifficultyLevel;
  imageUrl?: string | null;
  isBookmarked?: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number | null;
  isDoubtful: boolean;
}

export interface QuestionReviewItem {
  question: Question;
  selectedOptionIndex: number | null;
  earnedScore: number;
  isCorrect: boolean;
}

export interface ExamResultSummary {
  mode: ExamMode;
  track?: StudyTrack;
  examTitle?: string;
  isFullCpnsSkd?: boolean;
  maxPossibleScore?: number;
  contestId?: string;
  contestDeltaRating?: number;
  contestNewRating?: number;
  totalScore: number;
  twkScore: number;
  tiuScore: number;
  tkpScore: number;
  isTwkPassed: boolean;
  isTiuPassed: boolean;
  isTkpPassed: boolean;
  isOverallPassed: boolean;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  timeSpentSeconds: number;
  reviewItems: QuestionReviewItem[];
  createdAt: number;
}

export type ExamMode = 'DAILY' | 'EASY' | 'NORMAL' | 'HARD_HOTS' | 'SURVIVAL' | 'TRYOUT_FULL';

export interface ExamModeConfig {
  id: ExamMode;
  title: string;
  description: string;
  questionCount: number;
  durationSeconds: number;
  maxMistakesAllowed?: number;
  badge: string;
  icon: string;
}

export interface VerifiedScoreBadge {
  totalScore: number;
  breakdownText: string;
  percentileText: string;
  isPassed: boolean;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorBadge?: string | null;
  text: string;
  timeAgo: string;
  avatarInitial?: string;
}

export interface MicroQuizOption {
  index: number;
  text: string;
  votePercentage: number;
}

export interface MicroQuizData {
  questionText: string;
  options: MicroQuizOption[];
  correctIndex: number;
  explanation: string;
  userSelectedIndex?: number | null;
  totalVotes: number;
}

export interface StreamPost {
  id: string;
  authorId?: string;
  authorName: string;
  authorBadge?: string | null;
  authorPhotoUrl?: string | null;
  avatarInitial: string;
  timeAgo: string;
  cashtag: string;
  track: StudyTrack;
  content: string;
  imageUrl?: string | null;
  verifiedScore?: VerifiedScoreBadge | null;
  microQuiz?: MicroQuizData | null;
  upvoteCount: number;
  likeCount?: number;
  isLiked?: boolean;
  downvoteCount?: number;
  score?: number; // Net score: upvotes - downvotes
  userVote?: 1 | -1 | 0; // Reddit vote state: 1 (up), -1 (down), 0 (neutral)
  commentCount: number;
  isUpvoted?: boolean;
  comments: PostComment[];
}

export interface QuestionHistoryRecord {
  questionId: string;
  isCorrect: boolean;
  attemptedAt: number;
  timesSeen: number;
}

export type ContestStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';

export type ContestTier = 'NOVICE' | 'FIGHTER' | 'EXPERT' | 'MASTER' | 'GRANDMASTER';

export interface ContestRatingHistoryItem {
  contestId: string;
  contestTitle: string;
  rank: number;
  totalParticipants: number;
  score: number;
  deltaRating: number;
  newRating: number;
  date: string;
}

export interface ScheduledContest {
  id: string;
  track: StudyTrack;
  title: string;
  subtitle: string;
  type: 'WEEKLY' | 'NIGHT_CLASH' | 'MONTHLY_GRAND';
  status: ContestStatus;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  durationMinutes: number;
  questionCount: number;
  registeredCount: number;
  bannerGradient: string;
  badgeTag: string;
  description: string;
  targetCategories: Category[];
  isRegistered?: boolean;
}

export interface ContestParticipantStanding {
  rank: number;
  userId: string;
  userName: string;
  avatarInitial: string;
  rating: number;
  tier: ContestTier;
  score: number;
  penaltyTimeSeconds: number; // Finish time + wrong submission penalty
  isCurrentUser?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  targetAgency: string;
  avatarInitial: string;
  avatarPhotoUrl?: string | null;
  bannerTheme?: 'default' | 'emerald' | 'amber' | 'rose' | 'midnight';
  bio: string;
  streakDays: number;
  studyTrack: StudyTrack;
  dailyGoalQuestions?: number;
  telegramUsername?: string;
  instagramUsername?: string;
  quizzesSolvedCount?: number; // Proof of Competence: Number of quizzes solved
  isCompetenceVerified?: boolean; // True once user completes >= 1 quiz or exam
  reputationKarma?: number; // Peer-reviewed reputation
  followersCount?: number;
  followingCount?: number;
  followingIds?: string[]; // IDs of users/creators this user follows
  highestExamScore?: number;
  questionHistory?: Record<string, QuestionHistoryRecord>; // Anti-soal berulang history
  contestRating?: number; // LeetCode style ELO Rating (e.g. 1500)
  contestsAttended?: number;
  globalRank?: number;
  ratingHistory?: ContestRatingHistoryItem[];
  registeredContestIds?: string[];
}


