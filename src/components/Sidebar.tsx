/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Coins, 
  Wheat, 
  Truck, 
  Boxes, 
  FileSpreadsheet, 
  ShieldCheck, 
  Code2, 
  HelpCircle,
  Building2,
  GraduationCap,
  Target,
  X
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'masjid'
  | 'education'
  | 'mentoring'
  | 'banking' 
  | 'marketplace' 
  | 'orders' 
  | 'inventory' 
  | 'reports' 
  | 'security' 
  | 'api';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unrecordedTxCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  unrecordedTxCount,
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dasbor Analitik',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'masjid',
      label: 'Koperasi Masjid & Ummat',
      icon: <Building2 className="w-4 h-4" />,
      badge: 'Paket 180k/500k',
    },
    {
      id: 'education',
      label: 'Akademi & Kurikulum',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: '7 Modul',
    },
    {
      id: 'mentoring',
      label: 'Dasbor KPI & Mentoring',
      icon: <Target className="w-4 h-4" />,
      badge: 'KPI Syariah',
    },
    {
      id: 'banking',
      label: 'BMT & Akad Syariah',
      icon: <Coins className="w-4 h-4" />,
      badge: 'Bebas Riba',
    },
    {
      id: 'marketplace',
      label: 'Pasar Bebas Tengkulak',
      icon: <Wheat className="w-4 h-4" />,
      badge: 'Farm Direct',
    },
    {
      id: 'orders',
      label: 'Pelacakan Pengiriman',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: 'inventory',
      label: 'Inventaris Mitra Tani',
      icon: <Boxes className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Laporan & Ekspor Data',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: unrecordedTxCount > 0 ? `${unrecordedTxCount} alert` : undefined,
    },
    {
      id: 'security',
      label: 'Keamanan & Biometrik',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'E2EE',
    },
    {
      id: 'api',
      label: 'API Pihak Ketiga',
      icon: <Code2 className="w-4 h-4" />,
      badge: 'REST',
    },
  ];

  const handleSelect = (id: ActiveTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="p-4 hidden lg:block">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Menu Superaplikasi
          </span>
        </div>

        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight ${
                      isActive
                        ? 'bg-emerald-700/70 text-emerald-100'
                        : item.badge.includes('alert')
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Card */}
      <div className="p-4 mx-3 my-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Prinsip Koperasi Syariah</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Kolektif, adil, transparan, anti-monopoli, dan berdaulat pangan dari desa untuk bangsa.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10 border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Menu Koperasi Islamicity
              </span>
              <button 
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
