import { NextRequest, NextResponse } from 'next/server';
import { QuestionRepository } from '@/server/questions/repository';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const answers = body.answers;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid answers payload' },
        { status: 400 }
      );
    }

    const evaluation = QuestionRepository.evaluateAnswers(answers);

    return NextResponse.json({
      success: true,
      data: evaluation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error submitting exam answers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to evaluate exam answers' },
      { status: 500 }
    );
  }
}
