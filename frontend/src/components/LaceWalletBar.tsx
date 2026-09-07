import React, { useState } from 'react';

interface LaceWalletBarProps {
  walletConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  nightBalance: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const LaceWalletBar: React.FC<LaceWalletBarProps> = ({
  walletConnected,
  isConnecting,
  walletAddress,
  nightBalance,
  onConnect,
  onDisconnect
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {!walletConnected ? (
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-tertiary text-on-primary rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          <span className="font-semibold text-xs tracking-tight">
            {isConnecting ? 'Connecting Lace...' : 'Connect Lace Wallet'}
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-1.5 pl-3 pr-1.5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
            <div className="flex items-center gap-2 pr-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col text-left">
                <span className="font-mono text-xs font-bold text-on-surface leading-tight">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                </span>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold leading-tight">
                  {nightBalance}
                </span>
              </div>
            </div>
            <button
              onClick={() => setPopoverOpen(!popoverOpen)}
              className="p-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors flex items-center"
              title="Wallet Details"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="material-symbols-outlined text-[16px]">
                {popoverOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {/* Interactive Popover */}
          {popoverOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl bg-surface-container-lowest p-4 shadow-xl border border-outline-variant z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Lace CIP-30 Session
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-mono text-primary font-bold">
                  Midnight Preprod
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low mb-3 space-y-2">
                <div className="text-[11px] text-on-surface-variant">Active Clinical Wallet Address</div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-semibold text-on-surface truncate">
                    {walletAddress}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-primary hover:text-tertiary p-1"
                    title="Copy Address"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-outline-variant/40">
                  <span className="text-xs font-medium text-on-surface-variant">Available Balance</span>
                  <span className="font-sans text-sm font-bold text-on-surface">{nightBalance}</span>
                </div>
              </div>

              <div className="space-y-1 mb-4 text-[11px] text-on-surface-variant">
                <div className="flex justify-between py-1 border-b border-outline-variant/30">
                  <span>ZK Witness Scope</span>
                  <span className="font-bold text-primary">VALIDATE_CLAIM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>ZK Compiler</span>
                  <span className="font-mono text-on-surface">Compact v0.14.2</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPopoverOpen(false);
                  onDisconnect();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-semibold text-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
