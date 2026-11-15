'use client';

import React, { useState, useRef } from 'react';
import { StudyTrack, UserProfile, StreamPost } from '@/types';
import { CASHTAGS_BY_TRACK } from '@/data/constants';
import { formatUsername } from '@/utils/formatters';
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
  const cashtags = (CASHTAGS_BY_TRACK[activeTrack] || CASHTAGS_BY_TRACK.cpns).filter(
    (t) => t.startsWith('$')
  );

  const [content, setContent] = useState('');
  const [selectedCashtag, setSelectedCashtag] = useState(cashtags[0] || '$TIU');
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

  React.useEffect(() => {
    if (!cashtags.includes(selectedCashtag)) {
      setSelectedCashtag(cashtags[0] || '$TIU');
    }
  }, [activeTrack, cashtags, selectedCashtag]);

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
      authorId: userProfile.id,
      authorName: userProfile.name,
      authorUsername: userProfile.username || formatUsername(null, userProfile.name),
      authorBadge: 'Pejuang Aktif',
      avatarInitial: userProfile.avatarInitial,
      authorPhotoUrl: userProfile.avatarPhotoUrl || null,
      createdAt: Date.now(),
      timeAgo: '1m',
      cashtag: selectedCashtag,
      track: activeTrack,
      content: content.trim() || (selectedImage ? 'Ada yang bisa bantu selesaikan soal di foto ini?' : 'Coba kerjakan kuis mikro ini yuk:'),
      imageUrl: selectedImage,
      upvoteCount: 1,
      likeCount: 1,
      score: 1,
      commentCount: 0,
      isLiked: true,
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
      <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="min-w-0">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">
            Bagikan trik soal atau buat kuis mikro
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Masuk ke akunmu untuk ikut berdiskusi di Kamar {activeTrack.toUpperCase()}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRequireAuth?.('post')}
          className="h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0 w-full sm:w-auto"
        >
          Masuk Akun
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800/90 p-4 sm:p-5 transition-colors">
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-semibold text-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
          {userProfile.avatarPhotoUrl ? (
            <img
              src={userProfile.avatarPhotoUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            userProfile.avatarInitial
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Apa materi atau soal ${selectedCashtag} yang lagi kamu pelajari?`}
            className="w-full text-[15px] sm:text-base font-normal text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent resize-none focus:outline-none min-h-[56px] leading-relaxed pt-1"
            rows={2}
          />

          {/* Compressed Image Preview */}
          {selectedImage && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1322] p-1.5 max-w-sm">
              <img
                src={selectedImage}
                alt="Upload Soal Preview"
                className="w-full h-44 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white absolute top-3 right-3 flex items-center justify-center transition-colors"
                title="Hapus foto"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="px-2 py-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  WebP Terkompresi
                </span>
                <span className="font-mono tabular-nums">{imageSizeText}</span>
              </div>
            </div>
          )}

          {/* Micro-Quiz Drawer */}
          {isMicroQuizMode && (
            <div className="bg-slate-50 dark:bg-[#0D1322] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-sm gap-2 flex-wrap">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                  Buat Kuis Mikro
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Klik huruf untuk kunci jawaban
                </span>
              </div>

              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                placeholder="Tulis pertanyaan soal di sini..."
                className="w-full h-10 text-[15px] sm:text-sm font-medium px-3.5 bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />

              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectOptionIdx(idx)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0 ${
                        correctOptionIdx === idx
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-[#111726] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                      title="Jadikan kunci jawaban benar"
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
                      className="flex-1 min-w-0 h-10 text-[15px] sm:text-sm px-3.5 bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                className="w-full h-10 text-[15px] sm:text-sm px-3.5 bg-white dark:bg-[#111726] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/90">
            <div className="flex flex-wrap items-center gap-2">
              {/* Cashtag Select */}
              <div className="relative">
                <select
                  value={selectedCashtag}
                  onChange={(e) => setSelectedCashtag(e.target.value)}
                  className="h-9 text-[13px] font-semibold text-[#2563EB] dark:text-blue-400 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-lg pl-3 pr-7 appearance-none focus:outline-none cursor-pointer"
                >
                  {cashtags.map((tag) => (
                    <option key={tag} value={tag} className="bg-white dark:bg-[#111726] text-slate-900 dark:text-white">
                      {tag}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Photo Upload Button */}
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
                className={`h-9 text-[13px] font-medium px-3 rounded-lg flex items-center gap-1.5 transition-colors border ${
                  selectedImage
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                }`}
                title="Lampirkan foto soal (Auto-compress WebP)"
              >
                <ImageIcon className="w-4 h-4" strokeWidth={1.85} />
                <span>{isCompressing ? 'Mengompres...' : selectedImage ? 'Foto Siap' : 'Foto'}</span>
              </button>

              {/* Micro-Quiz Toggle */}
              <button
                type="button"
                onClick={() => setIsMicroQuizMode(!isMicroQuizMode)}
                className={`h-9 text-[13px] font-medium px-3 rounded-lg flex items-center gap-1.5 transition-colors border ${
                  isMicroQuizMode
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0D1322] hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" strokeWidth={1.85} />
                <span>Kuis</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={(!content.trim() && !quizQuestion.trim() && !selectedImage) || isCompressing}
              className="h-9 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-colors ml-auto"
            >
              Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
