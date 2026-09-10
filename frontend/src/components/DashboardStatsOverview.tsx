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
}

export const DashboardStatsOverview: React.FC<DashboardStatsOverviewProps> = ({
  contractConfig,
  walletConnected,
  walletProvider,
  totalClaimsCount,
  approvedCount,
  rejectedCount,
  pendingCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Total Claims</span>
          <span className="material-symbols-outlined text-[18px] text-primary">description</span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-on-surface font-mono">
          {totalClaimsCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          Settled via ZK Circuits
        </div>
      </div>

      {/* Approved Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
          <span>Approved</span>
          <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-emerald-600 font-mono">
          {approvedCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          Authorized on Ledger
        </div>
      </div>

      {/* Rejected Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-rose-600 text-[11px] font-bold uppercase tracking-wider">
          <span>Rejected</span>
          <span className="material-symbols-outlined text-[18px] text-rose-600">cancel</span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-rose-600 font-mono">
          {rejectedCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          Policy Limit Exceeded / Invalid
        </div>
      </div>

      {/* Pending Claims */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-amber-600 text-[11px] font-bold uppercase tracking-wider">
          <span>Pending</span>
          <span className="material-symbols-outlined text-[18px] text-amber-600">hourglass_empty</span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-amber-600 font-mono">
          {pendingCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          In Proof Pipeline
        </div>
      </div>

      {/* Wallet Status */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Wallet Status</span>
          <span className="material-symbols-outlined text-[18px] text-primary">account_balance_wallet</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <span className="text-sm font-bold text-on-surface truncate">
            {walletConnected ? (walletProvider ? `${walletProvider} Wallet` : 'Connected') : 'Disconnected'}
          </span>
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 truncate">
          {walletConnected ? 'CIP-30 Active' : 'Connect Wallet'}
        </div>
      </div>

      {/* Network Status */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Network</span>
          <span className="material-symbols-outlined text-[18px] text-secondary">lan</span>
        </div>
        <div className="mt-2 text-sm font-bold text-on-surface font-mono truncate">
          {contractConfig.network.toUpperCase()}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 truncate">
          Midnight Testnet
        </div>
      </div>
    </div>
  );
};
