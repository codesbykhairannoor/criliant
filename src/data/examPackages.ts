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
    },
    {
      id: 'CPNS_DRILL_TIU',
      track: 'cpns',
      title: 'Drilling Kilat TIU (Hitung Cepat & Silogisme)',
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
    },
    {
      id: 'CPNS_DRILL_TKP',
      track: 'cpns',
      title: 'Drilling Anti-Radikalisme & Integritas (TKP)',
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
    },
    {
      id: 'SNBT_DRILL_TPS',
      track: 'snbt',
      title: 'Drilling Skolastik (TPS & Kuantitatif)',
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
    },
    {
      id: 'SNBT_DRILL_MATH',
      track: 'snbt',
      title: 'Drilling Penalaran Matematika',
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
    },
    {
      id: 'KEDINASAN_DRILL_TBI',
      track: 'kedinasan',
      title: 'Drilling TBI Bebas Nilai Mati',
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
    },
    {
      id: 'KEDINASAN_DRILL_TPA',
      track: 'kedinasan',
      title: 'Drilling TPA & Angka Hilang',
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
    },
  ],
};

// Helper untuk menyaring bank soal 100% murni sesuai kamar
export function getFilteredQuestionsForTrack(
  allQuestions: Question[],
  track: StudyTrack,
  count?: number
): Question[] {
  const allowedCategories = TRACK_CATEGORIES[track] || TRACK_CATEGORIES.cpns;
  const filtered = allQuestions.filter((q) => allowedCategories.includes(q.category));

  if (filtered.length === 0) {
    // Fallback bila bank soal track spesifik belum lengkap: gunakan semua soal
    return count ? allQuestions.slice(0, count) : allQuestions;
  }

  // Shuffle acak
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return count ? shuffled.slice(0, count) : shuffled;
}
