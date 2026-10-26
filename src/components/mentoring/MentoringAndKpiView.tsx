/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  UserCheck, 
  Award, 
  Calendar, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { KpiMetric, CooperativeMentor } from '../../types/masjid';
import { INITIAL_KPI_METRICS, INITIAL_MENTORS } from '../../services/masjidMockData';
import { MemberProfile } from '../../types/koperasi';

interface MentoringAndKpiViewProps {
  member: MemberProfile;
  onBookMentoringSession: (mentor: CooperativeMentor, topic: string) => void;
}

export const MentoringAndKpiView: React.FC<MentoringAndKpiViewProps> = ({
  member,
  onBookMentoringSession,
}) => {
  const [kpis] = useState<KpiMetric[]>(INITIAL_KPI_METRICS);
  const [mentors] = useState<CooperativeMentor[]>(INITIAL_MENTORS);
  const [selectedMentor, setSelectedMentor] = useState<CooperativeMentor | null>(null);
  const [consultTopic, setConsultTopic] = useState('Pemberdayaan Modal Usaha Mikro Kelompok Jamaah');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    onBookMentoringSession(selectedMentor, consultTopic);
    setBookingSuccess(`Permohonan konsultasi dengan ${selectedMentor.name} berhasil diajukan. Mentor akan menghubungi Anda via WhatsApp.`);
    setTimeout(() => {
      setSelectedMentor(null);
      setBookingSuccess(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Tata Kelola Profesional
            </span>
            <span className="text-xs text-indigo-200">
              Key Performance Index (KPI) & Pendampingan Mentor Ahli
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Dasbor KPI Koperasi Masjid & Jaringan Mentor Syariah
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Menentukan standar kinerja objektif untuk memantau kesehatan permodalan, kepatuhan dewan syariah, efisiensi operasional, serta menyediakan bimbingan mentor berpengalaman bagi pengurus dan anggota.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              Indikator Kinerja Utama (Key Performance Index) Koperasi Masjid
            </h3>
            <p className="text-xs text-slate-500">
              Metrik evaluasi berkala untuk memastikan pertumbuhan sehat dan keberkahan berkelanjutan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {kpi.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      kpi.status === 'Optimal'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {kpi.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  {kpi.title}
                </h4>

                <div className="my-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Realisasi Saat Ini:</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {kpi.currentValue}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Target Standar:</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {kpi.targetValue}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      kpi.achievementPercent >= 100 ? 'bg-emerald-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.min(100, kpi.achievementPercent)}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                {kpi.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Guide: How to Best Mentor a Mosque Cooperative */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Panduan Utama: Bagaimana Cara Terbaik Mementori Koperasi Masjid Islamicity?</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <span className="font-bold text-emerald-600 block">1. Pahami Aturan & Fikih Koperasi</span>
            <p className="text-[11px] leading-relaxed">
              Mentor harus menguasai regulasi perkoperasian, fatwa DSN MUI, serta sistem tata kelola keuangan tanpa bunga agar arahan yang diberikan selalu patuh hukum dan syariah.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <span className="font-bold text-emerald-600 block">2. Jadwalkan Komunikasi Teratur</span>
            <p className="text-[11px] leading-relaxed">
              Adakan pertemuan rutin dengan pengurus koperasi masjid dan ketua Poktan binaan untuk meninjau laporan bulanan dan menyelesaikan hambatan operasional sedini mungkin.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <span className="font-bold text-emerald-600 block">3. Evaluasi Kinerja Berbasis KPI</span>
            <p className="text-[11px] leading-relaxed">
              Gunakan metrik objektif (rasio NPF 0%, kepatuhan DPS, rasio likuiditas) untuk menjaga kedisiplinan dan transparansi di hadapan seluruh anggota jamaah masjid.
            </p>
          </div>
        </div>
      </div>

      {/* Top Mentors Directory */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Mentor Terbaik Koperasi Masjid Islamicity
          </h3>
          <p className="text-xs text-slate-500">
            Praktisi keuangan mikro, akademisi syariah, dan pembina wirausaha siap mendampingi kelompok usaha Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mentors.map((mtr) => (
            <div
              key={mtr.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={mtr.avatarUrl}
                    alt={mtr.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {mtr.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      {mtr.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 text-[11px]">{mtr.mosqueAffiliation}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{mtr.rating}</span>
                    <span className="text-slate-400 font-normal">({mtr.totalMentees} bimbingan)</span>
                  </div>
                </div>

                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {mtr.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      {exp}
                    </span>
                  ))}
                </div>

                <blockquote className="mt-3 text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed border-l-2 border-emerald-500 pl-2.5">
                  &quot;{mtr.quote}&quot;
                </blockquote>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Jadwal: {mtr.availableDays}</span>
                <button
                  onClick={() => setSelectedMentor(mtr)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Ajukan Konsultasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentoring Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sesi Mentoring Koperasi Masjid
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Konsultasi gratis dengan {selectedMentor.name} ({selectedMentor.mosqueAffiliation})
            </p>

            {bookingSuccess ? (
              <div className="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                {bookingSuccess}
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Topik / Kebutuhan Pendampingan
                  </label>
                  <select
                    value={consultTopic}
                    onChange={(e) => setConsultTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Pemberdayaan Modal Usaha Mikro Kelompok Jamaah">Pemberdayaan Modal Usaha Mikro Kelompok Jamaah</option>
                    <option value="Studi Kelayakan Bridging Finance Infrastruktur Santri">Studi Kelayakan Bridging Finance Infrastruktur Santri</option>
                    <option value="Audit Kepatuhan Syariah & Struktur Akad Salam">Audit Kepatuhan Syariah & Struktur Akad Salam</option>
                    <option value="Scale-up Pemasaran Produk Halal via Telegram GreatMall">Scale-up Pemasaran Produk Halal via Telegram GreatMall</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Hari & Waktu Konsultasi
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                    Sesi online via Google Meet / Sesi tatap muka di Masjid binaan ({selectedMentor.availableDays}).
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                  >
                    Konfirmasi Booking Sesi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
