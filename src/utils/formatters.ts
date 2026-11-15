/**
 * Formatting utilities for compact timestamps, usernames, long names, and social sharing.
 */

export function formatCompactTime(timestamp: number | string | undefined | null): string {
  if (!timestamp) return '1m';

  if (typeof timestamp === 'string') {
    const trimmed = timestamp.trim();
    // If already in compact form (e.g. "2m", "3h", "1d", "4w"), return as is
    if (/^\d+[mhdw]$/.test(trimmed)) return trimmed;

    if (
      trimmed.toLowerCase().includes('baru saja') ||
      trimmed.toLowerCase().includes('just now') ||
      trimmed.toLowerCase().includes('sekarang')
    ) {
      return '1m';
    }

    const match = trimmed.match(/^(\d+)\s*(m|menit|j|jam|h|hari|d|minggu|w|bln)/i);
    if (match) {
      const num = match[1];
      const unit = match[2].toLowerCase();
      if (unit.startsWith('m') && !unit.startsWith('min')) return `${num}m`;
      if (unit.startsWith('j') || unit.startsWith('h')) return `${num}h`;
      if (unit.startsWith('d') || unit.startsWith('har')) return `${num}d`;
      if (unit.startsWith('min') || unit.startsWith('w')) return `${num}w`;
      if (unit.startsWith('bln')) return `${num}bln`;
    }

    const parsed = Date.parse(trimmed);
    if (!isNaN(parsed)) {
      return formatTimestampDiff(parsed);
    }

    return trimmed;
  }

  return formatTimestampDiff(timestamp);
}

export function formatTimestampDiff(timeMs: number): string {
  const diffMs = Math.max(0, Date.now() - timeMs);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSec < 60) return '1m';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  if (diffWeeks < 52) return `${diffWeeks}w`;
  return `${Math.floor(diffDays / 30)}bln`;
}

/**
 * Format clean username handle (lowercase, alphanumeric + underscores, max 20 chars).
 */
export function formatUsername(username?: string | null, fallbackName?: string | null): string {
  if (username && username.trim()) {
    return username.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  }
  if (!fallbackName) return 'pejuang';
  return fallbackName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 18) || 'pejuang';
}

/**
 * Smart formatting for long names (e.g. Raden Mas Muhammad Fathurrahman Al-Ghifari, S.Tr.Ak).
 */
export function formatDisplayName(fullName?: string | null, maxLength = 24): {
  display: string;
  full: string;
  isTruncated: boolean;
} {
  const trimmed = fullName?.trim() || 'Pejuang';
  if (trimmed.length <= maxLength) {
    return { display: trimmed, full: trimmed, isTruncated: false };
  }
  return {
    display: `${trimmed.slice(0, maxLength - 2).trim()}…`,
    full: trimmed,
    isTruncated: true,
  };
}

export interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

/**
 * Trigger native share or copy to clipboard fallback
 */
export async function triggerShare(options: ShareOptions): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(options);
      return 'shared';
    } catch (e) {
      // User canceled or unsupported share data, fallback to clipboard
      if ((e as Error).name === 'AbortError') return 'failed';
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${options.text}\n${options.url}`);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
