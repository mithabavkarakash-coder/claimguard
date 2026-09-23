import React, { useState } from 'react';

interface AnalyticsDashboardPanelProps {
  currentClaim?: {
    status: 'Approved' | 'Rejected';
    authorizedAmount: number;
    commitment: string;
    txHash: string;
    timestamp: string;
  } | null;
  walletAddress?: string;
  nightBalance?: string;
}

export const AnalyticsDashboardPanel: React.FC<AnalyticsDashboardPanelProps> = ({
  currentClaim,
  walletAddress = 'addr1q8x94ed3920akslw02948271038102938472901847102938479x4e',
  nightBalance = '₳ 1,420.50 ADA / 1,450.00 tNIGHT'
}) => {
  const [viewRole, setViewRole] = useState<'provider' | 'patient'>('provider');

  // Base metrics calculated dynamically
  const authorizedSum = 5050 + (currentClaim?.status === 'Approved' ? currentClaim.authorizedAmount : 0);
  const totalClaimsCount = 18 + (currentClaim ? 1 : 0);
  const approvalRate = 94.4;

  // Monthly trends data
  const monthlyData = [
    { month: 'Jan', approved: 12400, rejected: 1200 },
    { month: 'Feb', approved: 15800, rejected: 800 },
    { month: 'Mar', approved: 14200, rejected: 1500 },
    { month: 'Apr', approved: 18900, rejected: 900 },
    { month: 'May', approved: 21500, rejected: 1100 },
    { month: 'Jun', approved: authorizedSum + 18500, rejected: 600 }
  ];

  // Procedure categories
  const procedureCategories = [
    { name: 'Cardiology (CPT 101)', amount: 14500, count: 6, percentage: 38, color: 'bg-primary' },
    { name: 'Laboratory (CPT 102)', amount: 8200, count: 8, percentage: 22, color: 'bg-secondary' },
    { name: 'Radiology (CPT 103)', amount: 9800, count: 4, percentage: 26, color: 'bg-tertiary' },
    { name: 'Outpatient Care (CPT 104)', amount: 5400, count: 3, percentage: 14, color: 'bg-outline' }
  ];

  const patientDeductibleSpent = 2450 + (currentClaim?.status === 'Approved' ? currentClaim.authorizedAmount : 0);
  const patientDeductibleLimit = 5000;
  const deductiblePercent = Math.min(100, Math.round((patientDeductibleSpent / patientDeductibleLimit) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">insights</span>
            <span>Real-Time ZK Settlement Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            {viewRole === 'provider' ? 'Healthcare Provider Settlement Dashboard' : 'Policyholder Benefits & Claims Portal'}
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl mt-1">
            {viewRole === 'provider'
              ? 'Institutional metrics tracking zero-knowledge claim adjudication, CPT procedure volume, and reimbursement velocity on the Midnight Network.'
              : 'Personal health insurance dashboard for tracking annual deductible limits, out-of-pocket savings, and shielded Midnight testnet balances.'}
          </p>
        </div>

        {/* Toggle Switcher */}
        <div className="flex items-center bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/60 self-start sm:self-auto">
          <button
            onClick={() => setViewRole('provider')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewRole === 'provider'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_hospital</span>
            <span>Provider View</span>
          </button>
          <button
            onClick={() => setViewRole('patient')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewRole === 'patient'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">person</span>
            <span>Patient View</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Payouts */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">
              {viewRole === 'provider' ? 'Total Settled Payouts' : 'Reimbursed Benefits'}
            </span>
            <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg text-lg">
              payments
            </span>
          </div>
          <div className="text-2xl font-black text-on-surface font-tnum">
            ${authorizedSum.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12.4% vs last period</span>
          </div>
        </div>

        {/* Card 2: ZK Adjudication Rate */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">ZK Adjudication Rate</span>
            <span className="material-symbols-outlined text-secondary p-2 bg-secondary/10 rounded-lg text-lg">
              verified
            </span>
          </div>
          <div className="text-2xl font-black text-on-surface font-tnum">{approvalRate}%</div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-sm text-secondary">verified_user</span>
            <span>{totalClaimsCount} total claims evaluated off-chain</span>
          </div>
        </div>

        {/* Card 3: Deductible / Latency */}
        {viewRole === 'provider' ? (
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Adjudication Time</span>
              <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary/10 rounded-lg text-lg">
                bolt
              </span>
            </div>
            <div className="text-2xl font-black text-on-surface font-tnum">1.82 seconds</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="material-symbols-outlined text-sm">speed</span>
              <span>Groth16 zk-SNARK prove time</span>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider">Annual Deductible</span>
              <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary/10 rounded-lg text-lg">
                pie_chart
              </span>
            </div>
            <div className="text-2xl font-black text-on-surface font-tnum">
              ${patientDeductibleSpent.toLocaleString()} / ${patientDeductibleLimit.toLocaleString()}
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-tertiary h-full rounded-full transition-all duration-500"
                style={{ width: `${deductiblePercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Card 4: Wallet & Shielded State */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">Shielded Wallet Asset</span>
            <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg text-lg">
              account_balance_wallet
            </span>
          </div>
          <div className="text-sm font-bold text-on-surface font-mono truncate">{nightBalance}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-mono truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{walletAddress.slice(0, 16)}...</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Charts & Categorization (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Monthly Settlement Trends Bar Chart */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-on-surface">Monthly Settlement Volume ($ USD)</h3>
                <p className="text-xs text-on-surface-variant">
                  Zero-Knowledge verified claim approvals vs. rejected attempts by month.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary"></span>
                  <span>Approved Payouts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-outline/40"></span>
                  <span>Rejected / Disallowed</span>
                </div>
              </div>
            </div>

            {/* Custom Tailwind Bar Chart */}
            <div className="pt-6 pb-2 grid grid-cols-6 gap-3 md:gap-6 items-end h-56 border-b border-outline-variant/60">
              {monthlyData.map((d, i) => {
                const maxVal = 25000;
                const approvedHeight = (d.approved / maxVal) * 100;
                const rejectedHeight = (d.rejected / maxVal) * 100;

                return (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full px-1">
                      {/* Approved Bar */}
                      <div
                        className="w-full max-w-[24px] bg-primary rounded-t-md transition-all group-hover:bg-primary/80 relative"
                        style={{ height: `${approvedHeight}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] py-0.5 px-1.5 rounded font-mono font-bold whitespace-nowrap z-10">
                          ${(d.approved / 1000).toFixed(1)}k
                        </div>
                      </div>
                      {/* Rejected Bar */}
                      <div
                        className="w-full max-w-[12px] bg-outline/40 rounded-t-md transition-all group-hover:bg-outline/60"
                        style={{ height: `${rejectedHeight}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant font-mono">{d.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant font-mono pt-1">
              <span>Period: Jan 2026 - Jun 2026</span>
              <span>Network: Midnight Preprod (Chain ID: 0x02a7)</span>
            </div>
          </div>

          {/* Procedure Category Breakdown */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-surface">Reimbursement by CPT Procedure Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {procedureCategories.map((cat, idx) => (
                <div key={idx} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></span>
                      {cat.name}
                    </span>
                    <span className="font-mono">${cat.amount.toLocaleString()} USD</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className={`${cat.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                    <span>{cat.count} Processed Claims</span>
                    <span>{cat.percentage}% of Total Volume</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Privacy Model & Live Stream (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Policyholder Coverage Summary (Patient view mode enhancement) */}
          {viewRole === 'patient' && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-tertiary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">health_and_safety</span>
                <span>Policy Benefits Status</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">Midnight Aegis Health Plan #2026</h4>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                  <span className="text-on-surface-variant">Annual Deductible Limit</span>
                  <span className="font-bold text-on-surface font-tnum">$5,000.00 USD</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                  <span className="text-on-surface-variant">Met to Date</span>
                  <span className="font-bold text-tertiary font-tnum">${patientDeductibleSpent.toLocaleString()}.00 USD</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-outline-variant/40">
                  <span className="text-on-surface-variant">Remaining Out-of-Pocket</span>
                  <span className="font-bold text-emerald-600 font-tnum">
                    ${Math.max(0, patientDeductibleLimit - patientDeductibleSpent).toLocaleString()}.00 USD
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Co-Insurance Coverage</span>
                  <span className="font-bold text-on-surface font-tnum">80% In-Network / 20% Patient</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent ZK Attestation Stream */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Recent ZK Proof Attestations</h3>
                <p className="text-[11px] text-on-surface-variant">Live Midnight Preprod chain verification log.</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-3">
              {/* Latest Real Claim if exists */}
              {currentClaim && (
                <div className="p-3 bg-primary/5 border border-primary/30 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      {currentClaim.status}
                    </span>
                    <span className="font-mono text-[10px] text-on-surface-variant">{currentClaim.timestamp}</span>
                  </div>
                  <div className="font-mono text-[11px] text-on-surface truncate">
                    Commitment: {currentClaim.commitment.slice(0, 20)}...
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>Authorized: ${currentClaim.authorizedAmount} USD</span>
                    <span className="text-emerald-600 font-semibold">Zero-Knowledge Validated</span>
                  </div>
                </div>
              )}

              {/* Historical Mock Log Records */}
              <div className="p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Approved
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">20:45:10</span>
                </div>
                <div className="font-mono text-[11px] text-on-surface truncate">
                  Commitment: 0x7f8e9d0c1b2a3f4e56789012...
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>Authorized: $850 USD</span>
                  <span className="text-on-surface-variant">CPT 102 Lab Diagnostics</span>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    Rejected
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">19:30:05</span>
                </div>
                <div className="font-mono text-[11px] text-on-surface truncate">
                  Commitment: 0x3a4b5c6d7e8f90123456789a...
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>Authorized: $0 USD</span>
                  <span className="text-rose-500 font-medium">Exceeds Limit / Disallowed</span>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Approved
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">18:15:40</span>
                </div>
                <div className="font-mono text-[11px] text-on-surface truncate">
                  Commitment: 0x918273645543210f89012345...
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>Authorized: $1,750 USD</span>
                  <span className="text-on-surface-variant">CPT 103 Radiology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
