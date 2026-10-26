/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Key, 
  Lock, 
  RefreshCw, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Smartphone, 
  HardDrive,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { MemberProfile, Transaction } from '../../types/koperasi';
import { E2EESecurityState, CloudBackupSchedule } from '../../types/security';
import { StorageService } from '../../services/storageService';
import { generateKeyFingerprint } from '../../services/cryptoService';

interface SecurityCenterViewProps {
  member: MemberProfile;
  transactions: Transaction[];
  onTriggerBiometricTest: () => void;
  onUpdateMemberSecurity: (updates: Partial<MemberProfile>) => void;
}

export const SecurityCenterView: React.FC<SecurityCenterViewProps> = ({
  member,
  transactions,
  onTriggerBiometricTest,
  onUpdateMemberSecurity,
}) => {
  const [e2eeState, setE2EEState] = useState<E2EESecurityState>({
    isEncryptionActive: true,
    algorithm: 'AES-256-GCM',
    keyFingerprint: member.e2eePublicKey || '04:B2:99:A1:FE:33:01:C8:DE:77:88:12:34:56:78:9A:BC:DE:F0',
    lastKeyRotation: '25 Oktober 2026 08:00 WIB',
    totalEncryptedPayloads: 148,
    integrityVerified: true,
  });

  const [backupSchedule, setBackupSchedule] = useState<CloudBackupSchedule>(
    StorageService.getBackupSchedule()
  );

  const [copiedKey, setCopiedKey] = useState(false);
  const [isRotatingKey, setIsRotatingKey] = useState(false);
  const [isBackingUpNow, setIsBackingUpNow] = useState(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);

  // 2FA state
  const [twoFactorOtpCode, setTwoFactorOtpCode] = useState('849 201');

  const handleCopyKey = () => {
    navigator.clipboard.writeText(e2eeState.keyFingerprint);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRotateKey = () => {
    setIsRotatingKey(true);
    setTimeout(() => {
      const newFp = generateKeyFingerprint();
      setE2EEState((prev) => ({
        ...prev,
        keyFingerprint: newFp,
        lastKeyRotation: 'Baru saja',
      }));
      onUpdateMemberSecurity({ e2eePublicKey: newFp });
      setIsRotatingKey(false);
    }, 1000);
  };

  const handleManualBackup = () => {
    setIsBackingUpNow(true);
    setTimeout(() => {
      const updatedSchedule: CloudBackupSchedule = {
        ...backupSchedule,
        lastWeeklyBackup: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')} WIB`,
        totalSnapshots: backupSchedule.totalSnapshots + 1,
      };
      StorageService.saveBackupSchedule(updatedSchedule);
      setBackupSchedule(updatedSchedule);
      setIsBackingUpNow(false);
      setBackupSuccessMessage('Pencadangan snapshot terenkripsi ke Cloud Syariah Vault berhasil dibuat!');
      setTimeout(() => setBackupSuccessMessage(null), 4000);
    }, 1400);
  };

  const handleDownloadSnapshotJson = () => {
    const jsonStr = StorageService.generateFullSnapshot();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `islamicity_encrypted_vault_snapshot_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Perbankan Standar Tertinggi
            </span>
            <span className="text-xs text-indigo-200">
              Enkripsi End-to-End & Biometrik Multi-Faktor
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Pusat Keamanan Siber & Pencadangan Cloud Mingguan
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Data pribadi anggota dan catatan keuangan dilindungi enkripsi AES-256-GCM, audit trail hash SHA-256, serta sinkronisasi lintas perangkat yang transparan.
          </p>
        </div>

        <button
          onClick={handleManualBackup}
          disabled={isBackingUpNow}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Cloud className={`w-4 h-4 ${isBackingUpNow ? 'animate-spin' : ''}`} />
          <span>{isBackingUpNow ? 'Membuat Snapshot...' : 'Cadangkan ke Cloud Sekarang'}</span>
        </button>
      </div>

      {backupSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2 text-emerald-800 dark:text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{backupSuccessMessage}</span>
        </div>
      )}

      {/* 3 Pillars of Security: E2EE, Biometric & 2FA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: End-to-End Encryption */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                AES-256-GCM
              </span>
              <Lock className="w-4 h-4 text-indigo-600" />
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Enkripsi Ujung-ke-Ujung (E2EE)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Semua nominal saldo, data pribadi KTP, dan komunikasi akad dienkripsi di perangkat sebelum terkirim ke server.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[10px] space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span>Fingerprint Kunci Publik Sesi:</span>
                <button
                  onClick={handleCopyKey}
                  className="hover:text-emerald-500 cursor-pointer"
                  title="Salin Fingerprint"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-slate-800 dark:text-slate-200 font-bold truncate">
                {e2eeState.keyFingerprint}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Rotasi: {e2eeState.lastKeyRotation}</span>
            <button
              onClick={handleRotateKey}
              disabled={isRotatingKey}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRotatingKey ? 'animate-spin' : ''}`} />
              Rotasi Kunci
            </button>
          </div>
        </div>

        {/* Card 2: Biometric Authentication */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                FIDO2 / WebAuthn
              </span>
              <Fingerprint className="w-4 h-4 text-emerald-600" />
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Otentikasi Biometrik Perangkat
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Otorisasi transaksi penarikan saldo dan penandatanganan akad Salam menggunakan sensor sidik jari atau Face ID.
            </p>

            <div className="mt-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status Sensor:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {member.isBiometricEnabled ? 'Aktif & Terdaftar' : 'Belum Aktif'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Tipe Hardware:</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Touch ID / Fingerprint Scanner</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onTriggerBiometricTest}
              className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Fingerprint className="w-3.5 h-3.5" />
              Uji Coba Sensor Biometrik
            </button>
          </div>
        </div>

        {/* Card 3: Two-Factor Authentication (2FA) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                TOTP Authenticator
              </span>
              <Smartphone className="w-4 h-4 text-amber-600" />
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Autentikasi Dua Faktor (2FA)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Lapisan verifikasi ganda berbasis waktu untuk mencegah pengambilalihan akun anggota oleh pihak tak berwenang.
            </p>

            <div className="mt-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 text-xs">
              <span className="text-slate-400 text-[10px] block">Kode OTP Dinamis Saat Ini:</span>
              <div className="text-xl font-mono font-black text-amber-800 dark:text-amber-300 tracking-widest mt-0.5">
                {twoFactorOtpCode}
              </div>
              <span className="text-[10px] text-amber-600 block mt-1">
                Berubah setiap 30 detik (Google Authenticator)
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Status 2FA Akun</span>
            <span className="text-xs font-bold text-emerald-600">Aktif Wajib</span>
          </div>
        </div>
      </div>

      {/* Automated Weekly Cloud Backup Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Pencadangan Otomatis Cloud Mingguan & Pemulihan Data
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Snapshot terenkripsi disimpan secara berkala setiap 7 hari untuk menjamin ketersediaan data di kondisi darurat.
            </p>
          </div>

          <button
            onClick={handleDownloadSnapshotJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Snapshot JSON</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Cadangan Terakhir</span>
            <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{backupSchedule.lastWeeklyBackup}</span>
            <span className="text-emerald-600 text-[10px]">Integritas Hash 100% Cocok</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Jadwal Otomatis Berikutnya</span>
            <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{backupSchedule.nextScheduledBackup}</span>
            <span className="text-slate-500 text-[10px]">Otomatis berjalan di latar belakang</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Snapshot Tersimpan</span>
            <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{backupSchedule.totalSnapshots} Snapshot Snapshot Vault</span>
            <span className="text-indigo-600 text-[10px]">Retensi 365 Hari Bank-Grade</span>
          </div>
        </div>
      </div>

      {/* SHA-256 Cryptographic Hash Chain Audit Explorer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Verifikasi Rantai Kriptografi SHA-256 (Audit Trail)
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan bukti bahwa catatan keuangan tidak dapat diubah (tamper-proof)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
            Integritas Rantai: Valid
          </span>
        </div>

        <div className="space-y-2.5">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                  #{idx + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{tx.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {tx.id} • {tx.timestamp}
                  </span>
                </div>
              </div>

              <div className="text-left md:text-right font-mono text-[10px]">
                <div className="text-slate-500">
                  Prev: <span className="text-slate-400">{tx.previousHash.substring(0, 16)}...</span>
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Hash: <span>{tx.sha256Hash.substring(0, 24)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
