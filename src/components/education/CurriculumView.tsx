/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  Play, 
  Sparkles,
  QrCode,
  ShieldCheck,
  X
} from 'lucide-react';
import { CurriculumModule } from '../../types/masjid';
import { INITIAL_CURRICULUM_MODULES } from '../../services/masjidMockData';
import { MemberProfile } from '../../types/koperasi';

interface CurriculumViewProps {
  member: MemberProfile;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ member }) => {
  const [modules, setModules] = useState<CurriculumModule[]>(INITIAL_CURRICULUM_MODULES);
  const [selectedModule, setSelectedModule] = useState<CurriculumModule>(modules[0]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  const completedCount = modules.filter(m => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

  const handleStartQuiz = (mod: CurriculumModule) => {
    setSelectedModule(mod);
    setQuizAnswer(null);
    setQuizFeedback(null);
    setShowQuizModal(true);
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    setQuizAnswer(optionIndex);
    // Option 1 (index 1) is consistently the correct ethical sharia/cooperative answer in this simulation
    if (optionIndex === 1) {
      setQuizFeedback('Jawaban Benar! Anda memahami nilai keadilan syariah dan prinsip kemandirian koperasi.');
      // Mark module completed
      const updated = modules.map(m => m.id === selectedModule.id ? { ...m, isCompleted: true, score: 100 } : m);
      setModules(updated);
    } else {
      setQuizFeedback('Kurang tepat. Koperasi syariah berlandaskan ukhuwah, bagi hasil adil, dan tanpa riba. Silakan pelajari kembali.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/30 text-teal-300 border border-teal-400/30">
              Akademi Koperasi Islamicity
            </span>
            <span className="text-xs font-arabic text-teal-200">
              طلب العلم فريضة على كل مسلم
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Kurikulum Pembelajaran Sistem Informasi & Kepemimpinan Koperasi
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl mt-1 leading-relaxed">
            Membangun kemandirian ekonomi anggota melalui 7 pilar kompetensi: produk syariah, manajemen keuangan, riset pasar, standarisasi halal, regulasi hukum, jaringan ukhuwah, dan penguasaan teknologi digital.
          </p>
        </div>

        {/* Certificate trigger */}
        <button
          onClick={() => setShowCertModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Award className="w-4 h-4 fill-slate-950" />
          <span>Lihat Sertifikat Digital Anggota</span>
        </button>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Progres Pembelajaran Mandiri Anda
            </h4>
            <p className="text-xs text-slate-500">
              Menyelesaikan {completedCount} dari {modules.length} modul kurikulum standar koperasi syariah
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1.5 text-xs">
          <div className="flex justify-between font-bold">
            <span className="text-slate-500">Pencapaian:</span>
            <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}% Tuntas</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7 Modules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              mod.isCompleted
                ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Modul #{mod.number} • {mod.level}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  {mod.durationHours} Jam
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                {mod.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {mod.summary}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-600 dark:text-slate-400 block text-[10px] uppercase">
                  Pokok Bahasan Materi:
                </span>
                {mod.learningPoints.slice(0, 3).map((lp, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="line-clamp-1">{lp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {mod.isCompleted ? (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai (Nilai {mod.score})</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Belum Diuji</span>
              )}

              <button
                onClick={() => handleStartQuiz(mod)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{mod.isCompleted ? 'Uji Ulang' : 'Mulai Belajar & Kuis'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShowQuizModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Evaluasi Pemahaman: Modul #{selectedModule.number}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {selectedModule.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedModule.summary}
            </p>

            <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Pertanyaan Kasus Praktis:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Seorang anggota kelompok tani membutuhkan modal Rp 10.000.000 untuk membeli bibit dan pupuk sebelum musim tanam. Bagaimana akad syariah terbaik yang diterapkan koperasi sesuai prinsip memotong perantara dan tanpa bunga?
              </p>

              <div className="space-y-2 pt-2 text-xs">
                {[
                  'Memberikan pinjaman tunai dengan bunga flat 2% per bulan sebagai biaya administrasi.',
                  'Menerapkan Akad Salam: Koperasi membeli hasil panen padi di muka dengan harga adil, dan petani menyerahkan hasil panen saat tiba masanya.',
                  'Meminjamkan dana dengan agunan tanah dan denda harian jika panen terlambat.',
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerSubmit(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      quizAnswer === idx
                        ? idx === 1
                          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold'
                          : 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-800 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {quizFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold mt-3 ${
                    quizAnswer === 1
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300'
                  }`}
                >
                  {quizFeedback}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowQuizModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Tutup Evaluasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-xl p-8 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-300">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
                KOPERASI ISLAMICITY DIGITAL SUPERAPP
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                SERTIFIKAT KELAYAKAN ANGGOTA BERDAYA
              </h2>
              <p className="text-xs text-slate-500">
                Nomor Registrasi Sertifikat: CERT-ISL-2026-8829-DPS
              </p>
            </div>

            <div className="py-4 border-y border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Diberikan Kepada Anggota:</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {member.name}
              </div>
              <span className="text-xs text-emerald-600 font-mono font-bold block">
                No. Anggota: {member.memberNumber}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto pt-2 leading-relaxed">
                Telah menyelesaikan kurikulum pembelajaran sistem informasi, pemahaman fikih muamalah anti-riba, dan siap menjadi penggerak kader kepemimpinan koperasi masjid.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <div className="text-left font-mono text-[10px] text-slate-400">
                <span>Tanggal Terbit: 25 Oktober 2026</span>
                <span className="block text-emerald-600 font-bold">Status: Aktif & Terverifikasi DPS</span>
              </div>

              <div className="flex items-center gap-2">
                <QrCode className="w-9 h-9 text-slate-800 dark:text-slate-200" />
                <span className="text-[9px] font-mono text-left text-slate-400 leading-tight">
                  HASH: 9A7C..E1F<br />SHA-256 VALID
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
