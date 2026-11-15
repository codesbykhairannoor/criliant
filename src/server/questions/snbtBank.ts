import { Question } from '@/types';

// Bank Soal Resmi SNBT / UTBK (BPPP / Kemendikbudristek)
// Kategori: TPS_PENALARAN_UMUM, TPS_KUANTITATIF, LITERASI_INDONESIA, PENALARAN_MATEMATIKA
export const SNBT_QUESTION_BANK: Question[] = [
  // --- TPS PENALARAN UMUM (INDUKTIF & DEDUKTIF) ---
  {
    id: 'SNBT-PU-01',
    text: 'Semua atlet renang memiliki daya tahan paru-paru di atas rata-rata. Sebagian orang dengan daya tahan paru-paru di atas rata-rata memiliki detak jantung istirahat di bawah 60 bpm. Seseorang bernama Dimas memiliki detak jantung istirahat 55 bpm. Simpulan yang PALING TEPAT mengenai Dimas adalah...',
    category: 'TPS_PENALARAN_UMUM',
    subTopic: 'Penalaran Deduktif & Silogisme',
    options: [
      'Dimas pasti seorang atlet renang profesional',
      'Dimas memiliki daya tahan paru-paru di atas rata-rata',
      'Dimas bukan merupakan seorang atlet renang',
      'Belum tentu Dimas adalah seorang atlet renang',
      'Dimas memiliki kapasitas fisik yang setara dengan seluruh atlet'
    ],
    correctOptionIndex: 3,
    explanation: 'Dimas memiliki detak jantung 55 bpm, tetapi kepemilikan detak jantung di bawah 60 bpm tidak eksklusif hanya untuk atlet renang (karena hanya "sebagian" dan bukan syarat cukup). Oleh karena itu, kesimpulan paling tepat dan objektif adalah "Belum tentu Dimas adalah seorang atlet renang".',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PU-02',
    text: 'Berdasarkan data Badan Pusat Statistik (BPS), produksi gabah kering giling di Daerah A mengalami kenaikan 15% pada kuartal I, namun harga beras di pasar tradisional daerah tersebut justru melonjak 12%. Manakah pernyataan berikut yang PALING MEMUNGKINKAN menjelaskan anomali tersebut?',
    category: 'TPS_PENALARAN_UMUM',
    subTopic: 'Penalaran Kausalitas & Evaluasi Argumen',
    options: [
      'Biaya logistik pengiriman antar daerah mengalami penurunan yang sangat signifikan',
      'Daerah A mengekspor sebagian besar hasil panennya ke daerah tetangga yang mengalami gagal panen total',
      'Masyarakat di Daerah A mulai beralih mengonsumsi jagung dan singkong sebagai pengganti karbohidrat',
      'Kapasitas gudang penyimpanan beras di Daerah A meningkat dua kali lipat dibanding tahun lalu',
      'Pemerintah memberikan subsidi pupuk yang merata kepada seluruh petani padi'
    ],
    correctOptionIndex: 1,
    explanation: 'Jika produksi melimpah namun sebagian besar stok diserap keluar daerah (ekspor ke daerah defisit), maka pasokan lokal tetap langka sehingga mendorong kenaikan harga (supply & demand).',
    difficulty: 'hard_hots'
  },
  {
    id: 'SNBT-PU-03',
    text: 'Jika cuaca mendung dan kelembapan udara melebihi 85%, maka kemungkinan turun hujan lebat adalah tinggi. Saat ini kelembapan udara mencapai 90%, namun cuaca cerah terik tanpa awan mendung. Simpulan yang benar adalah...',
    category: 'TPS_PENALARAN_UMUM',
    subTopic: 'Logika Proposisional Implikasi Ganda',
    options: [
      'Pasti tidak akan terjadi hujan lebat',
      'Kemungkinan turun hujan lebat adalah tinggi',
      'Tidak dapat dipastikan terjadi hujan lebat atau tidak',
      'Akan turun hujan rintik-rintik',
      'Cuaca akan segera berubah mendung dalam waktu 30 menit'
    ],
    correctOptionIndex: 2,
    explanation: 'Aturan berbunyi P AND Q -> R. Saat ini Q benar tetapi P salah. Konsekuensi R tidak dapat dipastikan hanya dari ketiadaan P (fallacy of denying the antecedent). Maka kesimpulan yang tepat adalah tidak dapat dipastikan.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PU-04',
    text: 'Sebuah keluarga merencanakan liburan dengan 4 destinasi: Pantai, Danau, Gunung, dan Air Terjun. Pantai harus dikunjungi sebelum Gunung. Air Terjun dikunjungi tepat setelah Danau. Jika Danau dikunjungi pada urutan kedua, destinasi manakah yang dikunjungi pertama kali?',
    category: 'TPS_PENALARAN_UMUM',
    subTopic: 'Penalaran Analitik Urutan Berantai',
    options: ['Gunung', 'Pantai', 'Air Terjun', 'Danau', 'Bisa Pantai atau Gunung'],
    correctOptionIndex: 1,
    explanation: 'Urutan 2 adalah Danau, sehingga urutan 3 pasti Air Terjun (karena tepat setelah Danau). Tersisa posisi 1 dan 4 untuk Pantai dan Gunung. Karena Pantai harus dikunjungi sebelum Gunung, maka Pantai di posisi 1 dan Gunung di posisi 4.',
    difficulty: 'easy'
  },
  {
    id: 'SNBT-PU-05',
    text: 'Tren adopsi kendaraan listrik roda dua di kota metropolitan meningkat tajam seiring pemberian insentif pajak. Namun, beberapa pengamat transportasi berpendapat bahwa kemacetan lalu lintas justru tidak berkurang sama sekali. Manakah fakta yang MENGUATKAN pandangan pengamat tersebut?',
    category: 'TPS_PENALARAN_UMUM',
    subTopic: 'Evaluasi Argumen & Pembuktian Fakta',
    options: [
      'Pengguna kendaraan listrik mayoritas adalah masyarakat yang sebelumnya menggunakan transportasi umum MRT dan bus',
      'Stasiun Pengisian Kendaraan Listrik Umum (SPKLU) kini tersedia di setiap pusat perbelanjaan',
      'Biaya operasional motor listrik jauh lebih hemat dibanding motor berbahan bakar bensin',
      'Banyak pengguna mobil pribadi yang beralih menggunakan sepeda untuk jarak dekat',
      'Produsen motor listrik memberikan garansi baterai hingga 5 tahun'
    ],
    correctOptionIndex: 0,
    explanation: 'Jika pengguna motor listrik berasal dari eks pengguna transportasi publik, volume kendaraan pribadi di jalan raya bertambah bukannya berkurang, sehingga kemacetan tetap bertahan atau meningkat.',
    difficulty: 'hard_hots'
  },

  // --- TPS PENGETAHUAN KUANTITATIF ---
  {
    id: 'SNBT-PK-01',
    text: 'Diberikan fungsi f(x) = (2x - 3) / (x + 4) untuk x ≠ -4. Jika g(x) = 3x + 1, nilai dari (f ∘ g)(2) adalah...',
    category: 'TPS_KUANTITATIF',
    subTopic: 'Fungsi Komposisi Aljabar',
    options: ['1', '1.5', '2', '11/10', '11/12'],
    correctOptionIndex: 0,
    explanation: 'g(2) = 3(2) + 1 = 7. Maka (f ∘ g)(2) = f(g(2)) = f(7) = (2(7) - 3) / (7 + 4) = (14 - 3) / 11 = 11 / 11 = 1.',
    difficulty: 'easy'
  },
  {
    id: 'SNBT-PK-02',
    text: 'Rata-rata nilai ujian matematika dari 18 siswa laki-laki adalah 76, sedangkan rata-rata nilai dari 12 siswa perempuan adalah 84. Rata-rata nilai gabungan seluruh siswa di kelas tersebut adalah...',
    category: 'TPS_KUANTITATIF',
    subTopic: 'Statistika Rata-Rata Gabungan',
    options: ['78.8', '79.2', '80.0', '80.4', '81.2'],
    correctOptionIndex: 1,
    explanation: 'Total nilai = (18 × 76) + (12 × 84) = 1368 + 1008 = 2376. Jumlah siswa = 18 + 12 = 30. Rata-rata gabungan = 2376 / 30 = 79.2.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PK-03',
    text: 'Jika 3^(2x - 1) = 81^(x - 2), maka nilai x yang memenuhi persamaan eksponen tersebut adalah...',
    category: 'TPS_KUANTITATIF',
    subTopic: 'Persamaan Eksponensial',
    options: ['3.5', '4.0', '4.5', '5.0', '5.5'],
    correctOptionIndex: 0,
    explanation: '81 = 3^4, sehingga 81^(x - 2) = 3^(4(x - 2)) = 3^(4x - 8). Samakan pangkat: 2x - 1 = 4x - 8 => 2x = 7 => x = 3.5.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PK-04',
    text: 'Sebuah kotak berisi 5 bola merah, 4 bola biru, dan 3 bola hijau. Diambil 2 bola satu per satu tanpa pengembalian secara acak. Peluang terambil bola pertama merah dan bola kedua hijau adalah...',
    category: 'TPS_KUANTITATIF',
    subTopic: 'Peluang Bersyarat Tanpa Pengembalian',
    options: ['5/44', '15/132', '5/36', '1/8', '3/22'],
    correctOptionIndex: 0,
    explanation: 'Total bola = 5 + 4 + 3 = 12. P(Merah ke-1) = 5/12. Bola tersisa = 11 bola (3 hijau). P(Hijau ke-2) = 3/11. Peluang gabungan = (5/12) × (3/11) = 15/132 = 5/44.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PK-05',
    text: 'Suatu barisan aritmetika memiliki suku ke-4 bernilai 17 dan suku ke-9 bernilai 37. Nilai dari suku ke-20 barisan tersebut adalah...',
    category: 'TPS_KUANTITATIF',
    subTopic: 'Barisan dan Deret Aritmetika',
    options: ['77', '81', '85', '89', '93'],
    correctOptionIndex: 1,
    explanation: 'U9 - U4 = 5b = 37 - 17 = 20 => b = 4. U4 = a + 3(4) = 17 => a = 5. U20 = a + 19b = 5 + 19(4) = 5 + 76 = 81.',
    difficulty: 'easy'
  },

  // --- LITERASI DALAM BAHASA INDONESIA ---
  {
    id: 'SNBT-LIT-01',
    text: 'Cermati kutipan teks berikut:\n"Penerapan kecerdasan buatan (AI) di bidang medis menjanjikan lompatan akurasi dalam diagnostik radiologi. Kendati demikian, ketergantungan absolut terhadap algoritma tanpa pertimbangan intuisi klinis dokter spesialis dapat berakibat fatal pada deteksi penyakit komorbiditas yang langka."\n\nGagasan pokok yang ingin disampaikan oleh penulis teks tersebut adalah...',
    category: 'LITERASI_INDONESIA',
    subTopic: 'Gagasan Utama & Evaluasi Kritis Teks Ilmiah Populer',
    options: [
      'Algoritma AI telah sepenuhnya menggantikan peran dokter spesialis radiologi',
      'Pemanfaatan AI medis harus diimbangi dan diverifikasi oleh kompetensi pertimbangan klinis dokter',
      'Penyakit komorbiditas langka tidak mungkin dideteksi oleh perangkat lunak komputer',
      'Kecerdasan buatan membawa lebih banyak risiko kerugian dibanding keunggulan dalam dunia kesehatan',
      'Rumah sakit modern sebaiknya menolak integrasi teknologi kecerdasan buatan'
    ],
    correctOptionIndex: 1,
    explanation: 'Penulis mengakui manfaat AI dalam meningkatkan akurasi diagnosa, namun secara tegas mengingatkan pentingnya intuisi klinis dokter agar tidak terjadi kesalahan fatal.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-LIT-02',
    text: 'Perhatikan kalimat berikut:\n"Meskipun anggaran riset nasional telah ditingkatkan, namun produktivitas publikasi ilmiah internasional terindeks belum menunjukkan lonjakan yang signifikan."\n\nPerbaikan kalimat di atas agar menjadi kalimat yang efektif dan baku sesuai PUEBI adalah...',
    category: 'LITERASI_INDONESIA',
    subTopic: 'Kaidah Kebahasaan Kalimat Efektif & Konjungsi',
    options: [
      'Menghilangkan kata "Meskipun" di awal kalimat',
      'Menghilangkan konjungsi "namun" setelah tanda koma',
      'Mengganti kata "lonjakan" dengan kata "pertambahan"',
      'Menambahkan tanda hubung pada kata "ditingkatkan"',
      'Mengubah kata "produktifitas" menjadi bentuk tidak baku'
    ],
    correctOptionIndex: 1,
    explanation: 'Penggunaan konjungsi subordinatif "meskipun" tidak boleh disandingkan dengan konjungsi koordinatif intrakalimat "namun" dalam satu klausa bertingkat (kerancuan konjungsi ganda). Cukup hilangkan kata "namun".',
    difficulty: 'easy'
  },
  {
    id: 'SNBT-LIT-03',
    text: 'Kata "distorsi" dalam kalimat: "Informasi yang disebarkan berulang kali di media sosial tanpa verifikasi dapat menimbulkan distorsi fakta sejarah bagi generasi muda," memiliki makna yang paling dekat dengan...',
    category: 'LITERASI_INDONESIA',
    subTopic: 'Makna Kata Kontekstual & Semantik',
    options: ['Penyimpangan atau pemutarbalikan', 'Penyebarluasan massal', 'Penguatan bukti nyata', 'Pengarsipan digital', 'Pemusnahan total'],
    correctOptionIndex: 0,
    explanation: 'Distorsi berarti pemutarbalikan suatu fakta atau penyimpangan dari bentuk atau makna aslinya.',
    difficulty: 'easy'
  },
  {
    id: 'SNBT-LIT-04',
    text: 'Cermati paragraf berikut:\n"Ekosistem mangrove memiliki peran ganda sebagai benteng alami pesisir dari abrasi gelombang laut sekaligus penyerap karbon biru (blue carbon) yang sangat efisien. Namun, laju deforestasi mangrove untuk alih fungsi tambak terus mengancam kelestarian habitat biota laut dangkal."\n\nSimpulan logis yang dapat ditarik dari paragraf tersebut adalah...',
    category: 'LITERASI_INDONESIA',
    subTopic: 'Simpulan Implisit Paragraf Argumentatif',
    options: [
      'Alih fungsi tambak merupakan sektor paling penting bagi ketahanan pangan nasional',
      'Deforestasi hutan mangrove berpotensi memperparah abrasi pantai dan pelepasan emisi karbon',
      'Gelombang laut pesisir tidak akan membahayakan pemukiman tanpa adanya mangrove',
      'Biota laut dangkal dapat beradaptasi dengan baik di perairan tambak komersial',
      'Mangrove hanya berfungsi efektif bila tidak dipengaruhi oleh pasang surut air laut'
    ],
    correctOptionIndex: 1,
    explanation: 'Karena mangrove adalah pelindung abrasi dan penyerap karbon, hilangnya mangrove melalui deforestasi secara langsung memperparah kerentanan abrasi pesisir dan meningkatkan emisi karbon.',
    difficulty: 'medium'
  },

  // --- PENALARAN MATEMATIKA ---
  {
    id: 'SNBT-PM-01',
    text: 'Sebuah tangki air berbentuk silinder memiliki diameter alas 1.4 meter dan tinggi 2 meter. Air dialirkan ke dalam tangki menggunakan pipa berdebit tetap 22 liter per menit. Jika tangki awalnya kosong, berapa menit waktu yang dibutuhkan hingga tangki terisi penuh? (Gunakan π ≈ 22/7)',
    category: 'PENALARAN_MATEMATIKA',
    subTopic: 'Geometri Bangun Ruang & Debit Fluida Terapan',
    options: ['100 menit', '120 menit', '140 menit', '150 menit', '180 menit'],
    correctOptionIndex: 2,
    explanation: 'Jari-jari r = 1.4 / 2 = 0.7 m = 7 dm. Tinggi h = 2 m = 20 dm. Volume = π × r² × h = (22/7) × 7 × 7 × 20 = 22 × 7 × 20 = 3080 dm³ (liter). Waktu = 3080 / 22 = 140 menit.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PM-02',
    text: 'Seorang pedagang membeli 50 kg beras jenis A seharga Rp 12.000/kg dan 30 kg beras jenis B seharga Rp 16.000/kg. Seluruh beras tersebut dicampur rata. Jika pedagang menginginkan keuntungan sebesar 20%, berapakah harga jual beras campuran per kilogramnya?',
    category: 'PENALARAN_MATEMATIKA',
    subTopic: 'Aritmetika Campuran & Margin Keuntungan',
    options: ['Rp 15.600', 'Rp 16.200', 'Rp 16.500', 'Rp 16.800', 'Rp 17.200'],
    correctOptionIndex: 1,
    explanation: 'Modal beras A = 50 × 12.000 = Rp 600.000. Beras B = 30 × 16.000 = Rp 480.000. Total modal = Rp 1.080.000 untuk 80 kg. Modal per kg = 1.080.000 / 80 = Rp 13.500. Harga jual (+20%) = 13.500 × 1.20 = Rp 16.200/kg.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PM-03',
    text: 'Sebuah mobil bergerak dari kota P ke kota Q sejauh 180 km dengan kecepatan rata-rata 60 km/jam. Pada perjalanan pulang dari kota Q ke kota P melalui rute yang sama, lalu lintas lebih padat sehingga kecepatan rata-ratanya menjadi 45 km/jam. Kecepatan rata-rata mobil untuk seluruh perjalanan bolak-balik tersebut adalah...',
    category: 'PENALARAN_MATEMATIKA',
    subTopic: 'Kecepatan Rata-Rata Harmonik',
    options: ['50.00 km/jam', '51.43 km/jam', '52.50 km/jam', '53.33 km/jam', '55.00 km/jam'],
    correctOptionIndex: 1,
    explanation: 'Waktu berangkat = 180 / 60 = 3 jam. Waktu pulang = 180 / 45 = 4 jam. Total jarak = 180 + 180 = 360 km. Total waktu = 3 + 4 = 7 jam. Kecepatan rata-rata = 360 / 7 ≈ 51.43 km/jam.',
    difficulty: 'medium'
  },
  {
    id: 'SNBT-PM-04',
    text: 'Suatu modal investasi sebesar Rp 10.000.000 disimpan di bank dengan bunga majemuk tahunan sebesar 10% per tahun. Nilai akhir modal tersebut setelah 2 tahun adalah...',
    category: 'PENALARAN_MATEMATIKA',
    subTopic: 'Bunga Majemuk Terapan Keuangan',
    options: ['Rp 12.000.000', 'Rp 12.100.000', 'Rp 12.210.000', 'Rp 12.500.000', 'Rp 13.000.000'],
    correctOptionIndex: 1,
    explanation: 'Tahun 1: 10.000.000 × 1.10 = Rp 11.000.000. Tahun 2: 11.000.000 × 1.10 = Rp 12.100.000.',
    difficulty: 'easy'
  }
];
