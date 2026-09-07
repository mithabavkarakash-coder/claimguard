import React from 'react';

interface ClaimSubmissionFormProps {
  policyId: string;
  setPolicyId: (val: string) => void;
  diagnosisCode: string;
  setDiagnosisCode: (val: string) => void;
  procedureCode: string;
  setProcedureCode: (val: string) => void;
  claimAmount: string;
  setClaimAmount: (val: string) => void;
  deductibleLimit: string;
  setDeductibleLimit: (val: string) => void;
  treatmentNotes: string;
  setTreatmentNotes: (val: string) => void;
  isSubmitting: boolean;
  executionStep: string | null;
  walletConnected: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ClaimSubmissionForm: React.FC<ClaimSubmissionFormProps> = ({
  policyId,
  setPolicyId,
  diagnosisCode,
  setDiagnosisCode,
  procedureCode,
  setProcedureCode,
  claimAmount,
  setClaimAmount,
  deductibleLimit,
  setDeductibleLimit,
  treatmentNotes,
  setTreatmentNotes,
  isSubmitting,
  executionStep,
  walletConnected,
  onSubmit
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.02)]">
      <form className="space-y-6" onSubmit={onSubmit}>
        
        {/* Field 0: Policy ID (Public Attribute) */}
        <div className="space-y-1">
          <label className="flex items-center justify-between font-semibold text-xs text-on-surface" htmlFor="policy-id">
            <span>Policy Identifier (Public Ledger Attribute)</span>
            <span className="text-on-surface-variant text-[11px]">SPC Core Contract</span>
          </label>
          <input
            id="policy-id"
            type="text"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            className="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            required
          />
        </div>

        {/* Field 1: Procedure Code */}
        <div className="space-y-1">
          <label className="flex items-center justify-between font-semibold text-xs text-on-surface" htmlFor="procedure-code">
            <span>Standardized Procedure Code (CPT / HCPCS)</span>
            <span className="text-on-surface-variant text-[11px]">Public Ledger Attribute</span>
          </label>
          <div className="relative">
            <select
              id="procedure-code"
              value={procedureCode}
              onChange={(e) => setProcedureCode(e.target.value)}
              className="w-full h-11 appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-4 font-sans text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all cursor-pointer pr-10"
            >
              <option value="101">CPT 101 - General Cardiology Consultation (Allowed)</option>
              <option value="102">CPT 102 - Comprehensive Diagnostic Lab (Allowed)</option>
              <option value="103">CPT 103 - CT Head / Radiology (Allowed)</option>
              <option value="104">CPT 104 - Preventive Screening (Allowed)</option>
              <option value="201">CPT 201 - Outpatient Rehabilitation (Allowed)</option>
              <option value="99214">CPT 99214 - Outpatient Visit Est Moderate 30-39 min</option>
              <option value="70450">CPT 70450 - CT Head/Brain without Contrast</option>
              <option value="999">CPT 999 - Uncovered Elective Procedure (Will Reject)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
              unfold_more
            </span>
          </div>
        </div>

        {/* Field 2 & Field 2b: Claim Amount & Deductible Limit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Claim Amount */}
          <div className="space-y-1">
            <label className="flex items-center justify-between font-semibold text-xs text-on-surface" htmlFor="claim-amount">
              <span>Total Claim Amount (USD)</span>
              <span className="text-on-surface-variant text-[11px]">Audited Numerical Value</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none">
                <span className="font-bold text-xs text-on-surface-variant">$</span>
              </div>
              <input
                id="claim-amount"
                type="number"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 pl-7 pr-24 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-[10px] uppercase bg-surface-container-low px-2 py-0.5 rounded">
                USD • Settlement
              </div>
            </div>
          </div>

          {/* Deductible Limit */}
          <div className="space-y-1">
            <label className="flex items-center justify-between font-semibold text-xs text-on-surface" htmlFor="deductible-limit">
              <span>Policy Deductible Limit ($)</span>
              <span className="text-on-surface-variant text-[11px]">Maximum Coverage</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none">
                <span className="font-bold text-xs text-on-surface-variant">$</span>
              </div>
              <input
                id="deductible-limit"
                type="number"
                value={deductibleLimit}
                onChange={(e) => setDeductibleLimit(e.target.value)}
                className="w-full h-11 pl-7 pr-12 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-[10px] uppercase bg-surface-container-low px-1.5 py-0.5 rounded">
                Cap
              </div>
            </div>
          </div>
        </div>

        {/* Field 3: Diagnosis Code (Masked / Private Witness) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1 font-semibold text-xs text-on-surface" htmlFor="diagnosis-code">
              <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
              <span>Clinical Diagnosis Coding (ICD-10-CM)</span>
            </label>
            <div className="flex items-center gap-1 bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-[12px]">security</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">ZK-Shielded Private Data</span>
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              id="diagnosis-code"
              type="text"
              value={diagnosisCode}
              onChange={(e) => setDiagnosisCode(e.target.value)}
              placeholder="e.g. 4201 (ICD-10)"
              className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              required
            />
            <div className="absolute right-3 flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">visibility_off</span>
              <span className="font-mono text-[11px] text-outline">HASH: 0x9B...D41E</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant flex items-center gap-1 pt-0.5">
            <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
            Diagnostic payload remains locally locked in your private witness. Only computational zero-knowledge proofs are generated during validation.
          </p>
        </div>

        {/* Field 4: Provider Clinical Notes */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-xs text-on-surface" htmlFor="provider-notes">
              Attending Physician Clinical Notes
            </label>
            <div className="flex items-center gap-1.5 bg-surface-container-high px-2 py-0.5 rounded-md border border-outline-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="text-[10px] font-bold text-on-secondary-container">
                Confidential & Zero-Knowledge Protected — Never stored in plaintext on-chain
              </span>
            </div>
          </div>
          <textarea
            id="provider-notes"
            rows={3}
            value={treatmentNotes}
            onChange={(e) => setTreatmentNotes(e.target.value)}
            placeholder="Enter medical narrative..."
            className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-sans text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-none"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
            <span>Proof verification cycle: ~1.2s (Groth16 / BLS12-381)</span>
          </div>
          
          <button
            id="submit-button"
            type="submit"
            disabled={isSubmitting || !walletConnected}
            className="w-full sm:w-auto min-w-[280px] h-12 flex items-center justify-center gap-2 px-6 bg-primary hover:bg-tertiary disabled:opacity-50 text-on-primary font-semibold text-xs rounded-lg shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>{executionStep || 'Executing Compact ZK Circuit...'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>Execute ZK Circuit & Submit Claim</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
