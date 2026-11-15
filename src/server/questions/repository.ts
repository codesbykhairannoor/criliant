import { Question, StudyTrack, Category } from '@/types';
import { CPNS_QUESTION_BANK } from './cpnsBank';
import { SNBT_QUESTION_BANK } from './snbtBank';
import { KEDINASAN_QUESTION_BANK } from './kedinasanBank';

export interface QuestionFilterParams {
  track?: StudyTrack;
  categories?: Category[];
  search?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}

export interface QuestionBankStats {
  total: number;
  byTrack: Record<StudyTrack, number>;
  byCategory: Record<string, number>;
}

export class QuestionRepository {
  private static allQuestions: Question[] = [
    ...CPNS_QUESTION_BANK,
    ...SNBT_QUESTION_BANK,
    ...KEDINASAN_QUESTION_BANK,
  ];

  // Ambil semua soal (internal memory pool)
  public static getAll(): Question[] {
    return [...this.allQuestions];
  }

  // Dapatkan statistik repositori
  public static getStats(): QuestionBankStats {
    const byCategory: Record<string, number> = {};
    const byTrack: Record<StudyTrack, number> = {
      cpns: CPNS_QUESTION_BANK.length,
      snbt: SNBT_QUESTION_BANK.length,
      kedinasan: KEDINASAN_QUESTION_BANK.length,
    };

    for (const q of this.allQuestions) {
      byCategory[q.category] = (byCategory[q.category] || 0) + 1;
    }

    return {
      total: this.allQuestions.length,
      byTrack,
      byCategory,
    };
  }

  // Filter pencarian dengan parameter dinamis
  public static filter(params: QuestionFilterParams): { questions: Question[]; total: number } {
    let pool = [...this.allQuestions];

    // Filter berdasarkan track
    if (params.track === 'cpns') {
      pool = [...CPNS_QUESTION_BANK];
    } else if (params.track === 'snbt') {
      pool = [...SNBT_QUESTION_BANK];
    } else if (params.track === 'kedinasan') {
      pool = [...KEDINASAN_QUESTION_BANK];
    }

    // Filter berdasarkan kategori spesifik
    if (params.categories && params.categories.length > 0) {
      pool = pool.filter((q) => params.categories!.includes(q.category));
    }

    // Filter tingkat kesulitan
    if (params.difficulty && params.difficulty !== 'ALL') {
      pool = pool.filter((q) => q.difficulty.toLowerCase() === params.difficulty!.toLowerCase());
    }

    // Pencarian kata kunci teks/topik
    if (params.search && params.search.trim()) {
      const qLower = params.search.trim().toLowerCase();
      pool = pool.filter(
        (q) =>
          q.text.toLowerCase().includes(qLower) ||
          q.subTopic.toLowerCase().includes(qLower) ||
          q.category.toLowerCase().includes(qLower)
      );
    }

    const total = pool.length;
    const offset = params.offset || 0;
    const limit = params.limit ? Math.min(params.limit, pool.length) : pool.length;
    const paginated = pool.slice(offset, offset + limit);

    return { questions: paginated, total };
  }

  // Generate paket ujian teracak dengan sanitasi opsi aman (tanpa bocor jawaban ke browser)
  public static generateExamSession(
    track: StudyTrack,
    questionCount: number,
    targetedCategories?: Category[]
  ): Question[] {
    let pool: Question[] = [];

    if (track === 'cpns') {
      pool = [...CPNS_QUESTION_BANK];
    } else if (track === 'snbt') {
      pool = [...SNBT_QUESTION_BANK];
    } else if (track === 'kedinasan') {
      pool = [...KEDINASAN_QUESTION_BANK];
    } else {
      pool = [...this.allQuestions];
    }

    // Saring kategori jika disediakan
    if (targetedCategories && targetedCategories.length > 0) {
      const targeted = pool.filter((q) => targetedCategories.includes(q.category));
      if (targeted.length > 0) {
        pool = targeted;
      }
    }

    // Algoritma Fisher-Yates Shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, questionCount);
  }

  // Sanitasi jawaban agar kunci jawaban tidak dapat diintip di Developer Tools browser
  public static sanitizeForClient(questions: Question[]): Question[] {
    return questions.map((q) => ({
      ...q,
      // Jangan ekspos kunci jawaban selama tes berlangsung untuk integritas ujian
      correctOptionIndex: -1,
      explanation: '',
    }));
  }

  // Verifikasi dan evaluasi jawaban ujian di sisi server (Server-Side Grading)
  public static evaluateAnswers(
    answers: Record<string, { selectedOptionIndex: number | null }>
  ): {
    scoreTotal: number;
    twkScore: number;
    tiuScore: number;
    tkpScore: number;
    correctCount: number;
    answeredCount: number;
    reviewItems: Array<{
      question: Question;
      selectedOptionIndex: number | null;
      earnedScore: number;
      isCorrect: boolean;
    }>;
  } {
    const questionMap = new Map<string, Question>(this.allQuestions.map((q) => [q.id, q]));

    let twkScore = 0;
    let tiuScore = 0;
    let tkpScore = 0;
    let correctCount = 0;
    let answeredCount = 0;

    const reviewItems = Object.entries(answers).map(([qid, userAns]) => {
      const original = questionMap.get(qid);
      const selected = userAns.selectedOptionIndex;
      if (selected !== null) answeredCount++;

      if (!original) {
        return {
          question: {
            id: qid,
            text: 'Soal tidak ditemukan',
            category: 'TIU',
            subTopic: '',
            options: [],
            correctOptionIndex: 0,
            explanation: '',
            difficulty: 'easy',
          } as Question,
          selectedOptionIndex: selected,
          earnedScore: 0,
          isCorrect: false,
        };
      }

      let score = 0;
      let isCorrect = false;

      if (original.category === 'TKP') {
        score = original.tkpOptionPoints ? original.tkpOptionPoints[selected ?? 0] ?? 0 : 0;
        isCorrect = score === 5;
        tkpScore += score;
      } else {
        isCorrect = selected === original.correctOptionIndex;
        score = isCorrect ? 5 : 0;
        if (original.category === 'TWK') twkScore += score;
        else tiuScore += score;
      }

      if (isCorrect) correctCount++;

      return {
        question: original,
        selectedOptionIndex: selected,
        earnedScore: score,
        isCorrect,
      };
    });

    const scoreTotal = twkScore + tiuScore + tkpScore;

    return {
      scoreTotal,
      twkScore,
      tiuScore,
      tkpScore,
      correctCount,
      answeredCount,
      reviewItems,
    };
  }
}
