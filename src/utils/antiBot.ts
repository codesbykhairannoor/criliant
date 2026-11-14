'use client';

import { UserProfile } from '@/types';

// Rate Limiter Memory Cache
const voteClickTimestamps: number[] = [];
const RATE_LIMIT_WINDOW_MS = 3000; // 3 seconds
const MAX_VOTES_PER_WINDOW = 6; // Max 6 clicks in 3 seconds

export interface VoteValidationResult {
  allowed: boolean;
  reason?: 'RATE_LIMITED' | 'NEED_COMPETENCE_PROOF';
  message?: string;
  voteWeight: number;
}

export interface ReportValidationResult {
  accepted: boolean;
  isShadowDropped: boolean; // True if report comes from low-trust bot without triggering action
  message: string;
}

/**
 * Validates whether a vote action is allowed.
 * Production Principle (Reddit / X): NEVER block the user UI with a pop-up modal!
 * Instead, use Optimistic UI + Silent Shadow Weighting.
 */
export function validateVoteAction(user: UserProfile): VoteValidationResult {
  const now = Date.now();

  // 1. Rate Limiting Check (Anti Auto-Clicker)
  while (voteClickTimestamps.length > 0 && voteClickTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    voteClickTimestamps.shift();
  }

  if (voteClickTimestamps.length >= MAX_VOTES_PER_WINDOW) {
    return {
      allowed: false,
      reason: 'RATE_LIMITED',
      message: '🛡️ Anti-Spam Guard: Santai pejuang, vote kamu sudah tercatat!',
      voteWeight: 0,
    };
  }

  voteClickTimestamps.push(now);

  // 2. Proof of Competence (PoC) Silent Weight
  // If user hasn't solved a quiz yet, vote still reflects on their UI (allowed: true),
  // but carries low/dampened weight in global ranking until verified.
  const solvedCount = user.quizzesSolvedCount ?? 0;
  const isVerified = user.isCompetenceVerified || solvedCount >= 1;

  return {
    allowed: true,
    reason: isVerified ? undefined : 'NEED_COMPETENCE_PROOF',
    voteWeight: isVerified ? 1.0 : 0.1,
  };
}

/**
 * Shadow-Report Protection Engine (Anti-Brigading & Anti-Competitor Bot Report)
 * Protects creators & ad monetization from fake spam reports.
 */
export function validateReportAction(user: UserProfile): ReportValidationResult {
  const isVerified = user.isCompetenceVerified || (user.quizzesSolvedCount ?? 0) >= 1;
  const karma = user.reputationKarma ?? 10;

  // If user has 0 solved quizzes or low karma, silent-drop the report:
  // The UI shows "Laporan diterima", but it NEVER auto-takedowns the post!
  if (!isVerified || karma < 15) {
    return {
      accepted: true,
      isShadowDropped: true,
      message: 'Laporan telah diterima dan akan ditinjau secara berkala.',
    };
  }

  // Trusted Human User Report: sent to high-priority moderation queue
  return {
    accepted: true,
    isShadowDropped: false,
    message: 'Laporan diverifikasi dan dikirim ke dewan moderator Criliant.',
  };
}

/**
 * Reddit Vote Fuzzing Engine
 * Subtly jitters the displayed score for established posts (score >= 10)
 * so bot scripts cannot measure incremental vote feedback.
 */
export function getFuzzedDisplayScore(realScore: number, seedId: string): number {
  if (realScore < 8) return realScore;

  // Stable pseudo-random jitter between -1, 0, +1 based on seedId and current minute
  const minuteHash = Math.floor(Date.now() / 60000);
  const charCodeSum = seedId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pseudoSeed = (charCodeSum + minuteHash) % 3; // 0, 1, or 2

  const jitter = pseudoSeed === 0 ? -1 : pseudoSeed === 1 ? 0 : 1;
  return Math.max(1, realScore + jitter);
}

