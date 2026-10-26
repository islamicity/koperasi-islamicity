/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  TrendingDown, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  SlidersHorizontal, 
  Wheat, 
  ShieldCheck, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CommodityItem, PasarOrder } from '../../types/pasar';
import { MemberProfile } from '../../types/koperasi';

interface PasarTaniViewProps {
  commodities: CommodityItem[];
  member: MemberProfile;
  onPlaceOrder: (order: PasarOrder) => void;
  onOpenReviews: (commodity: CommodityItem) => void;
}

export const PasarTaniView: React.FC<PasarTaniViewProps> = ({
  commodities,
  member,
  onPlaceOrder,
  onOpenReviews,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50); // radius filter
  const [sortBy, setSortBy] = useState<'jarak' | 'harga' | 'rating'>('jarak');

  // Cart state
  const [cart, setCart] = useState<{ [commodityId: string]: number }>({
    'COM-01': 1, // default sample cart item
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(member.village + ', ' + member.province);
  const [paymentMethod, setPaymentMethod] = useState<'Simpanan Wadiah' | 'QRIS Koperasi Syariah'>('Simpanan Wadiah');

  const categories = [
    'Semua',
    'Beras & Biji-bijian',
    'Hortikultura & Sayur',
    'Bumbu & Rempah',
    'Peternakan & Unggas',
    'Madu & Herbal',
  ];

  // Filtering & Sorting
  const filtered = commodities.filter((item) => {
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchDistance = item.farmer.distanceKm <= maxDistanceKm;
    return matchQuery && matchCat && matchDistance;
  }).sort((a, b) => {
    if (sortBy === 'jarak') return a.farmer.distanceKm - b.farmer.distanceKm;
    if (sortBy === 'harga') return a.koperasiPrice - b.koperasiPrice;
    if (sortBy === 'rating') return b.averageRating - a.averageRating;
    return 0;
  });

  // Cart operations
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const commodity = commodities.find((c) => c.id === id)!;
    return { commodity, quantity: qty, subtotal: commodity ? commodity.koperasiPrice * qty : 0 };
  }).filter((c) => c.commodity);

  const cartTotalAmount = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const cartTotalMiddlemanAmount = cartItems.reduce((acc, curr) => acc + (curr.commodity.middlemanMarketPrice * curr.quantity), 0);
  const cartTotalSaved = Math.max(0, cartTotalMiddlemanAmount - cartTotalAmount);
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const orderNumber = `KSPPS-ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
    const trackingCode = `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newOrder: PasarOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      items: cartItems,
      totalAmount: cartTotalAmount,
      totalSavedVsMiddleman: cartTotalSaved,
      memberId: member.id,
      memberName: member.name,
      deliveryAddress,
      orderDate: new Date().toLocaleString('id-ID'),
      estimatedArrival: 'Hari Ini, 2 Jam Mendatang',
      currentStatus: 'DIVERIFIKASI_AKAD',
      statusHistory: [
        {
          status: 'DIVERIFIKASI_AKAD',
          label: 'Akad Murabahah Sah Diverifikasi',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          note: `Pembayaran via ${paymentMethod} berhasil didebit tanpa riba. Pesanan diteruskan ke mitra petani.`,
        },
      ],
      courierName: 'Armada Distribusi Koperasi Mandiri',
      courierPhone: '+62 812-4455-9900',
      paymentMethod,
      trackingCode,
    };

    onPlaceOrder(newOrder);
    setCart({});
    setIsCartOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: Free from Middlemen / Tengkulak */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-700 via-emerald-800 to-teal-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900">
              Direct Farm-to-Fork
            </span>
            <span className="text-xs font-semibold text-amber-200">
              100% Bebas Tengkulak & Oligarki Rente
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Pasar Rakyat Berdaya Pangan Koperasi
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl mt-1 leading-relaxed">
            Petani menerima harga 30-40% lebih tinggi dari harga beli tengkulak konvensional, sementara anggota koperasi berbelanja 20-30% lebih murah dari pasar ritel modern.
          </p>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-900 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-700" />
          <span>Keranjang Belanja ({cartCount})</span>
          {cartCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Search, Distance Radius & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari beras, sayur organik, bumbu, atau nama petani binaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Distance Filter (Radius Terdekat) */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Radius:</span>
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={10}>Maks. 10 Km (Lumbung Sekitar)</option>
              <option value={20}>Maks. 20 Km (Satu Kabupaten)</option>
              <option value={50}>Maks. 50 Km (Jawa Barat & Sekitar)</option>
              <option value={500}>Semua Lumbung Nusantara</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Urutan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="jarak">Lokasi Terdekat</option>
              <option value="harga">Harga Paling Hemat</option>
              <option value="rating">Ulasan Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Commodities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const qtyInCart = cart[item.id] || 0;
          const savingVsMarket = item.middlemanMarketPrice - item.koperasiPrice;
          const savingPercent = Math.round((savingVsMarket / item.middlemanMarketPrice) * 100);

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Saving Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Hemat {savingPercent}%
                  </div>

                  {/* Freshness Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {item.freshnessGrade}
                  </div>

                  {/* Distance chip */}
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {item.farmer.distanceKm} km dari lokasi Anda
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.category}</span>
                    <button
                      onClick={() => onOpenReviews(item)}
                      className="flex items-center gap-1 text-amber-500 hover:underline cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{item.averageRating}</span>
                      <span className="text-slate-400">({item.reviews.length})</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Farmer profile micro-card */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <img
                      src={item.farmer.avatarUrl}
                      alt={item.farmer.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1 text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {item.farmer.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {item.farmer.coopGroup} • {item.farmer.location}
                      </span>
                    </div>
                  </div>

                  {/* Price Comparison Table */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Harga Tengkulak Luar:</span>
                      <span className="line-through text-slate-400">
                        Rp {item.middlemanMarketPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Harga Petani Menerima:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Rp {item.farmerPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1 border-t border-emerald-200/50 dark:border-emerald-800/40">
                      <span className="text-slate-700 dark:text-slate-300 font-bold text-xs">Harga Anggota Koperasi:</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        Rp {item.koperasiPrice.toLocaleString('id-ID')}
                        <span className="text-[10px] font-normal text-slate-500 ml-1">/{item.unit}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0">
                {qtyInCart === 0 ? (
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Beli Komoditas Langsung</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {qtyInCart} {item.unit}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Keranjang Belanja Koperasi ({cartCount} item)
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 mb-2 opacity-50" />
                  <p className="text-xs">Keranjang Anda masih kosong</p>
                </div>
              ) : (
                cartItems.map(({ commodity, quantity, subtotal }) => (
                  <div
                    key={commodity.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <img
                      src={commodity.imageUrl}
                      alt={commodity.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {commodity.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {commodity.farmer.name} • Rp {commodity.koperasiPrice.toLocaleString('id-ID')}
                      </p>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        Subtotal: Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(commodity.id, -1)}
                        className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(commodity.id, 1)}
                        className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Form & Total */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-800/60">
                {/* Savings info */}
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    Total Penghematan dari Tengkulak:
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    Rp {cartTotalSaved.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Alamat Pengiriman (Armada Kurir Koperasi):
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Metode Pembayaran Syariah:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Simpanan Wadiah')}
                      className={`p-2 rounded-lg border font-bold text-[11px] ${
                        paymentMethod === 'Simpanan Wadiah'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Saldo Wadiah (Otomatis)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('QRIS Koperasi Syariah')}
                      className={`p-2 rounded-lg border font-bold text-[11px] ${
                        paymentMethod === 'QRIS Koperasi Syariah'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      QRIS Koperasi Syariah
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                  <span className="text-xs text-slate-500">Total Pembayaran:</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    Rp {cartTotalAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Konfirmasi Akad Murabahah & Bayar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
