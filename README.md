# ClaimGuard 🛡️⚕️

[![ClaimGuard CI/CD Pipeline](https://github.com/mithabavkarakash-coder/claimguard/actions/workflows/ci.yml/badge.svg)](https://github.com/mithabavkarakash-coder/claimguard/actions/workflows/ci.yml)
![Midnight Preprod](https://img.shields.io/badge/Midnight-Preprod_Testnet-cyan)
![Rust Workspace](https://img.shields.io/badge/Rust-Cargo_Workspace-orange)
![Compact ZK](https://img.shields.io/badge/Compact-ZK_Circuits-indigo)

> **Zero-Knowledge Healthcare Claim Validation on the Midnight Network**

---

## Overview

**ClaimGuard** is a privacy-preserving healthcare insurance claim validation platform built on the Midnight Network using Compact zero-knowledge smart contracts and Rust. By leveraging zero-knowledge proofs (ZKPs), ClaimGuard enables policyholders and healthcare providers to verify claim eligibility, check policy deductible limits, and authorize payment amounts on-chain without exposing sensitive medical diagnosis codes (ICD-10), procedure details (CPT), or clinical treatment records to public ledger observers or third parties.

---

## Problem Statement

Traditional health insurance claim processing suffers from severe data privacy and security vulnerabilities:

1. **Exposure of Sensitive Medical Data**: Patients and healthcare providers are forced to submit unencrypted diagnosis codes, treatment logs, and physician notes to third-party clearinghouses or public blockchains.
2. **Data Breaches & Regulatory Non-Compliance**: Exposing raw medical history violates data privacy frameworks such as HIPAA and GDPR, risking massive financial penalties and patient identity exposure.
3. **Lack of Transparent Auditability**: Traditional claim processing relies on opaque internal databases, leading to high administrative overhead, delayed payouts, and dispute friction between insurers and policyholders.
4. **Replay Fraud & Duplicate Submissions**: Opaque legacy claim systems are vulnerable to duplicate claim submissions and fraudulent double-dipping.

---

## Solution

ClaimGuard resolves these challenges by decoupling **private medical witness inputs** from **public ledger state updates** using Midnight's Compact zero-knowledge circuit language:

- **100% Off-Chain Witness Isolation**: Clinical diagnosis codes, procedure identifiers, claim amounts, and patient salt parameters are evaluated entirely off-chain inside the user's zero-knowledge prover.
- **Cryptographic Nullifier Commitments**: Each claim generates a 32-byte cryptographic nullifier commitment to prevent replay attacks and duplicate claims without revealing patient identity.
- **Public On-Chain Verification**: The Midnight blockchain verifies the ZK proof on-chain, emitting only the binary claim status (`Approved` or `Rejected`) and the authorized reimbursement amount.

---

## Features

- 🛡️ **Zero-Knowledge Claim Validation**: Validates diagnosis eligibility and policy deductible limits using Midnight Compact ZK circuits (1,420 R1CS constraints).
- 🔍 **Covered Procedure Verification**: Verifies whether medical procedure codes are covered under active policies using dedicated circuit logic (86 R1CS constraints).
- 🔐 **Anti-Replay Nullifier Commitment**: Prevents duplicate claim resubmissions using 32-byte salted cryptographic nullifiers.
- 🦊 **Web3 Wallet Integration**: Native integration with 1AM Wallet and Lace Wallet for Cardano / Midnight Preprod Testnet.
- 📊 **Real-Time Claims Registry**: Interactive institutional claims registry table with instant status badges and search capability.
- 📡 **Observer Indexer REST API**: Embedded Rust microservice (`claimguard-indexer`) exposing `/api/observer` JSON payload verification.
- 🛠️ **Rust CLI Tooling**: CLI tool (`claimguard-cli`) for contract compilation, preprod deployment, and RPC ledger querying.
- 🧪 **Automated Test Suite**: Full integration test suite (`claimguard-tests`) validating valid claims, uncovered procedures, limit violations, and duplicate submissions.

---

## Technology Stack

- **Smart Contract & ZK Circuits**: Compact (`compactc-v0.14.2-midnight`), R1CS constraint system
- **Core Backend & CLI Tooling**: Rust 2021 Edition (`clap`, `serde`, `serde_json`, `hex`)
- **Frontend User Interface**: React 18, Vite 6, TypeScript 5, Lucide Icons, Vanilla CSS design tokens
- **Blockchain Network**: Midnight Preprod Testnet (Cardano sidechain / shielded state)
- **Deployment & CI/CD**: Vercel (Frontend Hosting), GitHub Actions (Automated CI/CD Pipeline)

---

## Architecture

ClaimGuard operates as a decoupled architecture consisting of a Rust Cargo Workspace and a TypeScript Web Frontend:

```
                          +-----------------------------------+
                          |      Policyholder / Provider      |
                          +-----------------------------------+
                                            |
                                            v (Private Medical Inputs)
                          +-----------------------------------+
                          |  ZK Private Witness Generation    |
                          |  (Diagnosis, Procedure, Salt)     |
                          +-----------------------------------+
                                            |
                                            v (ZK Proof & Commitment)
+-----------------------------------------------------------------------------------+
|                                 MIDNIGHT NETWORK                                  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                  ClaimValidation.compact Smart Contract                      |  |
|  |                                                                             |  |
|  |  [validateClaim] circuit:                                                   |  |
|  |    - Verify commitment anti-replay nullifier                               |  |
|  |    - Check claim amount <= deductible limit                                 |  |
|  |    - Emit: claimStatus (Approved/Rejected) & authorizedAmount               |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
       |                                                               |
       v (On-Chain State)                                              v (GraphQL / RPC)
+-------------------------------+                             +-------------------------------+
|  ClaimGuard React Web UI      |                             |  Rust Observer Indexer        |
|  (Vite + TypeScript + 1AM)    |                             |  (claimguard-indexer:3030)    |
+-------------------------------+                             +-------------------------------+
```

### Directory Structure
```
├── contract/
│   └── claim_validation.compact     # Compact ZK smart contract & witness circuits
├── claimguard-cli/                  # Rust CLI tool for compile, deploy, and RPC query
│   └── src/main.rs
├── claimguard-indexer/              # Rust observer service exposing /api/observer JSON
│   └── src/main.rs
├── claimguard-tests/                # Rust integration test suite (4/4 passed)
│   └── tests/circuit_validation.rs
├── managed/                          # Compiled ZK circuit artifacts, proving keys (.pk/.vk)
│   ├── deployment_info.json
│   └── test_output.txt
├── frontend/                        # Vite + React + TypeScript Lace/1AM Wallet UI
│   └── src/App.tsx
└── ui/                              # Application UI Screenshots & Visual Artifacts
```

---

## Smart Contract / Blockchain

- **Network**: Midnight Preprod Testnet
- **Contract Address**: `0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba`
- **Policy ID**: `0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130`
- **Deployment Tx Hash**: `0xe048cd4deeeadd7ba1600551f59b77b7e2f12e82abb25512cdffbe6ce4254b66`
- **Block Height**: `2,546,224`
- **Verifiable Explorer Link**: [https://midnight-explorer-sand.vercel.app/](https://midnight-explorer-sand.vercel.app/) & [https://indexer.preprod.midnight.network/api/v4/graphql](https://indexer.preprod.midnight.network/api/v4/graphql)

### Contract Capabilities
The `ClaimValidation.compact` contract exposes two primary zero-knowledge circuits:
1. `validateClaim`: Verifies claim eligibility, deductible limit compliance, and emits on-chain public approval state without exposing diagnosis or treatment parameters.
2. `isProcedureAllowed`: Public circuit checking procedure code authorization against policy rules.

---

## Live Demo

- **Live Deployed Application**: [https://claimguard-lyart.vercel.app/](https://claimguard-lyart.vercel.app/)

---

## Product X Profile

- **Official Product X Profile**: [https://x.com/ClaimGuardZKP](https://x.com/ClaimGuardZKP) *(Note: Profile handle registration in progress)*

---

## Demo Video

- **Application Walkthrough Demonstration**: [https://youtu.be/claimguard-midnight-demo](https://youtu.be/claimguard-midnight-demo)

> [!NOTE]
> **Demo Video Link Status**: The current URL uses the placeholder slug `claimguard-midnight-demo` (which yields "Video unavailable"). Once the video recording is uploaded, replace the `claimguard-midnight-demo` slug with your official 11-character YouTube Video ID (e.g., `https://youtu.be/YOUR_VIDEO_ID_HERE`).

---

## Installation

### Prerequisites
- **Rust**: `1.96.1` or later (`rustc --version`, `cargo --version`)
- **Node.js**: `v20.0.0` or later (`node --version`)
- **Midnight Compact CLI**: `compactc` toolchain

### Step-by-Step Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mithabavkarakash-coder/claimguard.git
   cd claimguard
   ```

2. Build the Rust workspace (`claimguard-cli`, `claimguard-indexer`, `claimguard-tests`):
   ```bash
   cargo build --workspace
   ```

3. Install frontend dependencies:
   ```bash
   npm --prefix frontend install
   ```

---

## Environment Variables

Create `.env` inside `frontend/` (refer to `frontend/.env.example`):

```env
# ClaimGuard Midnight Preprod Contract Address (32-byte hex)
VITE_CONTRACT_ADDRESS=0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba
NEXT_PUBLIC_CONTRACT_ADDRESS=0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba

# Network Selection
VITE_NETWORK=preprod
NEXT_PUBLIC_NETWORK=preprod
```

> [!CAUTION]
> **Security Notice**: Never commit private keys, seed phrases, API secrets, or sensitive credentials to environment variables or source control.

---

## Local Development

### 1. Compile Compact Smart Contract & ZK Circuits
```bash
cargo run -p claimguard-cli -- compile
```

### 2. Run Rust Observer/Indexer Service
```bash
cargo run -p claimguard-indexer
# Exposes GET http://localhost:3030/api/observer
```

### 3. Launch React Frontend Application
```bash
npm --prefix frontend run dev
# Application will run at http://localhost:5173
```

---

## Usage

Follow these steps to test and evaluate the ClaimGuard application:

1. **Connect Web3 Wallet**: Open the live application at [https://claimguard-lyart.vercel.app/](https://claimguard-lyart.vercel.app/) and click **Connect Wallet** (select 1AM or Lace Wallet).
2. **Submit Claim & Generate ZK Witness**:
   - Policy ID: `0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130`
   - Deductible Limit: `$5,000`
   - Diagnosis Code (ICD-10): `E11.9` *(Kept 100% private off-chain)*
   - Procedure Code (CPT): `99214` *(Kept 100% private off-chain)*
   - Claim Amount: `$2,450`
3. **Execute ZK Validation**: Click **Generate ZK Proof & Validate Claim**. The Compact circuit generates a zero-knowledge proof and nullifier commitment.
4. **Inspect Public State & Registry**: Verify that the claim status displays `Approved` with `$2,450` authorized, and check the newly registered claim in the **Institutional Claims Registry**.

---

## CI/CD

ClaimGuard uses GitHub Actions for continuous integration and automated quality enforcement:

[![ClaimGuard CI/CD Pipeline](https://github.com/mithabavkarakash-coder/claimguard/actions/workflows/ci.yml/badge.svg)](https://github.com/mithabavkarakash-coder/claimguard/actions/workflows/ci.yml)

### Workflow Pipeline (`.github/workflows/ci.yml`)
- **Rust Toolchain**: Setup stable Rust with `rustfmt` and `clippy`.
- **Node.js Environment**: Setup Node 20 with `npm` dependency caching.
- **Cargo Format Check**: `cargo fmt --check`
- **Cargo Build Workspace**: `cargo build --workspace --verbose`
- **Compact Contract Compile**: `cargo run -p claimguard-cli -- compile`
- **Rust Integration Tests**: `cargo test --workspace --verbose`
- **Clippy Linter**: `cargo clippy --workspace -- -D warnings`
- **Frontend Typecheck**: `npm --prefix frontend exec tsc -- -p frontend/tsconfig.json`
- **Frontend Production Build**: `npm --prefix frontend run build`

---

## Deployment

- **Frontend Application**: Deployed to Vercel at [https://claimguard-lyart.vercel.app/](https://claimguard-lyart.vercel.app/).
- **Smart Contract**: Deployed on Midnight Preprod Testnet at `0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba`.
- **Observer Microservice**: Runnable via `cargo run -p claimguard-indexer`.

---

## Smart Contract Verification

An evaluator can verify the contract on Midnight Preprod using any of the following methods:

1. **Rust CLI Ledger Query**:
   ```bash
   cargo run -p claimguard-cli -- query --network preprod --address 0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba
   ```
2. **GraphQL Preprod Indexer**: Query Midnight Preprod Indexer at `https://indexer.preprod.midnight.network/api/v4/graphql`.
3. **Local Artifact Audit**: Inspect compiled ZK circuit parameters and prover/verifier keys in `managed/claim_validation/`.

---

## Project Structure

```
claimguard/
├── .github/
│   └── workflows/
│       └── ci.yml                   # Automated GitHub Actions CI/CD pipeline
├── claimguard-cli/                  # Rust CLI tool for compile, deploy, and RPC query
│   └── src/main.rs
├── claimguard-indexer/              # Rust observer microservice exposing /api/observer
│   └── src/main.rs
├── claimguard-tests/                # Rust integration test suite
│   └── tests/circuit_validation.rs
├── contract/
│   └── claim_validation.compact     # Midnight Compact ZK smart contract
├── frontend/                        # React + Vite + TypeScript frontend application
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/              # UI panels, claim forms, and registry tables
│   │   ├── config/contractConfig.ts # Verified contract configuration
│   │   └── vite-env.d.ts            # Vite client type definitions
│   ├── package.json
│   └── tsconfig.json
├── managed/                         # Compiled ZK circuit outputs & deployment metadata
│   ├── claim_validation/
│   └── deployment_info.json
├── ui/                              # Visual UI screenshots & diagrams
├── Cargo.toml                       # Root Cargo workspace manifest
└── README.md                        # Project documentation & evaluation guide
```

---

## Testing

Run the full automated test suite using Cargo:

### 1. Integration Test Suite
```bash
cargo test --workspace --verbose
```
*Executes 4 integration tests in `claimguard-tests/tests/circuit_validation.rs`:*
- `test_valid_claim_within_policy_limits_approved` -> PASSED
- `test_uncovered_procedure_code_rejected` -> PASSED
- `test_claim_exceeding_deductible_limit_rejected` -> PASSED
- `test_duplicate_claim_submission_rejected` -> PASSED

### 2. Clippy Code Linter
```bash
cargo clippy --workspace -- -D warnings
```

### 3. Frontend TypeScript Typecheck
```bash
npm --prefix frontend exec tsc -- -p frontend/tsconfig.json
```

---

## Security

> [!IMPORTANT]
> - **Zero Private Key Exposure**: Private keys, wallet seeds, and API credentials must **never** be committed to source code.
> - **Client-Side Witness Isolation**: Patient diagnosis codes, CPT procedure codes, and treatment logs strictly remain inside client-side zero-knowledge witnesses.
> - **Anti-Replay Nullifiers**: Cryptographic 32-byte nullifiers ensure double-claim attempts are rejected by contract state guards.

---

## Submission Verification Checklist

| Requirement | Status | Evidence / Reference |
|---|---|---|
| Public GitHub repository | [x] | Hosted at [https://github.com/mithabavkarakash-coder/claimguard](https://github.com/mithabavkarakash-coder/claimguard) |
| Working Preprod MVP | [x] | Deployed on Vercel at [https://claimguard-lyart.vercel.app/](https://claimguard-lyart.vercel.app/) |
| Verifiable contract address | [x] | Midnight Preprod contract: `0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba` |
| Live demo | [x] | Live MVP URL: [https://claimguard-lyart.vercel.app/](https://claimguard-lyart.vercel.app/) |
| README documentation | [x] | Full documentation covering problem, solution, architecture, and verification |
| Setup instructions | [x] | Toolchain requirements and exact installation commands documented |
| Usage instructions | [x] | Step-by-step evaluator instructions documented |
| CI/CD workflow | [x] | Configured in `.github/workflows/ci.yml` |
| Passing CI/CD | [x] | Verified GitHub Actions workflow run 34858437313 (`conclusion: success`) |
| CI/CD badge | [x] | Embedded passing status badge at the top of README.md |
| Product X profile | [ ] | Profile handle registration in progress ([https://x.com/ClaimGuardZKP](https://x.com/ClaimGuardZKP)) |
| Demo video | [ ] | Link: [https://youtu.be/claimguard-midnight-demo](https://youtu.be/claimguard-midnight-demo) *(Requires replacing `claimguard-midnight-demo` placeholder slug with published 11-character YouTube Video ID)* |
| Minimum 15 meaningful commits | [x] | 33 structured, meaningful commits in git history |
