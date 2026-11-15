import { Question, StudyTrack, Category } from '@/types';
import { QuestionRepository } from '@/server/questions/repository';

export interface FetchQuestionsParams {
  track?: StudyTrack;
  categories?: Category[];
  search?: string;
  difficulty?: string;
  limit?: number;
}

export class QuestionService {
  /**
   * Mengambil daftar soal untuk Bank Soal atau latihan interaktif.
   * Mendukung pemanggilan via internal repository saat SSR/prerender
   * dan via client fetch API di browser.
   */
  public static async getQuestions(params: FetchQuestionsParams = {}): Promise<Question[]> {
    if (typeof window === 'undefined') {
      return QuestionRepository.filter({
        track: params.track,
        categories: params.categories,
        search: params.search,
        difficulty: params.difficulty,
        limit: params.limit,
      }).questions;
    }

    try {
      const searchParams = new URLSearchParams();
      if (params.track) searchParams.set('track', params.track);
      if (params.categories && params.categories.length > 0) {
        searchParams.set('categories', params.categories.join(','));
      }
      if (params.search) searchParams.set('search', params.search);
      if (params.difficulty) searchParams.set('difficulty', params.difficulty);
      if (params.limit) searchParams.set('limit', String(params.limit));

      const res = await fetch(`/api/questions?${searchParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('Fallback to local repository due to network/build phase:', err);
      return QuestionRepository.filter({
        track: params.track,
        categories: params.categories,
        search: params.search,
        difficulty: params.difficulty,
        limit: params.limit,
      }).questions;
    }
  }

  /**
   * Menggenerate sesi ujian resmi yang diacak (Fisher-Yates) sesuai kurikulum kamar
   * Mendukung Anti-Soal Berulang dengan memprioritaskan soal yang belum pernah dikerjakan
   */
  public static async generateExamSession(
    track: StudyTrack,
    count: number,
    targetedCategories?: Category[],
    sanitizeAnswers = false,
    seenQuestionIds?: string[]
  ): Promise<Question[]> {
    if (typeof window === 'undefined') {
      const q = QuestionRepository.generateExamSession(track, count, targetedCategories, seenQuestionIds);
      return sanitizeAnswers ? QuestionRepository.sanitizeForClient(q) : q;
    }

    try {
      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track,
          count,
          targetedCategories,
          sanitizeAnswers,
          seenQuestionIds,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('Fallback to local repository generateExamSession:', err);
      const q = QuestionRepository.generateExamSession(track, count, targetedCategories, seenQuestionIds);
      return sanitizeAnswers ? QuestionRepository.sanitizeForClient(q) : q;
    }
  }
}
