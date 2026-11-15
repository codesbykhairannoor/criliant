'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
  shareText: string;
  previewAuthor?: string;
  previewDetails?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  shareUrl,
  shareText,
  previewAuthor,
  previewDetails,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

  const whatsappHref = `https://api.whatsapp.com/send?text=${encodedText}`;
  const telegramHref = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111726] rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center">
              <Share2 className="w-[18px] h-[18px]" strokeWidth={1.85} />
            </div>
            <div>
              <h3 className="font-semibold text-base">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Bagikan ke teman seperjuangan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Tutup"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
          </button>
        </div>

        {/* Content Snippet Preview */}
        {(previewAuthor || previewDetails) && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
            {previewAuthor && (
              <span className="font-semibold text-[#2563EB] dark:text-[#38BDF8] block truncate">
                {previewAuthor}
              </span>
            )}
            {previewDetails && (
              <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed text-xs">
                {previewDetails}
              </p>
            )}
          </div>
        )}

        {/* One-click share buttons */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 transition-all flex flex-col items-center gap-1.5 font-semibold"
          >
            <span className="text-lg">💬</span>
            <span className="text-xs">WhatsApp</span>
          </a>

          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 transition-all flex flex-col items-center gap-1.5 font-semibold"
          >
            <Send className="w-5 h-5 text-sky-500 my-0.5" strokeWidth={1.85} />
            <span className="text-xs">Telegram</span>
          </a>

          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 transition-all flex flex-col items-center gap-1.5 font-semibold"
          >
            <span className="text-lg font-black font-sans">𝕏</span>
            <span className="text-xs">Twitter / X</span>
          </a>
        </div>

        {/* Native share on mobile if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" strokeWidth={1.85} />
            <span>Bagikan via Menu Sistem</span>
          </button>
        )}

        {/* Copy Link input box */}
        <div className="pt-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Tautan Langsung
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-[15px] sm:text-xs font-mono px-2 py-1 text-slate-700 dark:text-slate-300 flex-1 outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`h-9 px-3.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2} />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" strokeWidth={1.85} />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
