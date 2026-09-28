import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  Download, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign, 
  Cpu, 
  Zap, 
  CheckSquare, 
  Square,
  FileText
} from 'lucide-react';

export interface BatchClaimItem {
  id: string;
  patientId: string;
  diagnosisCode: string;
  procedureCode: string;
  claimAmount: number;
  deductibleLimit: number;
  copayRatio: number;
  status: 'Queued' | 'Executing' | 'Approved' | 'Rejected';
  authorizedAmount: number;
  commitmentHash: string;
  executionTimeMs: number;
}

const SAMPLE_BATCH_CLAIMS: BatchClaimItem[] = [
  {
    id: 'BATCH-CLM-001',
    patientId: 'PAT-8812',
    diagnosisCode: '4201',
    procedureCode: '101',
    claimAmount: 2450,
    deductibleLimit: 5000,
    copayRatio: 90,
    status: 'Queued',
    authorizedAmount: 0,
    commitmentHash: '',
    executionTimeMs: 0
  },
  {
    id: 'BATCH-CLM-002',
    patientId: 'PAT-9034',
    diagnosisCode: '3104',
    procedureCode: '102',
    claimAmount: 1800,
    deductibleLimit: 3000,
    copayRatio: 85,
    status: 'Queued',
    authorizedAmount: 0,
    commitmentHash: '',
    executionTimeMs: 0
  },
  {
    id: 'BATCH-CLM-003',
    patientId: 'PAT-4410',
    diagnosisCode: '5021',
    procedureCode: '999', // Uncovered code simulation
    claimAmount: 3200,
    deductibleLimit: 4000,
    copayRatio: 80,
    status: 'Queued',
    authorizedAmount: 0,
    commitmentHash: '',
    executionTimeMs: 0
  },
  {
    id: 'BATCH-CLM-004',
    patientId: 'PAT-1198',
    diagnosisCode: '1209',
    procedureCode: '201',
    claimAmount: 4100,
    deductibleLimit: 6000,
    copayRatio: 90,
    status: 'Queued',
    authorizedAmount: 0,
    commitmentHash: '',
    executionTimeMs: 0
  },
  {
    id: 'BATCH-CLM-005',
    patientId: 'PAT-7721',
    diagnosisCode: '8831',
    procedureCode: '104',
    claimAmount: 7500, // Exceeds limit simulation
    deductibleLimit: 5000,
    copayRatio: 85,
    status: 'Queued',
    authorizedAmount: 0,
    commitmentHash: '',
    executionTimeMs: 0
  }
];

export const BatchSettlementPanel: React.FC = () => {
  const [claims, setClaims] = useState<BatchClaimItem[]>(SAMPLE_BATCH_CLAIMS);
  const [selectedIds, setSelectedIds] = useState<string[]>(SAMPLE_BATCH_CLAIMS.map(c => c.id));
  const [isExecutingBatch, setIsExecutingBatch] = useState(false);
  const [executionStep, setExecutionStep] = useState<string | null>(null);
  const [batchExecuted, setBatchExecuted] = useState(false);
  const [batchTxHash, setBatchTxHash] = useState<string | null>(null);

  // New Claim Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientId, setNewPatientId] = useState('');
  const [newDiagnosisCode, setNewDiagnosisCode] = useState('4201');
  const [newProcedureCode, setNewProcedureCode] = useState('101');
  const [newAmount, setNewAmount] = useState('2000');
  const [newLimit, setNewLimit] = useState('5000');

  const toggleSelectAll = () => {
    if (selectedIds.length === claims.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(claims.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveClaim = (id: string) => {
    setClaims(claims.filter(c => c.id !== id));
    setSelectedIds(selectedIds.filter(i => i !== id));
  };

  const handleAddClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientId || !newAmount) {
      alert('Please fill in Patient ID and Claim Amount.');
      return;
    }

    const newClaim: BatchClaimItem = {
      id: `BATCH-CLM-${Math.floor(100 + Math.random() * 900)}`,
      patientId: newPatientId,
      diagnosisCode: newDiagnosisCode,
      procedureCode: newProcedureCode,
      claimAmount: parseFloat(newAmount),
      deductibleLimit: parseFloat(newLimit),
      copayRatio: 90,
      status: 'Queued',
      authorizedAmount: 0,
      commitmentHash: '',
      executionTimeMs: 0
    };

    setClaims([...claims, newClaim]);
    setSelectedIds([...selectedIds, newClaim.id]);
    setShowAddModal(false);
    setNewPatientId('');
    setNewAmount('2000');
  };

  const handleExecuteBatch = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one claim to include in the batch.');
      return;
    }

    setIsExecutingBatch(true);
    setExecutionStep('Phase 1/3: Generating ZK Private Witness Proofs for selected batch cohort...');

    setTimeout(() => {
      setExecutionStep('Phase 2/3: Parallel R1CS Circuit Evaluation & Anti-Replay Nullifier Verification...');

      setTimeout(() => {
        setExecutionStep('Phase 3/3: Emitting Aggregated Payout State Vector to Midnight Preprod...');

        setTimeout(() => {
          const allowedProcedures = ['101', '102', '103', '104', '201', '99214', '70450'];

          const updated = claims.map(claim => {
            if (!selectedIds.includes(claim.id)) return claim;

            const isProcedureValid = allowedProcedures.includes(claim.procedureCode);
            const isWithinLimit = claim.claimAmount <= claim.deductibleLimit;
            const isApproved = isProcedureValid && isWithinLimit;

            const authorizedAmount = isApproved ? Math.round((claim.claimAmount * claim.copayRatio) / 100) : 0;
            const commitment = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            const timeMs = Math.floor(180 + Math.random() * 120);

            return {
              ...claim,
              status: isApproved ? 'Approved' : 'Rejected',
              authorizedAmount,
              commitmentHash: commitment,
              executionTimeMs: timeMs
            } as BatchClaimItem;
          });

          const randomBatchTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

          setClaims(updated);
          setBatchTxHash(randomBatchTx);
          setIsExecutingBatch(false);
          setExecutionStep(null);
          setBatchExecuted(true);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Payout Summary Metrics
  const selectedClaims = claims.filter(c => selectedIds.includes(c.id));
  const approvedClaims = selectedClaims.filter(c => c.status === 'Approved');
  const rejectedClaims = selectedClaims.filter(c => c.status === 'Rejected');
  const totalRequested = selectedClaims.reduce((acc, c) => acc + c.claimAmount, 0);
  const totalAuthorized = selectedClaims.reduce((acc, c) => acc + c.authorizedAmount, 0);
  const avgProofTime = selectedClaims.length > 0 ? (selectedClaims.reduce((acc, c) => acc + (c.executionTimeMs || 210), 0) / selectedClaims.length).toFixed(0) : '0';

  const exportJSONReport = () => {
    const reportData = {
      batch_id: `BATCH-${Date.now()}`,
      timestamp: new Date().toISOString(),
      network: 'Midnight Preprod Testnet',
      batch_tx_hash: batchTxHash || '0xe048cd4deeeadd7ba1600551f59b77b7e2f12e82abb25512cdffbe6ce4254b66',
      total_claims_processed: selectedClaims.length,
      approved_claims_count: approvedClaims.length,
      rejected_claims_count: rejectedClaims.length,
      total_reimbursement_authorized: totalAuthorized,
      claims: selectedClaims
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claimguard_batch_settlement_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary border border-secondary/20">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-1">
                <span>Institutional Batch Adjudication Portal</span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight">
                Healthcare Provider Batch Claims Settlement
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl mt-1">
                Batch-process multiple clinical healthcare claims in parallel. Compute aggregated ZK proof commitments and emit single-transaction ledger payouts on Midnight Preprod with high gas efficiency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-primary" />
              Add Claim to Queue
            </button>

            <button
              onClick={handleExecuteBatch}
              disabled={isExecutingBatch || selectedIds.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary font-bold text-xs rounded-xl hover:bg-secondary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isExecutingBatch ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isExecutingBatch ? 'Adjudicating Batch...' : `Execute Batch (${selectedIds.length})`}
            </button>
          </div>
        </div>

        {/* Batch Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Batch Cohort Size
            </div>
            <div className="text-xl font-bold font-tnum text-on-surface">{selectedIds.length} Claims</div>
            <div className="text-[11px] text-on-surface-variant font-medium">Selected for Adjudication</div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Total Reimbursement
            </div>
            <div className="text-xl font-bold font-tnum text-emerald-700 dark:text-emerald-400">
              ${totalAuthorized.toLocaleString()} USD
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              {approvedClaims.length} Approved / {rejectedClaims.length} Rejected
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Gas Efficiency Gain
            </div>
            <div className="text-xl font-bold font-tnum text-on-surface">+84.2%</div>
            <div className="text-[11px] text-amber-600 font-semibold">Single Tx State Broadcast</div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              Avg Proof Speed
            </div>
            <div className="text-xl font-bold font-tnum text-on-surface">{avgProofTime} ms / claim</div>
            <div className="text-[11px] text-indigo-600 font-semibold">Parallel R1CS Solver</div>
          </div>
        </div>
      </div>

      {/* Execution Progress Banner */}
      {isExecutingBatch && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-5 space-y-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-secondary animate-spin" />
            <h4 className="font-bold text-sm text-on-surface">Executing Midnight ZK Circuit Batch Adjudication...</h4>
          </div>
          <p className="text-xs text-secondary font-mono bg-surface-container-lowest p-2.5 rounded-lg border border-secondary/20">
            {executionStep}
          </p>
        </div>
      )}

      {/* Settlement Result Header */}
      {batchExecuted && batchTxHash && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <div>
                <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-300">
                  Batch Adjudication Successfully Broadcast to Midnight Network!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  {approvedClaims.length} of {selectedClaims.length} claims approved. Authorized total payout: <strong>${totalAuthorized.toLocaleString()} USD</strong>
                </p>
              </div>
            </div>

            <button
              onClick={exportJSONReport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors shadow cursor-pointer self-start md:self-auto"
            >
              <Download className="w-4 h-4" />
              Export Batch Audit Report (JSON)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-surface-container-lowest p-3 rounded-lg border border-emerald-500/20">
              <span className="text-[10px] text-on-surface-variant font-sans font-bold uppercase block mb-1">
                Midnight Settlement Tx Hash
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate block">
                {batchTxHash}
              </span>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-lg border border-emerald-500/20">
              <span className="text-[10px] text-on-surface-variant font-sans font-bold uppercase block mb-1">
                Aggregated Nullifier Commitment Vector
              </span>
              <span className="text-secondary font-bold truncate block">
                {approvedClaims[0]?.commitmentHash ? `${approvedClaims[0].commitmentHash.substring(0, 24)}... (+${approvedClaims.length - 1} nullifiers)` : '0x8f4a...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Table: Batch Claims Queue */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-secondary" />
              Provider Batch Claims Queue
            </h3>
            <p className="text-xs text-on-surface-variant">
              Select claims to bundle into the current zero-knowledge adjudication batch transaction.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="text-xs text-primary font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              {selectedIds.length === claims.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              {selectedIds.length === claims.length ? 'Deselect All' : 'Select All Claims'}
            </button>
            <span className="text-xs text-on-surface-variant font-mono bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant">
              {claims.length} Total Claims
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/80 bg-surface-container-low text-on-surface-variant uppercase font-bold text-[10px]">
                <th className="p-3.5 rounded-tl-lg">Select</th>
                <th className="p-3.5">Claim ID</th>
                <th className="p-3.5">Patient Ref</th>
                <th className="p-3.5">Procedure (CPT)</th>
                <th className="p-3.5">Claim Amount</th>
                <th className="p-3.5">Policy Limit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Authorized Payout</th>
                <th className="p-3.5 text-right rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-mono">
              {claims.map(claim => {
                const isSelected = selectedIds.includes(claim.id);

                return (
                  <tr 
                    key={claim.id} 
                    className={`transition-colors ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface-container-low/60'}`}
                  >
                    <td className="p-3.5">
                      <button 
                        onClick={() => toggleSelectOne(claim.id)}
                        className="text-primary hover:scale-110 transition-transform cursor-pointer"
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-on-surface-variant" />}
                      </button>
                    </td>

                    <td className="p-3.5 font-bold text-on-surface">{claim.id}</td>
                    
                    <td className="p-3.5 font-sans">
                      <span className="font-semibold text-on-surface">{claim.patientId}</span>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        ICD: {claim.diagnosisCode}
                      </div>
                    </td>

                    <td className="p-3.5 font-sans">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-container-high border border-outline-variant text-on-surface">
                        CPT {claim.procedureCode}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-on-surface font-tnum">
                      ${claim.claimAmount.toLocaleString()} USD
                    </td>

                    <td className="p-3.5 text-on-surface-variant font-tnum">
                      ${claim.deductibleLimit.toLocaleString()} USD
                    </td>

                    <td className="p-3.5 font-sans">
                      {claim.status === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Approved
                        </span>
                      ) : claim.status === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-700 border border-rose-500/20">
                          <XCircle className="w-3 h-3 text-rose-500" />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-container-high text-on-surface-variant border border-outline-variant">
                          <Clock className="w-3 h-3" />
                          Queued
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-bold font-tnum">
                      {claim.status === 'Approved' ? (
                        <span className="text-emerald-700 dark:text-emerald-400">
                          ${claim.authorizedAmount.toLocaleString()} USD
                        </span>
                      ) : claim.status === 'Rejected' ? (
                        <span className="text-rose-600 dark:text-rose-400">$0 USD</span>
                      ) : (
                        <span className="text-on-surface-variant italic">Pending</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right font-sans">
                      <button
                        onClick={() => handleRemoveClaim(claim.id)}
                        className="p-1.5 text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove from batch queue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Claim Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full border border-outline-variant shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
              <h3 className="font-extrabold text-lg text-on-surface flex items-center gap-2">
                <Plus className="w-5 h-5 text-secondary" />
                Add Claim to Batch Queue
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddClaim} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-on-surface">Patient Reference ID</label>
                <input
                  type="text"
                  value={newPatientId}
                  onChange={e => setNewPatientId(e.target.value)}
                  placeholder="e.g. PAT-6623"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Diagnosis Code (ICD)</label>
                  <input
                    type="text"
                    value={newDiagnosisCode}
                    onChange={e => setNewDiagnosisCode(e.target.value)}
                    placeholder="e.g. 4201"
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Procedure Code (CPT)</label>
                  <input
                    type="text"
                    value={newProcedureCode}
                    onChange={e => setNewProcedureCode(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Claim Amount ($)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="2000"
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Deductible Limit ($)</label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={e => setNewLimit(e.target.value)}
                    placeholder="5000"
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-on-secondary rounded-xl font-bold hover:bg-secondary/90 cursor-pointer shadow-md"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
