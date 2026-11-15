'use client';

import React, { useState } from 'react';
import { UserProfile, StudyTrack } from '@/types';
import { User, Target, Sparkles, X, Check, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [targetAgency, setTargetAgency] = useState(userProfile.targetAgency);
  const [bio, setBio] = useState(userProfile.bio);
  const [track, setTrack] = useState<StudyTrack>(userProfile.studyTrack);

  React.useEffect(() => {
    setName(userProfile.name);
    setTargetAgency(userProfile.targetAgency);
    setBio(userProfile.bio);
    setTrack(userProfile.studyTrack);
  }, [userProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      ...userProfile,
      name: name.trim(),
      avatarInitial: name.trim().charAt(0).toUpperCase() || 'P',
      targetAgency: targetAgency.trim() || 'Kementerian Keuangan',
      bio: bio.trim(),
      studyTrack: track,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-[#1E293B] space-y-5 animate-in zoom-in-95 duration-200 transition-colors max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563EB] dark:text-[#38BDF8]" />
            <h3 className="font-black text-[#0F1419] dark:text-white text-base">Profil Pejuang (Local-First)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-[#0F172A] p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#1E293B]">
          <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white font-black text-lg flex items-center justify-center shadow-md flex-shrink-0">
            {name.trim().charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-[#0F1419] dark:text-white truncate">{name || 'Nama Pejuang'}</span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] font-bold px-1.5 py-0.2 rounded flex-shrink-0">
                Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Target: {targetAgency || 'Kemenkeu'}</p>
          </div>
        </div>

        {/* Anti-Bot & Proof of Competence Status */}
        <div
          className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-colors ${userProfile.isCompetenceVerified
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-500/20 text-amber-900 dark:text-amber-200'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold flex items-center gap-1.5">
              {userProfile.isCompetenceVerified ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
              <span>Status Keaslian Akun</span>
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${userProfile.isCompetenceVerified
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
                }`}
            >
              {userProfile.isCompetenceVerified ? '🛡️ Verified Human' : '⚠️ Perlu PoC'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] opacity-80 pt-0.5 font-medium">
            <span>Kuis Terpecahkan: <strong>{userProfile.quizzesSolvedCount || 0}</strong></span>
            <span>Reputasi Karma: <strong>{userProfile.reputationKarma || 10}</strong></span>
          </div>
          <p className="text-[10px] opacity-75 leading-tight pt-1 border-t border-black/5 dark:border-white/5">
            {userProfile.isCompetenceVerified
              ? '✅ Akunmu terverifikasi bebas bot dengan hak penuh suka (❤️), komentar, dan lapor dalam ekosistem Criliant.'
              : 'ℹ️ Jawab minimal 1 kuis mikro di feed untuk mengaktifkan lencana Verified Human.'}
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Tampilan di Stream:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#2563EB] focus:outline-none text-[#0F1419] dark:text-white"
              placeholder="Contoh: Rian Pratama"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Instansi / Kampus Impian (Target):
            </label>
            <input
              type="text"
              value={targetAgency}
              onChange={(e) => setTargetAgency(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#2563EB] focus:outline-none text-[#0F1419] dark:text-white"
              placeholder="Contoh: Kementerian Keuangan, BKN, STAN, UI"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bio / Motto Perjuangan:
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#1E293B] focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#2563EB] focus:outline-none text-[#0F1419] dark:text-white"
              rows={2}
              placeholder="Tuliskan komitmen atau motto belajar lo..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Fokus Jalur Utama:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTrack('cpns')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${track === 'cpns'
                  ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]'
                  : 'border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
                  }`}
              >
                🏛️ CPNS
              </button>
              <button
                type="button"
                onClick={() => setTrack('snbt')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${track === 'snbt'
                  ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]'
                  : 'border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
                  }`}
              >
                🎓 SNBT
              </button>
              <button
                type="button"
                onClick={() => setTrack('kedinasan')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${track === 'kedinasan'
                  ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]'
                  : 'border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
                  }`}
              >
                🛡️ Kedinasan
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Profil Pejuang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
