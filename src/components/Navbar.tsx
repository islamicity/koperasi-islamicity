/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Building2, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  Bell, 
  Moon, 
  Sun, 
  Fingerprint, 
  Menu
} from 'lucide-react';
import { MemberProfile } from '../types/koperasi';

interface NavbarProps {
  member: MemberProfile;
  isOnline: boolean;
  isSyncing: boolean;
  pendingOfflineCount: number;
  unreadNotifCount: number;
  isDarkMode: boolean;
  isE2EEActive: boolean;
  onToggleOnline: () => void;
  onTriggerSync: () => void;
  onOpenNotifications: () => void;
  onToggleTheme: () => void;
  onOpenBiometricAuth: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  member,
  isOnline,
  isSyncing,
  pendingOfflineCount,
  unreadNotifCount,
  isDarkMode,
  isE2EEActive,
  onToggleOnline,
  onTriggerSync,
  onOpenNotifications,
  onToggleTheme,
  onOpenBiometricAuth,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    KOPERASI ISLAMICITY
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    SUPERAPP
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Koperasi Masjid, BMT Syariah & Pangan Bebas Tengkulak
                </p>
              </div>
            </div>
          </div>

          {/* Center/Status Bar: Network, Cloud Sync & E2EE */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Online/Offline Toggle */}
            <button
              onClick={onToggleOnline}
              title={isOnline ? 'Klik untuk simulasi mode offline di area pelosok' : 'Klik untuk kembali online'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-400 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online Cloud</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline (Tersimpan Lokal)</span>
                </>
              )}
            </button>

            {/* Sync Pulse */}
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              title="Sinkronisasi data ke cloud perbankan"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : pendingOfflineCount > 0 ? `Sinkron (${pendingOfflineCount})` : 'Tersinkron'}</span>
            </button>

            {/* E2EE Status */}
            <div 
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isE2EEActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
              title="Enkripsi End-to-End AES-256-GCM & SHA-256 Hash Chain Aktif"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>E2EE Bank-Grade</span>
            </div>
          </div>

          {/* Right Action Icons: Dark Mode, Push Notif, Biometric, Profile */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Switcher */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Push Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Biometric Scan Trigger */}
            <button
              onClick={onOpenBiometricAuth}
              title="Verifikasi Biometrik Sidik Jari"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Biometrik</span>
            </button>

            {/* Member Profile Widget */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div className="hidden xl:block text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight truncate max-w-[130px]">
                  {member.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {member.memberNumber}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
