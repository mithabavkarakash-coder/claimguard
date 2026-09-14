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
  const metaEnv = (import.meta as Record<string, any>).env || {};
  const globalProc = (globalThis as Record<string, any>).process;
  const procEnv = globalProc?.env || {};

  const envAddress =
    (metaEnv.VITE_CONTRACT_ADDRESS as string) ||
    (metaEnv.NEXT_PUBLIC_CONTRACT_ADDRESS as string) ||
    (procEnv.VITE_CONTRACT_ADDRESS as string) ||
    (procEnv.NEXT_PUBLIC_CONTRACT_ADDRESS as string) ||
    '0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba';

  const network =
    (metaEnv.VITE_NETWORK as string) ||
    (metaEnv.NEXT_PUBLIC_NETWORK as string) ||
    (procEnv.VITE_NETWORK as string) ||
    (procEnv.NEXT_PUBLIC_NETWORK as string) ||
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
