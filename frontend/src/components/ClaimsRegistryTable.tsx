import React, { useState } from 'react';

export type ClaimStatusType = 'Approved' | 'Rejected' | 'Pending' | 'Submitted' | 'Under Review';

export interface ClaimRegistryRecord {
  id: string;
  policyId: string;
  procedureCode: string;
  amount: number;
  status: ClaimStatusType;
  commitment: string;
  txHash: string;
  timestamp: string;
  walletAddress: string;
}

interface ClaimsRegistryTableProps {
  currentClaim: {
    status: 'Approved' | 'Rejected';
    authorizedAmount: number;
    commitment: string;
    txHash: string;
    timestamp: string;
  } | null;
}

export const ClaimsRegistryTable: React.FC<ClaimsRegistryTableProps> = ({ currentClaim }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const initialRecords: ClaimRegistryRecord[] = [
    {
      id: "CLM-88392-MIDNIGHT",
      policyId: "0x535043...563130",
      procedureCode: "101 (CPT Cardiology)",
      amount: currentClaim?.authorizedAmount ?? 2450,
      status: currentClaim?.status ?? "Approved",
      commitment: currentClaim?.commitment ? `${currentClaim.commitment.slice(0, 14)}...` : "0xa1b2c3d4e5f67890...",
      txHash: currentClaim?.txHash ? `${currentClaim.txHash.slice(0, 14)}...` : "0x8f7a9b0c1d2e3f4a...",
      timestamp: currentClaim?.timestamp ?? "21:02:12",
      walletAddress: "addr1q8x94ed3...8479x4e"
    },
    {
      id: "CLM-88391-MIDNIGHT",
      policyId: "0x414547...475541",
      procedureCode: "102 (CPT Lab)",
      amount: 850,
      status: "Approved",
      commitment: "0x7f8e9d0c1b2a3f4e...",
      txHash: "0x4a5b6c7d8e9f0a1b...",
      timestamp: "20:45:10",
      walletAddress: "addr1q9y85fe4...9580y5f"
    },
    {
      id: "CLM-88390-MIDNIGHT",
      policyId: "0x323032...484541",
      procedureCode: "999 (Uncovered Elective)",
      amount: 0,
      status: "Rejected",
      commitment: "0x3a4b5c6d7e8f9012...",
      txHash: "0x1b2c3d4e5f6a7b8c...",
      timestamp: "19:30:05",
      walletAddress: "addr1q8x94ed3...8479x4e"
    },
    {
      id: "CLM-88389-MIDNIGHT",
      policyId: "0x535043...563130",
      procedureCode: "103 (CPT Radiology)",
      amount: 1750,
      status: "Approved",
      commitment: "0x918273645543210f...",
      txHash: "0xd0e1f2a3b4c5d6e7...",
      timestamp: "18:15:40",
      walletAddress: "addr1q7w65ed2...7369z3d"
    }
  ];

  const filteredRecords = initialRecords.filter((rec) => {
    const matchesSearch = 
      rec.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.policyId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.procedureCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.walletAddress.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || rec.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ClaimStatusType) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejected
          </span>
        );
      case 'Pending':
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {status}
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Submitted
          </span>
        );
      default:
        return null;
    }
  };

  const totalSettledAmount = filteredRecords
    .filter(r => r.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-5">
      {/* Table Title & Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">dataset</span>
            <h2 className="text-lg font-bold text-on-surface">Institutional Claims Registry</h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Immutable record of zero-knowledge adjudicated claim settlements with verified state on Midnight Preprod.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200/70 shadow-2xs self-start sm:self-auto">
          <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-700">Settled Total:</span>
          <span className="font-mono text-sm font-bold text-emerald-900 font-tnum">${totalSettledAmount.toLocaleString()} USD</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by Claim ID, Policy ID, or Wallet..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/60 self-start sm:self-auto">
          {['ALL', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-surface-container-lowest text-primary shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/60">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="p-3.5">Claim ID</th>
              <th className="p-3.5">Policy ID</th>
              <th className="p-3.5">Procedure Code</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Authorized Payout</th>
              <th className="p-3.5">Commitment Hash</th>
              <th className="p-3.5">Tx Hash</th>
              <th className="p-3.5">Wallet Address</th>
              <th className="p-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 bg-surface-container-lowest">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-primary">{rec.id}</td>
                  <td className="p-3.5 font-mono text-on-surface-variant text-[11px]">{rec.policyId}</td>
                  <td className="p-3.5 font-medium text-on-surface">{rec.procedureCode}</td>
                  <td className="p-3.5">{getStatusBadge(rec.status)}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-on-surface font-tnum">
                    ${rec.amount.toLocaleString()} USD
                  </td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <span>{rec.commitment}</span>
                      <button
                        onClick={() => handleCopy(rec.commitment, `cm-${rec.id}`)}
                        className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                        title="Copy Commitment Hash"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedField === `cm-${rec.id}` ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-secondary text-[11px]">
                    <a
                      href={`https://preprod.midnight.network/tx/${rec.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>{rec.txHash}</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </td>
                  <td className="p-3.5 font-mono text-on-surface-variant text-[11px]">{rec.walletAddress}</td>
                  <td className="p-3.5 text-on-surface-variant whitespace-nowrap text-[11px] font-mono">{rec.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-slate-300 text-3xl">filter_alt_off</span>
                    <p className="text-xs font-medium">No matching claim records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

