import React from 'react';

interface ClaimRegistryRecord {
  id: string;
  policyId: string;
  procedureCode: string;
  amount: number;
  status: 'Approved' | 'Rejected' | 'Pending';
  commitment: string;
  timestamp: string;
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
      amount: currentClaim?.authorizedAmount || 2450,
      status: currentClaim?.status || "Approved",
      commitment: currentClaim?.commitment.slice(0, 16) + "..." || "0xa1b2c3d4e5f67890...",
      timestamp: currentClaim?.timestamp || "21:02:12"
    },
    {
      id: "CLM-88391-MIDNIGHT",
      policyId: "0x414547...475541",
      procedureCode: "102 (CPT Lab)",
      amount: 850,
      status: "Approved",
      commitment: "0x7f8e9d0c1b2a3f4e...",
      timestamp: "20:45:10"
    },
    {
      id: "CLM-88390-MIDNIGHT",
      policyId: "0x323032...484541",
      procedureCode: "999 (Uncovered Elective)",
      amount: 0,
      status: "Rejected",
      commitment: "0x3a4b5c6d7e8f9012...",
      timestamp: "19:30:05"
    },
    {
      id: "CLM-88389-MIDNIGHT",
      policyId: "0x535043...563130",
      procedureCode: "103 (CPT Radiology)",
      amount: 1750,
      status: "Approved",
      commitment: "0x918273645543210f...",
      timestamp: "18:15:40"
    }
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/60 pb-3">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Institutional Claims Registry</h2>
          <p className="text-xs text-on-surface-variant">Immutable record of zero-knowledge adjudicated claim settlements.</p>
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
                  {rec.status === 'Approved' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                      Rejected
                    </span>
                  )}
                </td>
                <td className="p-3 text-right font-mono font-bold text-on-surface font-tnum">
                  ${rec.amount.toLocaleString()} USD
                </td>
                <td className="p-3 font-mono text-outline text-[11px]">{rec.commitment}</td>
                <td className="p-3 text-on-surface-variant">{rec.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
