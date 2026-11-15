'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  onSubmitReport: (postId: string, category: string, reasonDetails: string) => void;
}

export const REPORT_REASONS = [
  { id: 'wrong_key', label: 'Kunci Jawaban / Pembahasan Keliru', desc: 'Jawaban yang ditandai benar berbeda dengan kaidah resmi BKN/Kemendikbud' },
  { id: 'typo_unclear', label: 'Soal Cacat / Kurang Lengkap', desc: 'Ada potongan teks rumus yang hilang atau foto tidak terbaca' },
  { id: 'spam_promotion', label: 'Spam / Iklan Berbayar Tidak Relevan', desc: 'Promosi bimbel eksternal, judi, atau tautan mencurigakan' },
  { id: 'offensive', label: 'Pelecehan / Ujaran Kebencian / SARA', desc: 'Konten menyinggung suku, agama, ras atau menyerang personal pejuang' },
  { id: 'other', label: 'Lainnya', desc: 'Masalah lainnya terkait etika dan akurasi' }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  postId,
  onSubmitReport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(REPORT_REASONS[0].id);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !postId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReport(postId, selectedCategory, details);
      setIsSubmitting(false);
      setDetails('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-[#111726] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 transition-colors relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-rose-800/50">
              <ShieldAlert className="w-5 h-5" strokeWidth={1.85} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Laporkan Postingan / Soal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bantu jaga standar keakuratan materi Criliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Pilih Alasan Pelaporan
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {REPORT_REASONS.map((reason) => {
                const isSelected = selectedCategory === reason.id;
                return (
                  <label
                    key={reason.id}
                    onClick={() => setSelectedCategory(reason.id)}
                    className={`block p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200 shadow-xs'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="report_reason"
                        checked={isSelected}
                        onChange={() => setSelectedCategory(reason.id)}
                        className="mt-1 text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <p className="text-sm font-semibold leading-snug">{reason.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {reason.desc}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Detail Tambahan (Opsional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Jelaskan alasan atau referensi buku/pasal jika ada..."
              rows={2}
              className="w-full text-[15px] sm:text-sm bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm active:scale-[0.99] transition-all"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
