/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2, Cloud } from 'lucide-react';

interface OfflineSyncBannerProps {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string;
  onSyncNow: () => void;
  onToggleOnline: () => void;
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  isOnline,
  isSyncing,
  pendingCount,
  lastSyncedAt,
  onSyncNow,
  onToggleOnline,
}) => {
  if (isOnline && pendingCount === 0) return null;

  return (
    <div className="sticky top-16 z-30 bg-amber-500 dark:bg-amber-600 text-slate-950 px-4 py-2.5 shadow-md border-b border-amber-600 dark:border-amber-700 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <div className="p-1 rounded bg-amber-600 text-white shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1 rounded bg-amber-600 text-white shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
          )}
          <span>
            {!isOnline
              ? 'Mode Offline Aktif (Area Pelosok/Perkebunan): Transaksi tersimpan aman di IndexedDB lokal.'
              : `Koneksi Pulih! Terdapat ${pendingCount} transaksi lokal menunggu sinkronisasi cloud.`}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {pendingCount > 0 && (
            <button
              onClick={onSyncNow}
              disabled={isSyncing || !isOnline}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : `Sinkronkan Sekarang (${pendingCount})`}</span>
            </button>
          )}

          <button
            onClick={onToggleOnline}
            className="px-2.5 py-1 rounded-lg bg-white/30 hover:bg-white/40 text-slate-950 text-[11px] font-bold transition-colors cursor-pointer"
          >
            {!isOnline ? 'Hubungkan Kembali' : 'Simulasi Offline'}
          </button>
        </div>
      </div>
    </div>
  );
};
