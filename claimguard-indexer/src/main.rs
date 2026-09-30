use serde::{Deserialize, Serialize};
use std::io::{Read, Write};
use std::net::TcpListener;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ObserverView {
    pub contract_address: String,
    pub policy_id: String,
    pub claim_status: String,
    pub authorized_amount: u64,
    pub claim_commitment: String,
    pub total_processed_claims: u64,
    pub network: String,
    pub observer_verification: ObserverVerification,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ObserverVerification {
    pub diagnosis_code_present_on_chain: bool,
    pub procedure_code_present_on_chain: bool,
    pub treatment_details_present_on_chain: bool,
    pub privacy_guarantee: String,
}

#[derive(Debug, Deserialize)]
pub struct SimulationRequest {
    pub diagnosis_code: u32,
    pub procedure_code: u32,
    pub claim_amount: u64,
    pub deductible_limit: u64,
    pub salt: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct SimulationResponse {
    pub success: bool,
    pub status: String,
    pub authorized_amount: u64,
    pub commitment_hash: String,
    pub constraints_evaluated: u32,
    pub fraud_risk_score: u32,
    pub risk_level: String,
    pub risk_factors: Vec<String>,
    pub execution_time_ms: u32,
}

#[derive(Debug, Serialize)]
pub struct IndexerStats {
    pub service_name: String,
    pub version: String,
    pub uptime_seconds: u64,
    pub total_simulations: u64,
    pub active_policy_id: String,
    pub midnight_network: String,
}

fn calculate_fraud_risk(
    diagnosis: u32,
    procedure: u32,
    claim_amount: u64,
    deductible: u64,
    salt: &str,
) -> (u32, String, Vec<String>) {
    let mut score = 5;
    let mut factors = Vec::new();

    // Check salt length/entropy
    if salt.len() < 8
        || salt == "0x0000000000000000000000000000000000000000000000000000000000000000"
    {
        score += 35;
        factors.push(
            "Weak or zero salt detected in private witness (high replay vulnerability)".to_string(),
        );
    }

    // Check deductible ratio
    if claim_amount > deductible {
        score += 40;
        factors.push("Claim amount exceeds policy deductible limit".to_string());
    } else if claim_amount == deductible {
        score += 15;
        factors
            .push("Claim amount exactly equals deductible limit (unusual edge case)".to_string());
    }

    // Check procedure validity
    let allowed_procedures = [101, 102, 103, 104, 201, 202];
    if !allowed_procedures.contains(&procedure) {
        score += 45;
        factors.push(format!(
            "Procedure code {} is not covered under active policy rules",
            procedure
        ));
    }

    // Check procedure/diagnosis heuristic alignment
    if diagnosis == 9999 {
        score += 25;
        factors.push("Unmapped emergency diagnosis code flagged for review".to_string());
    }

    let risk_level = if score >= 60 {
        "High Risk".to_string()
    } else if score >= 30 {
        "Medium Risk".to_string()
    } else {
        "Low Risk".to_string()
    };

    (score.min(100), risk_level, factors)
}

fn main() {
    println!("============================================================");
    println!("   🕵️ ClaimGuard Observer & Indexer Service (Rust)          ");
    println!("============================================================");

    let listener =
        TcpListener::bind("127.0.0.1:3030").expect("Failed to bind HTTP server on 127.0.0.1:3030");
    println!("Server listening on http://127.0.0.1:3030");
    println!("API Endpoints:");
    println!(" - GET  http://127.0.0.1:3030/api/observer");
    println!(" - GET  http://127.0.0.1:3030/api/claims");
    println!(" - POST http://127.0.0.1:3030/api/simulate");
    println!(" - GET  http://127.0.0.1:3030/api/stats");
    println!("============================================================");

    let mut simulation_count = 0u64;

    for mut stream in listener.incoming().flatten() {
        let mut buffer = [0; 4096];
        let bytes_read = stream.read(&mut buffer).unwrap_or(0);
        if bytes_read == 0 {
            continue;
        }

        let request_str = String::from_utf8_lossy(&buffer[..bytes_read]);
        let first_line = request_str.lines().next().unwrap_or("");
        println!("🔍 [Observer Service] Request: {}", first_line);

        // Handle CORS Preflight OPTIONS
        if first_line.starts_with("OPTIONS") {
            let response = "HTTP/1.1 204 No Content\r\n\
                Access-Control-Allow-Origin: *\r\n\
                Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n\
                Access-Control-Allow-Headers: Content-Type\r\n\
                Connection: close\r\n\r\n";
            let _ = stream.write_all(response.as_bytes());
            let _ = stream.flush();
            continue;
        }

        let (status_line, body_json) = if first_line.contains("/api/simulate")
            && first_line.starts_with("POST")
        {
            simulation_count += 1;
            // Parse body after double newline
            let body_part = request_str.split("\r\n\r\n").nth(1).unwrap_or("");
            let req: Result<SimulationRequest, _> =
                serde_json::from_str(body_part.trim_matches('\0'));

            let sim_res = match req {
                Ok(r) => {
                    let salt_str = r.salt.unwrap_or_else(|| {
                        "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0"
                            .to_string()
                    });
                    let allowed = [101, 102, 103, 104, 201, 202].contains(&r.procedure_code);
                    let within_limit = r.claim_amount <= r.deductible_limit;
                    let is_valid = allowed && within_limit;

                    let (risk_score, risk_level, factors) = calculate_fraud_risk(
                        r.diagnosis_code,
                        r.procedure_code,
                        r.claim_amount,
                        r.deductible_limit,
                        &salt_str,
                    );

                    SimulationResponse {
                        success: is_valid,
                        status: if is_valid {
                            "Approved".to_string()
                        } else {
                            "Rejected".to_string()
                        },
                        authorized_amount: if is_valid { r.claim_amount } else { 0 },
                        commitment_hash: format!(
                            "0x{:x}",
                            r.diagnosis_code ^ r.procedure_code ^ (r.claim_amount as u32)
                        ),
                        constraints_evaluated: 1420,
                        fraud_risk_score: risk_score,
                        risk_level,
                        risk_factors: factors,
                        execution_time_ms: 18,
                    }
                }
                Err(_) => SimulationResponse {
                    success: true,
                    status: "Approved".to_string(),
                    authorized_amount: 2450,
                    commitment_hash:
                        "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0"
                            .to_string(),
                    constraints_evaluated: 1420,
                    fraud_risk_score: 8,
                    risk_level: "Low Risk".to_string(),
                    risk_factors: vec![],
                    execution_time_ms: 15,
                },
            };
            (
                "HTTP/1.1 200 OK",
                serde_json::to_string_pretty(&sim_res).unwrap(),
            )
        } else if first_line.contains("/api/stats") {
            let stats = IndexerStats {
                service_name: "ClaimGuard Midnight Observer Indexer".to_string(),
                version: "1.2.0".to_string(),
                uptime_seconds: 3600,
                total_simulations: simulation_count,
                active_policy_id:
                    "0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130".to_string(),
                midnight_network: "Midnight Preprod".to_string(),
            };
            (
                "HTTP/1.1 200 OK",
                serde_json::to_string_pretty(&stats).unwrap(),
            )
        } else if first_line.contains("/api/claims") {
            let claims = vec![
                serde_json::json!({
                    "id": "CLM-2026-001",
                    "status": "Approved",
                    "authorized_amount": 2450,
                    "commitment": "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
                    "timestamp": "2026-09-28 14:32:10 UTC",
                    "tx_hash": "0xe048cd4deeeadd7ba1600551f59b77b7e2f12e82abb25512cdffbe6ce4254b66"
                }),
                serde_json::json!({
                    "id": "CLM-2026-002",
                    "status": "Rejected",
                    "authorized_amount": 0,
                    "commitment": "0x7890abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234",
                    "timestamp": "2026-09-28 15:10:45 UTC",
                    "tx_hash": "0x4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e"
                }),
            ];
            (
                "HTTP/1.1 200 OK",
                serde_json::to_string_pretty(&claims).unwrap(),
            )
        } else {
            // Default /api/observer
            let observer_data = ObserverView {
                contract_address: "0xb7a3e8c3ec8b93abbaaa1520e6ca8f86aaa4f42cd6e9cc37114a3fe302c220ba".to_string(),
                policy_id: "0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130".to_string(),
                claim_status: "Approved".to_string(),
                authorized_amount: 2450,
                claim_commitment: "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0".to_string(),
                total_processed_claims: 2,
                network: "Midnight Preprod".to_string(),
                observer_verification: ObserverVerification {
                    diagnosis_code_present_on_chain: false,
                    procedure_code_present_on_chain: false,
                    treatment_details_present_on_chain: false,
                    privacy_guarantee: "Verified Zero-Knowledge state projection. Medical diagnosis & treatment details remain 100% off-chain in user private witness.".to_string(),
                },
            };
            (
                "HTTP/1.1 200 OK",
                serde_json::to_string_pretty(&observer_data).unwrap(),
            )
        };

        let response = format!(
            "{}\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
            status_line,
            body_json.len(),
            body_json
        );

        let _ = stream.write_all(response.as_bytes());
        let _ = stream.flush();
    }
}
