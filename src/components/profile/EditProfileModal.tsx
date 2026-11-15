'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProfile, StudyTrack } from '@/types';
import { formatUsername } from '@/utils/formatters';
import {
  User,
  Target,
  Sparkles,
  X,
  Check,
  ShieldCheck,
  ShieldAlert,
  Camera,
  Trash2,
  RefreshCw,
  Send,
  Flame,
  Database,
  HardDrive,
  Zap,
} from 'lucide-react';
import { StorageEngine } from '@/utils/storageEngine';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onResetQuestionHistory?: () => void;
  onVacuumStorage?: () => Promise<void>;
  onClearMediaCache?: () => Promise<void>;
}

export const BANNER_THEMES = {
  default: { id: 'default', label: 'Cobalt', class: 'from-blue-600 via-indigo-600 to-sky-500' },
  emerald: { id: 'emerald', label: 'Emerald', class: 'from-emerald-600 via-teal-600 to-cyan-500' },
  amber: { id: 'amber', label: 'Amber', class: 'from-amber-600 via-orange-600 to-yellow-500' },
  rose: { id: 'rose', label: 'Rose', class: 'from-rose-600 via-pink-600 to-purple-600' },
  midnight: { id: 'midnight', label: 'Midnight', class: 'from-slate-900 via-indigo-950 to-slate-800' },
} as const;

export const AGENCY_SUGGESTIONS: Record<StudyTrack, string[]> = {
  cpns: [
    'Kementerian Keuangan (DJP)',
    'Badan Kepegawaian Negara',
    'Kejaksaan Agung RI',
    'Kemenkumham RI',
    'Kemenkes RI',
    'Pemprov DKI Jakarta',
  ],
  snbt: [
    'FK UI (Kedokteran)',
    'STEI ITB',
    'Teknik Industri UGM',
    'Kedokteran Unair',
    'Fasilkom UI',
    'Informatika ITS',
  ],
  kedinasan: [
    'PKN STAN',
    'Polstat STIS',
    'IPDN',
    'STIN',
    'STMKG',
    'Poltekip / Poltekim',
  ],
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onResetQuestionHistory,
  onVacuumStorage,
  onClearMediaCache,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [username, setUsername] = useState(userProfile.username || formatUsername(null, userProfile.name));
  const [targetAgency, setTargetAgency] = useState(userProfile.targetAgency);
  const [bio, setBio] = useState(userProfile.bio);
  const [track, setTrack] = useState<StudyTrack>(userProfile.studyTrack);
  const [avatarPhotoUrl, setAvatarPhotoUrl] = useState<string | null>(userProfile.avatarPhotoUrl || null);
  const [bannerTheme, setBannerTheme] = useState<UserProfile['bannerTheme']>(userProfile.bannerTheme || 'default');
  const [dailyGoal, setDailyGoal] = useState<number>(userProfile.dailyGoalQuestions || 25);
  const [telegramUsername, setTelegramUsername] = useState(userProfile.telegramUsername || '');
  const [instagramUsername, setInstagramUsername] = useState(userProfile.instagramUsername || '');
  const [isCompressing, setIsCompressing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Storage Engine State & Analytics
  const [storageStats, setStorageStats] = useState<{
    usedBytes: number;
    formattedUsed: string;
    profileKb: number;
    postsKb: number;
    bookmarksKb: number;
    isIndexedDBActive: boolean;
    quotaEstimateText: string;
  } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const refreshStorageStats = useCallback(() => {
    StorageEngine.getStorageStats().then((stats) => {
      setStorageStats(stats);
    });
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(userProfile.name);
    setUsername(userProfile.username || formatUsername(null, userProfile.name));
    setTargetAgency(userProfile.targetAgency);
    setBio(userProfile.bio);
    setTrack(userProfile.studyTrack);
    setAvatarPhotoUrl(userProfile.avatarPhotoUrl || null);
    setBannerTheme(userProfile.bannerTheme || 'default');
    setDailyGoal(userProfile.dailyGoalQuestions || 25);
    setTelegramUsername(userProfile.telegramUsername || '');
    setInstagramUsername(userProfile.instagramUsername || '');
    setShowResetConfirm(false);
    refreshStorageStats();
  }, [userProfile, isOpen, refreshStorageStats]);

  const handleRunVacuum = async () => {
    setIsOptimizing(true);
    try {
      if (onVacuumStorage) {
        await onVacuumStorage();
      } else {
        await StorageEngine.vacuumCache();
      }
      refreshStorageStats();
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRunClearMedia = async () => {
    setIsOptimizing(true);
    try {
      if (onClearMediaCache) {
        await onClearMediaCache();
      } else {
        await StorageEngine.clearMediaCache();
      }
      refreshStorageStats();
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!isOpen) return null;

  // Ultra-compressed square avatar via HTML5 Canvas (outputs ~15-20KB WebP)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        const targetDim = 280; // Sharp avatar dimension
        const canvas = document.createElement('canvas');
        canvas.width = targetDim;
        canvas.height = targetDim;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, startX, startY, size, size, 0, 0, targetDim, targetDim);
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.82);
          setAvatarPhotoUrl(compressedDataUrl);
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanUsername =
      username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20) ||
      formatUsername(null, name);

    onSaveProfile({
      ...userProfile,
      name: name.trim(),
      username: cleanUsername,
      avatarInitial: name.trim().charAt(0).toUpperCase() || 'P',
      avatarPhotoUrl,
      bannerTheme,
      targetAgency: targetAgency.trim() || 'Kementerian Keuangan',
      bio: bio.trim(),
      studyTrack: track,
      dailyGoalQuestions: dailyGoal,
      telegramUsername: telegramUsername.trim().replace(/^@/, ''),
      instagramUsername: instagramUsername.trim().replace(/^@/, ''),
    });
    onClose();
  };

  const seenQuestionsCount = userProfile.questionHistory
    ? Object.keys(userProfile.questionHistory).length
    : 0;

  const currentBannerClass = BANNER_THEMES[bannerTheme || 'default']?.class || BANNER_THEMES.default.class;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-[#111726] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200 transition-colors max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#2563EB] dark:text-[#38BDF8]" strokeWidth={1.85} />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Pengaturan Profil Pejuang</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tersimpan otomatis di penyimpanan lokal akunmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
          </button>
        </div>

        {/* Dynamic Banner & Avatar Preview Box */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-[#0B0F19]">
          <div className={`h-16 bg-gradient-to-r ${currentBannerClass} relative p-3 flex justify-between items-start`}>
            <span className="text-xs font-semibold text-white bg-black/25 backdrop-blur-xs px-2.5 py-0.5 rounded-lg">
              Tema Banner: {BANNER_THEMES[bannerTheme || 'default']?.label}
            </span>
          </div>

          <div className="px-4 pb-4 pt-0 flex items-end justify-between -mt-8 gap-3">
            {/* Avatar with Camera Overlay */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 border-4 border-white dark:border-[#0B0F19] text-white font-bold text-xl flex items-center justify-center shadow-md overflow-hidden">
                {avatarPhotoUrl ? (
                  <img src={avatarPhotoUrl} alt="Preview Foto Profil" className="w-full h-full object-cover" />
                ) : (
                  <span>{name.trim().charAt(0).toUpperCase() || 'P'}</span>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#0B0F19] transition-all"
                title="Ganti Foto Profil"
              >
                <Camera className="w-4 h-4" strokeWidth={1.85} />
              </button>
            </div>

            <div className="flex-1 min-w-0 pb-0.5">
              <span className="font-semibold text-sm text-slate-900 dark:text-white block truncate" title={name}>
                {name || 'Nama Pejuang'}
              </span>
              <span className="text-xs text-[#2563EB] dark:text-[#38BDF8] font-mono block truncate">
                @{username || formatUsername(null, name)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                Target: {targetAgency || 'Kementerian Keuangan'}
              </span>
            </div>

            {avatarPhotoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="h-9 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
                title="Hapus foto dan kembali ke inisial"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.85} />
                <span className="hidden sm:inline">Hapus</span>
              </button>
            )}
          </div>
        </div>

        {/* Anti-Bot Status Banner */}
        <div
          className={`p-3.5 rounded-xl border text-xs space-y-1 transition-colors ${
            userProfile.isCompetenceVerified
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500/20 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold flex items-center gap-1.5 text-sm">
              {userProfile.isCompetenceVerified ? (
                <ShieldCheck className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" strokeWidth={1.85} />
              ) : (
                <ShieldAlert className="w-[18px] h-[18px] text-amber-600 dark:text-amber-400" strokeWidth={1.85} />
              )}
              <span>Status Akun &amp; Verifikasi</span>
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                userProfile.isCompetenceVerified ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {userProfile.isCompetenceVerified ? 'Verified Human' : 'Perlu 1 Kuis'}
            </span>
          </div>
          <p className="text-xs opacity-85 leading-relaxed pt-0.5">
            {userProfile.isCompetenceVerified
              ? 'Akunmu terverifikasi bebas bot dengan hak penuh interaksi Love (❤️), komentar, dan pelaporan.'
              : 'Selesaikan minimal 1 kuis mikro di feed untuk mengaktifkan lencana keaslian.'}
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Nama Tampilan & Username Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Lengkap / Tampilan
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 text-[15px] sm:text-sm font-medium px-3.5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 focus:border-[#2563EB] focus:outline-none text-slate-900 dark:text-white"
                placeholder="Contoh: Rian Pratama"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between gap-2">
                <span>Username (@)</span>
                <span className="text-xs text-slate-400 font-mono font-normal truncate">@{username || 'pejuang'}</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20))
                  }
                  className="w-full h-10 text-[15px] sm:text-sm font-mono font-semibold pl-8 pr-3 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 focus:border-[#2563EB] focus:outline-none text-slate-900 dark:text-white"
                  placeholder="rian_pratama"
                />
              </div>
            </div>
          </div>

          {/* 2. Fokus Jalur */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Fokus Jalur Seleksi
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTrack('cpns')}
                className={`h-10 px-2 text-xs sm:text-[13px] font-semibold rounded-xl border transition-all text-center ${
                  track === 'cpns'
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0B0F19]'
                }`}
              >
                CPNS 2026
              </button>
              <button
                type="button"
                onClick={() => setTrack('snbt')}
                className={`h-10 px-2 text-xs sm:text-[13px] font-semibold rounded-xl border transition-all text-center ${
                  track === 'snbt'
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0B0F19]'
                }`}
              >
                SNBT UTBK
              </button>
              <button
                type="button"
                onClick={() => setTrack('kedinasan')}
                className={`h-10 px-2 text-xs sm:text-[13px] font-semibold rounded-xl border transition-all text-center ${
                  track === 'kedinasan'
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0B0F19]'
                }`}
              >
                Kedinasan
              </button>
            </div>
          </div>

          {/* 3. Instansi / Kampus Impian with Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Instansi / Kampus Impian
              </label>
              <span className="text-xs text-slate-400">Klik rekomendasi di bawah</span>
            </div>

            <input
              type="text"
              value={targetAgency}
              onChange={(e) => setTargetAgency(e.target.value)}
              className="w-full h-10 text-[15px] sm:text-sm font-medium px-3.5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 focus:border-[#2563EB] focus:outline-none text-slate-900 dark:text-white mb-2"
              placeholder="Contoh: Kementerian Keuangan, PKN STAN, FK UI"
            />

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {AGENCY_SUGGESTIONS[track].map((agency) => (
                <button
                  key={agency}
                  type="button"
                  onClick={() => setTargetAgency(agency)}
                  className={`h-8 text-xs font-medium px-2.5 rounded-lg border whitespace-nowrap transition-all ${
                    targetAgency === agency
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs font-semibold'
                      : 'bg-white dark:bg-[#0B0F19] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                  }`}
                >
                  {agency}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Banner Theme Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Warna Tema Banner Profil
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(BANNER_THEMES) as Array<keyof typeof BANNER_THEMES>).map((tKey) => {
                const bTheme = BANNER_THEMES[tKey];
                const isSelected = (bannerTheme || 'default') === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setBannerTheme(tKey)}
                    className={`h-9 rounded-xl bg-gradient-to-r ${bTheme.class} relative flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-slate-900 dark:ring-white scale-[1.03] shadow-sm' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={bTheme.label}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={2.2} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Target Soal Harian */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Latihan Harian
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 15, label: '15 Soal/Hari', sub: 'Pemanasan' },
                { count: 25, label: '25 Soal/Hari', sub: 'Ideal' },
                { count: 50, label: '50 Soal/Hari', sub: 'Ambis' },
              ].map((tier) => (
                <button
                  key={tier.count}
                  type="button"
                  onClick={() => setDailyGoal(tier.count)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    dailyGoal === tier.count
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0B0F19]'
                  }`}
                >
                  <span className="block text-xs font-semibold tabular-nums">{tier.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Bio / Motto */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Bio / Motto Perjuangan
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-[15px] sm:text-sm font-normal px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 focus:border-[#2563EB] focus:outline-none text-slate-900 dark:text-white leading-relaxed"
              rows={2}
              placeholder="Tuliskan komitmen atau motto belajarmu..."
            />
          </div>

          {/* 7. Kontak Belajar / Media Sosial (Opsional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-500" />
                <span>Telegram (Opsional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="pejuang_2026"
                  className="w-full h-10 text-[15px] sm:text-sm pl-8 pr-3 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                <span>Instagram (Opsional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                <input
                  type="text"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  placeholder="pejuang_nip"
                  className="w-full h-10 text-[15px] sm:text-sm pl-8 pr-3 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          {/* 8. Reset Riwayat Soal (Anti-Repetition Utility) */}
          {seenQuestionsCount > 0 && onResetQuestionHistory && (
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                      Riwayat Soal Pernah Dikerjakan
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      Kamu sudah menyelesaikan {seenQuestionsCount} soal unik
                    </span>
                  </div>
                  {!showResetConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="h-9 px-3 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.85} />
                      <span>Reset Riwayat</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onResetQuestionHistory();
                          setShowResetConfirm(false);
                        }}
                        className="h-9 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                      >
                        Ya, Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="h-9 px-2.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-medium"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 9. Pusat Penyimpanan & Manajemen Memori */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4" strokeWidth={1.85} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <span>Pusat Penyimpanan & Memori</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        {storageStats?.isIndexedDBActive ? 'IndexedDB Aktif' : 'Local Engine'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Penyimpanan lokal berkapasitas besar bebas limit 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress & Stats Details */}
              <div className="space-y-2 bg-white dark:bg-[#111726] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold tabular-nums">
                  <span className="text-slate-600 dark:text-slate-300">
                    Terpakai: <span className="text-[#2563EB] dark:text-[#38BDF8] font-bold">{storageStats?.formattedUsed || '0 KB'}</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    {storageStats?.quotaEstimateText || 'Kuota Fleksibel'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(3, ((storageStats?.usedBytes || 0) / (10 * 1024 * 1024)) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap tabular-nums">
                  <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    Profil & Soal: ~{storageStats?.profileKb ?? 0} KB
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    Stream: ~{storageStats?.postsKb ?? 0} KB
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    Bookmark: ~{storageStats?.bookmarksKb ?? 0} KB
                  </span>
                </div>
              </div>

              {/* Action Buttons: Vacuum & Clear Media */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                <button
                  type="button"
                  onClick={handleRunVacuum}
                  disabled={isOptimizing}
                  className="h-9 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-[#38BDF8] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={1.85} />
                  <span>{isOptimizing ? 'Merapikan...' : 'Optimalkan Memori'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRunClearMedia}
                  disabled={isOptimizing}
                  className="h-9 px-3 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <HardDrive className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.85} />
                  <span>Bersihkan Cache Gambar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isCompressing}
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={2} />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
