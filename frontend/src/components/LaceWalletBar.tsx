import React, { useState, useEffect } from 'react';
import { 
  WalletProvider, 
  WalletState, 
  checkAvailableWallets, 
  connectLace, 
  connect1AM 
} from '../utils/cardanoWallet';

interface LaceWalletBarProps {
  walletConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  nightBalance: string;
  walletProvider?: WalletProvider | null;
  onConnect: (provider?: WalletProvider) => void;
  onDisconnect: () => void;
}

export const LaceWalletBar: React.FC<LaceWalletBarProps> = ({
  walletConnected,
  isConnecting,
  walletAddress,
  nightBalance,
  walletProvider = 'Lace',
  onConnect,
  onDisconnect
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [available, setAvailable] = useState({ hasLace: false, has1AM: false });

  useEffect(() => {
    setAvailable(checkAvailableWallets());
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectWallet = (provider: WalletProvider) => {
    setModalOpen(false);
    onConnect(provider);
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Wallet State Simulator Controller */}
      <div className="hidden xl:flex items-center p-1 rounded-xl bg-surface-container-high border border-outline-variant/40 shadow-inner text-xs">
        <button
          onClick={onDisconnect}
          className={`px-3 py-1 rounded-lg font-semibold tracking-wide transition-all ${
            !walletConnected
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          Disconnected
        </button>
        <button
          onClick={() => handleSelectWallet('Lace')}
          className={`px-3 py-1 rounded-lg font-semibold tracking-wide transition-all ${
            walletConnected && walletProvider === 'Lace'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          Lace
        </button>
        <button
          onClick={() => handleSelectWallet('1AM')}
          className={`px-3 py-1 rounded-lg font-semibold tracking-wide transition-all ${
            walletConnected && walletProvider === '1AM'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          1AM
        </button>
      </div>

      {!walletConnected ? (
        <button
          onClick={() => setModalOpen(true)}
          disabled={isConnecting}
          className="flex items-center gap-2.5 px-4 py-2 bg-primary hover:bg-tertiary text-on-primary rounded-xl transition-all shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] hover:shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
          type="button"
        >
          <div className="w-5 h-5 rounded-full bg-surface-container-lowest flex items-center justify-center p-0.5 shrink-0">
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#131B2E"/>
              <path d="M7 14.5C8.5 16 11 16.5 13 15C15 13.5 16.5 14 17 14.5" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2"/>
              <circle cx="9" cy="9" fill="#FFFFFF" r="1.5"/>
              <circle cx="15" cy="9" fill="#FFFFFF" r="1.5"/>
            </svg>
          </div>
          <span className="font-semibold text-xs tracking-tight">
            {isConnecting ? 'Connecting Wallet...' : 'Connect Wallet (Lace / 1AM)'}
          </span>
        </button>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-2 p-1.5 pl-3 pr-1.5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
            <div className="flex items-center gap-2 pr-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-on-surface leading-tight">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-primary-fixed text-on-primary-fixed uppercase">
                    {walletProvider || 'Lace'}
                  </span>
                </div>
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold leading-tight">
                  {nightBalance}
                </span>
              </div>
            </div>
            <button
              onClick={() => setPopoverOpen(!popoverOpen)}
              className="p-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-0.5"
              title="Wallet Details"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="material-symbols-outlined text-[16px]">
                {popoverOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {/* Stitch CIP-30 Management Drawer/Popover */}
          {popoverOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl bg-surface-container-lowest p-4 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.04)] border border-outline-variant z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    {walletProvider === '1AM' ? '1AM Midnight ZK' : 'Lace CIP-30 Gateway'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-mono text-primary font-bold">
                  {walletProvider === '1AM' ? 'Midnight Native' : 'Cardano / Midnight'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low mb-3 space-y-2">
                <div className="text-[11px] text-on-surface-variant">
                  {walletProvider === '1AM' ? 'Active 1AM ZK Account' : 'Active Cardano Clinical Account'}
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-semibold text-on-surface truncate">
                    {walletAddress.slice(0, 14)}...{walletAddress.slice(-6)}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-primary hover:text-tertiary p-1 transition-colors"
                    title="Copy Full Address"
                    type="button"
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
                <div className="text-[11px] text-right text-on-surface-variant font-mono">≈ $937.53 USD</div>
              </div>

              <div className="space-y-1 mb-4 text-[11px] text-on-surface-variant">
                <div className="flex justify-between py-1 border-b border-outline-variant/30">
                  <span>Connection Protocol</span>
                  <span className="font-mono text-emerald-600 font-medium">CIP-30 Real-time</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/30">
                  <span>Proof Signing Scope</span>
                  <span className="font-bold text-primary">BATCH_SETTLE_CLAIM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Provider Target</span>
                  <span className="font-mono text-on-surface">{walletProvider === '1AM' ? '1AM Midnight Wallet' : 'Lace CIP-30'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setPopoverOpen(false);
                    setModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high font-semibold text-xs transition-all cursor-pointer border border-outline-variant/40"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  Switch Wallet (Lace / 1AM)
                </button>

                <button
                  onClick={() => {
                    setPopoverOpen(false);
                    onDisconnect();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-semibold text-xs transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Wallet Selection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <h3 className="font-bold text-base text-on-surface">Select Wallet Connection</h3>
                <p className="text-xs text-on-surface-variant">Choose your preferred Cardano / Midnight web wallet provider</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Lace Wallet */}
              <button
                onClick={() => handleSelectWallet('Lace')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 hover:border-primary transition-all text-left group cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#FFFFFF" fillOpacity="0.2"/>
                      <path d="M7 14.5C8.5 16 11 16.5 13 15C15 13.5 16.5 14 17 14.5" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2"/>
                      <circle cx="9" cy="9" fill="#FFFFFF" r="1.5"/>
                      <circle cx="15" cy="9" fill="#FFFFFF" r="1.5"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                      <span>Lace Wallet</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary-fixed text-on-primary-fixed font-bold">
                        CIP-30
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Cardano & Midnight Dual-Chain Web Gateway
                    </p>
                  </div>
                </div>

                <span className="material-symbols-outlined text-primary text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              {/* Option 2: 1AM Wallet */}
              <button
                onClick={() => handleSelectWallet('1AM')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 hover:border-secondary transition-all text-left group cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">lock</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                      <span>1AM Wallet</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-secondary-fixed text-on-secondary-fixed-variant font-bold">
                        Midnight ZK
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Native Midnight Zero-Knowledge Witness Custody
                    </p>
                  </div>
                </div>

                <span className="material-symbols-outlined text-secondary text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/40 text-xs text-on-surface-variant flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">info</span>
              <span>
                If your browser extension is installed, ClaimGuard will initiate a real CIP-30 permission handshake. If not detected, testnet proof keys are automatically provisioned.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


