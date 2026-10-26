/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Warehouse, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  Wheat, 
  RefreshCw 
} from 'lucide-react';
import { FarmerInventoryBatch } from '../../types/pasar';

interface FarmerInventoryViewProps {
  batches: FarmerInventoryBatch[];
  onAddBatch: (batch: Omit<FarmerInventoryBatch, 'id'>) => void;
  onUpdateStock: (batchId: string, addedStockKg: number) => void;
}

export const FarmerInventoryView: React.FC<FarmerInventoryViewProps> = ({
  batches,
  onAddBatch,
  onUpdateStock,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [commodityName, setCommodityName] = useState('Beras Rojolele Delanggu');
  const [batchCode, setBatchCode] = useState(`LOT-2026-RJL-${Math.floor(10 + Math.random() * 89)}`);
  const [currentStockKg, setCurrentStockKg] = useState('500');
  const [incomingHarvestKg, setIncomingHarvestKg] = useState('4000');
  const [estimatedHarvestDate, setEstimatedHarvestDate] = useState('2026-11-20');
  const [warehouseLocation, setWarehouseLocation] = useState('Silo Lumbung Pangan Klaten');
  const [fairPricePerKg, setFairPricePerKg] = useState('14500');

  const totalStock = batches.reduce((acc, curr) => acc + curr.currentStockKg, 0);
  const totalIncoming = batches.reduce((acc, curr) => acc + curr.incomingHarvestKg, 0);
  const criticalItems = batches.filter((b) => b.status === 'Menipis');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBatch({
      commodityName,
      batchCode,
      currentStockKg: Number(currentStockKg),
      reservedStockKg: 0,
      incomingHarvestKg: Number(incomingHarvestKg),
      estimatedHarvestDate,
      warehouseLocation,
      status: Number(currentStockKg) < 50 ? 'Menipis' : 'Tersedia',
      fairPricePerKg: Number(fairPricePerKg),
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
              Lumbung & Logistik Mandiri
            </span>
            <span className="text-xs text-slate-300">
              Manajemen Stok Otomatis Mitra Tani
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Sistem Inventaris Komoditas & Jadwal Panen Raya
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Menghubungkan kapasitas silo lumbung desa, jadwal panen padi, hortikultura, serta mitigasi risiko kekosongan stok pangan rakyat.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Batch Panen Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Stok Siap Distribusi</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalStock.toLocaleString('id-ID')} Kg
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Di 4 Lumbung Desa Koperasi
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Proyeksi Panen Mendatang</span>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            {totalIncoming.toLocaleString('id-ID')} Kg
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            Hasil Pembiayaan Akad Salam
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Peringatan Stok Menipis</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {criticalItems.length} Komoditas
          </div>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
            Perlu percepatan distribusi lumbung
          </span>
        </div>
      </div>

      {/* Batches Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Daftar Batch Lot Inventaris & Posisi Gudang
            </h3>
            <p className="text-xs text-slate-500">
              Pelacakan lot kesegaran per komoditas dan estimasi tanggal panen raya mitra petani
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Kode Batch & Komoditas</th>
                <th className="py-3 px-3">Lokasi Gudang/Silo</th>
                <th className="py-3 px-3 text-right">Stok Aktif</th>
                <th className="py-3 px-3 text-right">Estimasi Panen Masuk</th>
                <th className="py-3 px-3">Tanggal Panen</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{batch.commodityName}</span>
                    <span className="text-[10px] text-emerald-600 font-mono">{batch.batchCode}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                      {batch.warehouseLocation}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {batch.currentStockKg} Kg
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Terpesan: {batch.reservedStockKg} Kg
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      +{batch.incomingHarvestKg.toLocaleString('id-ID')} Kg
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {batch.estimatedHarvestDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        batch.status === 'Tersedia'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => onUpdateStock(batch.id, 50)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold cursor-pointer"
                    >
                      +50 Kg Panen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tambah Batch Panen Mitra Petani
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Catat komoditas baru hasil panen atau persiapan musim tanam
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Komoditas
                </label>
                <input
                  type="text"
                  value={commodityName}
                  onChange={(e) => setCommodityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kode Batch / Lot
                  </label>
                  <input
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Stok Awal (Kg)
                  </label>
                  <input
                    type="number"
                    value={currentStockKg}
                    onChange={(e) => setCurrentStockKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Perkiraan Panen (Kg)
                  </label>
                  <input
                    type="number"
                    value={incomingHarvestKg}
                    onChange={(e) => setIncomingHarvestKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Panen Raya
                  </label>
                  <input
                    type="date"
                    value={estimatedHarvestDate}
                    onChange={(e) => setEstimatedHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lokasi Gudang / Silo Lumbung
                </label>
                <input
                  type="text"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  Simpan Batch Inventaris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
