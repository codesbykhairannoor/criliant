import { Question, Category } from '@/types';

/**
 * Parametric Generator Utility
 * Menghasilkan soal-soal hitungan kuantitatif, deret angka, aljabar, dan logika perbandingan
 * dengan angka dan variabel yang selalu baru secara dinamis, sehingga peserta tidak bisa
 * menghafal kunci jawaban atau angka kemarin.
 */
export class ParametricQuestionGenerator {
  // 1. Generator Deret Angka Pola Aritmetika/Geometri Bertingkat (TIU / TPS Kuantitatif / TPA)
  public static generateNumberSeries(track: 'cpns' | 'snbt' | 'kedinasan'): Question {
    const seedId = `PARAM-SERIES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const category: Category = track === 'cpns' ? 'TIU' : track === 'snbt' ? 'TPS_KUANTITATIF' : 'TPA';

    // Pilih tipe pola: 0 = Kali n + c, 1 = Selisih bertingkat (+2, +4, +6...), 2 = Fibonacci varian
    const patternType = Math.floor(Math.random() * 3);

    if (patternType === 0) {
      const start = Math.floor(Math.random() * 6) + 2; // 2..7
      const multiplier = Math.floor(Math.random() * 2) + 2; // 2..3
      const adder = Math.floor(Math.random() * 3) + 1; // 1..3

      const s0 = start;
      const s1 = s0 * multiplier + adder;
      const s2 = s1 * multiplier + adder;
      const s3 = s2 * multiplier + adder;
      const answer = s3 * multiplier + adder;

      const seriesText = `${s0}, ${s1}, ${s2}, ${s3}, ...`;
      const candidatePool = [
        answer - multiplier,
        answer + multiplier,
        answer + multiplier * 2,
        answer - (adder + 2),
        answer + adder + 3,
        answer + multiplier * 3,
      ];
      const uniqueDistractors: number[] = [];
      for (const c of candidatePool) {
        if (c > 0 && c !== answer && !uniqueDistractors.includes(c)) {
          uniqueDistractors.push(c);
        }
        if (uniqueDistractors.length === 4) break;
      }

      const allOptions = [String(answer), ...uniqueDistractors.map(String)];
      const shuffledOptions = this.shuffleArray(allOptions);
      const correctIdx = shuffledOptions.indexOf(String(answer));

      return {
        id: seedId,
        text: `Tentukan bilangan berikutnya pada deret angka berikut: ${seriesText}`,
        category,
        subTopic: 'Deret Angka Pola Multiplikatif Dinamis',
        options: shuffledOptions,
        correctOptionIndex: correctIdx,
        explanation: `Pola deret: setiap suku berikutnya = (suku sebelumnya × ${multiplier}) + ${adder}. Maka suku berikutnya = (${s3} × ${multiplier}) + ${adder} = ${answer}.`,
        difficulty: 'medium',
      };
    } else if (patternType === 1) {
      const start = Math.floor(Math.random() * 10) + 3;
      const stepBase = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
      const stepInc = 2;

      const d1 = stepBase;
      const d2 = stepBase + stepInc;
      const d3 = stepBase + stepInc * 2;
      const d4 = stepBase + stepInc * 3;

      const s0 = start;
      const s1 = s0 + d1;
      const s2 = s1 + d2;
      const s3 = s2 + d3;
      const answer = s3 + d4;

      const seriesText = `${s0}, ${s1}, ${s2}, ${s3}, ...`;
      const distractors = [answer - 2, answer + 2, answer + 4, answer - 4];
      const allOptions = [String(answer), ...distractors.map(String)];
      const shuffledOptions = this.shuffleArray(allOptions);
      const correctIdx = shuffledOptions.indexOf(String(answer));

      return {
        id: seedId,
        text: `Tentukan angka selanjutnya dari barisan berikut: ${seriesText}`,
        category,
        subTopic: 'Deret Selisih Bertingkat Aritmetika',
        options: shuffledOptions,
        correctOptionIndex: correctIdx,
        explanation: `Pola selisih: +${d1}, +${d2}, +${d3}, bertambah +${stepInc} di setiap langkah. Langkah berikutnya adalah +${d4}. Maka ${s3} + ${d4} = ${answer}.`,
        difficulty: 'easy',
      };
    } else {
      // Fibonacci varian
      const a = Math.floor(Math.random() * 4) + 1;
      const b = a + Math.floor(Math.random() * 3) + 1;
      const c = a + b;
      const d = b + c;
      const e = c + d;
      const answer = d + e;

      const seriesText = `${a}, ${b}, ${c}, ${d}, ${e}, ...`;
      const distractors = [answer - 1, answer + 1, answer + 2, answer - 2];
      const allOptions = [String(answer), ...distractors.map(String)];
      const shuffledOptions = this.shuffleArray(allOptions);
      const correctIdx = shuffledOptions.indexOf(String(answer));

      return {
        id: seedId,
        text: `Lanjutkan barisan rekursif berikut: ${seriesText}`,
        category,
        subTopic: 'Deret Fibonacci Adaptif',
        options: shuffledOptions,
        correctOptionIndex: correctIdx,
        explanation: `Pola rekursif: setiap bilangan merupakan jumlah dari dua bilangan tepat sebelumnya (${d} + ${e} = ${answer}).`,
        difficulty: 'easy',
      };
    }
  }

  // 2. Generator Perbandingan Pekerja & Waktu (TIU / Penalaran Matematika)
  public static generateWorkforceRate(track: 'cpns' | 'snbt' | 'kedinasan'): Question {
    const seedId = `PARAM-WORK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const category: Category = track === 'cpns' ? 'TIU' : track === 'snbt' ? 'PENALARAN_MATEMATIKA' : 'TPA';

    // Gunakan pasangan bersih agar hasil pekerja tambahan SELALU bilangan bulat eksak
    const cleanScenarios = [
      { baseWorkers: 12, originalDays: 30, targetDays: 20 }, // 360 / 20 = 18 (+6)
      { baseWorkers: 16, originalDays: 45, targetDays: 30 }, // 720 / 30 = 24 (+8)
      { baseWorkers: 20, originalDays: 40, targetDays: 25 }, // 800 / 25 = 32 (+12)
      { baseWorkers: 24, originalDays: 45, targetDays: 30 }, // 1080 / 30 = 36 (+12)
      { baseWorkers: 18, originalDays: 50, targetDays: 30 }, // 900 / 30 = 30 (+12)
      { baseWorkers: 15, originalDays: 40, targetDays: 24 }, // 600 / 24 = 25 (+10)
    ];
    const chosen = cleanScenarios[Math.floor(Math.random() * cleanScenarios.length)];
    const { baseWorkers, originalDays, targetDays } = chosen;

    const totalManDays = baseWorkers * originalDays;
    const requiredWorkers = totalManDays / targetDays;
    const extraWorkers = requiredWorkers - baseWorkers;

    const distractorVals = new Set<number>([
      extraWorkers + 4,
      Math.max(1, extraWorkers - 4),
      requiredWorkers,
      extraWorkers + 8,
    ]);
    // Ensure exactly 4 unique distractors different from extraWorkers
    let offset = 2;
    while (distractorVals.size < 4 || distractorVals.has(extraWorkers)) {
      distractorVals.delete(extraWorkers);
      distractorVals.add(extraWorkers + offset);
      offset += 2;
    }

    const options = [`${extraWorkers} orang`, ...Array.from(distractorVals).slice(0, 4).map((v) => `${v} orang`)];
    const shuffled = this.shuffleArray(options);
    const correctIdx = shuffled.indexOf(`${extraWorkers} orang`);

    return {
      id: seedId,
      text: `Sebuah proyek pembangunan jalan dapat dirampungkan oleh ${baseWorkers} pekerja dalam kurun waktu ${originalDays} hari. Jika proyek diminta harus rampung lebih cepat dalam ${targetDays} hari, berapa pekerja tambahan yang harus direkrut?`,
      category,
      subTopic: 'Perbandingan Berbalik Nilai Dinamis',
      options: shuffled,
      correctOptionIndex: correctIdx,
      explanation: `Beban kerja total = ${baseWorkers} × ${originalDays} = ${totalManDays} hari-orang. Untuk selesai dalam ${targetDays} hari, diperlukan ${totalManDays} / ${targetDays} = ${requiredWorkers} pekerja. Tambahan pekerja yang dibutuhkan = ${requiredWorkers} - ${baseWorkers} = ${extraWorkers} orang.`,
      difficulty: 'medium',
    };
  }

  // 3. Generator Persentase Diskon Ganda & Pajak (Aritmetika Sosial)
  public static generateAritmetikaSosial(track: 'cpns' | 'snbt' | 'kedinasan'): Question {
    const seedId = `PARAM-ARIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const category: Category = track === 'cpns' ? 'TIU' : track === 'snbt' ? 'TPS_KUANTITATIF' : 'TPA';

    const basePrice = (Math.floor(Math.random() * 6) + 4) * 100000; // 400.000, 500.000, ..., 900.000
    const diskonPct = [10, 20, 25, 30][Math.floor(Math.random() * 4)];
    const pajakPct = 10;

    const afterDiskon = basePrice * (1 - diskonPct / 100);
    const finalPrice = Math.round(afterDiskon * (1 + pajakPct / 100));

    const formatRp = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

    const correctStr = formatRp(basePrice);
    const distractors = [
      formatRp(basePrice + 50000),
      formatRp(basePrice - 50000),
      formatRp(Math.round(basePrice * 1.15)),
      formatRp(Math.round(basePrice * 0.85)),
    ];

    const shuffled = this.shuffleArray([correctStr, ...distractors]);
    const correctIdx = shuffled.indexOf(correctStr);

    return {
      id: seedId,
      text: `Sebuah laptop/perangkat elektronik setelah mendapatkan diskon sebesar ${diskonPct}% kemudian dikenakan biaya pajak PPN ${pajakPct}% memiliki harga akhir ${formatRp(finalPrice)}. Berapakah harga asli barang tersebut sebelum dikenakan diskon dan pajak?`,
      category,
      subTopic: 'Aritmetika Sosial Persentase Bertingkat',
      options: shuffled,
      correctOptionIndex: correctIdx,
      explanation: `Misal harga mula-mula adalah H. Setelah diskon ${diskonPct}%, harga menjadi ${(100 - diskonPct) / 100}H. Setelah ditambah pajak ${pajakPct}%, harga akhir = ${((100 - diskonPct) / 100) * 1.1}H = ${formatRp(finalPrice)}. Maka H = ${finalPrice} / ${((100 - diskonPct) / 100) * 1.1} = ${correctStr}.`,
      difficulty: 'medium',
    };
  }

  // 4. Generator Logika Silogisme Acak
  public static generateSyllogism(): Question {
    const seedId = `PARAM-SYL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const subjects = [
      { all: 'Semua mahasiswa teknik', attr1: 'menguasai bahasa pemrograman C++', part: 'Sebagian mahasiswa teknik', attr2: 'tidak menyukai perakitan robot' },
      { all: 'Semua perwira maritim', attr1: 'memiliki sertifikat navigasi laut lepas', part: 'Sebagian perwira maritim', attr2: 'tidak bertugas di kapal selam' },
      { all: 'Semua analis intelijen', attr1: 'menguasai teknik kriptografi', part: 'Sebagian analis intelijen', attr2: 'tidak fasih bahasa Mandarin' },
    ];

    const chosen = subjects[Math.floor(Math.random() * subjects.length)];
    const correctText = `Sebagian yang ${chosen.attr1} ${chosen.attr2}`;

    const distractors = [
      `Semua yang ${chosen.attr1} pasti ${chosen.attr2.replace('tidak ', '')}`,
      `Semua orang yang ${chosen.attr2} bukan merupakan anggota yang ${chosen.attr1}`,
      `Tidak ada yang ${chosen.attr1} yang ${chosen.attr2}`,
      `Hanya sebagian kecil yang tidak memiliki kaitan dengan keduanya`,
    ];

    const shuffled = this.shuffleArray([correctText, ...distractors]);
    const correctIdx = shuffled.indexOf(correctText);

    return {
      id: seedId,
      text: `Diberikan dua pernyataan premis:\n1. ${chosen.all} ${chosen.attr1}.\n2. ${chosen.part} ${chosen.attr2}.\n\nKesimpulan yang sah dan logis menurut silogisme adalah...`,
      category: 'TIU',
      subTopic: 'Silogisme Logika Partikular Dinamis',
      options: shuffled,
      correctOptionIndex: correctIdx,
      explanation: `Karena semua anggota himpunan subjek pasti ${chosen.attr1}, maka sebagian dari mereka yang ${chosen.attr2} juga merupakan bagian dari mereka yang ${chosen.attr1}. Kesimpulan sah: "${correctText}".`,
      difficulty: 'medium',
    };
  }

  // Helper shuffle array
  private static shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
