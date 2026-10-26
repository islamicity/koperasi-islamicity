/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PushNotificationItem } from '../../types/security';
import { Bell, CheckCheck, Tag, AlertTriangle, ShieldCheck, ShoppingBag, X } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotificationItem[];
  onMarkAllRead: () => void;
  onSelectAction: (url?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (category: PushNotificationItem['category']) => {
    switch (category) {
      case 'HARGA_KOMODITAS':
        return <Tag className="w-4 h-4 text-amber-500" />;
      case 'TAGIHAN':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'STATUS_PESANAN':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'KEAMANAN_E2EE':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slideLeft">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pusat Notifikasi Push</h3>
              <p className="text-[11px] text-slate-500">Pembaruan transaksi & pasar real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              title="Tandai semua dibaca"
              className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs flex items-center gap-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto stroke-1 mb-2 opacity-50" />
              <p className="text-xs">Belum ada notifikasi baru</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAction(item.actionUrl);
                  onClose();
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  item.read
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100 shadow-xs'
                } hover:border-emerald-400 dark:hover:border-emerald-600`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold truncate text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Enkripsi Notifikasi Aktif • Bebas Spam
          </p>
        </div>
      </div>
    </div>
  );
};
