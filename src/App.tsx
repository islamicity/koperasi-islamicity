/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { BankingView } from './components/banking/BankingView';
import { PasarTaniView } from './components/marketplace/PasarTaniView';
import { OrdersAndTrackingView } from './components/marketplace/OrdersAndTrackingView';
import { FarmerInventoryView } from './components/inventory/FarmerInventoryView';
import { FinancialReportsView } from './components/reports/FinancialReportsView';
import { SecurityCenterView } from './components/security/SecurityCenterView';
import { DeveloperApiView } from './components/api/DeveloperApiView';
import { MasjidCoopView } from './components/masjid/MasjidCoopView';
import { CurriculumView } from './components/education/CurriculumView';
import { MentoringAndKpiView } from './components/mentoring/MentoringAndKpiView';
import { BiometricAuthModal } from './components/common/BiometricAuthModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { OfflineSyncBanner } from './components/common/OfflineSyncBanner';
import { StorageService } from './services/storageService';
import { MemberProfile, Transaction, PembiayaanItem, ZiswafRecord, BillReminder } from './types/koperasi';
import { CommodityItem, FarmerInventoryBatch, PasarOrder, ReviewItem } from './types/pasar';
import { PushNotificationItem } from './types/security';
import { SpecialProgram, SocialInfaqDonation, CooperativeMentor } from './types/masjid';
import { INITIAL_SHU_SIMULATION } from './services/mockData';

export default function App() {
  // Master states
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [member, setMember] = useState<MemberProfile>(StorageService.getMember());
  const [transactions, setTransactions] = useState<Transaction[]>(StorageService.getTransactions());
  const [pembiayaanList, setPembiayaanList] = useState<PembiayaanItem[]>(StorageService.getPembiayaan());
  const [commodities, setCommodities] = useState<CommodityItem[]>(StorageService.getCommodities());
  const [inventoryBatches, setInventoryBatches] = useState<FarmerInventoryBatch[]>(StorageService.getInventory());
  const [orders, setOrders] = useState<PasarOrder[]>(StorageService.getOrders());
  const [bills, setBills] = useState<BillReminder[]>(StorageService.getBills());
  const [ziswafList, setZiswafList] = useState<ZiswafRecord[]>(StorageService.getZiswaf());
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(StorageService.getNotifications());
  const [shu, setShu] = useState(INITIAL_SHU_SIMULATION);

  // Network & Sync states
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Baru saja');
  const [offlineQueue, setOfflineQueue] = useState(StorageService.getOfflineQueue());

  // Security & Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('islamicity_theme_mode') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isE2EEActive, setIsE2EEActive] = useState<boolean>(true);

  // Modals & Drawers
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCommodityForReviewModal, setSelectedCommodityForReviewModal] = useState<CommodityItem | null>(null);

  // Handle dark mode DOM sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('islamicity_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('islamicity_theme_mode', 'light');
    }
  }, [isDarkMode]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerAutoSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerAutoSync = () => {
    const queue = StorageService.getOfflineQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    setTimeout(() => {
      // Reconcile pending transactions
      const txs = StorageService.getTransactions().map(t => ({
        ...t,
        status: t.status === 'MENUNGGU_SINKRON' ? 'BERHASIL' : t.status,
      }));
      localStorage.setItem('islamicity_transactions', JSON.stringify(txs));
      setTransactions(txs);
      StorageService.clearOfflineQueue();
      setOfflineQueue([]);
      setIsSyncing(false);
      setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

      // Add push notification
      const notif = StorageService.addNotification({
        title: '☁️ Sinkronisasi Cloud Berhasil',
        message: `${queue.length} transaksi lokal berhasil direkonsiliasi dan dicatat di buku kas syariah.`,
        category: 'TRANSAKSI',
        actionUrl: 'dashboard',
      });
      setNotifications(StorageService.getNotifications());
    }, 1200);
  };

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      triggerAutoSync();
    } else {
      StorageService.addNotification({
        title: '📶 Beralih ke Mode Offline',
        message: 'Aplikasi beroperasi secara lokal. Transaksi tetap dapat diproses dan dienkripsi di perangkat.',
        category: 'KEAMANAN_E2EE',
      });
      setNotifications(StorageService.getNotifications());
    }
  };

  const handleDeposit = async (amount: number, akad: 'Wadiah' | 'Mudharabah') => {
    const newTx = await StorageService.addTransaction({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'SIMPANAN',
      akad,
      amount,
      title: `Setoran Tambahan Simpanan ${akad}`,
      description: `Setoran aman syariah tanpa potongan bunga`,
      senderOrRecipient: member.name,
      status: 'BERHASIL',
      isEncrypted: true,
    }, !isOnline);

    const updatedMember = {
      ...member,
      simpananSukarelaWadiah: akad === 'Wadiah' ? member.simpananSukarelaWadiah + amount : member.simpananSukarelaWadiah,
      investasiMudharabah: akad === 'Mudharabah' ? member.investasiMudharabah + amount : member.investasiMudharabah,
    };
    StorageService.saveMember(updatedMember);
    setMember(updatedMember);
    setTransactions(StorageService.getTransactions());
    setOfflineQueue(StorageService.getOfflineQueue());

    StorageService.addNotification({
      title: '💰 Setoran Simpanan Sukses',
      message: `Setoran Rp ${amount.toLocaleString('id-ID')} dengan akad ${akad} berhasil dicatat.`,
      category: 'TRANSAKSI',
      actionUrl: 'banking',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleRequestSalam = (data: { title: string; farmer: string; amount: number; commodity: string; tenor: number }) => {
    const newP: PembiayaanItem = {
      id: `PEM-SLM-${Date.now().toString().slice(-3)}`,
      programTitle: data.title,
      akad: 'Salam',
      farmerOrMemberName: data.farmer,
      commodityTarget: data.commodity,
      totalPlafond: data.amount,
      remainingAmount: data.amount,
      tenorMonths: data.tenor,
      disbursedDate: new Date().toLocaleDateString('id-ID'),
      dueDate: `${data.tenor} Bulan Mendatang`,
      status: 'Aktif Lancer',
      nisbahAtauMargin: 'Harga Kontrak Salam Adil Bebas Rente',
      nextPaymentDate: `${data.tenor} Bulan Mendatang (Penyerahan Panen)`,
      nextPaymentAmount: data.amount,
    };

    const updatedList = [newP, ...pembiayaanList];
    localStorage.setItem('islamicity_pembiayaan', JSON.stringify(updatedList));
    setPembiayaanList(updatedList);

    // Record as transaction
    StorageService.addTransaction({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'PEMBIAYAAN_SALAM',
      akad: 'Salam',
      amount: data.amount,
      title: `Penyaluran Akad Salam: ${data.commodity}`,
      description: `Pre-financing panen petani memotong rantai tengkulak`,
      senderOrRecipient: data.farmer,
      status: 'DIVERIFIKASI_DPS',
      isEncrypted: true,
    }, !isOnline);

    setTransactions(StorageService.getTransactions());

    StorageService.addNotification({
      title: '🌾 Pembiayaan Salam Berhasil Didaftarkan',
      message: `Pembiayaan pre-financing Rp ${data.amount.toLocaleString('id-ID')} untuk ${data.farmer} disetujui tanpa bunga.`,
      category: 'TRANSAKSI',
      actionUrl: 'banking',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleSubmitZiswaf = (type: ZiswafRecord['type'], amount: number, target: string) => {
    const record: ZiswafRecord = {
      id: `ZIS-${Date.now().toString().slice(-3)}`,
      type,
      amount,
      donorName: member.name,
      date: new Date().toLocaleDateString('id-ID'),
      targetProgram: target,
      receiptNumber: `REC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };

    StorageService.addZiswaf(record);
    setZiswafList(StorageService.getZiswaf());

    StorageService.addTransaction({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'ZISWAF',
      akad: 'Qardh_Hasan',
      amount,
      title: `Donasi ${type}: ${target}`,
      description: `Disalurkan melalui Baitul Maal KSPPS Islamicity`,
      senderOrRecipient: 'Baitul Maal KSPPS',
      status: 'BERHASIL',
      isEncrypted: true,
    }, !isOnline);

    setTransactions(StorageService.getTransactions());

    StorageService.addNotification({
      title: '🤲 Jazakallahu Khair ZISWAF Diterima',
      message: `Tanda terima ${record.receiptNumber} untuk ${type} sebesar Rp ${amount.toLocaleString('id-ID')} tersimpan aman.`,
      category: 'TRANSAKSI',
      actionUrl: 'banking',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handlePlaceOrder = (order: PasarOrder) => {
    StorageService.addOrder(order, !isOnline);
    setOrders(StorageService.getOrders());

    // Deduct from Wadiah if paid via Wadiah
    if (order.paymentMethod === 'Simpanan Wadiah' && member.simpananSukarelaWadiah >= order.totalAmount) {
      const updatedMember = {
        ...member,
        simpananSukarelaWadiah: member.simpananSukarelaWadiah - order.totalAmount,
        totalPoinBerdaya: member.totalPoinBerdaya + Math.floor(order.totalAmount / 10000),
      };
      StorageService.saveMember(updatedMember);
      setMember(updatedMember);
    }

    // Add transaction record
    StorageService.addTransaction({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'BELANJA_PASAR',
      akad: 'Murabahah',
      amount: order.totalAmount,
      title: `Belanja Pasar Kedaulatan Pangan (#${order.orderNumber})`,
      description: `Pemesanan langsung petani tanpa tengkulak`,
      senderOrRecipient: 'Lumbung Petani Mitra Koperasi',
      status: 'BERHASIL',
      isEncrypted: true,
    }, !isOnline);

    setTransactions(StorageService.getTransactions());
    setOfflineQueue(StorageService.getOfflineQueue());

    // Notification
    StorageService.addNotification({
      title: '🛒 Pesanan Komoditas Diterima',
      message: `Pesanan ${order.orderNumber} berhasil diverifikasi. Kurir koperasi sedang mempersiapkan pengantaran.`,
      category: 'STATUS_PESANAN',
      actionUrl: 'orders',
    });
    setNotifications(StorageService.getNotifications());

    setActiveTab('orders');
  };

  const handleAddReview = (commodityId: string, review: Omit<ReviewItem, 'id' | 'date'>) => {
    const list = StorageService.getCommodities();
    const updated = list.map((c) => {
      if (c.id === commodityId) {
        const newRev: ReviewItem = {
          ...review,
          id: `REV-${Date.now()}`,
          date: new Date().toLocaleDateString('id-ID'),
        };
        const allRevs = [newRev, ...c.reviews];
        const avg = allRevs.reduce((acc, r) => acc + r.rating, 0) / allRevs.length;
        return {
          ...c,
          reviews: allRevs,
          averageRating: Number(avg.toFixed(1)),
        };
      }
      return c;
    });

    StorageService.saveCommodities(updated);
    setCommodities(updated);

    StorageService.addNotification({
      title: '⭐ Ulasan Komunitas Terpublikasi',
      message: `Terima kasih! Ulasan Anda membantu memperkuat kepercayaan terhadap petani lokal.`,
      category: 'STATUS_PESANAN',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleAddInventoryBatch = (batchData: Omit<FarmerInventoryBatch, 'id'>) => {
    const list = StorageService.getInventory();
    const newBatch: FarmerInventoryBatch = {
      ...batchData,
      id: `INV-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newBatch, ...list];
    StorageService.saveInventory(updated);
    setInventoryBatches(updated);

    StorageService.addNotification({
      title: '📦 Batch Panen Baru Terdaftar',
      message: `Batch ${newBatch.batchCode} (${newBatch.commodityName}) berhasil ditambahkan ke inventaris lumbung.`,
      category: 'HARGA_KOMODITAS',
      actionUrl: 'inventory',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleUpdateStock = (batchId: string, addedStockKg: number) => {
    const list = StorageService.getInventory();
    const updated = list.map((b) => {
      if (b.id === batchId) {
        const nextStock = b.currentStockKg + addedStockKg;
        return {
          ...b,
          currentStockKg: nextStock,
          status: nextStock > 50 ? ('Tersedia' as const) : ('Menipis' as const),
        };
      }
      return b;
    });
    StorageService.saveInventory(updated);
    setInventoryBatches(updated);
  };

  const handlePayBill = (billId: string) => {
    const bill = bills.find((b) => b.id === billId);
    if (!bill) return;

    StorageService.markBillPaid(billId);
    setBills(StorageService.getBills());

    // Deduct and add transaction
    if (member.simpananSukarelaWadiah >= bill.amount) {
      const updatedMember = {
        ...member,
        simpananSukarelaWadiah: member.simpananSukarelaWadiah - bill.amount,
      };
      StorageService.saveMember(updatedMember);
      setMember(updatedMember);
    }

    StorageService.addTransaction({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'SIMPANAN',
      akad: 'Wadiah',
      amount: bill.amount,
      title: `Pembayaran ${bill.title}`,
      description: `Rekonsiliasi tagihan berkala koperasi`,
      senderOrRecipient: 'Kas Koperasi Islamicity',
      status: 'BERHASIL',
      isEncrypted: true,
    }, !isOnline);

    setTransactions(StorageService.getTransactions());

    StorageService.addNotification({
      title: '✅ Tagihan Berhasil Dibayar',
      message: `${bill.title} lunas tercatat. Syukron katsiran!`,
      category: 'TAGIHAN',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleRegisterNewMember = (data: any) => {
    StorageService.addTransaction({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'SIMPANAN',
      akad: 'Wadiah',
      amount: data.simpananPokok + data.simpananWajib,
      title: `Pendaftaran Anggota Baru: ${data.name}`,
      description: `Registrasi Jamaah Masjid (${data.memberNumber}) - Paket Koperasi`,
      senderOrRecipient: data.name,
      status: 'BERHASIL',
      isEncrypted: true,
    }, !isOnline);

    setTransactions(StorageService.getTransactions());

    StorageService.addNotification({
      title: '🎉 Pendaftaran Anggota Baru Berhasil',
      message: `${data.name} terdaftar dengan No. ${data.memberNumber} di ${data.mosque}. Hak SHU & Voucher Belanja aktif.`,
      category: 'TRANSAKSI',
      actionUrl: 'masjid',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleDonateInfaq = (donation: SocialInfaqDonation) => {
    StorageService.addTransaction({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'ZISWAF',
      akad: 'Qardh_Hasan',
      amount: donation.amount,
      title: `Infaq Pengembangan: ${donation.targetMosque}`,
      description: `Alokasi: ${donation.allocatedFor} (Souvenir ${donation.voucherCode})`,
      senderOrRecipient: donation.targetMosque,
      status: 'BERHASIL',
      isEncrypted: true,
    }, !isOnline);

    setTransactions(StorageService.getTransactions());

    StorageService.addNotification({
      title: '🎁 Infaq Diterima & Voucher Terbit',
      message: `Infaq Rp ${donation.amount.toLocaleString('id-ID')} berhasil. Voucher ${donation.voucherCode} (${donation.voucherValue}) siap digunakan di global.property.islamicity.tv`,
      category: 'TAGIHAN',
      actionUrl: 'masjid',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleEnrollSpecialProgram = (prog: SpecialProgram) => {
    StorageService.addNotification({
      title: '📋 Registrasi Program Khusus Diterima',
      message: `Pendaftaran ${prog.title} berhasil diajukan ke dewan koperasi masjid. Tim ${prog.partnerGroup} akan segera memproses.`,
      category: 'STATUS_PESANAN',
      actionUrl: 'masjid',
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleBookMentoringSession = (mentor: CooperativeMentor, topic: string) => {
    StorageService.addNotification({
      title: '🤝 Sesi Mentoring Dijadwalkan',
      message: `Permohonan konsultasi dengan ${mentor.name} topik "${topic}" telah diajukan.`,
      category: 'STATUS_PESANAN',
      actionUrl: 'mentoring',
    });
    setNotifications(StorageService.getNotifications());
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const unrecordedTxCount = transactions.filter(t => t.status === 'MENUNGGU_SINKRON').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        member={member}
        isOnline={isOnline}
        isSyncing={isSyncing}
        pendingOfflineCount={offlineQueue.length}
        unreadNotifCount={unreadNotifCount}
        isDarkMode={isDarkMode}
        isE2EEActive={isE2EEActive}
        onToggleOnline={handleToggleOnline}
        onTriggerSync={triggerAutoSync}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenBiometricAuth={() => setIsBiometricModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Offline Sync State Notification Ribbon */}
      <OfflineSyncBanner
        isOnline={isOnline}
        isSyncing={isSyncing}
        pendingCount={offlineQueue.length}
        lastSyncedAt={lastSyncedAt}
        onSyncNow={triggerAutoSync}
        onToggleOnline={handleToggleOnline}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          unrecordedTxCount={unrecordedTxCount}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              member={member}
              transactions={transactions}
              bills={bills}
              shu={shu}
              onNavigateTab={setActiveTab}
              onPayBill={handlePayBill}
              onOpenBiometric={() => setIsBiometricModalOpen(true)}
              onQuickDeposit={() => handleDeposit(1000000, 'Wadiah')}
            />
          )}

          {activeTab === 'masjid' && (
            <MasjidCoopView
              member={member}
              onRegisterNewMember={handleRegisterNewMember}
              onDonateInfaq={handleDonateInfaq}
              onEnrollSpecialProgram={handleEnrollSpecialProgram}
            />
          )}

          {activeTab === 'education' && (
            <CurriculumView
              member={member}
            />
          )}

          {activeTab === 'mentoring' && (
            <MentoringAndKpiView
              member={member}
              onBookMentoringSession={handleBookMentoringSession}
            />
          )}

          {activeTab === 'banking' && (
            <BankingView
              member={member}
              pembiayaanList={pembiayaanList}
              ziswafList={ziswafList}
              shu={shu}
              onDeposit={handleDeposit}
              onRequestSalam={handleRequestSalam}
              onSubmitZiswaf={handleSubmitZiswaf}
            />
          )}

          {activeTab === 'marketplace' && (
            <PasarTaniView
              commodities={commodities}
              member={member}
              onPlaceOrder={handlePlaceOrder}
              onOpenReviews={(c) => {
                setSelectedCommodityForReviewModal(c);
                setActiveTab('orders');
              }}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersAndTrackingView
              orders={orders}
              onAddReview={handleAddReview}
              commodities={commodities}
            />
          )}

          {activeTab === 'inventory' && (
            <FarmerInventoryView
              batches={inventoryBatches}
              onAddBatch={handleAddInventoryBatch}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {activeTab === 'reports' && (
            <FinancialReportsView
              transactions={transactions}
              member={member}
              bills={bills}
            />
          )}

          {activeTab === 'security' && (
            <SecurityCenterView
              member={member}
              transactions={transactions}
              onTriggerBiometricTest={() => setIsBiometricModalOpen(true)}
              onUpdateMemberSecurity={(updates) => {
                const updated = { ...member, ...updates };
                StorageService.saveMember(updated);
                setMember(updated);
              }}
            />
          )}

          {activeTab === 'api' && (
            <DeveloperApiView member={member} />
          )}
        </main>
      </div>

      {/* Biometric Interactive Verification Modal */}
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        title="Otorisasi Biometrik Koperasi Syariah"
        onSuccess={() => {
          setIsBiometricModalOpen(false);
          StorageService.addNotification({
            title: '🔐 Verifikasi Biometrik Sah',
            message: 'Identitas biometrik FIDO2 Anda terverifikasi dengan tanda tangan kunci privat.',
            category: 'KEAMANAN_E2EE',
          });
          setNotifications(StorageService.getNotifications());
        }}
        onClose={() => setIsBiometricModalOpen(false)}
      />

      {/* Push Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          StorageService.markAllNotificationsRead();
          setNotifications(StorageService.getNotifications());
        }}
        onSelectAction={(url) => {
          if (url) setActiveTab(url as ActiveTab);
        }}
      />
    </div>
  );
}
