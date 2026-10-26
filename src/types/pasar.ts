/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FarmerProfile {
  id: string;
  name: string;
  coopGroup: string;
  location: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  farmSizeHectares: number;
  commodities: string[];
  avatarUrl: string;
  verifiedSharia: boolean;
  phone: string;
}

export interface ReviewItem {
  id: string;
  buyerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  avatarUrl?: string;
}

export interface CommodityItem {
  id: string;
  name: string;
  category: 'Beras & Biji-bijian' | 'Hortikultura & Sayur' | 'Bumbu & Rempah' | 'Buah Organik' | 'Peternakan & Unggas' | 'Madu & Herbal';
  unit: string;
  farmerPrice: number;       // Harga adil yang diterima langsung oleh petani
  koperasiPrice: number;     // Harga jual koperasi untuk anggota (bebas tengkulak)
  middlemanMarketPrice: number; // Harga di pasar luar / tengkulak konvensional
  stockKg: number;
  minimumOrder: number;
  farmer: FarmerProfile;
  imageUrl: string;
  harvestDate: string;
  freshnessGrade: 'A+' | 'A' | 'Organik Bersertifikat';
  reviews: ReviewItem[];
  averageRating: number;
  priceTrend: 'stabil' | 'turun' | 'naik';
  priceChangePercent: number;
  batchNumber: string;
  description: string;
}

export interface FarmerInventoryBatch {
  id: string;
  commodityName: string;
  batchCode: string;
  currentStockKg: number;
  reservedStockKg: number;
  incomingHarvestKg: number;
  estimatedHarvestDate: string;
  warehouseLocation: string;
  status: 'Tersedia' | 'Menipis' | 'Menunggu Panen Raya';
  fairPricePerKg: number;
}

export interface OrderItem {
  commodity: CommodityItem;
  quantity: number;
  subtotal: number;
}

export type OrderDeliveryStatus = 
  | 'DIVERIFIKASI_AKAD'
  | 'DIPETIK_PETANI'
  | 'KONTROL_KUALITAS_LUMBUNG'
  | 'DALAM_DISTRIBUSI_KURIR'
  | 'TIBA_DI_TUJUAN';

export interface PasarOrder {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  totalSavedVsMiddleman: number;
  memberId: string;
  memberName: string;
  deliveryAddress: string;
  orderDate: string;
  estimatedArrival: string;
  currentStatus: OrderDeliveryStatus;
  statusHistory: {
    status: OrderDeliveryStatus;
    label: string;
    timestamp: string;
    note: string;
  }[];
  courierName: string;
  courierPhone: string;
  paymentMethod: 'Simpanan Wadiah' | 'QRIS Koperasi Syariah' | 'Transfer BMT';
  trackingCode: string;
}

export interface DailyCommodityPriceAlert {
  commodityId: string;
  commodityName: string;
  unit: string;
  todayPrice: number;
  yesterdayPrice: number;
  difference: number;
  percentage: number;
  tengkulakComparison: string;
  recommendation: string;
}
