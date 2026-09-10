import React from 'react';

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

  const getStatusBadge = (status: ClaimStatusType) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
            Rejected
          </span>
        );
      case 'Pending':
      case 'Under Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
            {status}
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
            Submitted
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/60 pb-3">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Institutional Claims Registry</h2>
          <p className="text-xs text-on-surface-variant">Immutable record of zero-knowledge adjudicated claim settlements with verified state on Midnight Preprod.</p>
        </div>
        <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-mono font-semibold rounded-full self-start sm:self-auto">
          Total Settled: ${initialRecords.filter(r => r.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} USD
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="p-3 rounded-l-lg">Claim ID</th>
              <th className="p-3">Policy ID</th>
              <th className="p-3">Procedure Code</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Authorized Payout</th>
              <th className="p-3">Commitment Hash</th>
              <th className="p-3">Tx Hash</th>
              <th className="p-3">Wallet Address</th>
              <th className="p-3 rounded-r-lg">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {initialRecords.map((rec) => (
              <tr key={rec.id} className="hover:bg-surface-container-low/60 transition-colors">
                <td className="p-3 font-mono font-bold text-primary">{rec.id}</td>
                <td className="p-3 font-mono text-on-surface-variant">{rec.policyId}</td>
                <td className="p-3 font-medium text-on-surface">{rec.procedureCode}</td>
                <td className="p-3">
                  {getStatusBadge(rec.status)}
                </td>
                <td className="p-3 text-right font-mono font-bold text-on-surface font-tnum">
                  ${rec.amount.toLocaleString()} USD
                </td>
                <td className="p-3 font-mono text-outline text-[11px]">{rec.commitment}</td>
                <td className="p-3 font-mono text-secondary text-[11px]">
                  <a
                    href={`https://preprod.midnight.network/tx/${rec.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{rec.txHash}</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </a>
                </td>
                <td className="p-3 font-mono text-on-surface-variant text-[11px]">{rec.walletAddress}</td>
                <td className="p-3 text-on-surface-variant whitespace-nowrap">{rec.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
