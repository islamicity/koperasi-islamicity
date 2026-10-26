/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  Key, 
  ExternalLink, 
  ShieldCheck, 
  Layers,
  Sparkles
} from 'lucide-react';
import { MemberProfile } from '../../types/koperasi';

interface DeveloperApiViewProps {
  member: MemberProfile;
}

export const DeveloperApiView: React.FC<DeveloperApiViewProps> = ({ member }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET_BALANCE');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const apiKey = `islamicity_live_sec_${member.id}_98273645`;

  const endpoints = [
    {
      id: 'GET_BALANCE',
      method: 'GET',
      path: '/api/v1/koperasi/balance',
      title: 'Cek Saldo Simpanan Syariah & Portofolio',
      desc: 'Mengambil ringkasan saldo Wadiah, Mudharabah, dan dividen SHU anggota secara real-time.',
      sampleRequest: null,
      sampleResponse: {
        statusCode: 200,
        status: 'SUCCESS',
        data: {
          memberNumber: member.memberNumber,
          memberName: member.name,
          simpananSukarelaWadiah: member.simpananSukarelaWadiah,
          investasiMudharabah: member.investasiMudharabah,
          simpananPokokDanWajib: member.simpananPokok + member.simpananWajib,
          shuEstimated: 3840000,
          currency: 'IDR',
          isEncrypted: true,
          cryptoSignature: 'SHA256_STAMP_78A29...',
        },
      },
    },
    {
      id: 'POST_TRANSACTION',
      method: 'POST',
      path: '/api/v1/koperasi/transactions/auto-record',
      title: 'Pencatatan Transaksi Perbankan Otomatis (SNAP BI-FAST)',
      desc: 'Mencatat transaksi debit/kredit perbankan dan menghubungkannya langsung ke rantai SHA-256 buku kas.',
      sampleRequest: {
        amount: 250000,
        type: 'BELANJA_PASAR',
        akad: 'Murabahah',
        sourceAccount: 'Wadiah',
        recipient: 'Lumbung Petani Cianjur',
        notes: 'Pembayaran otomatis via Open Banking API gateway',
      },
      sampleResponse: {
        statusCode: 201,
        status: 'CREATED',
        transactionId: 'TXN-API-9941',
        blockHash: '7a9c1e4b8f0a2d3e5c7b9a1f3d5e7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f',
        reconciled: true,
      },
    },
    {
      id: 'GET_COMMODITIES',
      method: 'GET',
      path: '/api/v1/pasar/commodities?radius=15km',
      title: 'Katalog Komoditas Pangan Bebas Tengkulak',
      desc: 'Akses harga pasar komoditas real-time, stok silo lumbung, dan profil petani mitra.',
      sampleRequest: null,
      sampleResponse: {
        statusCode: 200,
        totalItems: 5,
        radiusFilteredKm: 15,
        commodities: [
          {
            id: 'COM-01',
            name: 'Beras Pandan Wangi Cianjur Asli Organik',
            koperasiPrice: 76000,
            tengkulakPrice: 94000,
            farmerReceives: 68000,
            unit: '5 Kg Pack',
            distanceKm: 4.2,
            freshness: 'Organik Bersertifikat',
          },
        ],
      },
    },
    {
      id: 'GET_REPORTS_AUTO',
      method: 'GET',
      path: '/api/v1/reports/financial/auto-export?format=json',
      title: 'API Laporan Keuangan Otomatis (Akuntabel)',
      desc: 'Ekspor laporan laba rugi syariah dan buku besar untuk integrasi ERP eksternal atau akuntan publik.',
      sampleRequest: null,
      sampleResponse: {
        statusCode: 200,
        reportingPeriod: '2026-Q3',
        totalAssets: 485000000,
        liquidityRatio: '38.4%',
        npfRatio: '0.00%',
        auditedBy: 'Dewan Pengawas Syariah & DSN MUI',
      },
    },
  ];

  const currentEp = endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  const handleRunTest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTestOutput(JSON.stringify(currentEp.sampleResponse, null, 2));
      setIsLoading(false);
    }, 600);
  };

  const curlCommand = `curl -X ${currentEp.method} "https://koperasi-api.islamicity.id${currentEp.path}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -H "X-E2EE-Algorithm: AES-256-GCM"${currentEp.sampleRequest ? ` \\\n  -d '${JSON.stringify(currentEp.sampleRequest)}'` : ''}`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Open Banking & Core System API
            </span>
            <span className="text-xs text-indigo-200">
              Standar SNAP BI-FAST & RESTful JSON
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Portal Integrasi Pengembang Pihak Ketiga
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Menyediakan antarmuka pemrograman aplikasi (API) yang aman dan terenkripsi untuk integrasi sistem kasir toko ritel desa, ERP koperasi, atau perbankan syariah nasional.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-right">
          <span className="text-[10px] text-slate-400 block font-semibold">API Key Anggota Terenkripsi:</span>
          <span className="font-mono font-bold text-emerald-400 block mt-0.5">
            {apiKey.substring(0, 18)}...
          </span>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Endpoint Selector Menu */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Daftar Endpoint API Terbuka
          </h3>
          <p className="text-xs text-slate-500">
            Pilih endpoint untuk menguji integrasi dan melihat respon JSON:
          </p>

          <div className="space-y-2 mt-2">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep.id);
                    setTestOutput(null);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/40 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black font-mono ${
                        ep.method === 'GET'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {ep.title}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 truncate">
                    {ep.path}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sandbox Request & Live Test Console */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  {currentEp.method}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentEp.path}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentEp.desc}</p>
            </div>

            <button
              onClick={handleRunTest}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Send className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Mengirim Request...' : 'Uji Endpoint Sandbox'}</span>
            </button>
          </div>

          {/* cURL Snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Terminal className="w-3.5 h-3.5" />
                cURL Request Command:
              </span>
              <button
                onClick={handleCopyCurl}
                className="hover:text-indigo-600 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'Tersalin' : 'Salin cURL'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
              {curlCommand}
            </pre>
          </div>

          {/* Response Console */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Respon Live Server JSON:
              </span>
              <span className="text-[11px] font-mono text-emerald-600">
                Status: 200 OK (Terverifikasi E2EE)
              </span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 min-h-[140px] leading-relaxed">
              {testOutput || JSON.stringify(currentEp.sampleResponse, null, 2)}
            </pre>
          </div>

          {/* Security & Token Note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Semua payload API melalui tanda tangan kriptografi HMAC-SHA256 dan pembatasan laju 1.000 req/menit untuk mencegah serangan DDoS.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
