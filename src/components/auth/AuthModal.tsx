'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/types';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  MessageCircle,
  Bookmark,
  PlusCircle,
  Swords
} from 'lucide-react';

export type AuthTriggerReason = 'like' | 'comment' | 'bookmark' | 'post' | 'exam' | 'general';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
  triggerReason?: AuthTriggerReason;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  triggerReason = 'general',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const getReasonContent = () => {
    switch (triggerReason) {
      case 'like':
        return {
          icon: Heart,
          iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-500/20',
          title: 'Suka Postingan Ini?',
          desc: 'Masuk ke akunmu untuk memberikan apresiasi dan terhubung dengan sesama pejuang.',
        };
      case 'comment':
        return {
          icon: MessageCircle,
          iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-500/20',
          title: 'Ikut Berdiskusi?',
          desc: 'Masuk untuk berdiskusi, bertanya rumus jitu, dan mendapat feedback langsung dari mentor.',
        };
      case 'bookmark':
        return {
          icon: Bookmark,
          iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60 border-sky-500/20',
          title: 'Simpan Soal ke Akunmu',
          desc: 'Masuk agar bank soal dan materi penting tersimpan permanen di cloud pribadimu.',
        };
      case 'post':
        return {
          icon: PlusCircle,
          iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500/20',
          title: 'Bagikan Soal & Kuis Mikro',
          desc: 'Masuk untuk menulis postingan, membuat polling kuis, dan membangun reputasi pejuang.',
        };
      case 'exam':
        return {
          icon: Swords,
          iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-500/20',
          title: 'Simpan Rapor Resmi CAT BKN',
          desc: 'Masuk untuk mengikuti simulasi full 110 soal dan mencatat riwayat passing grade kamu.',
        };
      default:
        return {
          icon: Sparkles,
          iconColor: 'text-[#2563EB] bg-blue-50 dark:bg-blue-950/60 border-blue-500/20',
          title: 'Bergabung dengan Criliant',
          desc: 'Social Education Hub terlengkap untuk pejuang CPNS 2026, SNBT UTBK, dan Kedinasan.',
        };
    }
  };

  const reasonData = getReasonContent();
  const ReasonIcon = reasonData.icon;

  const handleGoogleLogin = () => {
    const derivedName = name.trim() || 'Pejuang Criliant';
    onSuccessLogin({
      id: `usr_google_${Date.now()}`,
      name: derivedName,
      targetAgency: 'Kementerian Keuangan',
      avatarInitial: (derivedName.charAt(0) || 'G').toUpperCase(),
      bio: 'Pejuang NIP 2026 bersama Criliant 🔥',
      streakDays: 1,
      studyTrack: 'cpns',
      quizzesSolvedCount: 0,
      isCompetenceVerified: true,
      reputationKarma: 25,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const derivedName = name.trim() || email.split('@')[0];
    onSuccessLogin({
      id: `usr_${Date.now()}`,
      name: derivedName,
      targetAgency: 'Kementerian Keuangan',
      avatarInitial: derivedName.charAt(0).toUpperCase() || 'P',
      bio: 'Konsisten belajar setiap hari bersama Criliant 🔥',
      streakDays: 1,
      studyTrack: 'cpns',
      quizzesSolvedCount: 0,
      isCompetenceVerified: false,
      reputationKarma: 10,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-[#111726] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200 transition-colors relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup modal masuk"
          className="absolute right-5 top-5 w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
        >
          <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
        </button>

        {/* Dynamic Context Header */}
        <div className="flex items-start gap-3.5 pr-10">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${reasonData.iconColor}`}>
            <ReasonIcon className="w-5 h-5" strokeWidth={1.85} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-snug tracking-tight">
              {reasonData.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {reasonData.desc}
            </p>
          </div>
        </div>

        {/* 1. Official Google OAuth Button */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleGoogleLogin}
            className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0F19] hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-900 dark:text-white font-semibold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
          >
            {/* Google Multi-Color SVG G Logo */}
            <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Akun Google</span>
          </button>

          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs font-medium py-0.5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span>atau</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* 2. Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="Nama Lengkap Pejuang"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 text-[15px] sm:text-sm font-medium px-3.5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#2563EB] text-slate-900 dark:text-white"
                  required
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Alamat Email (Contoh: pejuang@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 text-[15px] sm:text-sm font-medium px-3.5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#2563EB] text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 text-[15px] sm:text-sm font-medium px-3.5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#2563EB] text-slate-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>{isSignUp ? 'Daftar Akun Baru' : 'Masuk Sekarang'}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="text-center pt-1">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-semibold text-[#2563EB] dark:text-[#38BDF8] hover:underline py-1"
            >
              {isSignUp ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar gratis'}
            </button>
          </div>
        </div>

        {/* Security / Privacy assurance */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
          Dilindungi oleh sistem Anti-Bot Criliant. Akun tamu dapat membaca seluruh materi tanpa biaya.
        </p>
      </div>
    </div>
  );
};

