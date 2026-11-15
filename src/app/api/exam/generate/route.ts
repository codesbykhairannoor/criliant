import { NextRequest, NextResponse } from 'next/server';
import { QuestionRepository } from '@/server/questions/repository';
import { StudyTrack, Category } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const track: StudyTrack = body.track || 'cpns';
    const count: number = Number(body.count) || 25;
    const targetedCategories: Category[] | undefined = body.targetedCategories;
    const seenQuestionIds: string[] | undefined = body.seenQuestionIds;
    const sanitizeAnswers: boolean = body.sanitizeAnswers ?? true;

    const questions = QuestionRepository.generateExamSession(
      track,
      count,
      targetedCategories,
      seenQuestionIds
    );

    // Kirim versi soal (bisa disanitasi jika diinginkan mode anti-bocor atau menyertakan kunci untuk mode review)
    const clientQuestions = sanitizeAnswers
      ? QuestionRepository.sanitizeForClient(questions)
      : questions;

    return NextResponse.json({
      success: true,
      meta: {
        track,
        requestedCount: count,
        deliveredCount: clientQuestions.length,
        isSanitized: sanitizeAnswers,
        timestamp: new Date().toISOString(),
      },
      data: clientQuestions,
    });
  } catch (error) {
    console.error('Error generating exam questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate exam session' },
      { status: 500 }
    );
  }
}
