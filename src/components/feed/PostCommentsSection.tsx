'use client';

import React, { useState } from 'react';
import { PostComment, UserProfile } from '@/types';
import { Send } from 'lucide-react';
import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface PostCommentsSectionProps {
  postId: string;
  comments: PostComment[];
  userProfile: UserProfile | null;
  onAddComment: (postId: string, commentText: string) => void;
  onRequireAuth?: (reason: AuthTriggerReason) => void;
}

export const PostCommentsSection: React.FC<PostCommentsSectionProps> = ({
  postId,
  comments,
  userProfile,
  onAddComment,
  onRequireAuth,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      onRequireAuth?.('comment');
      return;
    }
    if (!newComment.trim()) return;
    onAddComment(postId, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
      {comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-slate-50 dark:bg-[#0E1524] p-2.5 rounded-xl text-xs space-y-1 border border-slate-200/70 dark:border-slate-800"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {c.authorName}
                  </span>
                  {c.authorBadge && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0">
                      {c.authorBadge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{c.timeAgo}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">
          Belum ada diskusi. Jadilah yang pertama memberikan solusi!
        </p>
      )}

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis tanggapan atau cara cepatmu..."
          className="flex-1 bg-slate-50 dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 min-w-0"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
          aria-label="Kirim komentar"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
