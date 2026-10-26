/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  ExternalLink, 
  Landmark, 
  ArrowRight, 
  Award, 
  FileCheck,
  Compass,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  HeartHandshake,
  Vote,
  CheckSquare,
  Lock,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { 
  RegistrationPackage, 
  SocialInfaqDonation, 
  Qs865Formation, 
  SpecialProgram,
  RatVoteTopic
} from '../../types/masjid';
import { 
  INITIAL_REGISTRATION_PACKAGES, 
  INITIAL_INFAQ_DONATIONS, 
  INITIAL_QS865_FORMATIONS, 
  INITIAL_SPECIAL_PROGRAMS,
  INITIAL_RAT_VOTES
} from '../../services/masjidMockData';
import { MemberProfile } from '../../types/koperasi';
import { RatLiveVotingModule } from './RatLiveVotingModule';

export interface VotingModuleProps {
  member: MemberProfile;
  ratVotes: RatVoteTopic[];
  onCastVote: (topicId: string, optionId: string) => void;
  onOpenFullRatSession?: () => void;
}

/**
 * VotingModule component for MasjidCoopView:
 * Displays live voting options for social fund allocation and RAT decisions,
 * featuring a visual progress bar for each option to show real-time results.
 */
export const VotingModule: React.FC<VotingModuleProps> = ({
  member,
  ratVotes,
  onCastVote,
  onOpenFullRatSession,
}) => {
  const [activeCategory, setActiveCategory] = useState<'social' | 'strategic'>('social');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [copiedAuditProof, setCopiedAuditProof] = useState<string | null>(null);
  const [justVotedOptId, setJustVotedOptId] = useState<string | null>(null);

  // Filter topics for social fund allocation vs strategic RAT decisions
  const socialTopics = ratVotes.filter((t) => t.category === 'Alokasi Dana Sosial');
  const strategicTopics = ratVotes.filter(
    (t) =>
      t.category === 'Keputusan Strategis RAT' ||
      t.category === 'Kebijakan Dividen SHU' ||
      t.category === 'Investasi Lumbung Pangan'
  );

  const displayedTopics = activeCategory === 'social' ? socialTopics : strategicTopics;

  // Active topic or fallback
  const activeTopic =
    displayedTopics.find((t) => t.id === selectedTopicId) ||
    displayedTopics[0] ||
    ratVotes[0];

  const handleCopyProof = (proof: string) => {
    navigator.clipboard.writeText(proof);
    setCopiedAuditProof(proof);
    setTimeout(() => setCopiedAuditProof(null), 2000);
  };

  if (!activeTopic) return null;

  const leadingOption = activeTopic.options.reduce(
    (prev, curr) => (curr.votesCount > prev.votesCount ? curr : prev),
    activeTopic.options[0]
  );

  return (
    <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-5">
      {/* Module Header with Live Indicator & Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Live Polling Real-Time
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Musyawarah Syariah • 1 Anggota = 1 Suara Sah
            </span>
          </div>
          <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Vote className="w-5 h-5 text-emerald-600" />
            <span>Modul Voting: Alokasi Dana Sosial & Keputusan Strategis RAT</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Berikan suara sah Anda untuk memusyawarahkan penyaluran dana sosial umat dan arah kebijakan strategis koperasi dengan visualisasi progres suara real-time.
          </p>
        </div>

        {/* Live Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold shrink-0">
          <button
            onClick={() => {
              setActiveCategory('social');
              setSelectedTopicId(null);
            }}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'social'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Alokasi Dana Sosial ({socialTopics.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveCategory('strategic');
              setSelectedTopicId(null);
            }}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'strategic'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Keputusan Strategis RAT ({strategicTopics.length})</span>
          </button>
        </div>
      </div>

      {/* Multiple Topics Switcher inside selected category */}
      {displayedTopics.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Pilih Topik:</span>
          {displayedTopics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTopic.id === t.id
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {t.title.length > 45 ? `${t.title.substring(0, 45)}...` : t.title}
            </button>
          ))}
        </div>
      )}

      {/* Active Agenda Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {activeTopic.category}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Batas Voting: <strong className="text-slate-800 dark:text-slate-200">{activeTopic.deadline}</strong>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeTopic.status === 'Aktif Voting' ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
                }`}
              >
                {activeTopic.status}
              </span>
            </div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              {activeTopic.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeTopic.description}
            </p>
          </div>

          <div className="text-right shrink-0 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Suara Masuk:</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">
              {activeTopic.totalVotes} Suara
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Kuorum: {activeTopic.quorumRequirement.split(' ')[0]} {activeTopic.quorumRequirement.split(' ')[1]}
            </span>
          </div>
        </div>

        {/* Quorum Visual Progress Gauge Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Progress Kuorum Sah Musyawarah (Ambang Batas: 215 Suara / 50%+1):
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono transition-all duration-500">
              {activeTopic.totalVotes} Suara ({Math.round((activeTopic.totalVotes / 215) * 100)}% Terpenuhi)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2.5 rounded-full overflow-hidden p-0.5 relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full progress-bar-shimmer transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] relative"
              style={{ width: `${Math.min(100, (activeTopic.totalVotes / 215) * 100)}%` }}
            >
              <div className="absolute right-0.5 top-0 bottom-0 w-2 rounded-full bg-white/70 shadow-[0_0_6px_white] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Live Voting Options with Visual Progress Bar for each option */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activeTopic.options.map((opt, idx) => {
            const isUserVote = activeTopic.userVotedOptionId === opt.id;
            const isLeading = opt.id === leadingOption?.id && opt.votesCount > 0;
            const isRecentlyClicked = justVotedOptId === opt.id;

            const gradients = [
              'from-emerald-500 via-teal-400 to-emerald-400',
              'from-amber-500 to-yellow-400',
              'from-sky-500 to-cyan-400',
              'from-indigo-500 to-violet-400',
            ];
            const barGradient = isLeading
              ? 'from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
              : gradients[idx % gradients.length];

            return (
              <div
                key={opt.id}
                onClick={() => {
                  if (activeTopic.status === 'Aktif Voting') {
                    setJustVotedOptId(opt.id);
                    onCastVote(activeTopic.id, opt.id);
                    setTimeout(() => setJustVotedOptId(null), 1200);
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between relative overflow-hidden transition-all duration-500 ${
                  isRecentlyClicked ? 'animate-vote-pop ring-4 ring-emerald-500/40 shadow-lg' : ''
                } ${
                  isUserVote
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-500/25'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isUserVote
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isUserVote && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {opt.label.split(':')[0]}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-black text-sm text-slate-900 dark:text-white transition-all duration-500">
                        {opt.percentage}%
                      </span>
                    </div>
                  </div>

                  {isLeading && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-all duration-300">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Pilihan Terbanyak Saat Ini
                    </span>
                  )}

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    {opt.label.includes(':') ? opt.label.split(':')[1] : opt.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {opt.description}
                  </p>
                </div>

                {/* Visual Progress Bar of Live Votes with Smooth Transitions & Shimmer */}
                <div className="mt-4 space-y-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="w-full bg-slate-200 dark:bg-slate-800/90 h-3 rounded-full overflow-hidden p-0.5 relative shadow-inner">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barGradient} progress-bar-shimmer transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] relative ${
                        isLeading ? 'progress-glow-active' : ''
                      }`}
                      style={{ width: `${Math.max(opt.percentage, 3)}%` }}
                    >
                      {/* Luminous beacon at the leading edge of the progress bar */}
                      {opt.percentage > 4 && (
                        <div className="absolute right-0.5 top-0.5 bottom-0.5 w-2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium transition-all duration-500">
                      {opt.votesCount} Suara Masuk
                    </span>
                    {isUserVote ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 transition-all duration-300">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Pilihan Suara Anda
                      </span>
                    ) : (
                      <span className="text-slate-400 hover:text-emerald-600 font-semibold transition-colors duration-200">
                        Klik untuk Memilih
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Cryptographic Stamp and Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] truncate">
            <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">
              Hash Bukti Sah: <strong className="text-slate-700 dark:text-slate-300">{activeTopic.cryptographicAuditProof}</strong>
            </span>
            <button
              onClick={() => handleCopyProof(activeTopic.cryptographicAuditProof)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0 ml-1 cursor-pointer"
            >
              {copiedAuditProof === activeTopic.cryptographicAuditProof ? (
                <span className="text-emerald-600 font-bold">Tersalin!</span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {onOpenFullRatSession && (
            <button
              onClick={onOpenFullRatSession}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Vote className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buka Ruang Sidang Paripurna RAT Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface MasjidCoopViewProps {
  member: MemberProfile;
  onRegisterNewMember: (newMemberData: any) => void;
  onDonateInfaq: (donation: SocialInfaqDonation) => void;
  onEnrollSpecialProgram: (program: SpecialProgram) => void;
}

export const MasjidCoopView: React.FC<MasjidCoopViewProps> = ({
  member,
  onRegisterNewMember,
  onDonateInfaq,
  onEnrollSpecialProgram,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'packages' | 'qs865' | 'rat_voting' | 'infaq_voucher' | 'special_programs'>('packages');

  // Registration form modal state
  const [selectedPackage, setSelectedPackage] = useState<RegistrationPackage>(INITIAL_REGISTRATION_PACKAGES[1]);
  const [showRegModal, setShowRegModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageMosque, setVillageMosque] = useState('Masjid Raya Islamicity Sentral');
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Infaq state
  const [infaqAmount, setInfaqAmount] = useState('500000');
  const [infaqTargetMosque, setInfaqTargetMosque] = useState('Masjid Raya Islamicity Sentral');
  const [infaqAllocation, setInfaqAllocation] = useState<SocialInfaqDonation['allocatedFor']>('Infrastruktur Masjid');
  const [infaqHistory, setInfaqHistory] = useState<SocialInfaqDonation[]>(INITIAL_INFAQ_DONATIONS);

  // QS 8:65 interactive calculator
  const [selectedFormationIdx, setSelectedFormationIdx] = useState(0);
  const activeFormation = INITIAL_QS865_FORMATIONS[selectedFormationIdx];

  // E-Voting RAT State
  const [ratVotes, setRatVotes] = useState<RatVoteTopic[]>(INITIAL_RAT_VOTES);
  const [voteCategoryFilter, setVoteCategoryFilter] = useState<string>('Semua');
  const [voteSuccessMsg, setVoteSuccessMsg] = useState<string | null>(null);
  const [copiedProofId, setCopiedProofId] = useState<string | null>(null);

  // Proposal State
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalCategory, setProposalCategory] = useState<RatVoteTopic['category']>('Alokasi Dana Sosial');
  const [proposalDesc, setProposalDesc] = useState('');
  const [proposalSuccessMsg, setProposalSuccessMsg] = useState<string | null>(null);

  const handleCastVote = (topicId: string, optionId: string) => {
    const updated = ratVotes.map((topic) => {
      if (topic.id === topicId) {
        const isPreviouslyVoted = !!topic.userVotedOptionId;
        const previousVotedOptId = topic.userVotedOptionId;

        const newTotalVotes = isPreviouslyVoted ? topic.totalVotes : topic.totalVotes + 1;

        const updatedOptions = topic.options.map((opt) => {
          let count = opt.votesCount;
          if (opt.id === optionId) {
            count = isPreviouslyVoted && previousVotedOptId === optionId ? count : count + 1;
          } else if (isPreviouslyVoted && previousVotedOptId === opt.id) {
            count = Math.max(0, count - 1);
          }
          return {
            ...opt,
            votesCount: count,
            percentage: Number(((count / newTotalVotes) * 100).toFixed(1)),
          };
        });

        const finalAuditHash = `SHA256_VOTE_${topicId}_${optionId}_${member.id}_${Date.now().toString(16).toUpperCase()}`;

        return {
          ...topic,
          totalVotes: newTotalVotes,
          options: updatedOptions,
          userVotedOptionId: optionId,
          cryptographicAuditProof: finalAuditHash,
        };
      }
      return topic;
    });

    setRatVotes(updated);
    setVoteSuccessMsg('Suara Sah Anda Berhasil Dicatat! Tanda tangan hash kriptografi telah ditautkan pada blok keputusan RAT.');
    setTimeout(() => setVoteSuccessMsg(null), 4000);
  };

  const handleCopyProof = (proof: string, id: string) => {
    navigator.clipboard.writeText(proof);
    setCopiedProofId(id);
    setTimeout(() => setCopiedProofId(null), 2000);
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle || !proposalDesc) return;

    const newTopic: RatVoteTopic = {
      id: `RAT-USUL-${Date.now().toString().slice(-4)}`,
      title: proposalTitle,
      category: proposalCategory,
      description: proposalDesc,
      deadline: '15 November 2026 (Tahap Musyawarah Awal)',
      totalVotes: 1,
      quorumRequirement: 'Minimum 50% + 1 Anggota Aktif (215 Suara)',
      quorumReached: false,
      status: 'Aktif Voting',
      cryptographicAuditProof: `SHA256_PROPOSAL_${member.id}_${Date.now()}`,
      options: [
        {
          id: `OPT-${Date.now()}-A`,
          label: 'Setuju dengan Usulan Program Jamaah',
          description: 'Mendukung implementasi program dalam rencana anggaran RAT.',
          votesCount: 1,
          percentage: 100,
        },
        {
          id: `OPT-${Date.now()}-B`,
          label: 'Perlu Kajian Ulang & Studi Kelayakan',
          description: 'Meminta Dewan Pengawas Syariah melakukan telaah risiko.',
          votesCount: 0,
          percentage: 0,
        },
      ],
      userVotedOptionId: `OPT-${Date.now()}-A`,
    };

    setRatVotes([newTopic, ...ratVotes]);
    setProposalSuccessMsg('Usulan musyawarah Anda berhasil diajukan ke sidang pleno RAT Koperasi!');
    setProposalTitle('');
    setProposalDesc('');
    setTimeout(() => {
      setShowProposalModal(false);
      setProposalSuccessMsg(null);
    }, 2000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const newMemberNum = `KSPPS-MSJ-${Math.floor(1000 + Math.random() * 9000)}`;
    onRegisterNewMember({
      name: fullName,
      phone,
      memberNumber: newMemberNum,
      packageId: selectedPackage.id,
      mosque: villageMosque,
      simpananPokok: selectedPackage.breakdown.simpananPokok,
      simpananWajib: selectedPackage.breakdown.simpananWajib,
    });

    setRegSuccessMessage(`Pendaftaran Berhasil! Nomor Anggota: ${newMemberNum}. Voucher Belanja Haji/Properti telah disematkan.`);
    setFullName('');
    setPhone('');
    setTimeout(() => {
      setShowRegModal(false);
      setRegSuccessMessage(null);
    }, 2500);
  };

  const handleInfaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(infaqAmount.replace(/\D/g, ''), 10);
    if (val > 0) {
      const voucherNum = `VOUCHER-ISL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newDonation: SocialInfaqDonation = {
        id: `INFQ-${Date.now()}`,
        donorName: member.name,
        amount: val,
        date: new Date().toLocaleDateString('id-ID'),
        targetMosque: infaqTargetMosque,
        allocatedFor: infaqAllocation,
        voucherCode: voucherNum,
        voucherValue: val >= 1000000 ? 'Rp 2.500.000' : 'Rp 1.000.000',
        voucherDescription: 'Voucher Belanja Haji Khusus / Properti Syariah di global.property.islamicity.tv',
      };

      setInfaqHistory([newDonation, ...infaqHistory]);
      onDonateInfaq(newDonation);
      setInfaqAmount('500000');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
              Pemberdayaan Ummat Berbasis Masjid
            </span>
            <span className="text-xs font-arabic text-emerald-200">
              إنما يعمر مساجد الله من آمن بالله واليوم الآخر
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Koperasi Masjid Islamicity: Gerakan Ekonomi Jamaah
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl mt-1 leading-relaxed">
            Menjadikan masjid sebagai pusat peradaban ekonomi umat melalui pengadaan modal kelompok usaha, infrastruktur santri, bridging modal bisnis, dan tabungan qurban berdaya.
          </p>
        </div>

        {/* Telegram GreatMall Channel Link */}
        <a
          href="https://t.me/GreatMallIslamicity"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Join @GreatMall Islamicity on Telegram</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Real-time VotingModule Component */}
      <VotingModule
        member={member}
        ratVotes={ratVotes}
        onCastVote={handleCastVote}
        onOpenFullRatSession={() => setActiveSubTab('rat_voting')}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('packages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'packages'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pilihan Paket Registrasi Keanggotaan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('qs865')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'qs865'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Formasi Jamaah Berlipat (QS 8:65)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rat_voting')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'rat_voting'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Vote className="w-4 h-4 text-amber-300" />
          <span>E-Voting RAT & Alokasi Dana Sosial</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">
            {ratVotes.filter(v => v.status === 'Aktif Voting').length} Aktif
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('infaq_voucher')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'infaq_voucher'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Infaq Dana Sosial & Voucher Haji/Property</span>
        </button>

        <button
          onClick={() => setActiveSubTab('special_programs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'special_programs'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Program Qurban, Realty & Investasi</span>
        </button>
      </div>

      {/* Subtab 1: Registration Packages & Commitment Options */}
      {activeSubTab === 'packages' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Formulir & Pilihan Komitmen Anggota Koperasi Masjid
            </h3>
            <p className="text-xs text-slate-500">
              Pilih paket simpanan awal yang sesuai dengan kemampuan Anda. Simpanan pokok dan wajib dikelola murni tanpa riba dan membuahkan SHU berkah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_REGISTRATION_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {pkg.name}
                    </span>
                    {pkg.popular && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                        Paling Dipilih
                      </span>
                    )}
                  </div>

                  <div className="mt-2 mb-4">
                    <span className="text-[11px] text-slate-400 block font-semibold">Total Setoran Awal:</span>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      Rp {pkg.totalInitialAmount.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Pokok Rp {pkg.breakdown.simpananPokok.toLocaleString('id-ID')} + Wajib Rp {pkg.breakdown.simpananWajib.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setShowRegModal(true);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      pkg.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>Daftar Paket Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines on Being the Best Member */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Bagaimana Menjadi Anggota Koperasi Masjid yang Terbaik?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-600 block">1. Disiplin & Amanah Simpanan</span>
                <p className="text-[11px] leading-relaxed">
                  Membayar simpanan wajib tepat waktu setiap bulan demi menjaga likuiditas permodalan jamaah dan keberlangsungan usaha bersama.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-600 block">2. Belanja Berdaya di Pasar Rakyat</span>
                <p className="text-[11px] leading-relaxed">
                  Memprioritaskan belanja kebutuhan sembako rumah tangga dari lumbung petani binaan koperasi untuk memotong rantai rente.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-600 block">3. Siap Menjadi Pemimpin Pengurus</span>
                <p className="text-[11px] leading-relaxed">
                  Mengikuti kelas pelatihan sistem informasi, aktif memberi masukan pada RAT, dan mempersiapkan diri menjadi kader pengurus masa depan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: QS 8:65 Formasi Solidaritas Jamaah */}
      {activeSubTab === 'qs865' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900 via-slate-900 to-emerald-950 text-white shadow-lg space-y-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
              Tafsir Gerakan Ekonomi: QS Al-Anfal (8:65)
            </span>
            <p className="text-sm md:text-base font-arabic text-amber-200 leading-relaxed">
              يَٰٓأَيُّهَا ٱلنَّبِىُّ حَرِّضِ ٱلْمُؤْمِنِينَ عَلَى ٱلْقِتَالِ ۚ إِن يَكُن مِّنكُمْ عِشْرُونَ صَٰبِرُونَ يَغْلِبُوا۟ مِا۟ئَتَيْنِ ۚ وَإِن يَكُن مِّنكُم مِّا۟ئَةٌ يَغْلِبُوٓا۟ أَلْفًا
            </p>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              &quot;...Jika ada dua puluh orang yang sabar di antara kamu, niscaya mereka akan dapat mengalahkan dua ratus orang... Dan jika ada seratus orang yang sabar di antara kamu, niscaya mereka akan dapat mengalahkan seribu orang...&quot;
            </p>
            <div className="pt-2 text-xs text-amber-300">
              Prinsip 1:10 — Kekuatan Jamaah dalam Jumlah yang Sedikit tapi Berdisiplin, Solid, dan Berpegang pada Nilai Syariah Mampu Melipatgandakan Dampak Modal 10x Lipat!
            </div>
          </div>

          {/* Formations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_QS865_FORMATIONS.map((form, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFormationIdx(idx)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedFormationIdx === idx
                    ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 ring-2 ring-amber-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {form.formationLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    Rasio 1 : {form.multiplierCapacityRatio}
                  </span>
                </div>

                <div className="my-3 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">Kapasitas Modal Terhimpun:</span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                    Rp {form.currentRealizedCapital.toLocaleString('id-ID')}
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(form.currentRealizedCapital / form.targetCapitalTotal) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Target: Rp {form.targetCapitalTotal.toLocaleString('id-ID')}</span>
                    <span>{form.businessesEmpowered} Usaha Terberdayakan</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {form.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Leverage Simulator */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Simulasi Daya Saing: Mengapa Jamaah Sedikit Bisa Mengungguli Korporasi Rente?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                <span className="font-bold text-rose-700 dark:text-rose-400 block">Sistem Konvensional / Tengkulak</span>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Beban bunga pinjaman majemuk 20-30% mencekik petani.</li>
                  <li>Biaya perantara berlapis memotong margin produsen desa.</li>
                  <li>Kurangnya rasa memiliki (transaksional murni tanpa persaudaraan).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">Model Formasi Koperasi Jamaah (QS 8:65)</span>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>0% Bunga & Denda: Berbagi hasil adil (Mudharabah/Musyarakah).</li>
                  <li>Takaful & Jaminan Moral: Anggota saling mengawasi dan menolong.</li>
                  <li>Pasar Terjamin: Anggota jamaah adalah pemilik sekaligus konsumen setia.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab: Komponen Modul Voting Interaktif Real-Time RAT & Alokasi Dana Sosial */}
      {activeSubTab === 'rat_voting' && (
        <RatLiveVotingModule
          member={member}
          initialTopics={ratVotes}
          onCastVote={handleCastVote}
          onSubmitProposal={(prop) => {
            const newTopic: RatVoteTopic = {
              id: `RAT-USUL-${Date.now().toString().slice(-4)}`,
              title: prop.title,
              category: prop.category,
              description: prop.description,
              deadline: '15 November 2026 (Tahap Musyawarah Awal)',
              totalVotes: 1,
              quorumRequirement: 'Minimum 50% + 1 Anggota Aktif (215 Suara)',
              quorumReached: false,
              status: 'Aktif Voting',
              cryptographicAuditProof: `SHA256_PROPOSAL_${member.id}_${Date.now()}`,
              options: [
                {
                  id: `OPT-${Date.now()}-A`,
                  label: 'Setuju dengan Usulan Program Jamaah',
                  description: 'Mendukung implementasi program dalam rencana anggaran RAT.',
                  votesCount: 1,
                  percentage: 100,
                },
                {
                  id: `OPT-${Date.now()}-B`,
                  label: 'Perlu Kajian Ulang & Studi Kelayakan',
                  description: 'Meminta Dewan Pengawas Syariah melakukan telaah risiko.',
                  votesCount: 0,
                  percentage: 0,
                },
              ],
              userVotedOptionId: `OPT-${Date.now()}-A`,
            };

            setRatVotes([newTopic, ...ratVotes]);
            setVoteSuccessMsg('Usulan musyawarah Anda berhasil diajukan ke sidang pleno RAT Koperasi!');
            setTimeout(() => setVoteSuccessMsg(null), 3000);
          }}
          onOpenBiometric={() => {}}
        />
      )}

      {/* Subtab 3: Infaq Dana Sosial & Voucher Souvenir */}
      {activeSubTab === 'infaq_voucher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donation Form */}
            <div className="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Tunaikan Infaq Dana Sosial Masjid
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap infaq berhadiah souvenir Voucher Belanja Haji / Properti Syariah di global.property.islamicity.tv
                </p>
              </div>

              <form onSubmit={handleInfaqSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Pilih Masjid Sasaran
                  </label>
                  <select
                    value={infaqTargetMosque}
                    onChange={(e) => setInfaqTargetMosque(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Masjid Raya Islamicity Sentral">Masjid Raya Islamicity Sentral</option>
                    <option value="Masjid Al-Barokah Cipanas">Masjid Al-Barokah Cipanas</option>
                    <option value="Masjid Mujahidin Boyolali">Masjid Mujahidin Boyolali</option>
                    <option value="Masjid Al-Ittihad Brebes">Masjid Al-Ittihad Brebes</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Alokasi Manfaat Infaq
                  </label>
                  <select
                    value={infaqAllocation}
                    onChange={(e) => setInfaqAllocation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Infrastruktur Masjid">Infrastruktur & Renovasi Masjid</option>
                    <option value="Modal Usaha Jamaah">Modal Kelompok Usaha Mikro Jamaah</option>
                    <option value="Bridging Finance">Bridging Finance Pengadaan Komoditas</option>
                    <option value="Beasiswa Santri">Beasiswa Pendidikan Anak Petani</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nominal Infaq (Rp)
                  </label>
                  <input
                    type="text"
                    value={infaqAmount}
                    onChange={(e) => setInfaqAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                  <span className="font-bold block mb-0.5">Souvenir Apresiasi Langsung:</span>
                  Dapatkan kode voucher diskon belanja kavling hunian syariah atau paket haji/umroh senilai hingga Rp 2.500.000!
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Kirim Infaq & Ambil Voucher</span>
                </button>
              </form>
            </div>

            {/* List of Issued Vouchers & History */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Sertifikat & Voucher Belanja Haji / Property Anda
                </h3>
                <p className="text-xs text-slate-500">
                  Dapat digunakan di ekosistem global: <a href="http://global.property.islamicity.tv" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">global.property.islamicity.tv</a>
                </p>
              </div>

              <div className="space-y-3">
                {infaqHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-600 text-white">
                          {item.voucherCode}
                        </span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">
                          Nilai: {item.voucherValue}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {item.voucherDescription}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Infaq: Rp {item.amount.toLocaleString('id-ID')} • {item.targetMosque} ({item.allocatedFor}) • {item.date}
                      </p>
                    </div>

                    <a
                      href="http://global.property.islamicity.tv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-50 flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
                    >
                      <span>Klaim di Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Program Qurban, Realty & Investasi Syariah */}
      {activeSubTab === 'special_programs' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Katalog Investasi Riil & Program Strategis Koperasi Masjid
            </h3>
            <p className="text-xs text-slate-500">
              Peluang diversifikasi tabungan halal jamaah ke sektor riil bernilai tambah tinggi: peternakan qurban, hunian properti, emas murni, dan reksadana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_SPECIAL_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 overflow-hidden relative">
                    <img
                      src={prog.imageUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white">
                      {prog.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {prog.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Plafond / Harga:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Rp {prog.priceOrPlafond.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <span>Imbal / Manfaat:</span>
                        <span>{prog.returnOrBenefit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => onEnrollSpecialProgram(prog)}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Daftar Program Ini
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pendaftaran Anggota: {selectedPackage.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Total Setoran Awal: Rp {selectedPackage.totalInitialAmount.toLocaleString('id-ID')} (Terenkripsi E2EE)
            </p>

            {regSuccessMessage ? (
              <div className="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                {regSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Lengkap (Sesuai KTP)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: H. Fulan bin Fulan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor WhatsApp / Ponsel
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Masjid / Komunitas Domisili
                  </label>
                  <input
                    type="text"
                    value={villageMosque}
                    onChange={(e) => setVillageMosque(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                  Dengan mendaftar, Anda menyetujui AD/ART Koperasi Masjid Islamicity, kesediaan menabung tepat waktu, dan berpartisipasi aktif dalam memajukan ekonomi jamaah.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                  >
                    Konfirmasi & Daftarkan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
