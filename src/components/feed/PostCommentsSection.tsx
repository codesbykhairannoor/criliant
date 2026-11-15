'use client';

import React, { useState } from 'react';
import { PostComment, UserProfile } from '@/types';
import { Send } from 'lucide-react';
import { AuthTriggerReason } from '@/components/auth/AuthModal';
import { formatCompactTime, formatUsername } from '@/utils/formatters';

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
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/90 space-y-3 animate-in fade-in duration-150">
      {comments.length > 0 ? (
        <div className="space-y-2.5">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-slate-50 dark:bg-[#0D1322] p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 flex gap-3 items-start"
            >
              <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white font-semibold text-xs flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
                {c.authorPhotoUrl ? (
                  <img src={c.authorPhotoUrl} alt={c.authorName} className="w-full h-full object-cover" />
                ) : (
                  c.avatarInitial || c.authorName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]"
                      title={c.authorName}
                    >
                      {c.authorName}
                    </span>
                    <span
                      className="text-xs text-slate-500 dark:text-slate-400 font-normal truncate max-w-[100px] sm:max-w-[140px]"
                      title={`@${formatUsername(c.authorUsername, c.authorName)}`}
                    >
                      @{formatUsername(c.authorUsername, c.authorName)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 tabular-nums">
                    {formatCompactTime(c.createdAt || c.timeAgo)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-normal leading-relaxed">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-2">
          Belum ada diskusi. Jadilah yang pertama memberikan solusi.
        </p>
      )}

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis tanggapan atau cara cepatmu..."
          className="flex-1 h-10 bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 text-[15px] sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 min-w-0"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="w-10 h-10 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
          aria-label="Kirim komentar"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
