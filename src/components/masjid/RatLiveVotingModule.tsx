/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Vote, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Copy, 
  Check, 
  Plus, 
  Radio, 
  Award, 
  Printer, 
  Send, 
  MessageSquare, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { RatVoteTopic, RatVoteOption } from '../../types/masjid';
import { MemberProfile } from '../../types/koperasi';

interface RatLiveVotingModuleProps {
  member: MemberProfile;
  initialTopics: RatVoteTopic[];
  onCastVote: (topicId: string, optionId: string) => void;
  onSubmitProposal: (proposal: { title: string; category: RatVoteTopic['category']; description: string }) => void;
  onOpenBiometric: () => void;
}

interface MemberInterruptionMessage {
  id: string;
  senderName: string;
  memberNumber: string;
  mosqueAffiliation: string;
  timestamp: string;
  message: string;
  category: 'Dukungan' | 'Tanggapan Kritis' | 'Pertanyaan Syariah';
}

export const RatLiveVotingModule: React.FC<RatLiveVotingModuleProps> = ({
  member,
  initialTopics,
  onCastVote,
  onSubmitProposal,
  onOpenBiometric,
}) => {
  const [topics, setTopics] = useState<RatVoteTopic[]>(initialTopics);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopics[0]?.id || 'RAT-VOTE-01');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [voteSuccessNotice, setVoteSuccessNotice] = useState<string | null>(null);
  const [copiedProofId, setCopiedProofId] = useState<string | null>(null);

  // Live session timer simulation (countdown)
  const [secondsLeft, setSecondsLeft] = useState<number>(342); // 5 min 42 sec
  const [liveAttendeesCount, setLiveAttendeesCount] = useState<number>(432);

  // Member interruption / discussion messages
  const [messages, setMessages] = useState<MemberInterruptionMessage[]>([
    {
      id: 'MSG-01',
      senderName: 'Kang Ridwan Kamil',
      memberNumber: 'KSPPS-ISL-9021',
      mosqueAffiliation: 'Masjid Raya Cipanas',
      timestamp: 'Baru saja',
      message: 'Bismillah, kami dari kelompok tani milenial sangat mendukung Formula 2 agar anggota semakin terdorong belanja komoditas beras dan cabai petani lokal.',
      category: 'Dukungan',
    },
    {
      id: 'MSG-02',
      senderName: 'Ibu Hj. Maryam Salsabila',
      memberNumber: 'KSPPS-ISL-7742',
      mosqueAffiliation: 'Masjid Al-Barokah Sentral',
      timestamp: '2 menit lalu',
      message: 'Untuk alokasi dana sosial, mohon dipastikan porsi beasiswa santri dhuafa tersalurkan tepat sasaran sebelum semester genap dimulai.',
      category: 'Tanggapan Kritis',
    },
    {
      id: 'MSG-03',
      senderName: 'Ust. Fathurrahman Al-Hafidz (DPS)',
      memberNumber: 'DSN-MUI-098',
      mosqueAffiliation: 'Dewan Pengawas Syariah',
      timestamp: '5 menit lalu',
      message: 'Alhamdulillah seluruh agenda pemungutan suara telah diaudit kesesuaian syariahnya tanpa riba dan gharar. Silakan gunakan hak suara Anda secara amanah.',
      category: 'Pertanyaan Syariah',
    },
  ]);
  const [newInterruptionText, setNewInterruptionText] = useState('');
  const [interruptionCategory, setInterruptionCategory] = useState<MemberInterruptionMessage['category']>('Dukungan');

  // Proposal modal
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [propTitle, setPropTitle] = useState('');
  const [propCategory, setPropCategory] = useState<RatVoteTopic['category']>('Alokasi Dana Sosial');
  const [propDescription, setPropDescription] = useState('');

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'Semua' | 'Alokasi Dana Sosial' | 'Keputusan Strategis RAT' | 'Belum Memilih'>('Semua');

  // Synchronize initialTopics if updated from parent
  useEffect(() => {
    setTopics(initialTopics);
  }, [initialTopics]);

  // Live timer countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 360));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const handleVoteSubmit = () => {
    if (!selectedOptionId) return;

    setIsSubmittingVote(true);
    setTimeout(() => {
      onCastVote(currentTopic.id, selectedOptionId);

      // Local state update for instant live animation
      const updated = topics.map((top) => {
        if (top.id === currentTopic.id) {
          const isPreviouslyVoted = !!top.userVotedOptionId;
          const prevId = top.userVotedOptionId;
          const newTotal = isPreviouslyVoted ? top.totalVotes : top.totalVotes + 1;

          const updatedOpts = top.options.map((opt) => {
            let count = opt.votesCount;
            if (opt.id === selectedOptionId) {
              count = isPreviouslyVoted && prevId === selectedOptionId ? count : count + 1;
            } else if (isPreviouslyVoted && prevId === opt.id) {
              count = Math.max(0, count - 1);
            }
            return {
              ...opt,
              votesCount: count,
              percentage: Number(((count / newTotal) * 100).toFixed(1)),
            };
          });

          return {
            ...top,
            totalVotes: newTotal,
            options: updatedOpts,
            userVotedOptionId: selectedOptionId,
            cryptographicAuditProof: `SHA256_VOTE_${top.id}_${selectedOptionId}_${member.id}_${Date.now().toString(16).toUpperCase()}`,
          };
        }
        return top;
      });

      setTopics(updated);
      setIsSubmittingVote(false);
      setVoteSuccessNotice(`Suara Sah Anda Berhasil Direkam! Tanda tangan hash SHA-256 tersimpan di buku kas RAT.`);
      setTimeout(() => setVoteSuccessNotice(null), 4000);
    }, 800);
  };

  const handleSendInterruption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterruptionText.trim()) return;

    const newMsg: MemberInterruptionMessage = {
      id: `MSG-${Date.now()}`,
      senderName: member.name,
      memberNumber: member.memberNumber,
      mosqueAffiliation: member.village,
      timestamp: 'Baru saja',
      message: newInterruptionText.trim(),
      category: interruptionCategory,
    };

    setMessages([newMsg, ...messages]);
    setNewInterruptionText('');
  };

  const handleProposalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle || !propDescription) return;

    onSubmitProposal({
      title: propTitle,
      category: propCategory,
      description: propDescription,
    });

    setPropTitle('');
    setPropDescription('');
    setShowProposalModal(false);
  };

  const handleCopyHash = (proof: string) => {
    navigator.clipboard.writeText(proof);
    setCopiedProofId(proof);
    setTimeout(() => setCopiedProofId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Session Ribbon Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-5 md:p-6 shadow-xl border border-emerald-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Live Sidang Pleno RAT XXI
              </span>
              <span className="text-xs text-emerald-300 font-arabic hidden sm:inline">
                وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ • الشورى: ٣٨
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
              Musyawarah Terpadu & E-Voting Sah Rapat Anggota Tahunan
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Kedaulatan ekonomi murni: <strong>1 Anggota = 1 Suara (One Member One Vote)</strong>. Seluruh proses diaudit Dewan Pengawas Syariah (DPS) dan dienkripsi ujung-ke-ujung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Live Attendees Counter */}
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs text-center">
              <span className="text-[10px] text-emerald-300 block font-bold">Kehadiran Kuorum Sah:</span>
              <span className="text-sm font-extrabold text-white flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                {liveAttendeesCount} Anggota (92.4%)
              </span>
            </div>

            {/* Countdown Timer */}
            <div className="px-3.5 py-2 rounded-xl bg-amber-500/20 backdrop-blur-xs border border-amber-400/40 text-xs text-center">
              <span className="text-[10px] text-amber-300 block font-bold">Sisa Sesi Voting:</span>
              <span className="text-sm font-mono font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(secondsLeft)}
              </span>
            </div>

            {/* Action button */}
            <button
              onClick={() => setShowProposalModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Usul Agenda Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {voteSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{voteSuccessNotice}</span>
        </div>
      )}

      {/* 2. Main Voting Grid: Agenda Selector & Live Ballot Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Agenda Selector Menu with Category Filtering */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Vote className="w-4 h-4 text-emerald-600" />
              Daftar Agenda Sidang RAT
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              {topics.length} Agenda
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setSelectedCategoryFilter('Semua')}
              className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                selectedCategoryFilter === 'Semua'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Semua ({topics.length})
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('Alokasi Dana Sosial')}
              className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                selectedCategoryFilter === 'Alokasi Dana Sosial'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Dana Sosial ({topics.filter(t => t.category === 'Alokasi Dana Sosial').length})
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('Keputusan Strategis RAT')}
              className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                selectedCategoryFilter === 'Keputusan Strategis RAT'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Strategis RAT ({topics.filter(t => t.category === 'Keputusan Strategis RAT' || t.category === 'Kebijakan Dividen SHU' || t.category === 'Investasi Lumbung Pangan').length})
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('Belum Memilih')}
              className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                selectedCategoryFilter === 'Belum Memilih'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Belum Suara ({topics.filter(t => !t.userVotedOptionId).length})
            </button>
          </div>

          <div className="space-y-2.5">
            {topics
              .filter((t) => {
                if (selectedCategoryFilter === 'Alokasi Dana Sosial') return t.category === 'Alokasi Dana Sosial';
                if (selectedCategoryFilter === 'Keputusan Strategis RAT') {
                  return t.category === 'Keputusan Strategis RAT' || t.category === 'Kebijakan Dividen SHU' || t.category === 'Investasi Lumbung Pangan';
                }
                if (selectedCategoryFilter === 'Belum Memilih') return !t.userVotedOptionId;
                return true;
              })
              .map((t) => {
                const isSelected = t.id === currentTopic.id;
                const hasVoted = !!t.userVotedOptionId;

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTopicId(t.id);
                      setSelectedOptionId(t.userVotedOptionId || null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/40 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        {t.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          t.status === 'Aktif Voting'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                      {t.title}
                    </h5>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">
                        {t.totalVotes} Suara Masuk
                      </span>
                      {hasVoted ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                          <Check className="w-3 h-3" />
                          Sudah Memilih
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                          Belum Memilih
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Center & Right: Live Ballot & Real-Time Tally */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
          {/* Active Agenda Header */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {currentTopic.category}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Batas Voting: <strong className="text-slate-800 dark:text-slate-200">{currentTopic.deadline}</strong></span>
              </div>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {currentTopic.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentTopic.description}
            </p>

            {/* Quorum Visual Progress Indicator */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kuorum Syarat Legalitas: <strong>{currentTopic.quorumRequirement}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentTopic.totalVotes} Suara Sah Terhimpun (Kuorum Terpenuhi)</span>
                </div>
              </div>

              {/* Visual Quorum Progress Bar */}
              <div className="space-y-1">
                <div className="relative w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (currentTopic.totalVotes / 215) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 Suara</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">215 Suara (Ambang Sah 50%+1)</span>
                  <span>{currentTopic.totalVotes} Suara Terkumpul</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Note if Completed */}
          {currentTopic.decisionNote && (
            <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
              <Award className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Ketetapan Resmi Sidang Pleno RAT (TAP-RAT):</strong>
                <p className="text-xs leading-relaxed mt-1">{currentTopic.decisionNote}</p>
              </div>
            </div>
          )}

          {/* Options & Live Tally List with Visual Progress Bars */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilihan Musyawarah Anggota (Hasil Rekapitulasi Suara Real-Time):
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Total {currentTopic.totalVotes} Suara
              </span>
            </div>

            {(() => {
              const leadingOpt = currentTopic.options.reduce(
                (prev, curr) => (curr.votesCount > prev.votesCount ? curr : prev),
                currentTopic.options[0]
              );

              return currentTopic.options.map((opt, optIdx) => {
                const isSelectedForVote = selectedOptionId === opt.id;
                const isUserCast = currentTopic.userVotedOptionId === opt.id;
                const isLeading = opt.id === leadingOpt?.id && opt.votesCount > 0;

                // Color themes for visual progress bar
                const getGradient = () => {
                  if (isLeading) return 'from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]';
                  if (optIdx === 1) return 'from-amber-500 to-yellow-400';
                  if (optIdx === 2) return 'from-sky-500 to-cyan-400';
                  return 'from-purple-500 to-indigo-400';
                };

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (currentTopic.status === 'Aktif Voting') {
                        setSelectedOptionId(opt.id);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelectedForVote || isUserCast
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelectedForVote || isUserCast
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-600 bg-transparent'
                            }`}
                          >
                            {(isSelectedForVote || isUserCast) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                              {opt.label}
                            </h5>
                            {isLeading && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                Terbanyak ({opt.percentage}%)
                              </span>
                            )}
                            {isUserCast && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                                Suara Sah Anda
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                          {opt.percentage}%
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {opt.votesCount} Suara Masuk
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Visual Progress Bar of Live Votes with Smooth Transitions & Shimmer */}
                    <div className="mt-3.5 space-y-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-3 rounded-full overflow-hidden p-0.5 relative shadow-inner">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getGradient()} progress-bar-shimmer transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] relative ${
                            isLeading ? 'progress-glow-active' : ''
                          }`}
                          style={{ width: `${Math.max(opt.percentage, 2)}%` }}
                        >
                          {opt.percentage > 4 && (
                            <div className="absolute right-0.5 top-0.5 bottom-0.5 w-2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                        <span>Porsi Suara: {opt.percentage}%</span>
                        <span>{opt.votesCount} / {currentTopic.totalVotes} Total</span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Action to Cast Vote */}
          {currentTopic.status === 'Aktif Voting' && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Otorisasi suara menggunakan Kunci Kriptografi Akun Anggota.
              </span>

              <button
                onClick={handleVoteSubmit}
                disabled={!selectedOptionId || isSubmittingVote}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Vote className="w-4 h-4" />
                <span>{isSubmittingVote ? 'Merekam Suara...' : 'Kirim Suara Sah (One Member One Vote)'}</span>
              </button>
            </div>
          )}

          {/* Cryptographic Audit Trail */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>SHA-256 Ballot Stamp: <span className="text-slate-600 dark:text-slate-300 truncate">{currentTopic.cryptographicAuditProof}</span></span>
            </div>

            <button
              onClick={() => handleCopyHash(currentTopic.cryptographicAuditProof)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans text-xs font-semibold shrink-0"
            >
              {copiedProofId === currentTopic.cryptographicAuditProof ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Hash Kriptografi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Member Interruption & Discussion Room */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Ruang Interupsi & Musyawarah Tertib Sidang RAT
            </h4>
            <p className="text-xs text-slate-500">
              Anggota yang hadir online dapat menyampaikan tanggapan atau saran langsung kepada Pimpinan Sidang dan Dewan Pengawas Syariah.
            </p>
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSendInterruption} className="space-y-3">
          <div className="flex gap-2">
            <select
              value={interruptionCategory}
              onChange={(e) => setInterruptionCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0"
            >
              <option value="Dukungan">Dukungan</option>
              <option value="Tanggapan Kritis">Tanggapan Kritis</option>
              <option value="Pertanyaan Syariah">Pertanyaan Syariah</option>
            </select>

            <input
              type="text"
              value={newInterruptionText}
              onChange={(e) => setNewInterruptionText(e.target.value)}
              placeholder="Sampaikan pandangan musyawarah Anda secara santun dan konstruktif..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim ke Meja Sidang</span>
            </button>
          </div>
        </form>

        {/* Messages Stream */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({msg.memberNumber}) • {msg.mosqueAffiliation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      msg.category === 'Dukungan'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : msg.category === 'Tanggapan Kritis'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {msg.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ajukan Usulan Agenda Sidang RAT Baru
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sebagai anggota berdaulat, Anda berhak mengusulkan agenda pengambilan keputusan atau program dana sosial.
            </p>

            <form onSubmit={handleProposalFormSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kategori Agenda
                </label>
                <select
                  value={propCategory}
                  onChange={(e) => setPropCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Alokasi Dana Sosial">Alokasi Dana Sosial Koperasi Masjid</option>
                  <option value="Kebijakan Dividen SHU">Kebijakan Dividen & Dana Cadangan SHU</option>
                  <option value="Investasi Lumbung Pangan">Investasi Sarana Lumbung & Logistik Pangan</option>
                  <option value="Pemilihan Pengurus/DPS">Pemilihan & Pengawasan Pengurus/DPS</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Usulan Agenda
                </label>
                <input
                  type="text"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="Contoh: Pengadaan Mesin Penggiling Padi Mini untuk Lumbung Cipanas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Uraian & Rencana Kemaslahatan Ummat
                </label>
                <textarea
                  rows={3}
                  value={propDescription}
                  onChange={(e) => setPropDescription(e.target.value)}
                  placeholder="Jelaskan alasan, estimasi anggaran, dan manfaat nyata bagi petani dan anggota jamaah..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Kirim ke Meja Pimpinan Sidang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
