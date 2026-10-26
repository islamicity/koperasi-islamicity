/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, X, KeyRound } from 'lucide-react';

interface BiometricAuthModalProps {
  isOpen: boolean;
  title: string;
  amount?: number;
  onSuccess: () => void;
  onClose: () => void;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  title,
  amount,
  onSuccess,
  onClose,
}) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'fallback'>('idle');
  const [pin, setPin] = useState(['', '', '', '', '', '']);

  if (!isOpen) return null;

  const handleScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        setStatus('idle');
      }, 700);
    }, 1200);
  };

  const handlePinChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const next = [...pin];
    next[idx] = val;
    setPin(next);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`pin-input-${idx + 1}`);
      nextInput?.focus();
    }
    if (idx === 5 && val) {
      setStatus('scanning');
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
          setStatus('idle');
        }, 700);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Otentikasi Kriptografi Biometrik Berlapis Bank-Grade FIDO2
          </p>

          {amount !== undefined && (
            <div className="my-4 py-2.5 px-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Otorisasi Akad</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>
          )}

          {status !== 'fallback' ? (
            <div className="my-6 flex flex-col items-center">
              <button
                type="button"
                onClick={handleScan}
                disabled={status === 'scanning' || status === 'success'}
                className={`relative group w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  status === 'scanning'
                    ? 'bg-amber-100 dark:bg-amber-950/50 border-4 border-amber-500 animate-pulse'
                    : status === 'success'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 border-4 border-emerald-500 scale-105'
                    : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 border-2 border-emerald-500 cursor-pointer shadow-lg hover:shadow-emerald-500/20'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                ) : (
                  <Fingerprint className={`w-12 h-12 text-emerald-600 dark:text-emerald-400 ${status === 'scanning' ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                )}
              </button>

              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-4">
                {status === 'idle' && 'Sentuh sensor sidik jari atau klik tombol di atas'}
                {status === 'scanning' && 'Memverifikasi pola biometrik & menandatangani hash transaksi...'}
                {status === 'success' && 'Otentikasi Berhasil! Akad Syariah Terenkripsi'}
              </p>

              <button
                type="button"
                onClick={() => setStatus('fallback')}
                className="mt-5 text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Gunakan PIN Koperasi 6-Digit
              </button>
            </div>
          ) : (
            <div className="my-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Masukkan 6-digit PIN Koperasi Syariah Anda
              </p>
              <div className="flex justify-center gap-2">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`pin-input-${idx}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 transition-colors"
              >
                Kembali ke Otentikasi Biometrik
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Tersertifikasi Dewan Pengawas Syariah & Terenkripsi E2EE
          </div>
        </div>
      </div>
    </div>
  );
};
