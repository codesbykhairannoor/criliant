import { NextRequest, NextResponse } from 'next/server';
import { QuestionRepository } from '@/server/questions/repository';
import { StudyTrack, Category } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track') as StudyTrack | null;
    const categoriesParam = searchParams.get('categories');
    const search = searchParams.get('search') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined;

    const categories = categoriesParam ? (categoriesParam.split(',') as Category[]) : undefined;

    const result = QuestionRepository.filter({
      track: track || undefined,
      categories,
      search,
      difficulty,
      limit,
      offset,
    });

    const stats = QuestionRepository.getStats();

    return NextResponse.json({
      success: true,
      meta: {
        total: result.total,
        returned: result.questions.length,
        stats,
      },
      data: result.questions,
    });
  } catch (error) {
    console.error('Error fetching questions API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
