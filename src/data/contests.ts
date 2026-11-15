import { ScheduledContest, ContestParticipantStanding, ContestTier, StudyTrack } from '@/types';

export const CONTEST_TIER_CONFIG: Record<
  ContestTier,
  { label: string; minRating: number; color: string; badgeBg: string; textColor: string; icon: string }
> = {
  NOVICE: {
    label: 'Novice',
    minRating: 0,
    color: 'from-amber-700 to-amber-900',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
    icon: '🟤',
  },
  FIGHTER: {
    label: 'Fighter',
    minRating: 1400,
    color: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    icon: '🟢',
  },
  EXPERT: {
    label: 'Expert',
    minRating: 1600,
    color: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400',
    icon: '🔵',
  },
  MASTER: {
    label: 'Master / Pejuang NIP',
    minRating: 1850,
    color: 'from-purple-600 to-pink-600',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400',
    icon: '🟣',
  },
  GRANDMASTER: {
    label: 'Grandmaster / Top 1% Nasional',
    minRating: 2100,
    color: 'from-amber-400 via-rose-500 to-red-600',
    badgeBg: 'bg-gradient-to-r from-amber-200 to-rose-200 dark:from-amber-950/80 dark:to-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800',
    textColor: 'text-rose-600 dark:text-rose-400 font-extrabold',
    icon: '👑',
  },
};

export function getTierFromRating(rating: number): ContestTier {
  if (rating >= 2100) return 'GRANDMASTER';
  if (rating >= 1850) return 'MASTER';
  if (rating >= 1600) return 'EXPERT';
  if (rating >= 1400) return 'FIGHTER';
  return 'NOVICE';
}

// Jadwal Kontes Mingguan & Harian Terjadwal (LeetCode Style)
export const SCHEDULED_CONTESTS: ScheduledContest[] = [
  // --- CPNS TRACK ---
  {
    id: 'CPNS_WEEKLY_48',
    track: 'cpns',
    title: 'Weekly CAT BKN Grand Prix #48',
    subtitle: 'Simulasi Akbar Serentak se-Indonesia',
    type: 'WEEKLY',
    status: 'LIVE', // Sedang berlangsung sekarang
    startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // Dimulai 25 menit lalu
    endTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),   // Berakhir dalam 75 menit
    durationMinutes: 100,
    questionCount: 110,
    registeredCount: 4892,
    bannerGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    badgeTag: '🔴 SEDANG BERLANGSUNG',
    description: '110 Soal CAT resmi BKN tanpa jeda (TWK, TIU, TKP). Sistem penilaian passing grade dan penalti waktu LeetCode.',
    targetCategories: ['TWK', 'TIU', 'TKP'],
  },
  {
    id: 'CPNS_NIGHT_CLASH_12',
    track: 'cpns',
    title: 'Midweek Night Clash #12: TIU Speed Drills',
    subtitle: 'Rabu Malam Kebut Logika & Deret',
    type: 'NIGHT_CLASH',
    status: 'UPCOMING',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 hari lagi
    endTime: new Date(Date.now() + (2 * 24 * 60 + 45) * 60 * 1000).toISOString(),
    durationMinutes: 45,
    questionCount: 30,
    registeredCount: 1720,
    bannerGradient: 'from-amber-600 via-orange-600 to-slate-900',
    badgeTag: '⏰ 2 HARI LAGI • 20:00 WIB',
    description: '30 Soal TIU HOTS (Deret, Analogi, Silogisme). Pinalti +2 menit per kesalahan submit. Pengasahan kecepatan berpikir kilat.',
    targetCategories: ['TIU'],
  },
  {
    id: 'CPNS_WEEKLY_47',
    track: 'cpns',
    title: 'Weekly CAT BKN Grand Prix #47 (Virtual Contest)',
    subtitle: 'Arsip Kontes Minggu Lalu',
    type: 'WEEKLY',
    status: 'FINISHED',
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 100 * 60 * 1000).toISOString(),
    durationMinutes: 100,
    questionCount: 110,
    registeredCount: 6140,
    bannerGradient: 'from-slate-700 to-slate-900',
    badgeTag: '📜 VIRTUAL TRYOUT TERSEDIA',
    description: 'Kerjakan arsip soal kontes minggu lalu dalam mode simulasi waktu nyata untuk menguji ketahanan mental.',
    targetCategories: ['TWK', 'TIU', 'TKP'],
  },

  // --- SNBT UTBK TRACK ---
  {
    id: 'SNBT_WEEKLY_24',
    track: 'snbt',
    title: 'SNBT National League #24: All-Subtest Battle',
    subtitle: 'Simulasi UTBK Penalaran Umum & Kuantitatif',
    type: 'WEEKLY',
    status: 'UPCOMING',
    startTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // Besok
    endTime: new Date(Date.now() + (18 * 60 + 90) * 60 * 1000).toISOString(),
    durationMinutes: 90,
    questionCount: 60,
    registeredCount: 3410,
    bannerGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    badgeTag: '⏰ MINGGU 09:00 WIB',
    description: '60 Soal HOTS penalaran umum, literasi, dan matematika berbasis pembobotan IRT (Item Response Theory).',
    targetCategories: ['TPS_PENALARAN_UMUM', 'TPS_KUANTITATIF', 'LITERASI_INDONESIA', 'PENALARAN_MATEMATIKA'],
  },
  {
    id: 'SNBT_NIGHT_CLASH_09',
    track: 'snbt',
    title: 'Night Speed-Run: Penalaran Matematika',
    subtitle: 'Trik Cepat Aljabar & Geometri',
    type: 'NIGHT_CLASH',
    status: 'FINISHED',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - (3 * 24 * 60 - 40) * 60 * 1000).toISOString(),
    durationMinutes: 40,
    questionCount: 25,
    registeredCount: 2190,
    bannerGradient: 'from-teal-800 to-slate-900',
    badgeTag: '📜 VIRTUAL TRYOUT TERSEDIA',
    description: '25 Soal kilat penalaran aljabar dan geometri praktis dengan pembatasan waktu ketat.',
    targetCategories: ['PENALARAN_MATEMATIKA', 'TPS_KUANTITATIF'],
  },

  // --- KEDINASAN TRACK ---
  {
    id: 'KEDINASAN_SUNDAY_STAN_15',
    track: 'kedinasan',
    title: 'Kedinasan Arena #15: TBI STAN & Matriks STIS',
    subtitle: 'Uji Ketangkasan Grammar Inversion & Logika Spasial',
    type: 'WEEKLY',
    status: 'UPCOMING',
    startTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + (28 * 60 + 80) * 60 * 1000).toISOString(),
    durationMinutes: 80,
    questionCount: 50,
    registeredCount: 2780,
    bannerGradient: 'from-purple-600 via-indigo-800 to-slate-900',
    badgeTag: '⏰ MINGGU 14:00 WIB',
    description: '50 Soal kombinasi Tes Bahasa Inggris (Inversion/Conditional) dan Matematika Terapan Polstat STIS.',
    targetCategories: ['TPA', 'BAHASA_INGGRIS', 'MTK_KEDINASAN'],
  },
];

// Standings / Leaderboard Mock Data untuk Kontes Live
export const MOCK_CONTEST_STANDINGS: ContestParticipantStanding[] = [
  {
    rank: 1,
    userId: 'u_101',
    userName: 'Rian Pratama',
    avatarInitial: 'R',
    rating: 2240,
    tier: 'GRANDMASTER',
    score: 495,
    penaltyTimeSeconds: 3120, // 52 menit
  },
  {
    rank: 2,
    userId: 'u_102',
    userName: 'Sarah Dania, S.Tr.',
    avatarInitial: 'S',
    rating: 2115,
    tier: 'GRANDMASTER',
    score: 490,
    penaltyTimeSeconds: 3450,
  },
  {
    rank: 3,
    userId: 'u_103',
    userName: 'Dimas Ardiansyah',
    avatarInitial: 'D',
    rating: 1980,
    tier: 'MASTER',
    score: 485,
    penaltyTimeSeconds: 3600,
  },
  {
    rank: 4,
    userId: 'u_104',
    userName: 'Aulia Nurul F.',
    avatarInitial: 'A',
    rating: 1890,
    tier: 'MASTER',
    score: 475,
    penaltyTimeSeconds: 3910,
  },
  {
    rank: 5,
    userId: 'u_105',
    userName: 'Bagus Wicaksono',
    avatarInitial: 'B',
    rating: 1740,
    tier: 'EXPERT',
    score: 465,
    penaltyTimeSeconds: 4100,
  },
  {
    rank: 6,
    userId: 'u_106',
    userName: 'Cindy Claudia',
    avatarInitial: 'C',
    rating: 1680,
    tier: 'EXPERT',
    score: 450,
    penaltyTimeSeconds: 4320,
  },
  {
    rank: 7,
    userId: 'u_107',
    userName: 'Fajar Nugraha',
    avatarInitial: 'F',
    rating: 1530,
    tier: 'FIGHTER',
    score: 440,
    penaltyTimeSeconds: 4600,
  },
  {
    rank: 8,
    userId: 'u_108',
    userName: 'Zahra Amelia',
    avatarInitial: 'Z',
    rating: 1470,
    tier: 'FIGHTER',
    score: 425,
    penaltyTimeSeconds: 4890,
  },
];

// Helper kalkulasi ELO Delta pasca kontes
export function calculateContestRatingDelta(
  currentRating: number,
  userScore: number,
  maxScore: number,
  userRank: number,
  totalParticipants: number
): { delta: number; newRating: number } {
  const percentile = (totalParticipants - userRank + 1) / totalParticipants;
  const scoreRatio = userScore / (maxScore || 500);

  // ELO variation formula
  const baseDelta = (percentile - 0.5) * 60;
  const performanceBonus = (scoreRatio - 0.7) * 40;
  const delta = Math.round(baseDelta + performanceBonus);

  const newRating = Math.max(800, currentRating + delta);
  return { delta, newRating };
}
