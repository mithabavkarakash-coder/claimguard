use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ClaimStatus {
    Unsubmitted,
    Approved,
    Rejected,
}

#[derive(Debug, Clone)]
pub struct PrivateWitness {
    pub diagnosis_code: u32,
    pub procedure_code: u32,
    pub claim_amount: u64,
    pub treatment_details: String,
    pub salt: String,
}

#[derive(Debug, Clone)]
pub struct ValidationResult {
    pub is_valid: bool,
    pub claim_status: ClaimStatus,
    pub authorized_amount: u64,
    pub commitment: String,
}

pub struct ClaimValidationCircuitSimulator {
    pub policy_id: String,
    pub claim_status: ClaimStatus,
    pub authorized_amount: u64,
    pub claim_commitment: String,
    pub processed_commitments: HashSet<String>,
    pub deductible_limit: u64,
}

impl ClaimValidationCircuitSimulator {
    pub fn new(policy_id: String, deductible_limit: u64) -> Self {
        Self {
            policy_id,
            claim_status: ClaimStatus::Unsubmitted,
            authorized_amount: 0,
            claim_commitment: "0x0000000000000000000000000000000000000000000000000000000000000000"
                .to_string(),
            processed_commitments: HashSet::new(),
            deductible_limit,
        }
    }

    pub fn is_procedure_allowed(&self, code: u32) -> bool {
        matches!(code, 101 | 102 | 103 | 104 | 201 | 202)
    }

    pub fn validate_claim(
        &mut self,
        witness: &PrivateWitness,
        commitment: &str,
    ) -> Result<ValidationResult, String> {
        // Rule 1: Anti-replay / Duplicate commitment check
        if self.processed_commitments.contains(commitment) {
            return Err("Duplicate claim commitment detected".to_string());
        }

        // Rule 2: Procedure code authorization check
        let procedure_valid = self.is_procedure_allowed(witness.procedure_code);

        // Rule 3: Policy deductible limit check
        let amount_valid = witness.claim_amount <= self.deductible_limit;

        let is_valid = procedure_valid && amount_valid;

        // Update Public Ledger State
        self.claim_commitment = commitment.to_string();
        self.processed_commitments.insert(commitment.to_string());

        if is_valid {
            self.claim_status = ClaimStatus::Approved;
            self.authorized_amount = witness.claim_amount;
        } else {
            self.claim_status = ClaimStatus::Rejected;
            self.authorized_amount = 0;
        }

        Ok(ValidationResult {
            is_valid,
            claim_status: self.claim_status.clone(),
            authorized_amount: self.authorized_amount,
            commitment: commitment.to_string(),
        })
    }
}
