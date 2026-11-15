'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, StudyTrack } from '@/types';
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
} from 'lucide-react';

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
}) => {
  const [name, setName] = useState(userProfile.name);
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(userProfile.name);
    setTargetAgency(userProfile.targetAgency);
    setBio(userProfile.bio);
    setTrack(userProfile.studyTrack);
    setAvatarPhotoUrl(userProfile.avatarPhotoUrl || null);
    setBannerTheme(userProfile.bannerTheme || 'default');
    setDailyGoal(userProfile.dailyGoalQuestions || 25);
    setTelegramUsername(userProfile.telegramUsername || '');
    setInstagramUsername(userProfile.instagramUsername || '');
    setShowResetConfirm(false);
  }, [userProfile, isOpen]);

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

    onSaveProfile({
      ...userProfile,
      name: name.trim(),
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-[#1E293B] space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 transition-colors max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563EB] dark:text-[#38BDF8]" />
            <div>
              <h3 className="font-black text-[#0F1419] dark:text-white text-base">Pengaturan Profil Pejuang</h3>
              <p className="text-[11px] text-[#536471] dark:text-slate-400">Tersimpan otomatis di penyimpanan lokal akunmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Banner & Avatar Preview Box */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-[#1E293B] overflow-hidden bg-slate-50 dark:bg-[#0F172A]">
          <div className={`h-16 bg-gradient-to-r ${currentBannerClass} relative p-2.5 flex justify-between items-start`}>
            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-md">
              Tema Banner: {BANNER_THEMES[bannerTheme || 'default']?.label}
            </span>
          </div>

          <div className="px-4 pb-3.5 pt-0 flex items-end justify-between -mt-8 gap-3">
            {/* Avatar with Camera Overlay */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 border-4 border-white dark:border-[#0F172A] text-white font-black text-xl flex items-center justify-center shadow-md overflow-hidden bg-slate-900">
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
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#0F172A] transition-all"
                title="Ganti Foto Profil"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <span className="font-extrabold text-sm text-[#0F1419] dark:text-white block truncate">
                {name || 'Nama Pejuang'}
              </span>
              <span className="text-[11px] text-[#536471] dark:text-slate-400 block truncate">
                Target: {targetAgency || 'Kementerian Keuangan'}
              </span>
            </div>

            {avatarPhotoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-[10px] font-bold flex items-center gap-1 hover:bg-rose-100"
                title="Hapus foto dan kembali ke inisial"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Hapus Foto</span>
              </button>
            )}
          </div>
        </div>

        {/* Anti-Bot Status Banner */}
        <div
          className={`p-3 rounded-2xl border text-xs space-y-1 transition-colors ${
            userProfile.isCompetenceVerified
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500/20 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold flex items-center gap-1.5">
              {userProfile.isCompetenceVerified ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
              <span>Status Akun &amp; Verifikasi</span>
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                userProfile.isCompetenceVerified ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {userProfile.isCompetenceVerified ? 'Verified Human 🛡️' : 'Perlu 1 Kuis'}
            </span>
          </div>
          <p className="text-[10px] opacity-80 leading-relaxed pt-0.5">
            {userProfile.isCompetenceVerified
              ? 'Akunmu terverifikasi bebas bot dengan hak penuh interaksi Love (❤️), komentar, dan pelaporan.'
              : 'Selesaikan minimal 1 kuis mikro di feed untuk mengaktifkan lencana keaslian.'}
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 1. Nama Tampilan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Tampilan Pejuang:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] focus:border-[#2563EB] focus:outline-none text-[#0F1419] dark:text-white"
              placeholder="Contoh: Rian Pratama"
              required
            />
          </div>

          {/* 2. Fokus Jalur */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Fokus Jalur Seleksi:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setTrack('cpns')}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                  track === 'cpns'
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                    : 'border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
                }`}
              >
                🏛️ CPNS 2026
              </button>
              <button
                type="button"
                onClick={() => setTrack('snbt')}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                  track === 'snbt'
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                    : 'border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
                }`}
              >
                🎓 SNBT UTBK
              </button>
              <button
                type="button"
                onClick={() => setTrack('kedinasan')}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                  track === 'kedinasan'
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                    : 'border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
                }`}
              >
                🛡️ Kedinasan
              </button>
            </div>
          </div>

          {/* 3. Instansi / Kampus Impian with Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Instansi / Kampus Impian:
              </label>
              <span className="text-[10px] text-slate-400">Klik rekomendasi di bawah</span>
            </div>

            <input
              type="text"
              value={targetAgency}
              onChange={(e) => setTargetAgency(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] focus:border-[#2563EB] focus:outline-none text-[#0F1419] dark:text-white mb-1.5"
              placeholder="Contoh: Kementerian Keuangan, PKN STAN, FK UI"
            />

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {AGENCY_SUGGESTIONS[track].map((agency) => (
                <button
                  key={agency}
                  type="button"
                  onClick={() => setTargetAgency(agency)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap transition-all ${
                    targetAgency === agency
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1E293B] hover:border-blue-400'
                  }`}
                >
                  {agency}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Banner Theme Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Warna Tema Banner Profil:
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(BANNER_THEMES) as Array<keyof typeof BANNER_THEMES>).map((tKey) => {
                const bTheme = BANNER_THEMES[tKey];
                const isSelected = (bannerTheme || 'default') === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setBannerTheme(tKey)}
                    className={`h-8 rounded-xl bg-gradient-to-r ${bTheme.class} relative flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-[#0F1419] dark:ring-white scale-105 shadow-md' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={bTheme.label}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Target Soal Harian */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Latihan Harian:
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
                  className={`p-2 rounded-xl border text-center transition-all ${
                    dailyGoal === tier.count
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] font-bold shadow-xs'
                      : 'border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
                  }`}
                >
                  <span className="block text-xs font-extrabold">{tier.label}</span>
                  <span className="block text-[9px] text-slate-400">{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Bio / Motto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bio / Motto Perjuangan:
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] focus:border-[#2563EB] focus:outline-none text-[#0F1419] dark:text-white"
              rows={2}
              placeholder="Tuliskan komitmen atau motto belajarmu..."
            />
          </div>

          {/* 7. Kontak Belajar / Media Sosial (Opsional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Send className="w-3 h-3 text-sky-500" />
                <span>Username Telegram (Opsional):</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">@</span>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="pejuang_2026"
                  className="w-full text-xs pl-7 pr-3 py-2 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <InstagramIcon className="w-3 h-3 text-pink-500" />
                <span>Username Instagram (Opsional):</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">@</span>
                <input
                  type="text"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  placeholder="pejuang_nip"
                  className="w-full text-xs pl-7 pr-3 py-2 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 8. Reset Riwayat Soal (Anti-Repetition Utility) */}
          {seenQuestionsCount > 0 && onResetQuestionHistory && (
            <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      Riwayat Soal Pernah Dikerjakan
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Kamu sudah menyelesaikan {seenQuestionsCount} soal unik
                    </span>
                  </div>
                  {!showResetConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="px-2.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Riwayat</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onResetQuestionHistory();
                          setShowResetConfirm(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-extrabold"
                      >
                        Ya, Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 text-[10px]"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isCompressing}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
