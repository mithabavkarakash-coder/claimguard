export interface ContractConfig {
  address: string;
  network: string;
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Validates if an EVM address string matches 0x followed by exactly 40 hexadecimal characters.
 */
export function isValidEvmAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address.trim());
}

/**
 * Loads the ClaimGuard contract configuration from NEXT_PUBLIC_CONTRACT_ADDRESS.
 */
export function getContractConfig(): ContractConfig {
  const envAddress =
    (import.meta.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CONTRACT_ADDRESS) ||
    '0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7';

  const network =
    (import.meta.env.NEXT_PUBLIC_NETWORK as string) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_NETWORK) ||
    'preprod';

  const cleanAddress = envAddress ? envAddress.trim() : '';
  const isValid = isValidEvmAddress(cleanAddress);

  return {
    address: cleanAddress,
    network,
    isValid,
    errorMessage: isValid
      ? null
      : 'ClaimGuard contract address is not configured correctly'
  };
}
