/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemberProfile, Transaction, PembiayaanItem, ZiswafRecord, BillReminder } from '../types/koperasi';
import { CommodityItem, FarmerInventoryBatch, PasarOrder } from '../types/pasar';
import { PushNotificationItem, CloudBackupSchedule } from '../types/security';
import { 
  INITIAL_MEMBER, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PEMBIAYAAN, 
  INITIAL_COMMODITIES, 
  INITIAL_INVENTORY_BATCHES, 
  INITIAL_ORDERS, 
  INITIAL_BILLS,
  INITIAL_ZISWAF_RECORDS
} from './mockData';
import { generateTransactionHash } from './cryptoService';

const STORAGE_KEYS = {
  MEMBER: 'islamicity_member_profile',
  TRANSACTIONS: 'islamicity_transactions',
  PEMBIAYAAN: 'islamicity_pembiayaan',
  COMMODITIES: 'islamicity_commodities',
  INVENTORY: 'islamicity_inventory',
  ORDERS: 'islamicity_orders',
  BILLS: 'islamicity_bills',
  ZISWAF: 'islamicity_ziswaf',
  OFFLINE_QUEUE: 'islamicity_offline_queue',
  NOTIFICATIONS: 'islamicity_notifications',
  BACKUP_SCHEDULE: 'islamicity_backup_schedule',
  THEME_MODE: 'islamicity_theme_mode',
};

// Push notification mock store initial
const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: '🌾 Pembaruan Status Pesanan Komoditas',
    message: 'Pesanan Beras Pandan Wangi (KSPPS-ORD-8829-01) sedang dalam distribusi kurir koperasi.',
    timestamp: '10 menit yang lalu',
    category: 'STATUS_PESANAN',
    read: false,
    actionUrl: 'orders',
  },
  {
    id: 'NOTIF-02',
    title: '📉 Waspada Harga Cabai Pasar Luar',
    message: 'Harga cabai tengkulak melonjak ke Rp 65.000/kg. Anggota dapat membeli di Koperasi seharga Rp 42.000/kg (Hemat 35%).',
    timestamp: '1 jam yang lalu',
    category: 'HARGA_KOMODITAS',
    read: false,
    actionUrl: 'market',
  },
  {
    id: 'NOTIF-03',
    title: '⏰ Pengingat Jatuh Tempo Pembiayaan Salam',
    message: 'Angsuran Akad Salam Traktor Tani #3 sebesar Rp 1.250.000 jatuh tempo pada 30 Oktober 2026.',
    timestamp: '3 jam yang lalu',
    category: 'TAGIHAN',
    read: true,
    actionUrl: 'banking',
  },
  {
    id: 'NOTIF-04',
    title: '🔐 Verifikasi Enkripsi End-to-End Berhasil',
    message: 'Kunci kriptografi sesi 256-bit diperbarui. 100% data transaksi tersandi aman sesuai standar perbankan.',
    timestamp: 'Kemarin',
    category: 'KEAMANAN_E2EE',
    read: true,
    actionUrl: 'security',
  },
];

export class StorageService {
  // Member
  static getMember(): MemberProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBER, JSON.stringify(INITIAL_MEMBER));
      return INITIAL_MEMBER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MEMBER;
    }
  }

  static saveMember(member: MemberProfile): void {
    localStorage.setItem(STORAGE_KEYS.MEMBER, JSON.stringify(member));
  }

  // Transactions
  static getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  static async addTransaction(tx: Omit<Transaction, 'sha256Hash' | 'previousHash'>, isOffline: boolean = false): Promise<Transaction> {
    const list = this.getTransactions();
    const prevTx = list[0];
    const previousHash = prevTx ? prevTx.sha256Hash : 'GENESIS-BLOCK-KSPPS-ISLAMICITY-E2EE-VAULT-2023';

    const sha256Hash = await generateTransactionHash({
      id: tx.id,
      timestamp: tx.timestamp,
      amount: tx.amount,
      senderOrRecipient: tx.senderOrRecipient,
      previousHash,
    });

    const newTx: Transaction = {
      ...tx,
      sha256Hash,
      previousHash,
      status: isOffline ? 'MENUNGGU_SINKRON' : tx.status,
    };

    const updated = [newTx, ...list];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));

    if (isOffline) {
      this.enqueueOfflineAction('ADD_TRANSACTION', newTx);
    }

    return newTx;
  }

  // Pembiayaan
  static getPembiayaan(): PembiayaanItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PEMBIAYAAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PEMBIAYAAN, JSON.stringify(INITIAL_PEMBIAYAAN));
      return INITIAL_PEMBIAYAAN;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PEMBIAYAAN;
    }
  }

  // Commodities
  static getCommodities(): CommodityItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMODITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMMODITIES, JSON.stringify(INITIAL_COMMODITIES));
      return INITIAL_COMMODITIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COMMODITIES;
    }
  }

  static saveCommodities(commodities: CommodityItem[]): void {
    localStorage.setItem(STORAGE_KEYS.COMMODITIES, JSON.stringify(commodities));
  }

  // Inventory
  static getInventory(): FarmerInventoryBatch[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY_BATCHES));
      return INITIAL_INVENTORY_BATCHES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_INVENTORY_BATCHES;
    }
  }

  static saveInventory(inventory: FarmerInventoryBatch[]): void {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }

  // Orders
  static getOrders(): PasarOrder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  static addOrder(order: PasarOrder, isOffline: boolean = false): void {
    const list = this.getOrders();
    const updated = [order, ...list];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    if (isOffline) {
      this.enqueueOfflineAction('ADD_ORDER', order);
    }
  }

  // Bills
  static getBills(): BillReminder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
      return INITIAL_BILLS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BILLS;
    }
  }

  static markBillPaid(billId: string): void {
    const list = this.getBills();
    const updated = list.map(b => b.id === billId ? { ...b, isPaid: true } : b);
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(updated));
  }

  // ZISWAF
  static getZiswaf(): ZiswafRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ZISWAF);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ZISWAF, JSON.stringify(INITIAL_ZISWAF_RECORDS));
      return INITIAL_ZISWAF_RECORDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ZISWAF_RECORDS;
    }
  }

  static addZiswaf(record: ZiswafRecord): void {
    const list = this.getZiswaf();
    const updated = [record, ...list];
    localStorage.setItem(STORAGE_KEYS.ZISWAF, JSON.stringify(updated));
  }

  // Offline Queue
  static getOfflineQueue(): Array<{ id: string; action: string; payload: any; queuedAt: string }> {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  }

  static enqueueOfflineAction(action: string, payload: any): void {
    const queue = this.getOfflineQueue();
    const newItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      payload,
      queuedAt: new Date().toISOString(),
    };
    queue.push(newItem);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  }

  static clearOfflineQueue(): void {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
  }

  // Notifications
  static getNotifications(): PushNotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static addNotification(notif: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>): PushNotificationItem {
    const list = this.getNotifications();
    const newItem: PushNotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Baru saja',
      read: false,
    };
    const updated = [newItem, ...list];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));

    // Browser Notification API if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        // Ignored in non-https or frame sandbox
      }
    }

    return newItem;
  }

  static markAllNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }

  // Cloud Backup Schedule
  static getBackupSchedule(): CloudBackupSchedule {
    const raw = localStorage.getItem(STORAGE_KEYS.BACKUP_SCHEDULE);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaultSchedule: CloudBackupSchedule = {
      lastWeeklyBackup: '2026-10-20 02:00:00 WIB',
      nextScheduledBackup: '2026-10-27 02:00:00 WIB',
      totalSnapshots: 14,
      storageProvider: 'Cloud Syariah Vault',
      isAutoWeeklyActive: true,
    };
    localStorage.setItem(STORAGE_KEYS.BACKUP_SCHEDULE, JSON.stringify(defaultSchedule));
    return defaultSchedule;
  }

  static saveBackupSchedule(schedule: CloudBackupSchedule): void {
    localStorage.setItem(STORAGE_KEYS.BACKUP_SCHEDULE, JSON.stringify(schedule));
  }

  // Export CSV
  static exportTransactionsCsv(): string {
    const txs = this.getTransactions();
    const headers = ['ID Transaksi', 'Waktu', 'Jenis', 'Akad Syariah', 'Nominal (IDR)', 'Keterangan', 'Pihak Terkait', 'Status', 'SHA-256 Hash Audit'];
    const rows = txs.map(t => [
      t.id,
      `"${t.timestamp}"`,
      `"${t.type}"`,
      `"${t.akad}"`,
      t.amount,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.senderOrRecipient.replace(/"/g, '""')}"`,
      `"${t.status}"`,
      `"${t.sha256Hash}"`,
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Export Full JSON Snapshot
  static generateFullSnapshot(): string {
    const snapshot = {
      app: 'Islamicity Koperasi Digital SuperApp',
      version: '3.4.0',
      exportedAt: new Date().toISOString(),
      member: this.getMember(),
      transactions: this.getTransactions(),
      pembiayaan: this.getPembiayaan(),
      commodities: this.getCommodities(),
      inventory: this.getInventory(),
      orders: this.getOrders(),
      bills: this.getBills(),
      ziswaf: this.getZiswaf(),
      cryptoSignature: 'SHA256_KSPPS_AUDIT_STAMP_VERIFIED_AUTHENTIC',
    };
    return JSON.stringify(snapshot, null, 2);
  }
}
