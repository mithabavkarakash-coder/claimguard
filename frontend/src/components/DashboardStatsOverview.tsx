import React from 'react';
import { ContractConfig } from '../config/contractConfig';
import { WalletProvider } from '../utils/cardanoWallet';

interface DashboardStatsOverviewProps {
  contractConfig: ContractConfig;
  walletConnected: boolean;
  walletProvider: WalletProvider | null;
  totalClaimsCount: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  zkProofsGenerated?: number;
}

export const DashboardStatsOverview: React.FC<DashboardStatsOverviewProps> = ({
  contractConfig,
  walletConnected,
  walletProvider,
  totalClaimsCount,
  approvedCount,
  rejectedCount,
  pendingCount,
  zkProofsGenerated = 312,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {/* Total Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm glass-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Total Claims</span>
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-primary">description</span>
          </div>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-on-surface font-mono font-tnum">
          {totalClaimsCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 font-medium">
          ZK-Settled On-Chain
        </div>
      </div>

      {/* Approved Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm glass-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
          <span>Approved</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-100/70 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
          </div>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-emerald-600 font-mono font-tnum">
          {approvedCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 font-medium">
          Authorized on Ledger
        </div>
      </div>

      {/* Rejected Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm glass-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-rose-700 text-[11px] font-bold uppercase tracking-wider">
          <span>Rejected</span>
          <div className="w-7 h-7 rounded-lg bg-rose-100/70 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-rose-600">cancel</span>
          </div>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-rose-600 font-mono font-tnum">
          {rejectedCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 font-medium">
          Policy Limit Exceeded
        </div>
      </div>

      {/* Pending Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm glass-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-amber-700 text-[11px] font-bold uppercase tracking-wider">
          <span>Pending</span>
          <div className="w-7 h-7 rounded-lg bg-amber-100/70 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-amber-600">hourglass_empty</span>
          </div>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-amber-600 font-mono font-tnum">
          {pendingCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 font-medium">
          In Proof Pipeline
        </div>
      </div>

      {/* Wallet Status */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm glass-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Wallet</span>
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-primary">account_balance_wallet</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          <span className="text-sm font-bold text-on-surface truncate">
            {walletConnected ? (walletProvider ? `${walletProvider} Wallet` : 'Connected') : 'Disconnected'}
          </span>
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 truncate font-medium">
          {walletConnected ? 'CIP-30 Active' : 'Connect Wallet'}
        </div>
      </div>

      {/* Network Status */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm glass-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Network</span>
          <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-secondary">lan</span>
          </div>
        </div>
        <div className="mt-2 text-sm font-bold text-on-surface font-mono truncate">
          {contractConfig.network.toUpperCase()}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 truncate font-medium">
          Midnight Testnet
        </div>
      </div>

      {/* ZK Proofs Generated */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm glass-card flex flex-col justify-between">
        <div className="flex items-center justify-between text-violet-700 text-[11px] font-bold uppercase tracking-wider">
          <span>ZK Proofs</span>
          <div className="w-7 h-7 rounded-lg bg-violet-100/70 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-violet-600">auto_awesome</span>
          </div>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-violet-600 font-mono font-tnum">
          {zkProofsGenerated.toLocaleString()}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 font-medium">
          Groth16 Proofs Total
        </div>
      </div>
    </div>
  );
};
