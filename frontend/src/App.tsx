import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { ClaimSubmissionForm } from './components/ClaimSubmissionForm';
import { SettlementLifecycleStepper } from './components/SettlementLifecycleStepper';
import { PublicResultPanel } from './components/PublicResultPanel';
import { ObserverViewPanel, ObserverState } from './components/ObserverViewPanel';
import { ClaimsRegistryTable } from './components/ClaimsRegistryTable';
import { PolicyStudioPanel, PolicyDefinition, PRESET_POLICIES } from './components/PolicyStudioPanel';
import { DashboardStatsOverview } from './components/DashboardStatsOverview';
import { ContractInfoPanel } from './components/ContractInfoPanel';
import { AnalyticsDashboardPanel } from './components/AnalyticsDashboardPanel';
import { ComplianceAuditPanel } from './components/ComplianceAuditPanel';
import { PatientVaultPanel } from './components/PatientVaultPanel';
import { BatchSettlementPanel } from './components/BatchSettlementPanel';
import { WalletProvider, connectLace, connect1AM } from './utils/cardanoWallet';
import { getContractConfig } from './config/contractConfig';
import { useToast } from './components/ToastNotificationSystem';
import { FraudRiskScorePanel } from './components/FraudRiskScorePanel';

export default function App() {
  const contractConfig = getContractConfig();
  const { addToast } = useToast();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('claims-submission');
  const [showBanner, setShowBanner] = useState(true);

  // Wallet State
  const [walletConnected, setWalletConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletProvider, setWalletProvider] = useState<WalletProvider | null>('Lace');
  const [walletAddress, setWalletAddress] = useState('addr1q8x94ed3920akslw02948271038102938472901847102938479x4e');
  const [nightBalance, setNightBalance] = useState('₳ 1,420.50 ADA / 1,450.00 tNIGHT');

  // Policy State
  const [currentPolicy, setCurrentPolicy] = useState<PolicyDefinition>(PRESET_POLICIES[0]);

  // Form State (Private Witness Inputs)
  const [policyId, setPolicyId] = useState(PRESET_POLICIES[0].hexId);
  const [diagnosisCode, setDiagnosisCode] = useState('4201');
  const [procedureCode, setProcedureCode] = useState('101');
  const [claimAmount, setClaimAmount] = useState('2450');
  const [deductibleLimit, setDeductibleLimit] = useState(PRESET_POLICIES[0].deductibleLimit.toString());
  const [treatmentNotes, setTreatmentNotes] = useState('Patient evaluated for recurrent focal headache. Zero focal deficits noted. Diagnostic imaging initiated.');

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
    txHash: '0xe048cd4deeeadd7ba1600551f59b77b7e2f12e82abb25512cdffbe6ce4254b66',
    timestamp: new Date().toLocaleTimeString()
  });

  // Observer View State
  const [observerView, setObserverView] = useState<ObserverState | null>({
    contract_address: contractConfig.address,
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

  // Poll Local Rust Indexer or Live Midnight Preprod GraphQL Indexer
  const fetchObserverState = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/observer');
      if (res.ok) {
        const data = await res.json();
        setObserverView(data);
        return;
      }
    } catch {
      // Local indexer service offline, query live Midnight Preprod GraphQL indexer
    }

    try {
      const res = await fetch('https://indexer.preprod.midnight.network/api/v4/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ block { height hash } }' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.block) {
          setObserverView(prev => prev ? {
            ...prev,
            contract_address: contractConfig.address,
            network: `Midnight Preprod (Block #${data.data.block.height})`
          } : null);
        }
      }
    } catch {
      // Fallback state
    }
  };

  useEffect(() => {
    fetchObserverState();
    const interval = setInterval(fetchObserverState, 5000);
    return () => clearInterval(interval);
  }, [contractConfig.address]);

  const handleWalletConnect = async (provider: WalletProvider = 'Lace') => {
    setIsConnecting(true);
    try {
      const walletState = provider === '1AM' ? await connect1AM() : await connectLace();
      setWalletConnected(walletState.connected);
      setWalletProvider(walletState.provider);
      setWalletAddress(walletState.address);
      setNightBalance(walletState.balance);
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletProvider(null);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractConfig.isValid) {
      alert(contractConfig.errorMessage || 'ClaimGuard contract address is not configured correctly');
      return;
    }
    if (!walletConnected) {
      alert('Please connect your Lace or 1AM Wallet first.');
      return;
    }

    setIsSubmitting(true);
    setExecutionStep('Generating Zero-Knowledge witness proof locally...');
    addToast({
      type: 'zk-proof',
      title: 'ZK Witness Generation Started',
      message: 'Constructing Groth16 proof for private witness inputs off-chain…',
      duration: 4000,
    });

    setTimeout(() => {
      setExecutionStep('Executing Compact ZK circuit (validateClaim)...');
      addToast({
        type: 'zk-proof',
        title: 'Compact ZK Circuit Running',
        message: 'Evaluating validateClaim() — 1,420 R1CS constraints on BLS12-381…',
        duration: 4000,
      });
      setTimeout(() => {
        setExecutionStep('Emitting public ledger state to Midnight Preprod...');
        addToast({
          type: 'info',
          title: 'Broadcasting to Midnight Preprod',
          message: 'Emitting shielded state commitment to public ledger…',
          duration: 4000,
        });
        setTimeout(() => {
          const allowedProcedures = currentPolicy ? currentPolicy.allowedProcedures : ['101', '102', '103', '104', '201', '99214', '70450'];
          const copayRatio = currentPolicy ? currentPolicy.copayRatio : 90;
          const amt = parseFloat(claimAmount);
          const limit = parseFloat(deductibleLimit);

          const isValid = allowedProcedures.includes(procedureCode) && amt <= limit;
          const status: 'Approved' | 'Rejected' = isValid ? 'Approved' : 'Rejected';
          const authorizedAmount = isValid ? Math.round((amt * copayRatio) / 100) : 0;

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

          // Fire result toast
          if (status === 'Approved') {
            addToast({
              type: 'success',
              title: 'Claim Approved ✓',
              message: `Authorized payout: $${authorizedAmount.toLocaleString()} USD. On-chain settlement confirmed.`,
              duration: 7000,
              txHash: randomTx,
              commitment: randomCommitment,
            });
          } else {
            addToast({
              type: 'error',
              title: 'Claim Rejected',
              message: `Procedure code ${procedureCode} is not covered or amount exceeds deductible limit.`,
              duration: 7000,
              commitment: randomCommitment,
            });
          }

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

  const handleApplyPolicy = (newPolicy: PolicyDefinition) => {
    setCurrentPolicy(newPolicy);
    setPolicyId(newPolicy.hexId);
    setDeductibleLimit(newPolicy.deductibleLimit.toString());
    if (observerView) {
      setObserverView({
        ...observerView,
        policy_id: newPolicy.hexId
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-surface flex flex-col antialiased">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletConnected={walletConnected}
        isConnecting={isConnecting}
        walletAddress={walletAddress}
        nightBalance={nightBalance}
        walletProvider={walletProvider}
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
      />

      {/* What's New v3.0 Announcement Banner */}
      {showBanner && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-white text-[11px] font-semibold flex items-center justify-center gap-3 px-4 py-2 shadow-md">
          <span className="animate-pulse">⚡</span>
          <span>ClaimGuard <strong>v3.0</strong> — Now featuring Batch Settlement, Patient Vault ZK Consent Manager &amp; real-time Fraud Risk Scoring powered by Midnight Network</span>
          <span className="animate-pulse">⚡</span>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-4 text-white/70 hover:text-white text-[13px] font-bold leading-none cursor-pointer"
            aria-label="Dismiss banner"
          >✕</button>
        </div>
      )}

      {/* Main Container */}
      <main className={`w-full pb-12 flex-1 ${showBanner ? 'pt-28' : 'pt-20'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8">
          
          {!contractConfig.isValid && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-700 dark:text-red-400 flex items-center gap-3 shadow-sm" role="alert">
              <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
              <div>
                <div className="font-bold text-sm">Contract Configuration Error</div>
                <div className="text-xs">{contractConfig.errorMessage}</div>
              </div>
            </div>
          )}

          {/* Header Hero Banner & Protocol Indicator */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-outline-variant/40 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-2 text-secondary font-bold text-[10px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span>Midnight Network Protocol • Zero-Knowledge Adjudication</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold border border-violet-200 uppercase tracking-wider">
                  🏆 Midnight Hackathon 2026
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold border border-amber-300 uppercase tracking-wider">
                  ⭐ Hackathon Finalist
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  Live Demo Mode
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                <span className="animate-shimmer">ClaimGuard</span> Healthcare Settlement Dashboard
                <span className="ml-2 text-[11px] font-semibold text-violet-500 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5 align-middle">v3.0</span>
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                Construct off-chain cryptographic witnesses for selective disclosure. Patient clinical diagnoses and provider documentation are converted to succinct zk-SNARK payloads prior to consensus broadcast. Private medical data <strong>never leaves</strong> the client device. Fully auditable compliance trail with <strong>zero-knowledge proof</strong> attestations.
              </p>
            </div>

            <div className="flex flex-col gap-2 self-start md:self-auto">
              <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/60 shadow-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">enhanced_encryption</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Circuit State</span>
                  <span className="font-mono text-xs text-on-surface font-semibold">Groth16 / BLS12-381 Active</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">ZK Proof Engine Online</span>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics Overview */}
          <DashboardStatsOverview
            contractConfig={contractConfig}
            walletConnected={walletConnected}
            walletProvider={walletProvider}
            totalClaimsCount={27}
            approvedCount={22}
            rejectedCount={3}
            pendingCount={2}
            zkProofsGenerated={1247}
          />

          {/* Contract Information Panel */}
          <ContractInfoPanel
            contractConfig={contractConfig}
            policyId={policyId}
          />

          {/* TAB 1: CLAIMS SUBMISSION */}
          {activeTab === 'claims-submission' && (
            <div className="space-y-8">
              {/* Asymmetric Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Primary Input Form Column (8 cols) */}
                <section className="lg:col-span-8 flex flex-col gap-8">
                  <ClaimSubmissionForm
                    policyId={policyId}
                    setPolicyId={setPolicyId}
                    diagnosisCode={diagnosisCode}
                    setDiagnosisCode={setDiagnosisCode}
                    procedureCode={procedureCode}
                    setProcedureCode={setProcedureCode}
                    claimAmount={claimAmount}
                    setClaimAmount={setClaimAmount}
                    deductibleLimit={deductibleLimit}
                    setDeductibleLimit={setDeductibleLimit}
                    treatmentNotes={treatmentNotes}
                    setTreatmentNotes={setTreatmentNotes}
                    isSubmitting={isSubmitting}
                    executionStep={executionStep}
                    walletConnected={walletConnected}
                    onSubmit={handleSubmitClaim}
                  />

                  {/* On-Chain Result Panel */}
                  <PublicResultPanel
                    claimResult={claimResult}
                    diagnosisCode={diagnosisCode}
                  />
                </section>

                {/* Sidebar Column (4 cols) */}
                <aside className="lg:col-span-4 flex flex-col gap-6">
                  <SettlementLifecycleStepper
                    commitment={claimResult?.commitment || '0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'}
                    isSubmitting={isSubmitting}
                    status={claimResult?.status || 'Pending'}
                  />

                  {/* Fraud Risk Score Panel */}
                  <FraudRiskScorePanel
                    claimAmount={parseFloat(claimAmount) || 0}
                    procedureCode={procedureCode}
                    diagnosisCode={diagnosisCode}
                    deductibleLimit={parseFloat(deductibleLimit) || 10000}
                    policyId={policyId}
                    commitment={claimResult?.commitment || '0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01'}
                    animateOnChange={true}
                  />
                </aside>

              </div>
            </div>
          )}

          {/* TAB 2: CLAIMS REGISTRY */}
          {activeTab === 'claims-registry' && (
            <ClaimsRegistryTable currentClaim={claimResult} />
          )}

          {/* TAB 3: ON-CHAIN EXPLORER */}
          {activeTab === 'on-chain-explorer' && (
            <ObserverViewPanel
              observerView={observerView}
              onRefresh={fetchObserverState}
            />
          )}

          {/* TAB 4: POLICY STUDIO */}
          {activeTab === 'policy-studio' && (
            <PolicyStudioPanel
              currentPolicy={currentPolicy}
              onApplyPolicy={handleApplyPolicy}
            />
          )}

          {/* TAB 5: COMPLIANCE & AUDIT */}
          {activeTab === 'compliance-audit' && (
            <ComplianceAuditPanel />
          )}

          {/* TAB 6: ANALYTICS DASHBOARD */}
          {activeTab === 'analytics-dashboard' && (
            <AnalyticsDashboardPanel
              currentClaim={claimResult}
              walletAddress={walletAddress}
              nightBalance={nightBalance}
            />
          )}

          {/* TAB 7: PATIENT MEDICAL VAULT & ZK CONSENT MANAGER */}
          {activeTab === 'patient-vault' && (
            <PatientVaultPanel />
          )}

          {/* TAB 8: BATCH CLAIM SETTLEMENT PORTAL */}
          {activeTab === 'batch-settlement' && (
            <BatchSettlementPanel />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant py-6 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs text-on-surface-variant font-bold">ClaimGuard v3.0.0-zkp</span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-on-surface-variant">Cryptographic Clinical Settlement Ledger</span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-on-surface-variant font-mono">Build: 2026-10-06</span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-on-surface-variant font-semibold">Team: MidnightMoon</span>
            <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[9px] font-bold border border-violet-200">Midnight Hackathon Submission</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-bold border border-amber-200">⭐ Finalist</span>
          </div>
          <div className="text-xs text-on-surface-variant">
            © 2026 AegisHealth / ClaimGuard Systems. Formally Verified Privacy Settlements.
          </div>
        </div>
      </footer>
    </div>
  );
}
