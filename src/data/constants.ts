import { ExamModeConfig, StudyTrackInfo, StreamPost } from '@/types';

export const PASSING_GRADE_TWK = 65;
export const PASSING_GRADE_TIU = 80;
export const PASSING_GRADE_TKP = 166;
export const TOTAL_SOAL_SKD = 110;
export const TOTAL_WAKTU_SKD_DETIK = 100 * 60; // 100 menit

export const STUDY_TRACKS: Record<string, StudyTrackInfo> = {
  cpns: {
    id: 'cpns',
    title: 'CASN & CPNS 2026',
    shortLabel: 'CPNS 2026',
    subtitle: 'Standar Resmi SKD CAT BKN (TWK, TIU, TKP)',
    iconEmoji: '🏛️',
    targetExamples: 'Kemenkeu, BKN, Kejaksaan, Kemenkumham, Pemda',
    colorHex: '#2563EB',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: '🏛️ SKD BKN',
  },
  snbt: {
    id: 'snbt',
    title: 'SNBT & UTBK PTN',
    shortLabel: 'SNBT UTBK',
    subtitle: 'Standar BPPP Kemendikbud (TPS, Literasi, Penalaran MTK)',
    iconEmoji: '🎓',
    targetExamples: 'UI, ITB, UGM, Unpad, ITS, Undip, Brawijaya',
    colorHex: '#10B981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: '🎓 SNBT PTN',
  },
  kedinasan: {
    id: 'kedinasan',
    title: 'Sekolah Kedinasan',
    shortLabel: 'Kedinasan',
    subtitle: 'SPMB PKN STAN, Polstat STIS, IPDN, STIN, STMKG',
    iconEmoji: '🛡️',
    targetExamples: 'PKN STAN, Polstat STIS, IPDN, STIN, Poltekip',
    colorHex: '#F59E0B',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: '🛡️ Kedinasan',
  },
};

export const EXAM_MODES: ExamModeConfig[] = [
  {
    id: 'DAILY',
    title: 'Teka-Teki Harian',
    description: '10 Soal kurasi hari ini untuk asah insting kilat',
    questionCount: 10,
    durationSeconds: 600,
    badge: '10 Menit',
    icon: '⚡',
  },
  {
    id: 'EASY',
    title: 'Pemanasan (Easy)',
    description: 'Latihan fondasi materi tanpa tekanan waktu',
    questionCount: 15,
    durationSeconds: 1200,
    badge: 'Santai',
    icon: '🌱',
  },
  {
    id: 'NORMAL',
    title: 'Standar BKN (Normal)',
    description: 'Tingkat kesulitan dan waktu setara ujian asli',
    questionCount: 30,
    durationSeconds: 1800,
    badge: 'Realistis',
    icon: '🎯',
  },
  {
    id: 'HARD_HOTS',
    title: 'Expert (HOTS)',
    description: 'Penalaran kritis dan soal cerita kompleks tingkat tinggi',
    questionCount: 20,
    durationSeconds: 1200,
    badge: 'HOTS Level 4',
    icon: '🔥',
  },
  {
    id: 'SURVIVAL',
    title: 'Survival 3 Nyawa',
    description: 'Uji ketelitian ekstrem: salah 3 kali langsung gugur',
    questionCount: 50,
    durationSeconds: 1500,
    maxMistakesAllowed: 3,
    badge: '3 Nyawa ❤️❤️❤️',
    icon: '💀',
  },
  {
    id: 'TRYOUT_FULL',
    title: 'Simulasi CAT BKN 110',
    description: 'Tryout resmi lengkap 110 soal standar KepmenPAN-RB (TWK:30, TIU:35, TKP:45)',
    questionCount: 110,
    durationSeconds: 6000,
    badge: '100 Menit Resmi',
    icon: '⚔️',
  },
];

export const CASHTAGS_BY_TRACK = {
  cpns: ['#Semua', '$TWK', '$TIU', '$TKP', '$Kemenkeu', '$Kejaksaan', '$BKN', '🔥 Trending'],
  snbt: ['#Semua', '$TPS-PU', '$Kuantitatif', '$Literasi', '$PenalaranMTK', '$FK-UI', '$STEI-ITB', '🔥 Trending'],
  kedinasan: ['#Semua', '$MTK-Kedinasan', '$TBI', '$AngkaHilang', '$STAN', '$STIS', '$IPDN', '🔥 Trending'],
};

export const INITIAL_POSTS: StreamPost[] = [
  {
    id: 'quiz_cpns_01',
    authorId: 'usr_mentor_tiu',
    authorName: 'Mentor TIU Master',
    authorUsername: 'mentor_tiu',
    authorBadge: 'Verified Coach BKN',
    avatarInitial: 'M',
    timeAgo: '12m',
    cashtag: '$TIU-Silogisme',
    track: 'cpns',
    content: '⚡ Kuis Silogisme Cepat 15 Detik! Pola partikular "Semua vs Sebagian" ini sering banget jadi jebakan betmen di CAT BKN. Coba jawab langsung di bawah tanpa hitung manual:',
    microQuiz: {
      questionText: 'Semua atlet pandai berenang. Sebagian atlet gemar makan pedas. Kesimpulan yang sah adalah...',
      options: [
        { index: 0, text: 'Semua yang pandai berenang gemar makan pedas', votePercentage: 12 },
        { index: 1, text: 'Sebagian yang pandai berenang gemar makan pedas', votePercentage: 74 },
        { index: 2, text: 'Yang tidak gemar makan pedas bukan atlet', votePercentage: 8 },
        { index: 3, text: 'Semua atlet tidak gemar makan pedas', votePercentage: 6 }
      ],
      correctIndex: 1,
      explanation: 'Hukum Silogisme Resmi BKN: Premis universal ("Semua") + premis partikular ("Sebagian") selalu menghasilkan kesimpulan partikular ("Sebagian"). Karena semua atlet berenang dan sebagian gemar makan pedas, maka sebagian yang pandai berenang gemar makan pedas.',
      totalVotes: 1842,
    },
    upvoteCount: 218,
    commentCount: 34,
    isUpvoted: false,
    comments: [
      { id: 'c1', authorName: 'Budi Setiawan', authorUsername: 'budi_setiawan', authorBadge: 'Pejuang NIP', text: 'Mantap kak, ini kaidah term penengah (middle term) ya? Kalau premis negatif kesimpulannya juga negatif kan?', timeAgo: '8m', avatarInitial: 'B' },
      { id: 'c2', authorName: 'Siti Rahma', authorUsername: 'siti_rahma', authorBadge: null, text: 'Awalnya kejebak opsi C wkwk, makasih pembahasannya langsung paham!', timeAgo: '4m', avatarInitial: 'S' }
    ]
  },
  {
    id: 'post_01',
    authorId: 'usr_rian_pratama',
    authorName: 'Rian Pratama',
    authorUsername: 'rian_pratama',
    authorBadge: 'Top 1% Scorer',
    avatarInitial: 'R',
    timeAgo: '35m',
    cashtag: '$Kemenkeu',
    track: 'cpns',
    content: 'Alhamdulillah tryout akbar paket 1 tembus skor 485! 🔥 Kuncinya jangan overthinking di TKP. Dahulukan soal TIU hitung cepat & silogisme di 35 menit awal, baru hajar TKP dengan fokus empati pelayanan publik & anti-radikalisme.',
    verifiedScore: {
      totalScore: 485,
      breakdownText: 'TWK 95 • TIU 150 • TKP 240',
      percentileText: 'Top 1% Nasional (P99.2)',
      isPassed: true
    },
    upvoteCount: 342,
    commentCount: 48,
    isUpvoted: true,
    comments: [
      { id: 'c3', authorName: 'Andi Wijaya', authorUsername: 'andi_wijaya', authorBadge: 'Pejuang Kemenkeu', text: 'Gila bro TIU 150 sempurna banget! Lu ada trik khusus buat deret angka bertingkat 3?', timeAgo: '20m', avatarInitial: 'A' },
      { id: 'c4', authorName: 'Rian Pratama', authorUsername: 'rian_pratama', authorBadge: 'Top 1% Scorer', text: '@Andi Wijaya cari selisih pertama dulu bro. Kalau belum konstan, cari selisih keduanya, biasanya ketemu pola n^2 atau +3, +5, +7.', timeAgo: '15m', avatarInitial: 'R' }
    ]
  },
  {
    id: 'quiz_snbt_01',
    authorId: 'usr_dimas_utbk',
    authorName: 'Kak Dimas UTBK',
    authorUsername: 'dimas_utbk',
    authorBadge: 'Alumni STEI ITB',
    avatarInitial: 'D',
    timeAgo: '1h',
    cashtag: '$PenalaranMTK',
    track: 'snbt',
    content: '🎯 Soal HOTS Penalaran Matematika SNBT 2026! Uji insting pemodelan aljabar kamu di bawah ini langsung di feed:',
    microQuiz: {
      questionText: 'Sebuah barisan aritmetika memiliki suku ke-3 = 14 dan suku ke-7 = 26. Berapakah jumlah 10 suku pertama (S10)?',
      options: [
        { index: 0, text: '195', votePercentage: 14 },
        { index: 1, text: '215', votePercentage: 72 },
        { index: 2, text: '225', votePercentage: 9 },
        { index: 3, text: '235', votePercentage: 5 }
      ],
      correctIndex: 1,
      explanation: 'Beda b = (U7 - U3) / (7 - 3) = (26 - 14) / 4 = 12 / 4 = 3. Suku pertama a = U3 - 2b = 14 - 2(3) = 8. Maka S10 = 10/2 * (2(8) + 9(3)) = 5 * (16 + 27) = 5 * 43 = 215.',
      totalVotes: 1520,
    },
    upvoteCount: 195,
    commentCount: 29,
    isUpvoted: false,
    comments: [
      { id: 'c5', authorName: 'Fajar Nugraha', authorUsername: 'fajar_nugraha', text: 'Rumus cepatnya mantap kak, tinggal beda per selisih indeks!', timeAgo: '45m', avatarInitial: 'F' }
    ]
  },
  {
    id: 'post_02',
    authorId: 'usr_sarah_amalia',
    authorName: 'Sarah Amalia',
    authorUsername: 'sarah_amalia',
    authorBadge: 'STAN 2025',
    avatarInitial: 'S',
    timeAgo: '2h',
    cashtag: '$STAN',
    track: 'kedinasan',
    content: 'Jangan remehin nilai mati Bahasa Inggris (TBI) SPMB STAN ya guys! Tahun lalu banyak yang nilainya tinggi di TPA tapi gugur karena TBI di bawah 60. Fokus di Inversion sama Subjunctive Mood.',
    upvoteCount: 164,
    commentCount: 18,
    isUpvoted: false,
    comments: [
      { id: 'c6', authorName: 'Kevin Halim', authorUsername: 'kevin_halim', text: 'Betul banget kak, materi inverted conditional sering keluar di 10 nomor awal.', timeAgo: '1h', avatarInitial: 'K' }
    ]
  }
];

export const TICKER_UPDATES = [
  '🔥 Budi baru saja lulus Passing Grade SKD CAT BKN Skor 485!',
  '⚡ 3.420 pejuang sedang aktif mengerjakan kuis mikro $TIU',
  '🏛️ Info Resmi: Ambang Batas SKD 2026 TWK: 65, TIU: 80, TKP: 166',
  '🎓 Rian menyelesaikan Tryout SNBT dengan persentil Top 2% Nasional',
  '🛡️ 1.250 pejuang STAN sedang drilling simulasi TBI & TPA'
];

