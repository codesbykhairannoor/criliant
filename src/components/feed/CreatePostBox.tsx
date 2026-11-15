'use client';

import React, { useState, useRef } from 'react';
import { StudyTrack, UserProfile, StreamPost } from '@/types';
import { CASHTAGS_BY_TRACK } from '@/data/constants';
import { HelpCircle, CheckCircle2, ChevronDown, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface CreatePostBoxProps {
  userProfile: UserProfile | null;
  activeTrack: StudyTrack;
  onAddPost: (post: StreamPost) => void;
  onRequireAuth?: (reason: AuthTriggerReason) => void;
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({
  userProfile,
  activeTrack,
  onAddPost,
  onRequireAuth,
}) => {
  const [content, setContent] = useState('');
  const [selectedCashtag, setSelectedCashtag] = useState('$TIU');
  const [isMicroQuizMode, setIsMicroQuizMode] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  // Image Upload State (Client-Side Ultra-Compressed WebP)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSizeText, setImageSizeText] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cashtags = (CASHTAGS_BY_TRACK[activeTrack] || CASHTAGS_BY_TRACK.cpns).filter(
    (t) => t.startsWith('$')
  );

  // Client-Side Canvas WebP Compression (Reduces 5MB camera photos to ~50KB)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const originalSizeKb = Math.round(file.size / 1024);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDimension = 1200; // Optimal sharp resolution for formulas & text
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Ultra efficient WebP format with 0.78 quality
            const webpDataUrl = canvas.toDataURL('image/webp', 0.78);
            const compressedSizeKb = Math.round((webpDataUrl.length * 3) / 4 / 1024);

            setSelectedImage(webpDataUrl);
            setImageSizeText(`${compressedSizeKb} KB WebP (${Math.round((1 - compressedSizeKb / originalSizeKb) * 100)}% lebih hemat)`);
          }
          setIsCompressing(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Compression error:', err);
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageSizeText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      onRequireAuth?.('post');
      return;
    }
    if (!content.trim() && !quizQuestion.trim() && !selectedImage) return;

    const newPost: StreamPost = {
      id: `post_${Date.now()}`,
      authorName: userProfile.name,
      authorBadge: 'Pejuang Aktif',
      avatarInitial: userProfile.avatarInitial,
      timeAgo: 'Baru saja',
      cashtag: selectedCashtag,
      track: activeTrack,
      content: content.trim() || (selectedImage ? 'Ada yang bisa bantu selesaikan soal di foto ini?' : 'Coba kerjakan kuis mikro ini yuk:'),
      imageUrl: selectedImage,
      upvoteCount: 1,
      score: 1,
      userVote: 1,
      commentCount: 0,
      isUpvoted: true,
      comments: [],
      microQuiz: isMicroQuizMode && quizQuestion.trim() && options.every(o => o.trim())
        ? {
          questionText: quizQuestion.trim(),
          options: options.map((opt, i) => ({
            index: i,
            text: opt.trim(),
            votePercentage: i === correctOptionIdx ? 100 : 0,
          })),
          correctIndex: correctOptionIdx,
          explanation: explanation.trim() || 'Jawaban benar sudah terverifikasi.',
          totalVotes: 1,
        }
        : null,
    };

    onAddPost(newPost);
    setContent('');
    setQuizQuestion('');
    setOptions(['', '', '', '']);
    setExplanation('');
    setIsMicroQuizMode(false);
    handleRemoveImage();
  };

  if (!userProfile) {
    return (
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 mb-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
              ✨
            </div>
            <div>
              <span className="font-extrabold text-xs text-[#0F1419] dark:text-white block">
                Punya Trik Soal atau Kuis Mikro?
              </span>
              <span className="text-[11px] text-[#536471] dark:text-slate-400">
                Masuk ke akunmu untuk membagikan materi dan berdiskusi dengan mentor.
              </span>
            </div>
          </div>
          <button
            onClick={() => onRequireAuth?.('post')}
            className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex-shrink-0 active:scale-98"
          >
            Masuk Akun
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 mb-4 shadow-sm transition-colors">
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
          {userProfile.avatarInitial}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-2.5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Apa materi atau soal ${selectedCashtag} yang lagi lo pelajari hari ini?`}
            className="w-full text-xs sm:text-sm font-medium text-[#0F1419] dark:text-white placeholder:text-[#536471] dark:placeholder:text-slate-500 bg-transparent resize-none focus:outline-none min-h-[48px] leading-relaxed pt-1"
            rows={2}
          />

          {/* Compressed Image Preview */}
          {selectedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-[#EFF3F4] dark:border-[#1E293B] bg-slate-50 dark:bg-[#090D16] p-1 max-w-sm">
              <img
                src={selectedImage}
                alt="Upload Soal Preview"
                className="w-full h-44 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white absolute top-2.5 right-2.5 flex items-center justify-center transition-all shadow"
                title="Hapus foto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="p-1.5 flex items-center justify-between text-[10px] text-[#536471] dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  Auto-Compressed WebP
                </span>
                <span className="font-mono">{imageSizeText}</span>
              </div>
            </div>
          )}

          {/* Micro-Quiz Drawer */}
          {isMicroQuizMode && (
            <div className="bg-[#F8FAFC] dark:bg-[#090D16] p-3 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#0F1419] dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
                  Buat Kuis Mikro di Feed
                </span>
                <span className="text-[10px] text-[#536471] dark:text-slate-400 font-semibold">
                  Klik huruf opsi untuk kunci benar
                </span>
              </div>

              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                placeholder="Tulis pertanyaan soal di sini..."
                className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-[#0F172A] rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] text-[#0F1419] dark:text-white focus:outline-none focus:border-[#2563EB]"
              />

              <div className="space-y-1.5">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectOptionIdx(idx)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-all ${correctOptionIdx === idx
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-[#0F172A] text-[#536471] dark:text-slate-300 border border-[#EFF3F4] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      title="Klik untuk jadikan kunci jawaban benar"
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx] = e.target.value;
                        setOptions(newOpts);
                      }}
                      placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 text-xs px-3 py-1.5 bg-white dark:bg-[#0F172A] rounded-lg border border-[#EFF3F4] dark:border-[#1E293B] text-[#0F1419] dark:text-white focus:outline-none focus:border-[#2563EB]"
                    />
                    {correctOptionIdx === idx && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Pembahasan singkat atau rumus cepat..."
                className="w-full text-xs px-3 py-1.5 bg-white dark:bg-[#0F172A] rounded-lg border border-[#EFF3F4] dark:border-[#1E293B] text-[#0F1419] dark:text-white focus:outline-none focus:border-[#2563EB] placeholder:text-[#536471] dark:placeholder:text-slate-500"
              />
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1.5 border-t border-[#EFF3F4] dark:border-[#1E293B]">
            <div className="flex items-center gap-1.5">
              {/* Cashtag Pill */}
              <div className="relative">
                <select
                  value={selectedCashtag}
                  onChange={(e) => setSelectedCashtag(e.target.value)}
                  className="text-xs font-bold text-[#2563EB] dark:text-[#38BDF8] bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-[#EFF3F4] dark:border-[#1E293B] rounded-full py-1 pl-2.5 pr-6 appearance-none focus:outline-none cursor-pointer"
                >
                  {cashtags.map((tag) => (
                    <option key={tag} value={tag} className="bg-white dark:bg-[#0F172A] text-[#0F1419] dark:text-white">
                      {tag}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#2563EB] dark:text-[#38BDF8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Photo Upload Button (Hidden File Input) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all ${selectedImage
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'text-[#536471] dark:text-slate-300 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-[#EFF3F4] dark:border-[#1E293B]'
                  }`}
                title="Lampirkan foto soal (Auto-compress WebP)"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{isCompressing ? 'Mengompres...' : selectedImage ? 'Foto Siap' : '+ Foto Soal'}</span>
              </button>

              {/* Micro-Quiz Toggle */}
              <button
                type="button"
                onClick={() => setIsMicroQuizMode(!isMicroQuizMode)}
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all ${isMicroQuizMode
                  ? 'bg-[#0F1419] dark:bg-white text-white dark:text-[#0F1419]'
                  : 'text-[#536471] dark:text-slate-300 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-[#EFF3F4] dark:border-[#1E293B]'
                  }`}
              >
                <HelpCircle className="w-3 h-3" />
                <span>+ Kuis</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={(!content.trim() && !quizQuestion.trim() && !selectedImage) || isCompressing}
              className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white font-extrabold text-xs rounded-full shadow-sm transition-all"
            >
              Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
