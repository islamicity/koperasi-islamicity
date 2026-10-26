/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Package, 
  Star, 
  Plus, 
  MessageSquare,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { PasarOrder, OrderDeliveryStatus, CommodityItem, ReviewItem } from '../../types/pasar';

interface OrdersAndTrackingViewProps {
  orders: PasarOrder[];
  onAddReview: (commodityId: string, review: Omit<ReviewItem, 'id' | 'date'>) => void;
  commodities: CommodityItem[];
}

export const OrdersAndTrackingView: React.FC<OrdersAndTrackingViewProps> = ({
  orders,
  onAddReview,
  commodities,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<PasarOrder>(orders[0] || null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCommodityForReview, setSelectedCommodityForReview] = useState<string>('COM-01');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const steps: { key: OrderDeliveryStatus; label: string; desc: string }[] = [
    { key: 'DIVERIFIKASI_AKAD', label: 'Akad Sah & Escrow', desc: 'Dana aman didebit tanpa potongan riba' },
    { key: 'DIPETIK_PETANI', label: 'Dipanen / Disiapkan', desc: 'Petani binaan memetik langsung dari kebun' },
    { key: 'KONTROL_KUALITAS_LUMBUNG', label: 'Uji Mutu Lumbung', desc: 'Sortir kualitas Grade A & timbangan tera' },
    { key: 'DALAM_DISTRIBUSI_KURIR', label: 'Distribusi Armada', desc: 'Kurir koperasi menuju alamat penerima' },
    { key: 'TIBA_DI_TUJUAN', label: 'Pesanan Diterima', desc: 'Konfirmasi serah terima & pelepasan dana' },
  ];

  const getStepIndex = (status: OrderDeliveryStatus) => {
    return steps.findIndex((s) => s.key === status);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    onAddReview(selectedCommodityForReview, {
      buyerName: selectedOrder ? selectedOrder.memberName : 'Anggota Koperasi Terverifikasi',
      rating: reviewRating,
      comment: reviewComment,
      verifiedBuyer: true,
    });

    setReviewComment('');
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              Logistik Lumbung Rakyat
            </span>
            <span className="text-xs text-emerald-200">
              Pelacakan Pengiriman Real-Time
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Status Distribusi & Komunitas Ulasan Petani
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-xl mt-1 leading-relaxed">
            Transparansi perjalanan komoditas dari sawah petani ke pintu rumah anggota. Bebas perantara, terhubung langsung armada koperasi.
          </p>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Star className="w-4 h-4 fill-slate-900" />
          <span>Tulis Ulasan Pembeli</span>
        </button>
      </div>

      {/* Main Grid: Orders list & Live Tracking Map/Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order Selector Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Daftar Pesanan Komoditas
          </h3>
          <p className="text-xs text-slate-500">
            Pilih pesanan untuk memantau status kurir dan detail akad:
          </p>

          <div className="space-y-2.5 mt-2">
            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/40 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{order.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {order.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    {order.items.map(i => `${i.commodity.name} (${i.quantity}x)`).join(', ')}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400">{order.estimatedArrival}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Stepper & Real-Time Tracking Details */}
        {selectedOrder && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Kode Resi: {selectedOrder.trackingCode}</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Pelacakan Pengiriman: {selectedOrder.orderNumber}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Estimasi Tiba:</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  {selectedOrder.estimatedArrival}
                </span>
              </div>
            </div>

            {/* Stepper Horizontal */}
            <div className="py-2">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 z-0" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500" 
                  style={{ width: `${(getStepIndex(selectedOrder.currentStatus) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((st, idx) => {
                  const currentIdx = getStepIndex(selectedOrder.currentStatus);
                  const isPassed = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={st.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-emerald-500/30 scale-110' : ''}`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2 text-center max-w-[70px] leading-tight">
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Route & Courier Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Detail Armada Kurir Koperasi
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {selectedOrder.courierName}
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {selectedOrder.courierPhone}
                    </span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-700">
                  <span>Tujuan Antar: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedOrder.deliveryAddress}</strong>
                </div>
              </div>

              {/* Savings & Akad verification */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Akad Syariah & Perlindungan Escrow
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600">Terverifikasi</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Dana disimpan di rekening penampung (Wadiah Escrow) dan baru diteruskan ke petani setelah Anda menerima paket dalam kondisi segar prima.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-emerald-200 dark:border-emerald-800 text-[11px]">
                  <span className="text-slate-500">Hemat Dibanding Ritel Rente:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    Rp {selectedOrder.totalSavedVsMiddleman.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Event Log */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Catatan Perjalanan Distribusi:
              </span>
              <div className="space-y-2">
                {selectedOrder.statusHistory.map((hist, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{hist.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{hist.timestamp}]</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{hist.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verified Reviews Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tulis Ulasan Pembeli Terverifikasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Bangun kepercayaan komunitas koperasi dan dukung reputasi mitra petani lokal kita.
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Komoditas
                </label>
                <select
                  value={selectedCommodityForReview}
                  onChange={(e) => setSelectedCommodityForReview(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.farmer.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Beri Bintang Kepuasan (1-5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {reviewRating} dari 5 Bintang
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Komentar & Pengalaman Rasa
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Misal: Berasnya sangat pulen dan wangi asli pegunungan. Alhamdulillah pengiriman cepat!"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-xs cursor-pointer"
                >
                  Publikasikan Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
