/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AkadType = 'Wadiah' | 'Mudharabah' | 'Murabahah' | 'Musyarakah' | 'Salam' | 'Qardh_Hasan';

export interface MemberProfile {
  id: string;
  memberNumber: string;
  name: string;
  email: string;
  phone: string;
  role: 'Anggota Biasa' | 'Mitra Petani' | 'Pengurus Koperasi' | 'Dewan Pengawas Syariah';
  joinDate: string;
  village: string;
  province: string;
  avatarUrl: string;
  isBiometricEnabled: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret: string;
  e2eePublicKey: string;
  simpananPokok: number;
  simpananWajib: number;
  simpananSukarelaWadiah: number;
  investasiMudharabah: number;
  totalPoinBerdaya: number;
}

export interface Transaction {
  id: string;
  timestamp: string;
  type: 'SIMPANAN' | 'PENARIKAN' | 'PEMBIAYAAN_SALAM' | 'BELANJA_PASAR' | 'ZISWAF' | 'BAGI_HASIL_SHU';
  akad: AkadType;
  amount: number;
  title: string;
  description: string;
  senderOrRecipient: string;
  status: 'BERHASIL' | 'MENUNGGU_SINKRON' | 'TERTUNDA' | 'DIVERIFIKASI_DPS';
  sha256Hash: string;
  previousHash: string;
  isEncrypted: boolean;
  metadata?: Record<string, any>;
}

export interface PembiayaanItem {
  id: string;
  programTitle: string;
  akad: AkadType;
  farmerOrMemberName: string;
  commodityTarget?: string;
  totalPlafond: number;
  remainingAmount: number;
  tenorMonths: number;
  disbursedDate: string;
  dueDate: string;
  status: 'Aktif Lancer' | 'Dalam Proses Panen' | 'Lunas';
  nisbahAtauMargin: string;
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

export interface ZiswafRecord {
  id: string;
  type: 'Zakat Maal' | 'Infaq Berdaya' | 'Sedekah Subuh' | 'Wakaf Sawah Produktif';
  amount: number;
  donorName: string;
  date: string;
  targetProgram: string;
  receiptNumber: string;
}

export interface ShuCalculation {
  year: number;
  totalShuKoperasi: number;
  danaCadangan: number;       // 25%
  jasaModalPersen: number;     // 35%
  jasaUsahaPersen: number;     // 25%
  danaPendidikanPersen: number;// 5%
  danaSosialZiswaf: number;    // 10%
  memberEstimatedShu: number;
  memberJasaModal: number;
  memberJasaUsaha: number;
  status: 'Diumumkan di RAT' | 'Siap Dicairkan';
}

export interface BillReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: 'Simpanan Wajib' | 'Angsuran Salam' | 'Tagihan Pasar Tani' | 'Zakat Tahunan';
  isPaid: boolean;
  urgency: 'high' | 'medium' | 'low';
}
