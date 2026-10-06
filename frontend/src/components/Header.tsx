import React, { useState, useEffect } from 'react';
import { AegisHealthLogo } from './AegisHealthLogo';
import { LaceWalletBar } from './LaceWalletBar';
import { WalletProvider } from '../utils/cardanoWallet';

export type NavTab = 'claims-submission' | 'analytics-dashboard' | 'patient-vault' | 'batch-settlement' | 'claims-registry' | 'on-chain-explorer' | 'policy-studio' | 'compliance-audit';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  walletConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  nightBalance: string;
  walletProvider?: WalletProvider | null;
  onConnect: (provider?: WalletProvider) => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  walletConnected,
  isConnecting,
  walletAddress,
  nightBalance,
  walletProvider,
  onConnect,
  onDisconnect
}) => {
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [validators, setValidators] = useState(312);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate live validator count fluctuation
    const vTimer = setInterval(() => {
      setValidators(v => v + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(vTimer);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
      <div className="h-16 w-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 md:gap-8">
          <AegisHealthLogo className="h-7 w-auto" brandText="AegisHealth" />
          
          <nav className="hidden lg:flex items-center gap-6 h-16">
            <button
              onClick={() => setActiveTab('claims-submission')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'claims-submission'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              Claims Submission
            </button>

            <button
              onClick={() => setActiveTab('analytics-dashboard')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'analytics-dashboard'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              Analytics Dashboard
            </button>

            <button
              onClick={() => setActiveTab('patient-vault')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'patient-vault'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              Patient Vault
            </button>

            <button
              onClick={() => setActiveTab('batch-settlement')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'batch-settlement'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              Batch Portal
            </button>
            
            <button
              onClick={() => setActiveTab('claims-registry')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'claims-registry'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              Claims Registry
            </button>

            <button
              onClick={() => setActiveTab('on-chain-explorer')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'on-chain-explorer'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              On-Chain Explorer
            </button>

            <button
              onClick={() => setActiveTab('policy-studio')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'policy-studio'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              Policy Studio
            </button>

            <button
              onClick={() => setActiveTab('compliance-audit')}
              className={`transition-colors flex items-center h-full px-1 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === 'compliance-audit'
                  ? 'text-primary font-semibold border-primary'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent'
              }`}
            >
              Compliance & Audit
            </button>
          </nav>
        </div>

        {/* Right: Network Status & Lace Wallet Bar */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Cardano / Midnight Testnet v3
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 pr-1">
              <span className="text-[9px] text-on-surface-variant font-mono">Last sync: {liveTime}</span>
              <span className="text-outline-variant text-[9px]">•</span>
              <span className="text-[9px] text-emerald-600 font-semibold">{validators} validators active</span>
            </div>
          </div>

          <LaceWalletBar
            walletConnected={walletConnected}
            isConnecting={isConnecting}
            walletAddress={walletAddress}
            nightBalance={nightBalance}
            walletProvider={walletProvider}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="lg:hidden flex items-center justify-around border-t border-outline-variant bg-surface-container-lowest px-2 py-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('claims-submission')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'claims-submission' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Claims
        </button>
        <button
          onClick={() => setActiveTab('analytics-dashboard')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'analytics-dashboard' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('patient-vault')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'patient-vault' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Vault
        </button>
        <button
          onClick={() => setActiveTab('batch-settlement')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'batch-settlement' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Batch
        </button>
        <button
          onClick={() => setActiveTab('claims-registry')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'claims-registry' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Registry
        </button>
        <button
          onClick={() => setActiveTab('on-chain-explorer')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'on-chain-explorer' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Explorer
        </button>
        <button
          onClick={() => setActiveTab('policy-studio')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'policy-studio' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Policy Studio
        </button>
        <button
          onClick={() => setActiveTab('compliance-audit')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'compliance-audit' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Audit
        </button>
      </div>
    </header>
  );
};
