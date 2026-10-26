/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegistrationPackage {
  id: string;
  name: string;
  totalInitialAmount: number;
  breakdown: {
    simpananPokok: number;
    simpananWajib: number;
    infaqPengembanganMasjid: number;
    voucherHajiProperty: number;
  };
  features: string[];
  popular?: boolean;
}

export interface SocialInfaqDonation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  targetMosque: string;
  allocatedFor: 'Infrastruktur Masjid' | 'Modal Usaha Jamaah' | 'Bridging Finance' | 'Beasiswa Santri';
  voucherCode: string;
  voucherValue: string;
  voucherDescription: string;
}

export interface Qs865Formation {
  formationLevel: 'Formasi 20 (Unit Sel Kompak)' | 'Formasi 100 (Ranting Masjid)' | 'Formasi 400 (Sentra Kawasan)';
  minActiveMembers: number;
  multiplierCapacityRatio: number; // 1 : 10 leverage based on QS 8:65
  targetCapitalTotal: number;
  currentRealizedCapital: number;
  businessesEmpowered: number;
  description: string;
}

export interface CurriculumModule {
  id: string;
  number: number;
  title: string;
  category: 
    | 'Produk & Jasa Koperasi'
    | 'Manajemen Keuangan Syariah'
    | 'Peluang Bisnis & Analisis Pasar'
    | 'Pengembangan Keterampilan'
    | 'Regulasi & Kepatuhan Syariah'
    | 'Jaringan Bisnis & Ukhuwah'
    | 'Penguasaan Teknologi & IT';
  durationHours: number;
  level: 'Dasar' | 'Menengah' | 'Lanjutan';
  summary: string;
  learningPoints: string[];
  isCompleted: boolean;
  score?: number;
}

export interface KpiMetric {
  id: string;
  title: string;
  category: 'Kesehatan Finansial' | 'Pemberdayaan Ummat' | 'Tata Kelola Syariah' | 'Efisiensi Operasional';
  targetValue: string;
  currentValue: string;
  achievementPercent: number;
  status: 'Optimal' | 'Tercapai' | 'Perhatian';
  description: string;
}

export interface CooperativeMentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  experienceYears: number;
  avatarUrl: string;
  mosqueAffiliation: string;
  rating: number;
  totalMentees: number;
  availableDays: string;
  quote: string;
}

export interface SpecialProgram {
  id: string;
  title: string;
  category: 'Qurban' | 'Realty & Properti' | 'Emas Safe Haven' | 'Reksadana Syariah';
  priceOrPlafond: number;
  tenorOrPeriod: string;
  returnOrBenefit: string;
  description: string;
  imageUrl: string;
  partnerGroup: string;
}

export interface RatVoteOption {
  id: string;
  label: string;
  description: string;
  votesCount: number;
  percentage: number;
}

export interface RatVoteTopic {
  id: string;
  title: string;
  category: 'Alokasi Dana Sosial' | 'Kebijakan Dividen SHU' | 'Investasi Lumbung Pangan' | 'Keputusan Strategis RAT' | 'Pemilihan Pengurus/DPS';
  description: string;
  deadline: string;
  totalVotes: number;
  quorumRequirement: string;
  quorumReached: boolean;
  status: 'Aktif Voting' | 'Selesai / Sah';
  options: RatVoteOption[];
  userVotedOptionId?: string;
  cryptographicAuditProof: string;
  decisionNote?: string;
}

