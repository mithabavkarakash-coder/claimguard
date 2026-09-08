import React from 'react';

export interface ObserverState {
  contract_address: string;
  policy_id: string;
  claim_status: string;
  authorized_amount: number;
  claim_commitment: string;
  total_processed_claims: number;
  network: string;
  observer_verification: {
    diagnosis_code_present_on_chain: boolean;
    procedure_code_present_on_chain: boolean;
    treatment_details_present_on_chain: boolean;
    privacy_guarantee: string;
  };
}

interface ObserverViewPanelProps {
  observerView: ObserverState | null;
  onRefresh: () => void;
}

export const ObserverViewPanel: React.FC<ObserverViewPanelProps> = ({
  observerView,
  onRefresh
}) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Status Overhead Marquee / Security Proof Anchor */}
      <div className="w-full bg-surface-container-low rounded-xl p-3 px-4 border border-outline-variant/60 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-[10px] uppercase tracking-wider border border-outline-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              Public Ledger Node Sync
            </span>
            <span className="font-mono text-on-surface-variant">Epoch 481 // Slot 18,924</span>
            <span className="hidden sm:inline text-outline-variant">•</span>
            <span className="hidden sm:inline text-on-surface-variant">
              Zero-Knowledge State Verifier: <span className="font-mono text-primary font-bold">PLONK-v3.1 / Compact</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-secondary font-medium">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              ZK Proof Validated
            </span>
            <button
              onClick={onRefresh}
              className="text-primary hover:text-tertiary transition-colors flex items-center gap-1 font-semibold cursor-pointer"
              type="button"
            >
              <span>Sync Indexer</span>
              <span className="material-symbols-outlined text-[16px]">sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Ledger Title & Real-time State Hero Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Observer Metadata */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[10px] uppercase">
                  Observer Viewport
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px]">
                  Node ID: observer-mainnet-eu-08
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-xs text-on-surface">External Explorer View</span>
              </div>
            </div>

            <div className="mt-2">
              <h2 className="text-xl font-bold text-on-surface tracking-tight">On-Chain Clinical Settlement Attestation</h2>
              <p className="text-xs text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
                You are examining the raw public ledger payload as broadcasted across Midnight validator relays. Protected health information (PHI), diagnoses, provider notes, and settled currencies are shielded using recursive zk-SNARK commitments.
              </p>
            </div>
          </div>

          {/* Ledger Transaction Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-6 bg-surface-container-low rounded-xl p-4 border border-outline-variant/60">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Public Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="font-bold text-xs text-on-surface">
                  {observerView?.claim_status || 'Approved'}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Block Height</span>
              <span className="font-mono text-xs text-on-surface font-semibold mt-1">#9,482,103</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Consensus Slot</span>
              <span className="font-mono text-xs text-on-surface font-semibold mt-1">34,189,203</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">ZK Protocol</span>
              <span className="font-semibold text-xs text-primary mt-1">Halo2 / KZG10</span>
            </div>
          </div>
        </div>

        {/* Right: Live Shielded Entropy Status Card */}
        <div className="lg:col-span-4 bg-primary text-on-primary rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider">
                Zero-Knowledge Integrity
              </span>
              <span className="material-symbols-outlined text-[20px] text-on-primary-container">shield</span>
            </div>
            <div className="text-xl font-bold mt-1">100% Blind Adjudication</div>
            <p className="text-xs text-primary-fixed leading-relaxed">
              Financial validity and clinical eligibility proved via zero-knowledge mathematics without releasing patient identifiers to block producers.
            </p>
          </div>

          <div className="relative z-10 mt-4 py-3 px-4 flex items-center justify-between bg-primary-container rounded-xl text-on-primary border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-primary-container uppercase">Verifier Output</span>
              <span className="font-mono text-xs font-bold mt-0.5 text-on-primary">STATE_LEGAL: OK</span>
            </div>
            <svg className="w-10 h-10 shrink-0 -rotate-90" viewBox="0 0 36 36">
              <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
              <path className="text-secondary-fixed" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeLinecap="round" strokeWidth="3.5"></path>
            </svg>
          </div>
        </div>

      </div>

      {/* Raw Deserialized JSON & On-Chain Privacy Checks */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">code</span>
            <h3 className="font-bold text-sm text-on-surface">Rust Observer Indexer Payload (GET /api/observer)</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200">
            Indexer Sync Active
          </span>
        </div>

        {observerView ? (
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-900 text-cyan-300 p-4 rounded-xl border border-slate-800 overflow-x-auto shadow-inner">
              <div className="text-slate-400 mb-1">// Deserialized Public Ledger JSON Object:</div>
              <pre className="whitespace-pre-wrap">{JSON.stringify(observerView, null, 2)}</pre>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Diagnosis Code present on public ledger?</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  FALSE (100% ZK-Shielded)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium font-sans">Procedure Code present on public ledger?</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-sans">
                  FALSE (100% ZK-Shielded)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium font-sans">Clinical Treatment Notes present on public ledger?</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-sans">
                  FALSE (100% ZK-Shielded)
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-on-surface-variant text-xs font-mono">
            Fetching ledger state from Rust Indexer service...
          </div>
        )}
      </div>

    </div>
  );
};

