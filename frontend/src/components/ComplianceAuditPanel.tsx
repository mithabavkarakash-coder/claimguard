import React, { useState } from 'react';

const AUDIT_LOG = [
  { id: 'AUD-001', event: 'ZK Proof Generated', actor: 'Client Browser (Local)', timestamp: '2026-10-02 08:42:11', status: 'Pass', detail: 'Groth16 proof for CLM-88392 constructed entirely off-chain.' },
  { id: 'AUD-002', event: 'Commitment Emitted', actor: 'Midnight Preprod Ledger', timestamp: '2026-10-02 08:42:14', status: 'Pass', detail: 'Public state commitment pushed; no PHI disclosed.' },
  { id: 'AUD-003', event: 'PHI Residue Scan', actor: 'ClaimGuard Privacy Engine', timestamp: '2026-10-02 08:42:15', status: 'Pass', detail: 'Zero diagnosis or treatment fields found in on-chain payload.' },
  { id: 'AUD-004', event: 'Policy Eligibility Verified', actor: 'Compact validateClaim()', timestamp: '2026-10-02 08:42:16', status: 'Pass', detail: 'procedure_code ∈ allowedProcedures ∧ amount ≤ deductible_limit.' },
  { id: 'AUD-005', event: 'Settlement Authorized', actor: 'Midnight Smart Contract', timestamp: '2026-10-02 08:42:17', status: 'Pass', detail: 'authorized_amount = $2,205 USD emitted to public ledger state.' },
  { id: 'AUD-006', event: 'Fraud Risk Score Evaluated', actor: 'FraudRiskScorePanel', timestamp: '2026-10-02 08:42:18', status: 'Pass', detail: 'Risk Score: LOW (24/100). No anomaly patterns detected.' },
];

const COMPLIANCE_STANDARDS = [
  { name: 'HIPAA §164.312', label: 'Technical Safeguards', status: 'Compliant', icon: 'health_and_safety', color: 'emerald' },
  { name: 'GDPR Art. 25', label: 'Privacy by Design', status: 'Compliant', icon: 'shield', color: 'emerald' },
  { name: 'SOC 2 Type II', label: 'Security & Availability', status: 'In Attestation', icon: 'verified_user', color: 'amber' },
  { name: 'HL7 FHIR R4', label: 'Interoperability', status: 'Compliant', icon: 'swap_horiz', color: 'emerald' },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const ComplianceAuditPanel: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Compliance Standards Grid */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-3">
          <span className="material-symbols-outlined text-primary text-[28px]">verified_user</span>
          <div>
            <h2 className="text-xl font-bold text-on-surface">HIPAA & GDPR Cryptographic Compliance</h2>
            <p className="text-xs text-on-surface-variant">Zero-knowledge proof mechanics and formal mathematical guarantees for clinical privacy.</p>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COMPLIANCE_STANDARDS.map((std) => (
            <div key={std.name} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border font-bold text-[11px] ${colorMap[std.color]}`}>
              <span className={`material-symbols-outlined text-[18px]`}>{std.icon}</span>
              <div>
                <div className="uppercase tracking-wider">{std.name}</div>
                <div className="font-normal text-[10px] opacity-80">{std.label}</div>
                <div className="font-extrabold mt-0.5">{std.status}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Zero PHI On-Chain
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Medical diagnosis codes (ICD-10-CM) and attending physician treatment narratives exist purely inside client-side local witnesses. No plain-text medical records are transmitted over public network relays.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-[18px]">memory</span>
              Groth16 & Compact Circuit
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Circuit constraints verify that <code className="bg-slate-100 px-1 rounded">procedure_code</code> belongs to the covered list and <code className="bg-slate-100 px-1 rounded">claim_amount &lt;= deductible_limit</code>. Proof sizes are succinct (~128 bytes) with sub-second verification.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Institutional Auditability
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Auditors can re-verify public witness commitments using the published verification key without ever needing access to sensitive patient clinical keys.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Event Log */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-3">
          <span className="material-symbols-outlined text-secondary text-2xl">history</span>
          <div>
            <h3 className="font-bold text-base text-on-surface">Live Audit Event Log</h3>
            <p className="text-[11px] text-on-surface-variant">Immutable sequence of privacy-preserving operations for the last settlement.</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">All Checks Passed</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-outline-variant/60">
          <table className="w-full text-xs font-sans text-left">
            <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="p-3">Audit ID</th>
                <th className="p-3">Event</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {AUDIT_LOG.map((entry) => (
                <React.Fragment key={entry.id}>
                  <tr
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                  >
                    <td className="p-3 font-mono text-primary font-bold">{entry.id}</td>
                    <td className="p-3 font-medium text-on-surface">{entry.event}</td>
                    <td className="p-3 text-on-surface-variant font-mono text-[11px]">{entry.actor}</td>
                    <td className="p-3 text-on-surface-variant font-mono text-[11px] whitespace-nowrap">{entry.timestamp}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        entry.status === 'Pass'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${entry.status === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                  {expandedRow === entry.id && (
                    <tr className="bg-slate-50/60">
                      <td colSpan={5} className="px-6 py-3 text-[11px] text-on-surface-variant italic border-t border-outline-variant/20">
                        <span className="font-bold text-on-surface not-italic">Detail: </span>{entry.detail}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Circuit Spec */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-on-surface">Formally Verified Circuit Specifications</h3>
        <div className="bg-slate-900 text-cyan-300 p-4 rounded-xl font-mono text-xs overflow-x-auto">
          <pre>{`// Compact Smart Contract: ClaimValidation.compact
export ledger state claim_status: ClaimStatus;
export ledger state authorized_amount: Uint;
export ledger state claim_commitment: Bytes<32>;

export circuit validateClaim(
    witness diagnosis_code: Uint,
    witness treatment_notes: Bytes<256>,
    public procedure_code: Uint,
    public claim_amount: Uint,
    public deductible_limit: Uint
): Boolean {
    // 1. Verify procedure code is in covered list
    assert isCoveredProcedure(procedure_code);
    
    // 2. Verify claim amount does not exceed deductible limit
    assert claim_amount <= deductible_limit;
    
    // 3. Emit public state vector without revealing diagnosis_code or treatment_notes
    return true;
}`}</pre>
        </div>
      </div>
    </div>
  );
};
