import React from 'react';
import { ContractConfig } from '../config/contractConfig';

interface ContractInfoPanelProps {
  contractConfig: ContractConfig;
  policyId?: string;
}

export const ContractInfoPanel: React.FC<ContractInfoPanelProps> = ({ contractConfig, policyId }) => {
  const defaultPolicyId = policyId || '0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130';
  const explorerUrl = `https://preprod.midnight.network/contract/${contractConfig.address}`;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">verified</span>
          <div>
            <h3 className="text-sm font-bold text-on-surface">Contract Information</h3>
            <p className="text-[11px] text-on-surface-variant">Live Midnight Compact Smart Contract Protocol</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Preprod
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        {/* Network */}
        <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Network</span>
          <div className="font-bold text-on-surface truncate">Midnight {contractConfig.network}</div>
        </div>

        {/* Contract Address */}
        <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Contract Address</span>
          <div className="font-bold text-primary truncate" title={contractConfig.address}>
            {contractConfig.address.slice(0, 10)}...{contractConfig.address.slice(-8)}
          </div>
        </div>

        {/* Policy ID */}
        <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Policy ID</span>
          <div className="font-bold text-on-surface truncate" title={defaultPolicyId}>
            {defaultPolicyId.slice(0, 10)}...{defaultPolicyId.slice(-8)}
          </div>
        </div>

        {/* Explorer */}
        <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Explorer</span>
          <div>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-secondary hover:underline cursor-pointer"
            >
              <span>View On Explorer</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
