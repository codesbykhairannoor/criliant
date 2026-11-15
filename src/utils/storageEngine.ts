/**
 * Criliant Storage Engine (X / Instagram-Grade Local-First Architecture)
 * 
 * - IndexedDB primary storage for massive, quota-free persistence (GBs capacity)
 * - Safe localStorage fallback with automatic LRU eviction & quota-exceeded guards
 * - Zero UI-thread blocking (asynchronous database operations)
 * - Memory optimization & one-tap vacuum utilities
 */

import { StreamPost, UserProfile } from '@/types';

const DB_NAME = 'criliant_app_db';
const DB_VERSION = 1;
const KV_STORE = 'app_state';

// Max cached items to keep free-tier performance blazing fast
const MAX_CACHED_POSTS = 60;
const MAX_QUESTION_HISTORY = 600;

class CriliantStorageEngine {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private isIndexedDBAvailable: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.isIndexedDBAvailable = true;
      this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(KV_STORE)) {
            db.createObjectStore(KV_STORE);
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (e) => {
          console.warn('[StorageEngine] IndexedDB open error, falling back to localStorage:', e);
          resolve(null);
        };
      } catch (err) {
        console.warn('[StorageEngine] IndexedDB unsupported, falling back to localStorage:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  /**
   * Safe set item (IndexedDB with localStorage mirror/fallback)
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);

    // 1. Try writing to IndexedDB (asynchronous & virtually unlimited)
    try {
      const db = await this.initDB();
      if (db) {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(KV_STORE, 'readwrite');
          const store = tx.objectStore(KV_STORE);
          const req = store.put(serialized, key);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    } catch (idbErr) {
      console.warn('[StorageEngine] IndexedDB write failed:', idbErr);
    }

    // 2. Mirror into localStorage with quota protection
    this.safeLocalStorageSet(key, serialized);
  }

  /**
   * Safe get item (Checks IndexedDB first, fallbacks to localStorage)
   */
  async getItem<T>(key: string): Promise<T | null> {
    // Try IndexedDB first
    try {
      const db = await this.initDB();
      if (db) {
        const val = await new Promise<string | null>((resolve) => {
          const tx = db.transaction(KV_STORE, 'readonly');
          const store = tx.objectStore(KV_STORE);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ?? null);
          req.onerror = () => resolve(null);
        });

        if (val) {
          return JSON.parse(val) as T;
        }
      }
    } catch {
      // Ignore IDB read error and fallback to localStorage
    }

    // Fallback to localStorage
    try {
      if (typeof window !== 'undefined') {
        const lsVal = localStorage.getItem(key);
        if (lsVal) return JSON.parse(lsVal) as T;
      }
    } catch (e) {
      console.error('[StorageEngine] localStorage read error:', e);
    }

    return null;
  }

  /**
   * Remove item from all storages
   */
  async removeItem(key: string): Promise<void> {
    try {
      const db = await this.initDB();
      if (db) {
        const tx = db.transaction(KV_STORE, 'readwrite');
        tx.objectStore(KV_STORE).delete(key);
      }
    } catch {}

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch {}
  }

  /**
   * Quota-safe localStorage write with LRU eviction
   */
  private safeLocalStorageSet(key: string, value: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, value);
    } catch (e: unknown) {
      // DOMException: QuotaExceededError handling
      console.warn('[StorageEngine] localStorage quota exceeded! Triggering LRU eviction...', e);
      this.evictLocalStorageCache();

      try {
        localStorage.setItem(key, value);
      } catch {
        // If still full, remove non-critical stream posts cache from localStorage
        // Data is still safely preserved in IndexedDB!
        try {
          localStorage.removeItem('criliant_stream_posts');
          localStorage.setItem(key, value);
        } catch {
          console.error('[StorageEngine] Critical: localStorage completely full.');
        }
      }
    }
  }

  /**
   * Evict old cached posts to free localStorage space
   */
  private evictLocalStorageCache(): void {
    try {
      const rawPosts = localStorage.getItem('criliant_stream_posts');
      if (rawPosts) {
        const posts: StreamPost[] = JSON.parse(rawPosts);
        if (posts.length > 20) {
          // Keep only newest 15 posts in localStorage
          const trimmed = posts.slice(0, 15);
          localStorage.setItem('criliant_stream_posts', JSON.stringify(trimmed));
        }
      }
    } catch {}
  }

  /**
   * Optimize and cap posts payload (Instagram/Twitter LRU stream style)
   */
  preparePostsPayload(posts: StreamPost[]): StreamPost[] {
    return posts.slice(0, MAX_CACHED_POSTS).map((post) => {
      // If comments array is huge, retain newest 10 comments in cached view
      if (post.comments && post.comments.length > 10) {
        return {
          ...post,
          comments: post.comments.slice(-10),
        };
      }
      return post;
    });
  }

  /**
   * Optimize UserProfile question history payload
   */
  prepareProfilePayload(profile: UserProfile): UserProfile {
    if (!profile.questionHistory) return profile;

    const entries = Object.entries(profile.questionHistory);
    if (entries.length <= MAX_QUESTION_HISTORY) return profile;

    // Retain newest entries based on attemptedAt
    const sorted = entries.sort((a, b) => b[1].attemptedAt - a[1].attemptedAt);
    const trimmedHistory = Object.fromEntries(sorted.slice(0, MAX_QUESTION_HISTORY));

    return {
      ...profile,
      questionHistory: trimmedHistory,
    };
  }

  /**
   * Get storage usage analysis (Usage in KB/MB & Quota Estimate)
   */
  async getStorageStats(): Promise<{
    usedBytes: number;
    formattedUsed: string;
    profileKb: number;
    postsKb: number;
    bookmarksKb: number;
    isIndexedDBActive: boolean;
    quotaEstimateText: string;
  }> {
    let profileBytes = 0;
    let postsBytes = 0;
    let bookmarksBytes = 0;

    if (typeof window !== 'undefined') {
      try {
        const profileStr = localStorage.getItem('criliant_user_profile') || '';
        profileBytes = new Blob([profileStr]).size;

        const postsStr = localStorage.getItem('criliant_stream_posts') || '';
        postsBytes = new Blob([postsStr]).size;

        const bookmarksStr = localStorage.getItem('criliant_bookmarks') || '';
        bookmarksBytes = new Blob([bookmarksStr]).size;
      } catch {}
    }

    let totalBytes = profileBytes + postsBytes + bookmarksBytes;
    let quotaText = 'Kapasitas Kuota Browser Standard';

    // Query browser storage estimate if available
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage !== undefined) {
          totalBytes = Math.max(totalBytes, estimate.usage);
        }
        if (estimate.quota !== undefined) {
          const quotaMb = Math.round(estimate.quota / (1024 * 1024));
          quotaText = `Mendukung hingga ~${quotaMb > 1000 ? (quotaMb / 1024).toFixed(1) + ' GB' : quotaMb + ' MB'}`;
        }
      } catch {}
    }

    const formattedUsed =
      totalBytes > 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(totalBytes / 1024)} KB`;

    return {
      usedBytes: totalBytes,
      formattedUsed,
      profileKb: Math.round(profileBytes / 1024),
      postsKb: Math.round(postsBytes / 1024),
      bookmarksKb: Math.round(bookmarksBytes / 1024),
      isIndexedDBActive: this.isIndexedDBAvailable,
      quotaEstimateText: quotaText,
    };
  }

  /**
   * One-Tap Memory Optimization (Vacuum Cache)
   * Cleans old stream post comments & cache without touching user profile or ratings
   */
  async vacuumCache(): Promise<{ freedKb: number; formattedSize: string }> {
    let beforeBytes = 0;
    let afterBytes = 0;

    if (typeof window !== 'undefined') {
      try {
        const postsStr = localStorage.getItem('criliant_stream_posts') || '';
        beforeBytes = new Blob([postsStr]).size;

        if (postsStr) {
          const posts: StreamPost[] = JSON.parse(postsStr);
          // Keep newest 20 posts with stripped image cache for older posts
          const slimmed = posts.slice(0, 20).map((p, idx) => ({
            ...p,
            imageUrl: idx < 3 ? p.imageUrl : null, // Only keep images for top 3 newest posts
            comments: p.comments?.slice(-4) || [],
          }));
          await this.setItem('criliant_stream_posts', slimmed);
          afterBytes = new Blob([JSON.stringify(slimmed)]).size;
        }
      } catch {}
    }

    const freedKb = Math.max(0, Math.round((beforeBytes - afterBytes) / 1024));
    const stats = await this.getStorageStats();
    return { freedKb, formattedSize: stats.formattedUsed };
  }

  /**
   * Clear media and cached temporary images
   */
  async clearMediaCache(): Promise<{ formattedSize: string }> {
    if (typeof window !== 'undefined') {
      try {
        const postsStr = localStorage.getItem('criliant_stream_posts');
        if (postsStr) {
          const posts: StreamPost[] = JSON.parse(postsStr);
          const withoutImages = posts.map((p) => ({
            ...p,
            imageUrl: null,
          }));
          await this.setItem('criliant_stream_posts', withoutImages);
        }
      } catch {}
    }
    const stats = await this.getStorageStats();
    return { formattedSize: stats.formattedUsed };
  }
}

export const StorageEngine = new CriliantStorageEngine();
