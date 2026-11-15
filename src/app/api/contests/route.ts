import { NextRequest, NextResponse } from 'next/server';
import { SCHEDULED_CONTESTS, MOCK_CONTEST_STANDINGS } from '@/data/contests';
import { StudyTrack } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track') as StudyTrack | null;
    const contestId = searchParams.get('contestId');

    // Jika meminta leaderboard / standings kontes tertentu
    if (contestId) {
      const contest = SCHEDULED_CONTESTS.find((c) => c.id === contestId);
      if (!contest) {
        return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          contest,
          standings: MOCK_CONTEST_STANDINGS,
          totalParticipants: contest.registeredCount,
          serverTime: new Date().toISOString(),
        },
      });
    }

    // Ambil daftar kontes berdasarkan track
    const filtered = track
      ? SCHEDULED_CONTESTS.filter((c) => c.track === track)
      : SCHEDULED_CONTESTS;

    return NextResponse.json({
      success: true,
      data: filtered,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/contests route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contestId, userId, action } = body;

    if (!contestId || !userId) {
      return NextResponse.json({ success: false, error: 'Missing contestId or userId' }, { status: 400 });
    }

    // Toggle registration logic
    return NextResponse.json({
      success: true,
      message: action === 'unregister' ? 'Pendaftaran kontes dibatalkan' : 'Berhasil mendaftar ke kontes!',
      registered: action !== 'unregister',
      contestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error registering contest:', error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
