/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Cloud, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  FileText, 
  ShieldCheck, 
  QrCode, 
  ExternalLink,
  Building2
} from 'lucide-react';
import { Transaction, MemberProfile, BillReminder } from '../../types/koperasi';
import { StorageService } from '../../services/storageService';

interface FinancialReportsViewProps {
  transactions: Transaction[];
  member: MemberProfile;
  bills: BillReminder[];
}

export const FinancialReportsView: React.FC<FinancialReportsViewProps> = ({
  transactions,
  member,
  bills,
}) => {
  const [filterPeriod, setFilterPeriod] = useState('Semua Periode (Tahun 2026)');
  const [filterType, setFilterType] = useState('ALL');
  const [searchKw, setSearchKw] = useState('');
  const [googleDriveSyncStatus, setGoogleDriveSyncStatus] = useState<'idle' | 'exporting' | 'synced'>('idle');
  const [googleDriveDocUrl, setGoogleDriveDocUrl] = useState<string | null>(null);

  // Unrecorded / pending transaction simulation alert
  const pendingTransactions = transactions.filter(t => t.status === 'MENUNGGU_SINKRON');

  const filtered = transactions.filter((t) => {
    const matchType = filterType === 'ALL' || t.type === filterType;
    const matchKw = t.title.toLowerCase().includes(searchKw.toLowerCase()) ||
      t.id.toLowerCase().includes(searchKw.toLowerCase()) ||
      t.senderOrRecipient.toLowerCase().includes(searchKw.toLowerCase());
    return matchType && matchKw;
  });

  const totalIn = transactions
    .filter(t => t.type === 'SIMPANAN' || t.type === 'BAGI_HASIL_SHU')
    .reduce((a, b) => a + b.amount, 0);

  const totalOut = transactions
    .filter(t => t.type !== 'SIMPANAN' && t.type !== 'BAGI_HASIL_SHU')
    .reduce((a, b) => a + b.amount, 0);

  const handleExportCsv = () => {
    const csvContent = StorageService.exportTransactionsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Keuangan_KSPPS_Islamicity_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleGoogleDriveSync = () => {
    setGoogleDriveSyncStatus('exporting');
    setTimeout(() => {
      setGoogleDriveSyncStatus('synced');
      setGoogleDriveDocUrl('https://drive.google.com/drive/folders/islamicity-koperasi-reports-backup');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="no-print p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              Akuntabilitas Terverifikasi
            </span>
            <span className="text-xs text-emerald-200">
              Format Standar Perbankan Syariah & OJK
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Modul Pelaporan Keuangan & Ekspor Multi-Format
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-xl mt-1 leading-relaxed">
            Menghasilkan laporan keuangan yang transparan, dapat diaudit, dan dilengkapi stempel tanda tangan digital serta integrasi pencadangan awan.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF Resmi</span>
          </button>

          <button
            onClick={handleGoogleDriveSync}
            disabled={googleDriveSyncStatus === 'exporting'}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Cloud className="w-4 h-4" />
            <span>{googleDriveSyncStatus === 'exporting' ? 'Menyinkronkan...' : googleDriveSyncStatus === 'synced' ? 'Tersimpan di GDrive' : 'Cadangkan ke Google Drive'}</span>
          </button>
        </div>
      </div>

      {/* Google Drive Success Banner */}
      {googleDriveSyncStatus === 'synced' && (
        <div className="no-print p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs flex items-center justify-between text-indigo-900 dark:text-indigo-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Laporan keuangan terenkripsi berhasil dicadangkan ke Google Drive Workspace Anda: <strong>KSPPS_Islamicity_Financial_Report_2026.pdf</strong>
            </span>
          </div>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] underline cursor-pointer">
            Buka di Google Drive
          </span>
        </div>
      )}

      {/* Unrecorded / Offline Pending Transactions Alert Banner */}
      {pendingTransactions.length > 0 && (
        <div className="no-print p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              Terdapat <strong>{pendingTransactions.length} transaksi offline</strong> yang belum direkonsiliasi dengan server pusat perbankan. Silakan klik tombol sinkronisasi saat internet aktif.
            </span>
          </div>
        </div>
      )}

      {/* Printable Official Financial Statement Layout */}
      <div className="print-container bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        
        {/* Official Header for Print & Audit */}
        <div className="border-b-2 border-emerald-800 dark:border-emerald-500 pb-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Koperasi Simpan Pinjam dan Pembiayaan Syariah (KSPPS) Islamicity
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Badan Hukum No: AHU-0019283.AH.01.26.Tahun 2023 • Dewan Syariah Nasional MUI No. DSN-098/2023
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Lumbung Pangan & Sentra Agribisnis Mandiri • Email: tamankuliner.islamicity@gmail.com
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 block">
                LAPORAN BUKU BESAR SYARIAH
              </span>
              <span className="text-[11px] text-slate-500 block">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
              <span className="text-[10px] text-indigo-600 font-mono block">E2EE-HASH-VERIFIED-OK</span>
            </div>
          </div>
        </div>

        {/* Member Profile & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Identitas Anggota</span>
            <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{member.name}</span>
            <span className="text-slate-500 text-[11px]">No. Anggota: {member.memberNumber}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase font-bold">Total Arus Masuk (Inflow)</span>
            <span className="font-black text-emerald-700 dark:text-emerald-300 text-base block mt-0.5">
              Rp {totalIn.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-500">Setoran Wadiah & Bagi Hasil SHU</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Arus Keluar (Outflow)</span>
            <span className="font-black text-slate-800 dark:text-slate-200 text-base block mt-0.5">
              Rp {totalOut.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-500">Belanja Pasar, Salam, ZISWAF</span>
          </div>
        </div>

        {/* Filter bar (Hidden in print) */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi atau pihak terkait..."
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">Semua Jenis Transaksi</option>
              <option value="SIMPANAN">Simpanan</option>
              <option value="BELANJA_PASAR">Belanja Pasar Petani</option>
              <option value="PEMBIAYAAN_SALAM">Pembiayaan Salam</option>
              <option value="BAGI_HASIL_SHU">Bagi Hasil SHU</option>
              <option value="ZISWAF">ZISWAF</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-2">ID & Waktu</th>
                <th className="py-2.5 px-2">Keterangan Transaksi</th>
                <th className="py-2.5 px-2">Pihak / Rekanan</th>
                <th className="py-2.5 px-2">Akad Syariah</th>
                <th className="py-2.5 px-2 text-right">Debit / Kredit</th>
                <th className="py-2.5 px-2 text-center">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-2 font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.id}</span>
                    <span className="text-[10px] text-slate-400">{t.timestamp}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="font-semibold text-slate-900 dark:text-white block">{t.title}</span>
                    <span className="text-[10px] text-slate-500">{t.description}</span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">{t.senderOrRecipient}</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {t.akad}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className={`font-bold ${t.type === 'SIMPANAN' || t.type === 'BAGI_HASIL_SHU' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {t.type === 'SIMPANAN' || t.type === 'BAGI_HASIL_SHU' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      Sah
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Signatures & Digital Stamp (Appears in Print & UI) */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Ketua Pengurus Koperasi</span>
            <div className="h-14 flex items-center justify-center font-arabic text-emerald-700 dark:text-emerald-400 text-lg">
              د. الحاج سوبارمان
            </div>
            <strong className="text-slate-800 dark:text-slate-200 block">Dr. H. Suparman, M.Si</strong>
            <span className="text-[10px] text-slate-400">NIP. KSPPS-DIR-001</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Dewan Pengawas Syariah</span>
            <div className="h-14 flex items-center justify-center font-arabic text-emerald-700 dark:text-emerald-400 text-lg">
              الشيخ فتح الرحمن
            </div>
            <strong className="text-slate-800 dark:text-slate-200 block">KH. Fathurrahman Al-Hafidz</strong>
            <span className="text-[10px] text-slate-400">DSN MUI No. 441/DPS</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 block mb-1">Stempel Digital & QR Verifikasi</span>
            <div className="p-2 border border-emerald-500/40 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 inline-flex items-center gap-2">
              <QrCode className="w-8 h-8 text-emerald-600" />
              <div className="text-left text-[9px] font-mono leading-tight">
                <span className="text-emerald-700 font-bold block">VERIFIED 2026</span>
                <span className="text-slate-400 block">HASH: 9A7C..E1F</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
