import { StudyTrack, Category, Question } from '@/types';

// Pemetaan Kategori Resmi per Kamar Ujian
export const TRACK_CATEGORIES: Record<StudyTrack, Category[]> = {
  cpns: ['TWK', 'TIU', 'TKP'],
  snbt: [
    'TPS_PENALARAN_UMUM',
    'TPS_KUANTITATIF',
    'LITERASI_INDONESIA',
    'PENALARAN_MATEMATIKA',
  ],
  kedinasan: [
    'TPA',
    'BAHASA_INGGRIS',
    'MTK_KEDINASAN',
    'PSIKOTES',
  ],
};

export interface ExamPackage {
  id: string;
  track: StudyTrack;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  durationSeconds: number;
  questionCount: number;
  iconEmoji: string;
  subTests: Array<{ name: string; count: number; note: string }>;
  targetedCategories?: Category[];
}

export const EXAM_PACKAGES: Record<StudyTrack, ExamPackage[]> = {
  cpns: [
    {
      id: 'CPNS_TRYOUT_FULL',
      track: 'cpns',
      title: 'Simulasi Penuh CAT BKN (110 Soal)',
      subtitle: 'Standar Resmi KepmenPAN-RB 2026',
      description: 'Format ujian asli 100 menit tanpa jeda: 30 TWK, 35 TIU, dan 45 TKP dengan penilaian ambang batas kelulusan.',
      badge: '100 Menit • 110 Soal',
      durationSeconds: 100 * 60,
      questionCount: 110,
      iconEmoji: '🏛️',
      subTests: [
        { name: '30 TWK', count: 30, note: 'Passing Grade: 65' },
        { name: '35 TIU', count: 35, note: 'Passing Grade: 80' },
        { name: '45 TKP', count: 45, note: 'Passing Grade: 166' },
      ],
      targetedCategories: ['TWK', 'TIU', 'TKP'],
    },
    {
      id: 'CPNS_DRILL_TIU',
      track: 'cpns',
      title: 'Latihan 1 Kategori: TIU (Hitung Cepat & Silogisme)',
      subtitle: 'Spesialis Pengasahan Skor Numerik',
      description: '25 Soal TIU intensif untuk mempertajam pola deret angka, analogi kata, dan silogisme partikular.',
      badge: '25 Menit • 25 Soal',
      durationSeconds: 25 * 60,
      questionCount: 25,
      iconEmoji: '⚡',
      subTests: [
        { name: 'Deret Angka', count: 10, note: 'Pola Cepat' },
        { name: 'Silogisme', count: 8, note: 'Logika Sah' },
        { name: 'Analogi', count: 7, note: 'Verbal' },
      ],
      targetedCategories: ['TIU'],
    },
    {
      id: 'CPNS_DRILL_TWK',
      track: 'cpns',
      title: 'Latihan 1 Kategori: TWK (Wawasan Kebangsaan)',
      subtitle: 'Pilar Negara, UUD 1945 & Integritas',
      description: '30 Soal murni hafalan dan penalaran bela negara, sejarah perjuangan, pasal UUD, dan nasionalisme.',
      badge: '25 Menit • 30 Soal',
      durationSeconds: 25 * 60,
      questionCount: 30,
      iconEmoji: '⚖️',
      subTests: [
        { name: 'Pancasila & UUD', count: 15, note: 'Hafalan Pasal' },
        { name: 'Bela Negara & Sejarah', count: 15, note: 'Nasionalisme' },
      ],
      targetedCategories: ['TWK'],
    },
    {
      id: 'CPNS_DRILL_TKP',
      track: 'cpns',
      title: 'Latihan 1 Kategori: TKP (Karakteristik Pribadi)',
      subtitle: 'Target Poin 5 Maksimal',
      description: '20 Soal studi kasus pelayanan publik, jejaring kerja, dan profesionalisme dengan bobot skor 1 sampai 5.',
      badge: '20 Menit • 20 Soal',
      durationSeconds: 20 * 60,
      questionCount: 20,
      iconEmoji: '🛡️',
      subTests: [
        { name: 'Pelayanan Publik', count: 8, note: 'Skala 1-5' },
        { name: 'Jejaring Kerja', count: 6, note: 'Skala 1-5' },
        { name: 'Anti-Radikalisme', count: 6, note: 'Skala 1-5' },
      ],
      targetedCategories: ['TKP'],
    },
  ],
  snbt: [
    {
      id: 'SNBT_TRYOUT_FULL',
      track: 'snbt',
      title: 'Simulasi Resmi SNBT UTBK PTN',
      subtitle: 'Standar Balai Pengelolaan Pengujian Pendidikan (BPPP)',
      description: 'Format resmi SNBT: Tes Potensi Skolastik (TPS), Literasi Bahasa, dan Penalaran Matematika.',
      badge: '115 Menit • 110 Soal',
      durationSeconds: 115 * 60,
      questionCount: 110,
      iconEmoji: '🎓',
      subTests: [
        { name: 'Penalaran Umum', count: 30, note: 'Logika Deduktif' },
        { name: 'Kuantitatif', count: 30, note: 'Aljabar & Data' },
        { name: 'Literasi & MTK', count: 50, note: 'Wacana Kritis' },
      ],
      targetedCategories: ['TPS_PENALARAN_UMUM', 'TPS_KUANTITATIF', 'LITERASI_INDONESIA', 'PENALARAN_MATEMATIKA'],
    },
    {
      id: 'SNBT_DRILL_TPS',
      track: 'snbt',
      title: 'Latihan 1 Kategori: TPS Skolastik',
      subtitle: 'Fondasi Utama Lolos PTN Impian',
      description: 'Fokus penalaran logika, pemodelan variabel, dan penalaran induktif-deduktif tanpa kalkulator.',
      badge: '30 Menit • 25 Soal',
      durationSeconds: 30 * 60,
      questionCount: 25,
      iconEmoji: '🧠',
      subTests: [
        { name: 'Penalaran Umum', count: 12, note: 'Induktif' },
        { name: 'Pengetahuan Kuantitatif', count: 13, note: 'Aritmetika' },
      ],
      targetedCategories: ['TPS_PENALARAN_UMUM', 'TPS_KUANTITATIF'],
    },
    {
      id: 'SNBT_DRILL_MATH',
      track: 'snbt',
      title: 'Latihan 1 Kategori: Penalaran Matematika',
      subtitle: 'Analisis Soal Cerita Kontekstual',
      description: 'Latihan interpretasi grafik, kombinatorika, dan pemecahan masalah kontekstual dunia nyata.',
      badge: '25 Menit • 20 Soal',
      durationSeconds: 25 * 60,
      questionCount: 20,
      iconEmoji: '📐',
      subTests: [
        { name: 'Pemodelan Fungsi', count: 10, note: 'Aljabar' },
        { name: 'Statistika & Peluang', count: 10, note: 'Analisis' },
      ],
      targetedCategories: ['PENALARAN_MATEMATIKA'],
    },
    {
      id: 'SNBT_DRILL_LITERASI',
      track: 'snbt',
      title: 'Latihan 1 Kategori: Literasi Bahasa Indonesia',
      subtitle: 'Pemahaman Wacana Kritis & Makna Teks',
      description: 'Melatih kemampuan menemukan ide pokok, simpulan paragraf, dan analisis argumen bacaan panjang.',
      badge: '25 Menit • 25 Soal',
      durationSeconds: 25 * 60,
      questionCount: 25,
      iconEmoji: '📖',
      subTests: [
        { name: 'Ide Pokok & Simpulan', count: 15, note: 'Pemahaman' },
        { name: 'Opini & Fakta', count: 10, note: 'Analisis' },
      ],
      targetedCategories: ['LITERASI_INDONESIA'],
    },
  ],
  kedinasan: [
    {
      id: 'KEDINASAN_TRYOUT_FULL',
      track: 'kedinasan',
      title: 'Simulasi SPMB STAN & STIS Terpadu',
      subtitle: 'Standar Gabungan SKD BKN + Nilai Mati TBI',
      description: 'Simulasi penuh dengan sistem seleksi gugur: Tes Potensi Akademik (TPA) dan Tes Bahasa Inggris (TBI).',
      badge: '100 Menit • 90 Soal',
      durationSeconds: 100 * 60,
      questionCount: 90,
      iconEmoji: '🛡️',
      subTests: [
        { name: 'TPA Numerik', count: 45, note: 'Logika Spasial' },
        { name: 'TBI B.Inggris', count: 35, note: 'Nilai Mati ≥ 60' },
        { name: 'Psikotes Matriks', count: 10, note: 'Angka Hilang' },
      ],
      targetedCategories: ['TPA', 'BAHASA_INGGRIS', 'MTK_KEDINASAN', 'PSIKOTES'],
    },
    {
      id: 'KEDINASAN_DRILL_TBI',
      track: 'kedinasan',
      title: 'Latihan 1 Kategori: TBI (Bahasa Inggris Nilai Mati)',
      subtitle: 'Inverted Sentence & Error Recognition',
      description: 'Drilling struktur grammar tingkat tinggi SPMB STAN yang sering menggugurkan peserta di bawah skor 60.',
      badge: '25 Menit • 25 Soal',
      durationSeconds: 25 * 60,
      questionCount: 25,
      iconEmoji: '🌐',
      subTests: [
        { name: 'Inversion & Conditional', count: 15, note: 'Grammar' },
        { name: 'Reading Comprehension', count: 10, note: 'Speed Reading' },
      ],
      targetedCategories: ['BAHASA_INGGRIS'],
    },
    {
      id: 'KEDINASAN_DRILL_TPA',
      track: 'kedinasan',
      title: 'Latihan 1 Kategori: TPA & Angka Hilang',
      subtitle: 'Uji Ketangkasan Pola Polstat STIS & STAN',
      description: 'Latihan kecepatan membaca matriks angka berputar, deret huruf, dan penalaran spasial.',
      badge: '20 Menit • 25 Soal',
      durationSeconds: 20 * 60,
      questionCount: 25,
      iconEmoji: '🔢',
      subTests: [
        { name: 'Matriks Angka', count: 15, note: 'Ketelitian' },
        { name: 'Spasial Gambar', count: 10, note: 'Visual 3D' },
      ],
      targetedCategories: ['TPA', 'PSIKOTES'],
    },
    {
      id: 'KEDINASAN_DRILL_MTK',
      track: 'kedinasan',
      title: 'Latihan 1 Kategori: Matematika Diskrit STIS',
      subtitle: 'Kalkulus, Matriks & Kombinatorika',
      description: 'Khusus pejuang Polstat STIS dan STIN untuk materi matematika sains tingkat lanjut.',
      badge: '30 Menit • 20 Soal',
      durationSeconds: 30 * 60,
      questionCount: 20,
      iconEmoji: '📐',
      subTests: [
        { name: 'Kombinatorika & Peluang', count: 10, note: 'Diskrit' },
        { name: 'Aljabar Matriks', count: 10, note: 'Analisis' },
      ],
      targetedCategories: ['MTK_KEDINASAN'],
    },
  ],
};

// Helper untuk menyaring bank soal 100% murni sesuai kurikulum kamar & paket yang dipilih
export function getFilteredQuestionsForTrack(
  allQuestions: Question[],
  track: StudyTrack,
  count?: number,
  targetedCategories?: Category[]
): Question[] {
  // Jika paket memiliki sub-kategori spesifik (misal: hanya TIU, atau hanya Penalaran MTK)
  const allowedCategories = targetedCategories && targetedCategories.length > 0
    ? targetedCategories
    : (TRACK_CATEGORIES[track] || TRACK_CATEGORIES.cpns);

  const filtered = allQuestions.filter((q) => allowedCategories.includes(q.category));

  if (filtered.length === 0) {
    // Fallback cadangan bila kategori spesifik belum ada soal: gunakan kategori umum kamar
    const fallbackKamar = allQuestions.filter((q) => (TRACK_CATEGORIES[track] || []).includes(q.category));
    const fallbackPool = fallbackKamar.length > 0 ? fallbackKamar : allQuestions;
    return count ? fallbackPool.slice(0, count) : fallbackPool;
  }

  // Shuffle acak
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return count ? shuffled.slice(0, count) : shuffled;
}
