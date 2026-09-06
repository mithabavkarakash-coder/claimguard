# ClaimGuard Privacy & Zero-Knowledge Security Model

## Overview
ClaimGuard implements programmable privacy on the Midnight Network using Compact smart contracts. It guarantees that sensitive patient healthcare data (diagnosis codes, procedure details, clinical notes) remain strictly inside the user's local zero-knowledge private witness during claim verification.

## Public vs. Private State Matrix

| Data Element | Classification | On-Chain Visibility | Verification Technique |
|---|---|---|---|
| **Diagnosis Code (ICD-10)** | Private Witness | 🔒 Completely Absent | ZK Proof Constraint Evaluation |
| **Procedure Code (CPT)** | Private Witness | 🔒 Completely Absent | Circuit Set Membership Check |
| **Claim Amount** | Private Witness | 🔒 Completely Absent | Circuit Deductible Bound Check |
| **Clinical Notes** | Private Witness | 🔒 Completely Absent | Off-Chain Local Prover Only |
| **Claim Status** | Public Ledger | 🌐 Public (`Approved`/`Rejected`) | Emitted Boolean Public State |
| **Authorized Amount** | Public Ledger | 🌐 Public (Reimbursement sum) | Emitted Public Uint State |
| **Claim Commitment** | Public Ledger | 🌐 Public (32-byte Nullifier) | Cryptographic Hash Nullifier |
| **Policy ID** | Public Ledger | 🌐 Public (Policy Identifier) | Public Ledger Field |

## Independent Observer Verification
An observer querying the Midnight ledger via `claimguard-indexer` (GET `/api/observer`) can inspect the deserialized state projection to verify that zero private diagnosis or treatment data touches the chain.
