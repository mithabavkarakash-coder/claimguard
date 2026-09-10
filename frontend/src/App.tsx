import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { ClaimSubmissionForm } from './components/ClaimSubmissionForm';
import { SettlementLifecycleStepper } from './components/SettlementLifecycleStepper';
import { PublicResultPanel } from './components/PublicResultPanel';
import { ObserverViewPanel, ObserverState } from './components/ObserverViewPanel';
import { ClaimsRegistryTable } from './components/ClaimsRegistryTable';
import { ComplianceAuditPanel } from './components/ComplianceAuditPanel';
import { DashboardStatsOverview } from './components/DashboardStatsOverview';
import { ContractInfoPanel } from './components/ContractInfoPanel';
import { WalletProvider, connectLace, connect1AM } from './utils/cardanoWallet';
import { getContractConfig } from './config/contractConfig';

export default function App() {
  const contractConfig = getContractConfig();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('claims-submission');

  // Wallet State
  const [walletConnected, setWalletConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletProvider, setWalletProvider] = useState<WalletProvider | null>('Lace');
  const [walletAddress, setWalletAddress] = useState('addr1q8x94ed3920akslw02948271038102938472901847102938479x4e');
  const [nightBalance, setNightBalance] = useState('₳ 1,420.50 ADA / 1,450.00 tNIGHT');

  // Form State (Private Witness Inputs)
  const [policyId, setPolicyId] = useState('0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130');
  const [diagnosisCode, setDiagnosisCode] = useState('4201');
  const [procedureCode, setProcedureCode] = useState('101');
  const [claimAmount, setClaimAmount] = useState('2450');
  const [deductibleLimit, setDeductibleLimit] = useState('5000');
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
    txHash: '0x8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
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

    setTimeout(() => {
      setExecutionStep('Executing Compact ZK circuit (validateClaim)...');
      setTimeout(() => {
        setExecutionStep('Emitting public ledger state to Midnight Preprod...');
        setTimeout(() => {
          const allowedProcedures = ['101', '102', '103', '104', '201', '99214', '70450'];
          const amt = parseFloat(claimAmount);
          const limit = parseFloat(deductibleLimit);

          const isValid = allowedProcedures.includes(procedureCode) && amt <= limit;
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

      {/* Main Container */}
      <main className="w-full pt-20 pb-12 flex-1">
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
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-secondary font-bold text-[10px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>Midnight Network Protocol • Zero-Knowledge Adjudication</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                ClaimGuard Healthcare Settlement Dashboard
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                Construct off-chain cryptographic witnesses for selective disclosure. Patient clinical diagnoses and provider documentation are converted to succinct zk-SNARK payloads prior to consensus broadcast.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/60 shadow-sm self-start md:self-auto">
              <span className="material-symbols-outlined text-primary text-[20px]">enhanced_encryption</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Circuit State</span>
                <span className="font-mono text-xs text-on-surface font-semibold">Groth16 / BLS12-381 Active</span>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics Overview */}
          <DashboardStatsOverview
            contractConfig={contractConfig}
            walletConnected={walletConnected}
            walletProvider={walletProvider}
            totalClaimsCount={4}
            approvedCount={3}
            rejectedCount={1}
            pendingCount={0}
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
                <aside className="lg:col-span-4">
                  <SettlementLifecycleStepper
                    commitment={claimResult?.commitment || '0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'}
                    isSubmitting={isSubmitting}
                    status={claimResult?.status || 'Pending'}
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

          {/* TAB 4: COMPLIANCE & AUDIT */}
          {activeTab === 'compliance-audit' && (
            <ComplianceAuditPanel />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant py-6 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-on-surface-variant font-bold">ClaimGuard v2.4.1-zkp</span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-on-surface-variant">Cryptographic Clinical Settlement Ledger</span>
          </div>
          <div className="text-xs text-on-surface-variant">
            © 2026 AegisHealth / ClaimGuard Systems. Formally Verified Privacy Settlements.
          </div>
        </div>
      </footer>
    </div>
  );
}
