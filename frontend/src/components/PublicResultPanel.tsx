import React, { useState } from 'react';

interface ClaimResultData {
  status: 'Approved' | 'Rejected';
  authorizedAmount: number;
  commitment: string;
  txHash: string;
  timestamp: string;
}

interface PublicResultPanelProps {
  claimResult: ClaimResultData | null;
  diagnosisCode: string;
}

export const PublicResultPanel: React.FC<PublicResultPanelProps> = ({
  claimResult,
  diagnosisCode
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col gap-6">
      
      {/* Top Header & Identification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-mono text-xs font-semibold">
              #CLM-88392-MIDNIGHT
            </span>
            <span className="font-mono text-xs text-on-surface-variant">Epoch 492 • Slot 812,044</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">Public Claim Attestation State</h2>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface transition-colors shadow-sm text-xs font-semibold cursor-pointer self-start sm:self-auto border border-outline-variant/40"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {copied ? 'check' : 'share'}
          </span>
          <span>{copied ? 'Proof Link Copied!' : 'Share Proof State'}</span>
        </button>
      </div>

      {/* Verified Public State Card */}
      {claimResult ? (
        <div className="w-full bg-surface-container-low rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-container via-primary to-primary-container"></div>
          
          <div className="flex flex-col items-center justify-center gap-6 my-2">
            {/* Status Badge */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Circuit Validation Outcome
              </span>

              {claimResult.status === 'Approved' ? (
                <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                  <span className="text-lg md:text-xl font-extrabold tracking-tight">Status: Approved / Settled</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 shadow-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                  </span>
                  <span className="text-lg md:text-xl font-extrabold tracking-tight">Status: Rejected</span>
                </div>
              )}
            </div>

            <div className="w-16 h-0.5 bg-outline-variant rounded-full"></div>

            {/* Authorized Payout Amount */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Authorized Payout Amount
              </span>
              <div className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight font-tnum">
                ${claimResult.authorizedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-surface-container-low rounded-2xl p-8 border border-outline-variant text-center">
          <span className="material-symbols-outlined text-[36px] text-outline mb-2">pending_actions</span>
          <div className="text-sm font-semibold text-on-surface-variant">No claim submitted in current session</div>
          <p className="text-xs text-outline mt-1">Submit the clinical claim form to generate ZK proof and view on-chain state.</p>
        </div>
      )}

      {/* Transaction & Commitment Metadata */}
      {claimResult && (
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-2 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-on-surface-variant">Claim Commitment Hash:</span>
            <span className="text-primary font-bold break-all">{claimResult.commitment}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-on-surface-variant">Transaction Hash:</span>
            <span className="text-secondary font-semibold break-all">{claimResult.txHash}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-outline-variant/40 font-sans">
            <span className="text-on-surface-variant">Timestamp:</span>
            <span className="text-on-surface font-semibold">{claimResult.timestamp}</span>
          </div>
        </div>
      )}

      {/* Explicit Privacy Reinforcement Notice */}
      <div className="bg-surface-container-high/60 border border-outline-variant rounded-xl p-4 flex items-start gap-3 text-xs">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">lock</span>
        <p className="text-on-surface-variant leading-relaxed">
          <strong className="text-on-surface">Privacy Guarantee Enforced:</strong> Private witness inputs (Diagnosis Code <span className="font-mono text-primary font-bold">#{diagnosisCode}</span> and Attending Clinical Notes) are <span className="underline decoration-primary font-medium">never stored or broadcasted on-chain</span>. Only the boolean verification result and authorized payout amount are recorded on the public ledger.
        </p>
      </div>

    </div>
  );
};

