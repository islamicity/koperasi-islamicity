/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Quote, Sparkles, ChevronDown, ChevronUp, Wheat, ShieldCheck } from 'lucide-react';

export const IdeologyBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 md:p-6 shadow-xl border border-emerald-700/40">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Manifesto Kedaulatan Ekonomi Rakyat
            </span>
            <span className="text-xs text-slate-300 font-arabic hidden sm:inline">
              تعاونوا على البر والتقوى
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {expanded ? 'Ringkas Gagasan' : 'Baca Pokok Pikiran'}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0 mt-1">
            <Quote className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-slate-100 leading-relaxed italic">
              &quot;Koperasi adalah obat antibiotik paling tepat untuk mematikan virus oligarki dan kapitalisme rente. Mawar tidak mungkin tumbuh di tengah belukar; belukar perantara yang mengeksploitasi produsen kecil harus dipotong melalui integrasi pasar langsung yang berkeadilan.&quot;
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-300 font-medium">
              <span>— Refleksi Gerakan Koperasi Kerakyatan & Kedaulatan Pangan</span>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-emerald-700/40 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <Wheat className="w-4 h-4 text-amber-400" />
                Potong Rantai Tengkulak
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Menghubungkan petani lokal langsung dengan konsumen anggota koperasi tanpa perantara rente. Nilai surplus kembali seutuhnya ke petani dan anggota.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Integritas Akad Syariah
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Pembiayaan Salam pertanian mendanai modal sebelum tanam tanpa riba, bunga, atau denda, mengamankan pasokan pangan halal dan berkah.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Kedaulatan Mandiri Desa
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Didukung enkripsi end-to-end, pencatatan audit SHA-256 terdistribusi, dan sinkronisasi offline agar tetap berdaya di pelosok tanah air.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
