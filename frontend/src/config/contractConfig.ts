export interface ContractConfig {
  address: string;
  network: string;
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Validates if an EVM address string matches 0x followed by exactly 40 hexadecimal characters.
 */
export function isValidEvmAddress(address: string | undefined | null): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  return /^0x[0-9a-fA-F]{40}$/.test(trimmed);
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
    '';

  const network =
    (import.meta.env.NEXT_PUBLIC_NETWORK as string) ||
    (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_NETWORK : undefined) ||
    'preprod';

  const cleanAddress = envAddress.trim();
  const isValid = isValidEvmAddress(cleanAddress);

  let errorMessage: string | null = null;
  if (!cleanAddress) {
    errorMessage = 'ClaimGuard contract address is not configured correctly. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in environment variables.';
  } else if (!isValid) {
    errorMessage = `ClaimGuard contract address is not configured correctly: "${cleanAddress}" is not a valid 40-character EVM address.`;
  }

  return {
    address: cleanAddress,
    network,
    isValid,
    errorMessage
  };
}
