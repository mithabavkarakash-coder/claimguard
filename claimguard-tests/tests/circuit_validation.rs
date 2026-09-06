use claimguard_tests::{ClaimStatus, ClaimValidationCircuitSimulator, PrivateWitness};

#[test]
fn test_valid_claim_within_policy_limits_approved() {
    let mut simulator = ClaimValidationCircuitSimulator::new(
        "0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130".to_string(),
        5000,
    );

    let witness = PrivateWitness {
        diagnosis_code: 4201,
        procedure_code: 101, // 101 = General Consultation (Allowed)
        claim_amount: 2450,
        treatment_details: "Routine cardiology evaluation & ECG examination".to_string(),
        salt: "0xa1b2c3d4e5f67890123456789abcdef0".to_string(),
    };

    let commitment = "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0";

    let result = simulator.validate_claim(&witness, commitment).expect("Circuit execution failed");

    assert!(result.is_valid, "Valid claim must pass circuit validation");
    assert_eq!(result.claim_status, ClaimStatus::Approved);
    assert_eq!(result.authorized_amount, 2450);
    assert_eq!(simulator.claim_status, ClaimStatus::Approved);
    assert_eq!(simulator.authorized_amount, 2450);
}

#[test]
fn test_claim_exceeding_deductible_limit_rejected() {
    let mut simulator = ClaimValidationCircuitSimulator::new(
        "0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130".to_string(),
        5000,
    );

    let witness = PrivateWitness {
        diagnosis_code: 4201,
        procedure_code: 102, // 102 = Diagnostic Lab (Allowed)
        claim_amount: 7500,  // Exceeds 5000 deductible limit!
        treatment_details: "Advanced genetic screening and whole genome sequencing".to_string(),
        salt: "0xb2c3d4e5f67890123456789abcdef012".to_string(),
    };

    let commitment = "0xb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01";

    let result = simulator.validate_claim(&witness, commitment).expect("Circuit execution failed");

    assert!(!result.is_valid, "Claim exceeding policy deductible limit must be rejected");
    assert_eq!(result.claim_status, ClaimStatus::Rejected);
    assert_eq!(result.authorized_amount, 0);
    assert_eq!(simulator.claim_status, ClaimStatus::Rejected);
    assert_eq!(simulator.authorized_amount, 0);
}

#[test]
fn test_duplicate_claim_submission_rejected() {
    let mut simulator = ClaimValidationCircuitSimulator::new(
        "0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130".to_string(),
        5000,
    );

    let witness = PrivateWitness {
        diagnosis_code: 4201,
        procedure_code: 101,
        claim_amount: 1200,
        treatment_details: "Physical therapy session".to_string(),
        salt: "0xc3d4e5f67890123456789abcdef01234".to_string(),
    };

    let commitment = "0xc3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef02";

    // First submission succeeds
    let first_res = simulator.validate_claim(&witness, commitment);
    assert!(first_res.is_ok(), "First claim submission should succeed");

    // Second submission with identical commitment must fail (anti-replay)
    let duplicate_res = simulator.validate_claim(&witness, commitment);
    assert!(duplicate_res.is_err(), "Duplicate claim commitment must be rejected");
    assert_eq!(
        duplicate_res.unwrap_err(),
        "Duplicate claim commitment detected"
    );
}

#[test]
fn test_uncovered_procedure_code_rejected() {
    let mut simulator = ClaimValidationCircuitSimulator::new(
        "0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130".to_string(),
        5000,
    );

    let witness = PrivateWitness {
        diagnosis_code: 4201,
        procedure_code: 999, // Uncovered procedure code!
        claim_amount: 1500,
        treatment_details: "Experimental elective procedure".to_string(),
        salt: "0xd4e5f67890123456789abcdef0123456".to_string(),
    };

    let commitment = "0xd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef03";

    let result = simulator.validate_claim(&witness, commitment).expect("Circuit execution failed");

    assert!(!result.is_valid, "Uncovered procedure code must be rejected by circuit logic");
    assert_eq!(result.claim_status, ClaimStatus::Rejected);
    assert_eq!(result.authorized_amount, 0);
}
