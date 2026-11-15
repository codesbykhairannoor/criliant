import { Question } from '@/types';

// Bank Soal Resmi Sekolah Kedinasan (PKN STAN, Polstat STIS, IPDN, STIN, Poltekip/Poltekim)
// Kategori: TPA, BAHASA_INGGRIS, MTK_KEDINASAN, PSIKOTES
export const KEDINASAN_QUESTION_BANK: Question[] = [
  // --- TPA (TES POTENSI AKADEMIK) ---
  {
    id: 'KED-TPA-01',
    text: 'Perhatikan susunan bilangan pada matriks berputar berikut:\nBaris 1: [3, 7, 15]\nBaris 2: [4, 9, 19]\nBaris 3: [5, 11, ?]\nBilangan yang tepat untuk menggantikan tanda tanya (?) adalah...',
    category: 'TPA',
    subTopic: 'Matriks Angka & Pola Relasi Aljabar',
    options: ['21', '23', '25', '27', '29'],
    correctOptionIndex: 1,
    explanation: 'Perhatikan baris: Baris 1: 3 × 2 + 1 = 7, 7 × 2 + 1 = 15. Baris 2: 4 × 2 + 1 = 9, 9 × 2 + 1 = 19. Baris 3: 5 × 2 + 1 = 11, maka 11 × 2 + 1 = 23.',
    difficulty: 'easy'
  },
  {
    id: 'KED-TPA-02',
    text: 'Tentukan kelanjutan dari deret angka berikut: 2, 3, 5, 8, 13, 21, 34, ...',
    category: 'TPA',
    subTopic: 'Deret Fibonacci & Pola Rekursif',
    options: ['45', '52', '55', '58', '63'],
    correctOptionIndex: 2,
    explanation: 'Deret Fibonacci standar di mana setiap suku adalah penjumlahan dua suku sebelumnya: 21 + 34 = 55.',
    difficulty: 'easy'
  },
  {
    id: 'KED-TPA-03',
    text: 'Semua taruna kedinasan memiliki disiplin waktu yang tinggi. Beberapa atlet pencak silat adalah taruna kedinasan. Kesimpulan yang valid dan sah adalah...',
    category: 'TPA',
    subTopic: 'Silogisme Logika Kedinasan',
    options: [
      'Semua atlet pencak silat memiliki disiplin waktu yang tinggi',
      'Beberapa atlet pencak silat memiliki disiplin waktu yang tinggi',
      'Semua yang berdisiplin waktu tinggi adalah atlet pencak silat',
      'Tidak ada atlet pencak silat yang menjadi taruna kedinasan',
      'Disiplin waktu hanya dimiliki oleh atlet pencak silat'
    ],
    correctOptionIndex: 1,
    explanation: 'Karena sebagian atlet pencak silat merupakan bagian dari taruna kedinasan, dan seluruh taruna kedinasan berdisiplin tinggi, maka atlet pencak silat yang taruna tersebut pasti memiliki disiplin waktu yang tinggi.',
    difficulty: 'medium'
  },
  {
    id: 'KED-TPA-04',
    text: 'Dalam suatu tes seleksi, Rangga berada di urutan ke-14 dari atas dan urutan ke-38 dari bawah di antara seluruh peserta yang lulus passing grade. Berapa total peserta yang dinyatakan lulus passing grade?',
    category: 'TPA',
    subTopic: 'Penalaran Posisi dan Urutan Relatif',
    options: ['50 orang', '51 orang', '52 orang', '53 orang', '54 orang'],
    correctOptionIndex: 1,
    explanation: 'Total = (Urutan atas + Urutan bawah) - 1 = (14 + 38) - 1 = 52 - 1 = 51 orang.',
    difficulty: 'easy'
  },

  // --- BAHASA INGGRIS (TBI - TES BAHASA INGGRIS STAN) ---
  {
    id: 'KED-TBI-01',
    text: 'Select the most grammatically correct completion:\n"Had the financial auditors ... the irregular expenditures earlier, the state budget deficits could have been prevented."',
    category: 'BAHASA_INGGRIS',
    subTopic: 'Inversion in Conditional Sentences Type 3',
    options: ['detect', 'detected', 'been detecting', 'detects', 'were detected'],
    correctOptionIndex: 1,
    explanation: 'Inverted third conditional structure: "Had + Subject + Past Participle (V3)". Bentuk yang tepat adalah "Had the financial auditors detected...".',
    difficulty: 'medium'
  },
  {
    id: 'KED-TBI-02',
    text: 'Choose the word that best completes the sentence:\n"The Director of Customs and Excise insisted that every imported consignment ... thoroughly inspected before entering the domestic territory."',
    category: 'BAHASA_INGGRIS',
    subTopic: 'Subjunctive Mood',
    options: ['is', 'was', 'be', 'must be', 'has been'],
    correctOptionIndex: 2,
    explanation: 'Subjunctive mood setelah kata kerja "insisted that" memerlukan bare infinitive ("be") tanpa memandang subjek maupun tenses.',
    difficulty: 'hard_hots'
  },
  {
    id: 'KED-TBI-03',
    text: 'Identify the synonym of the underlined word in context:\n"The state forensic unit conducted a METICULOUS examination of the digital transaction logs."',
    category: 'BAHASA_INGGRIS',
    subTopic: 'Vocabulary & Contextual Nuance',
    options: ['Careless', 'Painstaking', 'Hasty', 'Superficial', 'Vague'],
    correctOptionIndex: 1,
    explanation: 'Meticulous berarti sangat teliti, cermat, dan berhati-hati terhadap detail terkecil (synonym: painstaking / thorough).',
    difficulty: 'medium'
  },
  {
    id: 'KED-TBI-04',
    text: '"Seldom ... such extraordinary resilience as shown by the rescue team during the disaster relief operation."',
    category: 'BAHASA_INGGRIS',
    subTopic: 'Negative Inversion',
    options: [
      'we have witnessed',
      'have we witnessed',
      'we witnessed',
      'we had been witnessed',
      'did we witnessed'
    ],
    correctOptionIndex: 1,
    explanation: 'Ketika kalimat diawali oleh negative adverbial seperti "Seldom", "Rarely", atau "Hardly", struktur klausa mengalami inversi (Auxiliary + Subject + Verb): "have we witnessed".',
    difficulty: 'medium'
  },

  // --- MTK KEDINASAN (MATEMATIKA LANJUT / DISKRIT POLSTAT STIS) ---
  {
    id: 'KED-MTK-01',
    text: 'Berapa banyak susunan kata berbeda yang dapat dibentuk dari huruf-huruf pada kata "STATISTIKA"?',
    category: 'MTK_KEDINASAN',
    subTopic: 'Permutasi dengan Unsur Berulang',
    options: ['37.800', '75.600', '151.200', '302.400', '604.800'],
    correctOptionIndex: 1,
    explanation: 'Total huruf = 10. Huruf berulang: S=2, T=3, A=2, I=2, K=1. Rumus: 10! / (2! 3! 2! 2!) = 3.628.800 / (2 × 6 × 2 × 2) = 3.628.800 / 48 = 75.600.',
    difficulty: 'medium'
  },
  {
    id: 'KED-MTK-02',
    text: 'Nilai dari limit lim (x -> 0) [sin(6x) / (3x + tan(2x))] adalah...',
    category: 'MTK_KEDINASAN',
    subTopic: 'Kalkulus Limit Fungsi Trigonometri',
    options: ['1', '6/5', '2', '3', '6'],
    correctOptionIndex: 1,
    explanation: 'Bagi pembilang dan penyebut dengan x: lim (x -> 0) [ (sin 6x / x) / (3 + tan 2x / x) ] = 6 / (3 + 2) = 6/5.',
    difficulty: 'medium'
  },
  {
    id: 'KED-MTK-03',
    text: 'Jika determinan matriks A = [[2, x], [3, 5]] sama dengan 4, maka nilai x adalah...',
    category: 'MTK_KEDINASAN',
    subTopic: 'Matriks & Determinan Ordo 2x2',
    options: ['1', '2', '3', '4', '5'],
    correctOptionIndex: 1,
    explanation: 'det(A) = (2 × 5) - (x × 3) = 10 - 3x. Diketahui det(A) = 4 => 10 - 3x = 4 => 3x = 6 => x = 2.',
    difficulty: 'easy'
  },
  {
    id: 'KED-MTK-04',
    text: 'Sebuah komite beranggotakan 4 taruna akan dipilih dari 6 taruna tingkat III dan 4 taruna tingkat II. Berapa banyak cara memilih komite jika setidaknya harus ada 2 taruna tingkat III?',
    category: 'MTK_KEDINASAN',
    subTopic: 'Kombinatorika Peluang Bersyarat',
    options: ['115', '140', '185', '195', '210'],
    correctOptionIndex: 2,
    explanation: 'Kemungkinan: 1) 2 III & 2 II: C(6,2) × C(4,2) = 15 × 6 = 90. 2) 3 III & 1 II: C(6,3) × C(4,1) = 20 × 4 = 80. 3) 4 III: C(6,4) = 15. Total = 90 + 80 + 15 = 185 cara.',
    difficulty: 'hard_hots'
  },

  // --- PSIKOTES KEDINASAN ---
  {
    id: 'KED-PSI-01',
    text: 'Dalam simulasi ketahanan psikologis ruang tertutup dan isolasi misi pengintaian, seorang calon taruna mengalami disorientasi waktu dan kelelahan mental. Respons paling adaptif secara psikologis adalah...',
    category: 'PSIKOTES',
    subTopic: 'Ketahanan Mental & Regulasi Emosi di Bawah Tekanan',
    options: [
      'Fokus pada pernapasan ritmis dan membuat rutinitas mikro terstruktur untuk menjaga orientasi kognitif',
      'Mencoba tidur sepanjang waktu agar tidak merasakan kebosanan dan kecemasan',
      'Memukul dinding ruangan untuk meluapkan lonjakan emosi yang terpendam',
      'Menyerah dan menekan tombol darurat saat jam pertama merasakan isolasi',
      'Mengabaikan semua instruksi misi dan berdiam diri tanpa respons'
    ],
    correctOptionIndex: 0,
    explanation: 'Regulasi emosi adaptif dalam psikotes kedinasan diukur dari kemampuan mengendalikan fokus kognitif, teknik pernapasan terkendali, dan disiplin mikro di situasi ekstrem.',
    difficulty: 'medium'
  },
  {
    id: 'KED-PSI-02',
    text: 'KONSISTENSI : INTEGRITAS = KELENTURAN : ...',
    category: 'PSIKOTES',
    subTopic: 'Analogi Psikometri Kepribadian',
    options: ['Kekakuan', 'Adaptabilitas', 'Kelemahan', 'Kecurigaan', 'Kebimbangan'],
    correctOptionIndex: 1,
    explanation: 'Konsistensi adalah fondasi dari integritas. Kelenturan (fleksibilitas) adalah fondasi dari adaptabilitas.',
    difficulty: 'easy'
  }
];
