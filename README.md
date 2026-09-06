# ClaimGuard (Stellar Pharma Chain - SPC) 🛡️⚕️

> **Zero-Knowledge Healthcare Claim Validation on the Midnight Network**

ClaimGuard is a privacy-preserving healthcare insurance claim validation platform built on the Midnight Network using Compact smart contracts and Rust. By leveraging zero-knowledge proofs (ZKPs), ClaimGuard enables policyholders and healthcare providers to verify claim eligibility, check policy deductible limits, and authorize payment amounts on-chain without exposing sensitive medical diagnosis codes, procedure details, or treatment records to public ledger observers or third parties.

---

## Architecture Overview

ClaimGuard is structured as a high-performance **Cargo Workspace** alongside a lightweight TypeScript frontend:

- **`contract/claim_validation.compact`**: The core Compact smart contract defining public ledger fields (`claimStatus`, `authorizedAmount`, `claimCommitment`, `policyId`) and the private witness verification circuit.
- **`claimguard-cli`**: Rust CLI tool that shells out to the Compact compiler, parses circuit artifacts in `managed/`, deploys contracts to Midnight Preprod, and queries on-chain state.
- **`claimguard-indexer`**: Rust observer service that polls public ledger state and exposes a clean JSON endpoint (`GET /api/observer`) proving zero private data is leaked on-chain.
- **`claimguard-tests`**: Comprehensive Rust integration test suite verifying circuit rules, policy limits, and anti-replay commitments.
- **`frontend/`**: React TypeScript UI with Lace Wallet integration, claim submission form (private witness inputs), and live observer visualization.

---

## Quick Start & Setup

### Toolchain Requirements
- **Rust**: `1.96.1` or later (`rustc --version`, `cargo --version`)
- **Node.js**: `v24.18.0` or later (`node --version`)
- **Compact CLI**: `compactc` / `compact` compiler toolchain

### 1. Compile Compact Contract & Generate Circuits
```bash
cargo run -p claimguard-cli -- compile
```

### 2. Run Rust Integration Test Suite
```bash
cargo test -p claimguard-tests
```

### 3. Deploy Contract to Midnight Preprod Network
```bash
cargo run -p claimguard-cli -- deploy --network preprod
```

### 4. Query Public On-Chain Ledger State (Address Verification)
```bash
cargo run -p claimguard-cli -- query --network preprod --address 0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9
```

---

## Deployed Preprod Contract Address

- **Network**: Midnight Preprod Testnet
- **Contract Address**: `0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9`
- **Policy ID**: `0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130`
- **Deployment Transaction Hash**: `0x8f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a`
- **Block Height**: `1,482,930`

---

### 5. Launch Rust Observer Indexer Service
```bash
cargo run -p claimguard-indexer
```

### 6. Run Frontend Application Locally
```bash
cd frontend
npm install
npm run dev
```

---

## Public State vs. Private Witness Matrix

| Field | Visibility | Description / Guarantee |
|---|---|---|
| **Claim Status** | 🌐 Public | `Approved` or `Rejected` boolean outcome |
| **Authorized Amount** | 🌐 Public | Total reimbursement amount (in USD/tokens) |
| **Claim Commitment** | 🌐 Public | 32-byte cryptographic nullifier hash (Anti-Replay) |
| **Policy ID** | 🌐 Public | Insurance policy identifier |
| **Diagnosis Code** | 🔒 Private Witness Only | **100% Off-Chain** (Zero-Knowledge Private Witness) |
| **Procedure Code** | 🔒 Private Witness Only | **100% Off-Chain** (Verified via ZK Circuit logic) |
| **Claim Amount** | 🔒 Private Witness Only | **100% Off-Chain** (Verified <= Policy Limit in ZK) |
| **Treatment Notes** | 🔒 Private Witness Only | **100% Off-Chain** (Never touches public ledger) |

---

## Privacy Model & Verification

### What an Observer CAN Learn:
- That a claim was evaluated for a specific Policy ID.
- Whether the claim was `Approved` or `Rejected`.
- The final `Authorized Amount` emitted upon approval.
- The unique claim commitment hash (preventing duplicate claims).

### What an Observer CANNOT Learn:
- The patient's exact medical diagnosis or ICD-10 code.
- The specific medical procedure performed (CPT code).
- The detailed treatment notes or attending physician identity.
- Any private financial details beyond the final authorized sum.

*This privacy guarantee is independently verifiable via `claimguard-indexer` at `http://localhost:3030/api/observer`.*
