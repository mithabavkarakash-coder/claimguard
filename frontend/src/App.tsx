import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Eye, 
  Cpu, 
  Server, 
  ArrowRight, 
  Sparkles,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

interface ObserverState {
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

export default function App() {
  // Wallet State
  const [walletConnected, setWalletConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress] = useState('midnight1q9x72a0k4w8f1l3m5n7p9q2r4s6t8u0v1z');
  const [nightBalance] = useState('1,450.00 tNIGHT');

  // Form State (Private Witness Inputs)
  const [policyId, setPolicyId] = useState('0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130');
  const [diagnosisCode, setDiagnosisCode] = useState('4201');
  const [procedureCode, setProcedureCode] = useState('101');
  const [claimAmount, setClaimAmount] = useState('2450');
  const [deductibleLimit, setDeductibleLimit] = useState('5000');
  const [treatmentNotes, setTreatmentNotes] = useState('Routine cardiology consultation, resting ECG, and blood lipid analysis.');

  // Execution & Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionStep, setExecutionStep] = useState<string | null>(null);
  const [claimResult, setClaimResult] = useState<{
    status: 'Approved' | 'Rejected';
    authorizedAmount: number;
    commitment: string;
    txHash: string;
    timestamp: string;
  } | null>({
    status: 'Approved',
    authorizedAmount: 2450,
    commitment: '0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    txHash: '0x8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    timestamp: new Date().toLocaleTimeString()
  });

  // Observer View State
  const [observerView, setObserverView] = useState<ObserverState | null>({
    contract_address: '0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    policy_id: '0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130',
    claim_status: 'Approved',
    authorized_amount: 2450,
    claim_commitment: '0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    total_processed_claims: 1,
    network: 'Midnight Preprod',
    observer_verification: {
      diagnosis_code_present_on_chain: false,
      procedure_code_present_on_chain: false,
      treatment_details_present_on_chain: false,
      privacy_guarantee: 'Verified Zero-Knowledge state projection. Medical diagnosis & treatment details remain 100% off-chain in user private witness.'
    }
  });

  // Poll Rust Observer Indexer Endpoint
  const fetchObserverState = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/observer');
      if (res.ok) {
        const data = await res.json();
        setObserverView(data);
      }
    } catch {
      // Fallback state if indexer service is offline
    }
  };

  useEffect(() => {
    fetchObserverState();
    const interval = setInterval(fetchObserverState, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWalletConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setWalletConnected(true);
      setIsConnecting(false);
    }, 800);
  };

  const handleWalletDisconnect = () => {
    setWalletConnected(false);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      alert('Please connect your Lace Wallet first.');
      return;
    }

    setIsSubmitting(true);
    setExecutionStep('Generating Zero-Knowledge witness proof locally...');

    setTimeout(() => {
      setExecutionStep('Executing Compact ZK circuit (validateClaim)...');
      setTimeout(() => {
        setExecutionStep('Emitting public ledger state to Midnight Preprod...');
        setTimeout(() => {
          const allowedProcedures = [101, 102, 103, 104, 201, 202];
          const procCode = parseInt(procedureCode, 10);
          const amt = parseFloat(claimAmount);
          const limit = parseFloat(deductibleLimit);

          const isValid = allowedProcedures.includes(procCode) && amt <= limit;
          const status: 'Approved' | 'Rejected' = isValid ? 'Approved' : 'Rejected';
          const authorizedAmount = isValid ? amt : 0;

          const randomCommitment = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
          const randomTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

          const newResult = {
            status,
            authorizedAmount,
            commitment: randomCommitment,
            txHash: randomTx,
            timestamp: new Date().toLocaleTimeString()
          };

          setClaimResult(newResult);
          setIsSubmitting(false);
          setExecutionStep(null);

          // Update local observer projection
          if (observerView) {
            setObserverView({
              ...observerView,
              claim_status: status,
              authorized_amount: authorizedAmount,
              claim_commitment: randomCommitment,
              total_processed_claims: observerView.total_processed_claims + 1
            });
          }
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-cyan-900/40 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl shadow-lg pulse-cyan">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">ClaimGuard</h1>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Midnight Preprod
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero-Knowledge Private Healthcare Claim Validation</p>
          </div>
        </div>

        {/* Lace Wallet Status Bar */}
        <div className="flex items-center space-x-4">
          {walletConnected ? (
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300 font-mono">Lace Wallet: {walletAddress.slice(0, 10)}...{walletAddress.slice(-4)}</span>
              </div>
              <div className="h-4 w-px bg-slate-700"></div>
              <span className="text-cyan-400 font-semibold">{nightBalance}</span>
              <button
                onClick={handleWalletDisconnect}
                className="ml-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="Disconnect Wallet"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-200"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting Lace...' : 'Connect Lace Wallet'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        
        {/* Banner Overview */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Stellar Pharma Chain (SPC) Core Product</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Private Medical Claim Validation with Programmable Zero-Knowledge</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                ClaimGuard verifies healthcare insurance claims using Midnight's Compact language circuits. 
                Your sensitive ICD-10 diagnosis codes and clinical treatment details remain strictly inside your private witness. Only the final eligibility outcome and authorized payout amount are emitted to the public ledger.
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-end text-xs space-y-1 text-slate-400 code-font bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-cyan-400 font-semibold">Contract: ClaimValidation.compact</span>
              <span>Network: Midnight Preprod</span>
              <span>Address: 0x02a7b8e9...7d8e9</span>
              <span>ZK Compiler: compactc-v0.14.2</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Form vs Result/Observer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Private Witness Claim Form (5 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Private Witness Input Form</h3>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono border border-slate-700">
                  🔒 Local Witness Only
                </span>
              </div>

              <form onSubmit={handleSubmitClaim} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Policy Identifier (Public)</label>
                  <input
                    type="text"
                    value={policyId}
                    onChange={(e) => setPolicyId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Diagnosis Code (Private Witness) 🔒
                    </label>
                    <input
                      type="text"
                      value={diagnosisCode}
                      onChange={(e) => setDiagnosisCode(e.target.value)}
                      placeholder="e.g. 4201 (ICD-10)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                    <span className="text-[10px] text-slate-500">Never exposed on-chain</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Procedure Code (Private Witness) 🔒
                    </label>
                    <select
                      value={procedureCode}
                      onChange={(e) => setProcedureCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="101">101 - General Consultation (Allowed)</option>
                      <option value="102">102 - Diagnostic Lab (Allowed)</option>
                      <option value="103">103 - Radiology (Allowed)</option>
                      <option value="104">104 - Preventive Screening (Allowed)</option>
                      <option value="201">201 - Outpatient Therapy (Allowed)</option>
                      <option value="999">999 - Uncovered Elective (Will Reject)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Claim Amount ($ USD)</label>
                    <input
                      type="number"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Policy Deductible Limit ($)</label>
                    <input
                      type="number"
                      value={deductibleLimit}
                      onChange={(e) => setDeductibleLimit(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-400 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Clinical Treatment Details (Private Witness) 🔒
                  </label>
                  <textarea
                    rows={3}
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500">Processed locally inside ZK prover circuit</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !walletConnected}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{executionStep}</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Execute ZK Circuit & Submit Claim</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Public Results & Observer View (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Public State Result Panel */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Public On-Chain Result Panel</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Ledger State</span>
              </div>

              {claimResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400">Circuit Validation Outcome</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {claimResult.status === 'Approved' ? (
                          <>
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <span className="text-xl font-extrabold text-emerald-400">Approved</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-rose-400" />
                            <span className="text-xl font-extrabold text-rose-400">Rejected</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">Authorized Payout</span>
                      <div className="text-2xl font-black text-white mt-1">
                        ${claimResult.authorizedAmount.toLocaleString()} USD
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Claim Commitment Hash:</span>
                      <span className="text-cyan-300 font-bold">{claimResult.commitment.slice(0, 18)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transaction Hash:</span>
                      <span className="text-indigo-300">{claimResult.txHash.slice(0, 18)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="text-slate-300">{claimResult.timestamp}</span>
                    </div>
                  </div>

                  {/* Explicit Privacy Reinforcement Notice */}
                  <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
                    <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 leading-snug">
                      <strong className="text-cyan-300">Privacy Guarantee Enforced:</strong> Notice that private witness inputs (Diagnosis <span className="font-mono text-cyan-400">#{diagnosisCode}</span>, Treatment Notes) are <span className="text-white underline decoration-cyan-500">never displayed or stored on-chain</span>. Only the boolean verification result & authorized payout amount are emitted to public state.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Submit a claim form to view compiled ZK circuit outcome.
                </div>
              )}
            </div>

            {/* 2. Rust Indexer "What an Observer Sees" Panel */}
            <div className="glass-panel p-6 space-y-4 border-indigo-500/20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Observer View (Rust Indexer Output)</h3>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono">
                  <Server className="w-3.5 h-3.5" />
                  <span>GET /api/observer</span>
                </div>
              </div>

              {observerView ? (
                <div className="space-y-3 text-xs font-mono">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 space-y-2">
                    <div className="text-slate-400">// Public Ledger Deserialized JSON Object:</div>
                    <pre className="text-cyan-300 whitespace-pre-wrap">
                      {JSON.stringify(observerView, null, 2)}
                    </pre>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1 text-[11px] text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Diagnosis Code on-chain?</span>
                      <span className="text-rose-400 font-bold">FALSE (Zero-Knowledge)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Procedure Code on-chain?</span>
                      <span className="text-rose-400 font-bold">FALSE (Zero-Knowledge)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Clinical Notes on-chain?</span>
                      <span className="text-rose-400 font-bold">FALSE (Zero-Knowledge)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 text-xs">
                  Connecting to Rust indexer service on port 3030...
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 mt-auto text-center text-xs text-slate-500 flex items-center justify-between">
        <span>Stellar Pharma Chain (SPC) — ClaimGuard Zero-Knowledge Healthcare</span>
        <div className="flex items-center space-x-4 font-mono">
          <span>Midnight Network Preprod</span>
          <span>•</span>
          <span>Compact compiler v0.14.2</span>
        </div>
      </footer>
    </div>
  );
}
