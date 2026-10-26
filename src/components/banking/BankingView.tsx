/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Coins, 
  Sprout, 
  Calculator, 
  HeartHandshake, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Layers, 
  Percent, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { MemberProfile, Transaction, PembiayaanItem, ZiswafRecord, ShuCalculation } from '../../types/koperasi';

interface BankingViewProps {
  member: MemberProfile;
  pembiayaanList: PembiayaanItem[];
  ziswafList: ZiswafRecord[];
  shu: ShuCalculation;
  onDeposit: (amount: number, akad: 'Wadiah' | 'Mudharabah') => void;
  onRequestSalam: (data: { title: string; farmer: string; amount: number; commodity: string; tenor: number }) => void;
  onSubmitZiswaf: (type: ZiswafRecord['type'], amount: number, target: string) => void;
}

export const BankingView: React.FC<BankingViewProps> = ({
  member,
  pembiayaanList,
  ziswafList,
  shu,
  onDeposit,
  onRequestSalam,
  onSubmitZiswaf,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simpanan' | 'pembiayaan' | 'shu' | 'ziswaf'>('simpanan');

  // Modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1000000');
  const [depositAkad, setDepositAkad] = useState<'Wadiah' | 'Mudharabah'>('Wadiah');

  const [showSalamModal, setShowSalamModal] = useState(false);
  const [salamTitle, setSalamTitle] = useState('Pre-Financing Panen Gabah Sawah 1 Ha');
  const [salamFarmer, setSalamFarmer] = useState('Kelompok Tani Mekar Jaya');
  const [salamAmount, setSalamAmount] = useState('15000000');
  const [salamCommodity, setSalamCommodity] = useState('Padi Ciherang Organik (Est. 4 Ton)');
  const [salamTenor, setSalamTenor] = useState(4);

  const [showZiswafModal, setShowZiswafModal] = useState(false);
  const [ziswafType, setZiswafType] = useState<ZiswafRecord['type']>('Wakaf Sawah Produktif');
  const [ziswafAmount, setZiswafAmount] = useState('500000');
  const [ziswafTarget, setZiswafTarget] = useState('Pembebasan Lahan Sawah Abadi Kaum Dhuafa');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(depositAmount.replace(/\D/g, ''), 10);
    if (val > 0) {
      onDeposit(val, depositAkad);
      setShowDepositModal(false);
    }
  };

  const handleSalamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(salamAmount.replace(/\D/g, ''), 10);
    if (val > 0) {
      onRequestSalam({
        title: salamTitle,
        farmer: salamFarmer,
        amount: val,
        commodity: salamCommodity,
        tenor: Number(salamTenor),
      });
      setShowSalamModal(false);
    }
  };

  const handleZiswafSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(ziswafAmount.replace(/\D/g, ''), 10);
    if (val > 0) {
      onSubmitZiswaf(ziswafType, val, ziswafTarget);
      setShowZiswafModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              BMT Syariah KSPPS
            </span>
            <span className="text-xs font-arabic text-emerald-200">
              أحل الله البيع وحرم الربا
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Lembaga Keuangan Mikro Syariah & Baitul Maal
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
            Infrastruktur perbankan syariah tanpa riba, denda, atau rente. Memobilisasi simpanan anggota untuk mendanai pembiayaan langsung petani di pedesaan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Setor Simpanan</span>
          </button>
          <button
            onClick={() => setShowSalamModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-400/40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sprout className="w-4 h-4 text-emerald-300" />
            <span>Ajukan Salam Tani</span>
          </button>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('simpanan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'simpanan'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Simpanan & Tabungan Syariah</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pembiayaan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'pembiayaan'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Pembiayaan Salam & Produktif</span>
        </button>

        <button
          onClick={() => setActiveSubTab('shu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'shu'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Simulator SHU Real-Time</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ziswaf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'ziswaf'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Baitul Maal (ZISWAF Hub)</span>
        </button>
      </div>

      {/* Subtab 1: Simpanan */}
      {activeSubTab === 'simpanan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wadiah */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Akad Titipan Aman
                </span>
                <Coins className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Simpanan Wadiah Yad Dhamanah
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Tabungan likuid harian tanpa potongan admin bulanan. Bebas ditarik atau dibelanjakan di pasar koperasi.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Saldo Aktif</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  Rp {member.simpananSukarelaWadiah.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Mudharabah */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                  Investasi Bagi Hasil
                </span>
                <Percent className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Mudharabah Mutlaqah Agribisnis
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Penyertaan modal produktif pada rantai pasok lumbung padi dan hortikultura. Nisbah setara 11.2% p.a.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Investasi Terkelola</span>
                <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                  Rp {member.investasiMudharabah.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Pokok & Wajib */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Ekuitas Kolektif
                </span>
                <Layers className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Simpanan Pokok & Wajib Koperasi
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Bukti kepemilikan modal dasar koperasi anggota. Menjadi basis perhitungan persentase Sisa Hasil Usaha (SHU).
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Ekuitas</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-200">
                  Rp {(member.simpananPokok + member.simpananWajib).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Syariah Certificate & Security Note */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  Diawasi Dewan Pengawas Syariah (DPS) & Dilindungi Cadangan Risiko Koperasi
                </span>
                <p className="text-emerald-700 dark:text-emerald-300 text-[11px]">
                  Bebas dari Gharar (ketidakpastian), Maysir (spekulasi), dan Riba (bunga berganda).
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-white dark:bg-emerald-900/60 font-mono text-[10px] text-emerald-700 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-700 hidden sm:inline">
              NO. DPS-KSPPS-2026/08
            </span>
          </div>
        </div>
      )}

      {/* Subtab 2: Pembiayaan */}
      {activeSubTab === 'pembiayaan' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Portofolio Pembiayaan Salam Pertanian & Usaha Produktif
              </h3>
              <p className="text-xs text-slate-500">
                Penyaluran modal tunai sebelum tanam dengan penyerahan komoditas panen di masa depan pada harga adil.
              </p>
            </div>
            <button
              onClick={() => setShowSalamModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajukan Pembiayaan Salam Baru
            </button>
          </div>

          <div className="space-y-3">
            {pembiayaanList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Akad {item.akad}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.programTitle}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 self-start sm:self-auto">
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mitra Petani / Poktan</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.farmerOrMemberName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Komoditas / Target</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.commodityTarget || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Plafond Akad</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {item.totalPlafond.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jatuh Tempo Panen</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.dueDate}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Info className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{item.nisbahAtauMargin}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Jadwal Berikutnya: <strong className="text-slate-900 dark:text-white">{item.nextPaymentDate}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Simulator SHU */}
      {activeSubTab === 'shu' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Kalkulator Transparan Sisa Hasil Usaha (SHU) Tahun Buku {shu.year}
                </h3>
                <p className="text-xs text-slate-500">
                  Pembagian keuntungan koperasi secara proporsional sesuai jasa modal dan keaktifan belanja di pasar pangan.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                Total SHU Konsolidasi: Rp {shu.totalShuKoperasi.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Distribution pie-like cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs mb-6">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Dana Cadangan (25%)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Rp {shu.danaCadangan.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">Jasa Modal (35%)</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  Rp {(shu.totalShuKoperasi * 0.35).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-semibold">Jasa Usaha/Belanja (25%)</span>
                <span className="font-bold text-teal-700 dark:text-teal-300">
                  Rp {(shu.totalShuKoperasi * 0.25).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold">Pendidikan (5%)</span>
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  Rp {(shu.totalShuKoperasi * 0.05).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-semibold">Sosial & Ziswaf (10%)</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  Rp {shu.danaSosialZiswaf.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Member individual share */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    Hak SHU Anggota: {member.name}
                  </span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    Rp {shu.memberEstimatedShu.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Rincian: Jasa Modal Rp {shu.memberJasaModal.toLocaleString('id-ID')} + Jasa Usaha Belanja Rp {shu.memberJasaUsaha.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-400 block">Status Pencairan</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {shu.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: ZISWAF Hub */}
      {activeSubTab === 'ziswaf' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Baitul Maal KSPPS Islamicity: Zakat, Infaq, Sedekah & Wakaf Produktif
              </h3>
              <p className="text-xs text-slate-500">
                Penyaluran dana kebajikan untuk pengadaan sawah abadi, sumur bor irigasi, dan beasiswa anak petani.
              </p>
            </div>
            <button
              onClick={() => setShowZiswafModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              Tunaikan ZISWAF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ziswafList.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {rec.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{rec.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    Rp {rec.amount.toLocaleString('id-ID')}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {rec.targetProgram}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>No. Tanda Terima:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{rec.receiptNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Setor Simpanan Syariah Koperasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Setoran aman tanpa bunga via Virtual Account atau QRIS Syariah
            </p>

            <form onSubmit={handleDepositSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Pilih Akad Syariah
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositAkad('Wadiah')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      depositAkad === 'Wadiah'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Wadiah (Tabungan Likuid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositAkad('Mudharabah')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      depositAkad === 'Mudharabah'
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Mudharabah (Bagi Hasil)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nominal Setoran (Rp)
                </label>
                <input
                  type="text"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  Konfirmasi Setoran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salam Financing Modal */}
      {showSalamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pengajuan Pembiayaan Akad Salam Pertanian
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Skema bayar tunai di muka untuk memotong rantai tengkulak dan mengamankan panen petani.
            </p>

            <form onSubmit={handleSalamSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Program / Lahan
                </label>
                <input
                  type="text"
                  value={salamTitle}
                  onChange={(e) => setSalamTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mitra Petani / Poktan
                  </label>
                  <input
                    type="text"
                    value={salamFarmer}
                    onChange={(e) => setSalamFarmer(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Plafond Pembiayaan (Rp)
                  </label>
                  <input
                    type="text"
                    value={salamAmount}
                    onChange={(e) => setSalamAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Komoditas Panen
                  </label>
                  <input
                    type="text"
                    value={salamCommodity}
                    onChange={(e) => setSalamCommodity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tenor Masa Tanam (Bulan)
                  </label>
                  <select
                    value={salamTenor}
                    onChange={(e) => setSalamTenor(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value={3}>3 Bulan (Sayur Hortikultura)</option>
                    <option value={4}>4 Bulan (Padi Organik)</option>
                    <option value={6}>6 Bulan (Jagung / Palawija)</option>
                    <option value={12}>12 Bulan (Infrastruktur Irigasi)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                Pemberian pembiayaan Salam tidak dikenakan bunga/denda. Pelunasan diserahkan dalam bentuk hasil panen gabah/sayur sesuai spesifikasi akad.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSalamModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  Ajukan & Tandatangani Akad Digital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ziswaf Modal */}
      {showZiswafModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tunaikan ZISWAF Baitul Maal
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Salurkan rezeki untuk penguatan umat dan kedaulatan pangan kaum dhuafa.
            </p>

            <form onSubmit={handleZiswafSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Jenis Donasi
                </label>
                <select
                  value={ziswafType}
                  onChange={(e) => setZiswafType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="Wakaf Sawah Produktif">Wakaf Sawah Produktif</option>
                  <option value="Zakat Maal">Zakat Maal</option>
                  <option value="Infaq Berdaya">Infaq Berdaya</option>
                  <option value="Sedekah Subuh">Sedekah Subuh</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nominal Donasi (Rp)
                </label>
                <input
                  type="text"
                  value={ziswafAmount}
                  onChange={(e) => setZiswafAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Alokasi Target Program
                </label>
                <input
                  type="text"
                  value={ziswafTarget}
                  onChange={(e) => setZiswafTarget(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowZiswafModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
                >
                  Tunaikan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
