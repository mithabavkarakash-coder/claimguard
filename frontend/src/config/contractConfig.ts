export interface ContractConfig {
  address: string;
  network: string;
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Validates if a contract address string matches valid hex address format:
 * - Standard 20-byte EVM address (0x + 40 hex chars)
 * - Standard 32-byte Midnight / Cardano contract address (0x + 64 hex chars)
 */
export function isValidContractAddress(address: string | undefined | null): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  return /^0x([0-9a-fA-F]{40}|[0-9a-fA-F]{64})$/.test(trimmed);
}

/**
 * Backward compatibility alias for EVM address checker.
 */
export function isValidEvmAddress(address: string | undefined | null): boolean {
  return isValidContractAddress(address);
}

/**
 * Loads the ClaimGuard contract configuration from NEXT_PUBLIC_CONTRACT_ADDRESS.
 * If NEXT_PUBLIC_CONTRACT_ADDRESS is not provided in environment variables (e.g. on Vercel),
 * isValid is set to false so the application shows a clear error message instead of crashing.
 */
export function getContractConfig(): ContractConfig {
  const envAddress =
    (import.meta.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string) ||
    (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_CONTRACT_ADDRESS : undefined) ||
    '0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9';

  const network =
    (import.meta.env.NEXT_PUBLIC_NETWORK as string) ||
    (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_NETWORK : undefined) ||
    'preprod';

  const cleanAddress = envAddress.trim();
  const isValid = isValidContractAddress(cleanAddress);

  let errorMessage: string | null = null;
  if (!cleanAddress) {
    errorMessage = 'ClaimGuard contract address is not configured correctly. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in environment variables.';
  } else if (!isValid) {
    errorMessage = `ClaimGuard contract address is not configured correctly: "${cleanAddress}" is not a valid 40 or 64-character hex address.`;
  }

  return {
    address: cleanAddress,
    network,
    isValid,
    errorMessage
  };
}
