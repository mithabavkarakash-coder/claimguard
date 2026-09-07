import React, { useState } from 'react';

interface SettlementLifecycleStepperProps {
  commitment: string;
  isSubmitting: boolean;
  status: 'Approved' | 'Rejected' | 'Pending';
}

export const SettlementLifecycleStepper: React.FC<SettlementLifecycleStepperProps> = ({
  commitment,
  isSubmitting,
  status
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCommitment = () => {
    navigator.clipboard.writeText(commitment);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="flex flex-col gap-6">
      {/* Cryptographic Ledger Pipeline Stepper */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
          <h3 className="font-semibold text-xs text-on-surface uppercase tracking-wider">
            Settlement Lifecycle
          </h3>
          <span className="text-[10px] font-bold uppercase bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
            Deterministic
          </span>
        </div>

        <div className="relative mt-6 pl-1">
          {/* Continuous Line */}
          <div className="absolute top-3 left-[15px] bottom-3 w-0.5 bg-outline-variant"></div>

          {/* Step 1: Adjudication */}
          <div className="relative flex items-start gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full ${isSubmitting ? 'bg-primary animate-pulse' : 'bg-primary'} text-on-primary flex items-center justify-center shrink-0 z-10 shadow-sm`}>
              <span className="material-symbols-outlined text-[16px]">rule</span>
            </div>
            <div className="flex flex-col pt-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-on-surface">Adjudication</span>
                <span className="text-[10px] text-primary uppercase font-bold">Active</span>
              </div>
              <span className="text-xs text-on-surface-variant">Synthesizing witness parameters</span>
              <span className="font-mono text-[11px] text-outline mt-0.5">Compact Circuit v0.14.2</span>
            </div>
          </div>

          {/* Step 2: Verification */}
          <div className="relative flex items-start gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full ${status !== 'Pending' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center shrink-0 z-10`}>
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="font-semibold text-xs text-on-surface-variant">Verification</span>
              <span className="text-xs text-outline">Multi-party recursive zk-proof check</span>
            </div>
          </div>

          {/* Step 3: Settlement */}
          <div className="relative flex items-start gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full ${status === 'Approved' ? 'bg-emerald-600 text-white' : status === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center shrink-0 z-10`}>
              <span className="material-symbols-outlined text-[16px]">account_balance</span>
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="font-semibold text-xs text-on-surface-variant">Settlement</span>
              <span className="text-xs text-outline">Midnight UTxO atomic clearing</span>
            </div>
          </div>

          {/* Step 4: On-Chain Attestation */}
          <div className="relative flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full ${status !== 'Pending' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center shrink-0 z-10`}>
              <span className="material-symbols-outlined text-[16px]">link</span>
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="font-semibold text-xs text-on-surface-variant">On-Chain Attestation</span>
              <span className="text-xs text-outline">Immutable ledger receipt issuance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Inset Well */}
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Witness Commitment
          </span>
          <button
            onClick={handleCopyCommitment}
            className="text-primary hover:text-tertiary text-[11px] font-mono flex items-center gap-1 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/60 font-mono text-[11px] text-on-surface break-all select-all">
          {commitment || '0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'}
        </div>
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
          <span>Compiler: Compact v0.14.2</span>
          <span>Blake2b Digest</span>
        </div>
      </div>

      {/* Clinical Privacy Guarantee Notice */}
      <div className="rounded-xl p-4 bg-surface-container-lowest border border-outline-variant flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">shield</span>
        <div className="space-y-1">
          <h4 className="font-semibold text-xs text-on-surface">HIPAA & GDPR Compliant Off-Chain Proofs</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Protected Health Information (PHI) is evaluated purely inside client-side zero-knowledge circuits. Decryption keys remain bound to authorized institutional custodians.
          </p>
        </div>
      </div>
    </aside>
  );
};
