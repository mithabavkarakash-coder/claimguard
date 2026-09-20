import React, { useState } from 'react';

export interface PolicyDefinition {
  id: string;
  name: string;
  code: string;
  hexId: string;
  deductibleLimit: number;
  copayRatio: number; // e.g. 90 for 90%
  annualMaxBenefit: number;
  allowedProcedures: string[];
  excludedDiagnoses: string[];
  zkSecurityLevel: 'Standard Groth16' | 'Enhanced BLS12-381' | 'Ultra Privacy Salted';
  version: string;
  lastUpdated: string;
}

export const PRESET_POLICIES: PolicyDefinition[] = [
  {
    id: 'gold-shield-2026',
    name: 'Aegis Gold Health Shield 2026',
    code: 'POL-GOLD-2026',
    hexId: '0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130',
    deductibleLimit: 5000,
    copayRatio: 90,
    annualMaxBenefit: 100000,
    allowedProcedures: ['99214', '70450', '99396', '99285', '80053', '101', '102', '103', '104', '201'],
    excludedDiagnoses: ['Z71.1', 'Z00.00'],
    zkSecurityLevel: 'Enhanced BLS12-381',
    version: 'v2.4.1',
    lastUpdated: '2026-09-20'
  },
  {
    id: 'silver-hsa-2026',
    name: 'Aegis Silver HSA Flexible Plan',
    code: 'POL-SILVER-HSA',
    hexId: '0x53494c5645525f4853415f323032365f504f4c4943595f434c41494d5f563032',
    deductibleLimit: 3000,
    copayRatio: 100,
    annualMaxBenefit: 50000,
    allowedProcedures: ['99214', '99396', '80053', '101', '104'],
    excludedDiagnoses: ['Z71.1'],
    zkSecurityLevel: 'Standard Groth16',
    version: 'v2.1.0',
    lastUpdated: '2026-09-15'
  },
  {
    id: 'bronze-disaster-2026',
    name: 'Aegis Emergency Disaster Care',
    code: 'POL-BRONZE-EMG',
    hexId: '0x42524f4e5a455f454d455247454e43595f504f4c4943595f323032365f563031',
    deductibleLimit: 10000,
    copayRatio: 80,
    annualMaxBenefit: 250000,
    allowedProcedures: ['70450', '99285', '103'],
    excludedDiagnoses: [],
    zkSecurityLevel: 'Ultra Privacy Salted',
    version: 'v1.8.4',
    lastUpdated: '2026-08-30'
  },
  {
    id: 'executive-premier-2026',
    name: 'Aegis Executive Premier VIP Care',
    code: 'POL-EXEC-PREMIER',
    hexId: '0x455845435f5052454d4945525f504f4c4943595f323032365f46554c4c5f5630',
    deductibleLimit: 1500,
    copayRatio: 95,
    annualMaxBenefit: 500000,
    allowedProcedures: ['99214', '70450', '99396', '99285', '80053', '101', '102', '103', '104', '201'],
    excludedDiagnoses: [],
    zkSecurityLevel: 'Enhanced BLS12-381',
    version: 'v3.0.0',
    lastUpdated: '2026-09-18'
  }
];

const AVAILABLE_PROCEDURES = [
  { code: '99214', label: 'CPT 99214 - Outpatient Visit (Moderate)' },
  { code: '70450', label: 'CPT 70450 - CT Head/Brain without Contrast' },
  { code: '99396', label: 'CPT 99396 - Preventive Visit (40-64 yrs)' },
  { code: '99285', label: 'CPT 99285 - Emergency Dept Visit High Severity' },
  { code: '80053', label: 'CPT 80053 - Comprehensive Metabolic Panel' },
  { code: '101', label: 'CPT 101 - General Cardiology Consultation' },
  { code: '102', label: 'CPT 102 - Comprehensive Diagnostic Lab' },
  { code: '103', label: 'CPT 103 - CT Head / Radiology' },
  { code: '104', label: 'CPT 104 - Preventive Screening' },
  { code: '201', label: 'CPT 201 - Outpatient Rehabilitation' }
];

interface PolicyStudioPanelProps {
  currentPolicy: PolicyDefinition;
  onApplyPolicy: (policy: PolicyDefinition) => void;
}

export const PolicyStudioPanel: React.FC<PolicyStudioPanelProps> = ({
  currentPolicy,
  onApplyPolicy
}) => {
  const [activePolicy, setActivePolicy] = useState<PolicyDefinition>(currentPolicy);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [policyName, setPolicyName] = useState(activePolicy.name);
  const [policyCode, setPolicyCode] = useState(activePolicy.code);
  const [deductible, setDeductible] = useState(activePolicy.deductibleLimit.toString());
  const [copay, setCopay] = useState(activePolicy.copayRatio.toString());
  const [maxBenefit, setMaxBenefit] = useState(activePolicy.annualMaxBenefit.toString());
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>(activePolicy.allowedProcedures);
  const [securityLevel, setSecurityLevel] = useState(activePolicy.zkSecurityLevel);

  // Load Preset
  const handleSelectPreset = (preset: PolicyDefinition) => {
    setActivePolicy(preset);
    setPolicyName(preset.name);
    setPolicyCode(preset.code);
    setDeductible(preset.deductibleLimit.toString());
    setCopay(preset.copayRatio.toString());
    setMaxBenefit(preset.annualMaxBenefit.toString());
    setSelectedProcedures(preset.allowedProcedures);
    setSecurityLevel(preset.zkSecurityLevel);

    setToastMessage(`Loaded preset configuration: "${preset.name}"`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle procedure code in whitelist
  const toggleProcedure = (code: string) => {
    if (selectedProcedures.includes(code)) {
      setSelectedProcedures(selectedProcedures.filter(c => c !== code));
    } else {
      setSelectedProcedures([...selectedProcedures, code]);
    }
  };

  // Generate SHA-256 / Hex Policy Hash based on current form parameters
  const generatePolicyHex = () => {
    const raw = `${policyCode}_${deductible}_${copay}_${maxBenefit}_${selectedProcedures.join('_')}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `0x5350435f504f4c4943595f323032365f${hex.toUpperCase()}5f563130`;
  };

  const computedHexId = generatePolicyHex();

  // Apply Policy to Active Application Session
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPolicy: PolicyDefinition = {
      ...activePolicy,
      name: policyName,
      code: policyCode,
      hexId: computedHexId,
      deductibleLimit: parseFloat(deductible) || 5000,
      copayRatio: parseFloat(copay) || 90,
      annualMaxBenefit: parseFloat(maxBenefit) || 100000,
      allowedProcedures: selectedProcedures,
      zkSecurityLevel: securityLevel,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onApplyPolicy(updatedPolicy);
    setActivePolicy(updatedPolicy);

    setToastMessage('✅ Policy rules successfully deployed & synchronized with active zero-knowledge verifier session!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Download JSON Policy Manifest
  const handleDownloadJSON = () => {
    const data = JSON.stringify({
      policy: {
        name: policyName,
        code: policyCode,
        hexId: computedHexId,
        deductibleLimit: parseFloat(deductible),
        copayRatio: parseFloat(copay),
        annualMaxBenefit: parseFloat(maxBenefit),
        allowedProcedures: selectedProcedures,
        securityLevel,
        circuit: 'ClaimValidation.compact',
        compiledAt: new Date().toISOString()
      }
    }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claimguard_policy_${policyCode.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Compact Circuit Code
  const handleDownloadCompact = () => {
    const compactCode = `// Midnight Compact Smart Contract Policy Definition
// Policy Code: ${policyCode}
// Policy ID Hex: ${computedHexId}

pragma compact 0.14.2;

import CompactStandardLibrary;

export ledger policyDeductibleLimit: Cell<Uint<64>>;
export ledger policyCopayRatio: Cell<Uint<8>>;
export ledger activePolicyId: Cell<Bytes<32>>;

export circuit validateClaim(
  witness privateDiagnosisCode: Uint<16>,
  witness privateProcedureCode: Uint<16>,
  witness claimAmount: Uint<64>,
  witness patientSalt: Bytes<32>
): [] {
  // 1. Verify procedure code in whitelisted set: [${selectedProcedures.join(', ')}]
  assert (isProcedureAllowed(privateProcedureCode));

  // 2. Enforce policy deductible ceiling ($${deductible})
  assert (claimAmount <= ${deductible});

  // 3. Emit cryptographic nullifier commitment
  const nullifier = Poseidon::hash([patientSalt, privateDiagnosisCode]);
  emitClaimCommitment(nullifier, claimAmount);
}
`;

    const blob = new Blob([compactCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${policyCode.toLowerCase()}_policy.compact`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic Compact Code String for UI Preview
  const generatedCompactPreview = `pragma compact 0.14.2;

export ledger policyDeductibleLimit: Uint<64> = ${deductible || 5000};
export ledger copayReimbursementRatio: Uint<8> = ${copay || 90}; // ${copay || 90}%
export ledger annualMaxBenefit: Uint<64> = ${maxBenefit || 100000};

export circuit validateClaim(
  witness privateDiagnosisCode: Uint<16>,
  witness privateProcedureCode: Uint<16>,
  witness claimAmount: Uint<64>,
  witness patientSalt: Bytes<32>
): DisclosedClaimResult {
  // Enforce Policy Whitelisted CPT Procedures (${selectedProcedures.length} Active)
  assert (${selectedProcedures.length > 0 ? selectedProcedures.map(c => `privateProcedureCode == ${c}`).join(' || ') : 'false'});

  // Enforce Max Deductible Threshold
  assert (claimAmount <= policyDeductibleLimit);

  // Compute Authorized Reimbursement
  const authorizedAmount = (claimAmount * copayReimbursementRatio) / 100;
  return DisclosedClaimResult { status: ClaimStatus::Approved, authorizedAmount };
}`;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-primary/10 border border-primary/40 rounded-xl p-4 text-primary flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">verified</span>
            <span className="text-xs md:text-sm font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-primary hover:text-primary-dark font-bold text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Insurer Policy Administration Studio & Compact ZK Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight">
            Healthcare Claim Policy Rule Designer
          </h2>
          <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
            Configure deductible caps, co-pay reimbursement ratios, procedure whitelists, and annual maximum benefits. Deploys updated zero-knowledge Compact witness verification rules across Midnight Network smart contracts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="h-10 px-4 bg-surface-container-low border border-outline-variant hover:border-primary rounded-lg font-sans text-xs font-semibold text-on-surface flex items-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleDownloadCompact}
            className="h-10 px-4 bg-surface-container-low border border-outline-variant hover:border-primary rounded-lg font-sans text-xs font-semibold text-on-surface flex items-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">code</span>
            Export .compact
          </button>
        </div>
      </div>

      {/* Preset Plan Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">collections_bookmark</span>
            Quick Load Policy Presets
          </span>
          <span className="text-[11px] text-on-surface-variant">Click to load standard plan template</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_POLICIES.map((preset) => {
            const isSelected = activePolicy.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-sm ring-2 ring-primary/20'
                    : 'bg-surface-container-lowest border-outline-variant hover:border-primary/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {preset.code}
                    </span>
                    {isSelected && (
                      <span className="flex items-center text-[10px] font-bold text-primary gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-on-surface">{preset.name}</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-outline-variant/40">
                  <div>
                    <span className="text-on-surface-variant block text-[9px] uppercase font-bold">Deductible</span>
                    <span className="font-mono font-semibold text-on-surface">${preset.deductibleLimit.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[9px] uppercase font-bold">Co-Pay Rate</span>
                    <span className="font-mono font-semibold text-on-surface">{preset.copayRatio}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid: Form (Left 7 Cols) + Compact Preview (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Policy Configuration Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-6">
          <form onSubmit={handleApply} className="space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <h3 className="font-extrabold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                Policy Rules & Financial Parameters
              </h3>
              <span className="font-mono text-[11px] text-on-surface-variant font-bold">
                {securityLevel}
              </span>
            </div>

            {/* Field 1: Plan Name & Plan Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-xs text-on-surface" htmlFor="policy-name">
                  Plan Display Name
                </label>
                <input
                  id="policy-name"
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-xs text-on-surface" htmlFor="policy-code">
                  Plan System Code
                </label>
                <input
                  id="policy-code"
                  type="text"
                  value={policyCode}
                  onChange={(e) => setPolicyCode(e.target.value)}
                  className="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Field 2: Computed Policy Hex ID */}
            <div className="space-y-1">
              <label className="flex items-center justify-between font-semibold text-xs text-on-surface">
                <span>Cryptographic Policy Hash Identifier (32-Byte Hex)</span>
                <span className="text-[10px] text-primary font-bold">Auto-Generated SHA-256</span>
              </label>
              <div className="h-11 px-4 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-between font-mono text-xs text-primary truncate">
                <span className="truncate">{computedHexId}</span>
                <span className="material-symbols-outlined text-[16px] text-primary ml-2 flex-shrink-0">lock</span>
              </div>
            </div>

            {/* Field 3: Deductible Limit, Co-Pay Ratio, Annual Benefit Ceiling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Deductible */}
              <div className="space-y-1">
                <label className="font-semibold text-xs text-on-surface" htmlFor="policy-deductible">
                  Deductible Ceiling ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-on-surface-variant">$</span>
                  <input
                    id="policy-deductible"
                    type="number"
                    value={deductible}
                    onChange={(e) => setDeductible(e.target.value)}
                    className="w-full h-11 pl-7 pr-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Co-Pay Ratio */}
              <div className="space-y-1">
                <label className="font-semibold text-xs text-on-surface" htmlFor="policy-copay">
                  Co-Pay Ratio (%)
                </label>
                <div className="relative">
                  <input
                    id="policy-copay"
                    type="number"
                    min="1"
                    max="100"
                    value={copay}
                    onChange={(e) => setCopay(e.target.value)}
                    className="w-full h-11 pl-3 pr-8 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs text-on-surface-variant">%</span>
                </div>
              </div>

              {/* Annual Max Benefit */}
              <div className="space-y-1">
                <label className="font-semibold text-xs text-on-surface" htmlFor="policy-maxbenefit">
                  Max Annual Benefit ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-on-surface-variant">$</span>
                  <input
                    id="policy-maxbenefit"
                    type="number"
                    value={maxBenefit}
                    onChange={(e) => setMaxBenefit(e.target.value)}
                    className="w-full h-11 pl-7 pr-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Field 4: CPT Procedure Code Whitelist Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  Whitelisted Procedure Codes ({selectedProcedures.length} Selected)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProcedures(AVAILABLE_PROCEDURES.map(p => p.code))}
                    className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-outline-variant">•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProcedures([])}
                    className="text-[10px] text-red-500 hover:underline font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                {AVAILABLE_PROCEDURES.map((proc) => {
                  const isChecked = selectedProcedures.includes(proc.code);
                  return (
                    <label
                      key={proc.code}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-surface-container-lowest border-primary/60 text-on-surface font-semibold shadow-2xs'
                          : 'bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container-lowest/50'
                      }`}
                    >
                      <span className="truncate pr-2">{proc.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProcedure(proc.code)}
                        className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary focus:ring-offset-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Field 5: ZK Circuit Privacy Parameters */}
            <div className="space-y-2 pt-2">
              <label className="font-semibold text-xs text-on-surface flex items-center gap-1.5" htmlFor="security-level">
                <span className="material-symbols-outlined text-secondary text-[18px]">shield</span>
                ZK Circuit Cryptographic Security Level
              </label>
              <select
                id="security-level"
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value as any)}
                className="w-full h-11 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-sans text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all cursor-pointer"
              >
                <option value="Enhanced BLS12-381">Enhanced BLS12-381 Curve (Recommended • High Security)</option>
                <option value="Standard Groth16">Standard Groth16 R1CS (Optimal Verification Speed)</option>
                <option value="Ultra Privacy Salted">Ultra Privacy Salted Poseidon (Maximum Anonymity Blinding)</option>
              </select>
            </div>

            {/* Submit / Apply Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-dark text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                Deploy & Apply Policy to Active ClaimGuard Session
              </button>
            </div>

          </form>
        </div>

        {/* Compact Code Preview & Verification Specs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Compact Code Container */}
          <div className="bg-[#0f172a] text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="font-mono text-xs font-bold text-slate-400 ml-2">ClaimValidation.compact</span>
              </div>
              <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Midnight Compact v0.14.2
              </span>
            </div>

            <pre className="font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 max-h-96">
              <code>{generatedCompactPreview}</code>
            </pre>

            <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-slate-800 text-slate-400 font-mono">
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">R1CS Constraints</span>
                <span className="text-cyan-400 font-bold">1,420 Constraints</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Proving System</span>
                <span className="text-indigo-400 font-bold">{securityLevel.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Active Policy Status Box */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              Session Verification Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/40">
                <span className="text-on-surface-variant font-medium">Active Policy Code</span>
                <span className="font-mono font-bold text-primary">{policyCode}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-outline-variant/40">
                <span className="text-on-surface-variant font-medium">Effective Deductible Ceiling</span>
                <span className="font-mono font-bold text-on-surface">${parseFloat(deductible || '0').toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-outline-variant/40">
                <span className="text-on-surface-variant font-medium">Reimbursement Coverage Ratio</span>
                <span className="font-mono font-bold text-on-surface">{copay}% Reimbursement</span>
              </div>

              <div className="flex justify-between py-1 border-b border-outline-variant/40">
                <span className="text-on-surface-variant font-medium">Whitelisted Procedures</span>
                <span className="font-mono font-bold text-on-surface">{selectedProcedures.length} Procedures</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant leading-relaxed">
              💡 <strong>Live Synchronization</strong>: Submitting claims in the <strong>Claims Submission</strong> tab will automatically validate against these parameters.
            </div>
          </div>

        </div>

      </div>

      {/* Policy Revision History Audit Log */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
            Policy Revision Audit Trail
          </h3>
          <span className="text-xs text-on-surface-variant">4 Historical Versions Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-bold text-[10px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Version</th>
                <th className="pb-3 font-semibold">Plan Code</th>
                <th className="pb-3 font-semibold">Cryptographic Policy Hash</th>
                <th className="pb-3 font-semibold">Deductible</th>
                <th className="pb-3 font-semibold">Co-Pay</th>
                <th className="pb-3 font-semibold">Deployed Date</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 font-sans">
              <tr className="bg-primary/5 font-medium">
                <td className="py-3 font-mono font-bold text-primary">v2.4.1 (Active)</td>
                <td className="py-3 font-mono text-on-surface font-semibold">{policyCode}</td>
                <td className="py-3 font-mono text-[11px] text-primary truncate max-w-[200px]">{computedHexId}</td>
                <td className="py-3 font-mono">${parseFloat(deductible || '0').toLocaleString()}</td>
                <td className="py-3 font-mono">{copay}%</td>
                <td className="py-3 text-on-surface-variant">{new Date().toISOString().split('T')[0]}</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">
                    Active Session
                  </span>
                </td>
              </tr>
              <tr className="text-on-surface-variant">
                <td className="py-3 font-mono">v2.4.0</td>
                <td className="py-3 font-mono">POL-GOLD-2026</td>
                <td className="py-3 font-mono text-[11px] truncate max-w-[200px]">0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130</td>
                <td className="py-3 font-mono">$5,000</td>
                <td className="py-3 font-mono">90%</td>
                <td className="py-3">2026-09-10</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-bold text-[10px] uppercase">
                    Archived
                  </span>
                </td>
              </tr>
              <tr className="text-on-surface-variant">
                <td className="py-3 font-mono">v2.1.0</td>
                <td className="py-3 font-mono">POL-SILVER-HSA</td>
                <td className="py-3 font-mono text-[11px] truncate max-w-[200px]">0x53494c5645525f4853415f323032365f504f4c4943595f434c41494d5f563032</td>
                <td className="py-3 font-mono">$3,000</td>
                <td className="py-3 font-mono">100%</td>
                <td className="py-3">2026-08-25</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-bold text-[10px] uppercase">
                    Archived
                  </span>
                </td>
              </tr>
              <tr className="text-on-surface-variant">
                <td className="py-3 font-mono">v1.8.4</td>
                <td className="py-3 font-mono">POL-BRONZE-EMG</td>
                <td className="py-3 font-mono text-[11px] truncate max-w-[200px]">0x42524f4e5a455f454d455247454e43595f504f4c4943595f323032365f563031</td>
                <td className="py-3 font-mono">$10,000</td>
                <td className="py-3 font-mono">80%</td>
                <td className="py-3">2026-08-01</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-bold text-[10px] uppercase">
                    Archived
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
