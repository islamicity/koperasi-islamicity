/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  Sprout, 
  TrendingUp, 
  Award, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  ShoppingBag, 
  Coins,
  ChevronRight
} from 'lucide-react';
import { MemberProfile, Transaction, BillReminder, ShuCalculation } from '../../types/koperasi';
import { IdeologyBanner } from './IdeologyBanner';
import { ActiveTab } from '../Sidebar';

interface DashboardViewProps {
  member: MemberProfile;
  transactions: Transaction[];
  bills: BillReminder[];
  shu: ShuCalculation;
  onNavigateTab: (tab: ActiveTab) => void;
  onPayBill: (billId: string) => void;
  onOpenBiometric: () => void;
  onQuickDeposit: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  member,
  transactions,
  bills,
  shu,
  onNavigateTab,
  onPayBill,
  onOpenBiometric,
  onQuickDeposit,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');

  const totalSimpanan = member.simpananPokok + member.simpananWajib + member.simpananSukarelaWadiah + member.investasiMudharabah;
  const unpaidBills = bills.filter(b => !b.isPaid);

  // Monthly visual chart data (6 months)
  const monthlyFlow = [
    { month: 'Mei', masuk: 12500000, keluar: 8200000, surplus: 4300000 },
    { month: 'Jun', masuk: 14800000, keluar: 9100000, surplus: 5700000 },
    { month: 'Jul', masuk: 18200000, keluar: 11400000, surplus: 6800000 },
    { month: 'Agu', masuk: 16500000, keluar: 10200000, surplus: 6300000 },
    { month: 'Sep', masuk: 19800000, keluar: 12100000, surplus: 7700000 },
    { month: 'Okt', masuk: 22400000, keluar: 13500000, surplus: 8900000 },
  ];

  const maxVal = Math.max(...monthlyFlow.map(d => Math.max(d.masuk, d.keluar)));

  return (
    <div className="space-y-6">
      {/* Ideological Foundation Banner */}
      <IdeologyBanner />

      {/* Pending Bill & Unrecorded Transaction Alerts */}
      {unpaidBills.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Perhatian: {unpaidBills.length} Tagihan & Transaksi Perlu Rekonsiliasi
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                {unpaidBills[0].title} — Jatuh tempo: <span className="font-semibold">{unpaidBills[0].dueDate}</span> (Rp {unpaidBills[0].amount.toLocaleString('id-ID')})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => onPayBill(unpaidBills[0].id)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Bayar Sekarang
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-3 py-1.5 rounded-xl text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-medium transition-colors"
            >
              Lihat Semua
            </button>
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Simpanan Syariah
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Rp {totalSimpanan.toLocaleString('id-ID')}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% bulan ini (Wadiah & Mudharabah)</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Surplus Petani dari Tengkulak
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Rp 18.420.000
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Petani untung +38%, Konsumen hemat 24%</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Estimasi Sisa Hasil Usaha (SHU)
            </span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Rp {shu.memberEstimatedShu.toLocaleString('id-ID')}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Jasa Modal + Jasa Belanja Transparan</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Kualitas Portofolio Pembiayaan
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                0.00%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">NPF Lancar</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Akad Salam & Musyarakah Terlindungi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Shortcut Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Aksi Cepat Superaplikasi
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onQuickDeposit}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/60 transition-all cursor-pointer shadow-xs"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>Setor Simpanan Wadiah</span>
          </button>

          <button
            onClick={() => onNavigateTab('marketplace')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800/60 transition-all cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>Belanja Pasar Petani</span>
          </button>

          <button
            onClick={() => onNavigateTab('banking')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800/60 transition-all cursor-pointer shadow-xs"
          >
            <Sprout className="w-4 h-4 text-teal-600" />
            <span>Ajukan Salam Pertanian</span>
          </button>

          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Ekspor Laporan PDF/CSV</span>
          </button>
        </div>
      </div>

      {/* Real-Time Monthly Cashflow Analytics & Portfolio Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Monthly Cashflow Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Dasbor Analitik Arus Kas Bulanan Koperasi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Perbandingan Pemasukan (Setoran & Hasil Pasar) vs Pengeluaran Pembiayaan
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  Pemasukan
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
                  Pengeluaran
                </span>
              </div>
            </div>

            {/* Bars container */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
              {monthlyFlow.map((item, idx) => {
                const masukHeight = Math.round((item.masuk / maxVal) * 100);
                const keluarHeight = Math.round((item.keluar / maxVal) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {/* Masuk Bar */}
                      <div
                        style={{ height: `${masukHeight}%` }}
                        className="w-1/2 max-w-[24px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md transition-all group-hover:opacity-90 relative"
                        title={`Pemasukan: Rp ${item.masuk.toLocaleString('id-ID')}`}
                      />
                      {/* Keluar Bar */}
                      <div
                        style={{ height: `${keluarHeight}%` }}
                        className="w-1/2 max-w-[24px] bg-slate-300 dark:bg-slate-700 rounded-t-md transition-all group-hover:opacity-90 relative"
                        title={`Pengeluaran: Rp ${item.keluar.toLocaleString('id-ID')}`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Rasio Likuiditas Kas: <strong className="text-emerald-600">38.4% (Sangat Sehat)</strong></span>
            <span>Update Real-time otomatis via Web Crypto & Node Cloud</span>
          </div>
        </div>

        {/* Portfolio & Akad Balance Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Struktur Simpanan Anggota
              </h3>
              <button
                onClick={() => onNavigateTab('banking')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center"
              >
                Detail <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              {/* Wadiah */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  <span>Wadiah Yad Dhamanah (Giro/Tabungan)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Rp {member.simpananSukarelaWadiah.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              {/* Mudharabah */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  <span>Mudharabah Mutlaqah (Investasi Tani)</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">
                    Rp {member.investasiMudharabah.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              {/* Pokok & Wajib */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  <span>Simpanan Pokok & Wajib Koperasi</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    Rp {(member.simpananPokok + member.simpananWajib).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 dark:bg-slate-500 h-full rounded-full" style={{ width: '7%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Poin Berdaya Anggota:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Award className="w-4 h-4" /> {member.totalPoinBerdaya} Poin
            </span>
          </div>
        </div>
      </div>

      {/* Recent Cryptographic Transactions Table with SHA-256 Trail */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>Buku Transaksi Real-Time & Rantai Kriptografi SHA-256</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Bank-Grade Audit
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Setiap catatan transaksi tersambung dalam rantai hash tak dapat diubah (immutable trail)
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('security')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit Kriptografi Lengkap
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Waktu & Kode</th>
                <th className="py-3 px-3">Uraian Transaksi</th>
                <th className="py-3 px-3">Akad Syariah</th>
                <th className="py-3 px-3 text-right">Nominal</th>
                <th className="py-3 px-3 text-center">Status Enkripsi</th>
                <th className="py-3 px-3 text-center">SHA-256 Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{tx.id}</span>
                    <span className="text-[10px] text-slate-400">{tx.timestamp}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">{tx.title}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{tx.senderOrRecipient}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      {tx.akad}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-bold ${tx.type === 'SIMPANAN' || tx.type === 'BAGI_HASIL_SHU' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {tx.type === 'SIMPANAN' || tx.type === 'BAGI_HASIL_SHU' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/50">
                      <ShieldCheck className="w-3 h-3" />
                      E2EE AES-256
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[10px] text-slate-500">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded" title={tx.sha256Hash}>
                      {tx.sha256Hash.substring(0, 8)}...{tx.sha256Hash.substring(tx.sha256Hash.length - 6)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
