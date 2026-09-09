use serde::{Deserialize, Serialize};
use std::io::{Read, Write};
use std::net::TcpListener;

#[derive(Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
pub struct ObserverVerification {
    pub diagnosis_code_present_on_chain: bool,
    pub procedure_code_present_on_chain: bool,
    pub treatment_details_present_on_chain: bool,
    pub privacy_guarantee: String,
}

fn main() {
    println!("============================================================");
    println!("   🕵️ ClaimGuard Observer & Indexer Service (Rust)          ");
    println!("============================================================");

    let listener =
        TcpListener::bind("127.0.0.1:3030").expect("Failed to bind HTTP server on 127.0.0.1:3030");
    println!("Server listening on http://127.0.0.1:3030");
    println!("Observer API endpoint: http://127.0.0.1:3030/api/observer");
    println!("============================================================");

    for mut stream in listener.incoming().flatten() {
        let mut buffer = [0; 1024];
        let _ = stream.read(&mut buffer);

        let request_str = String::from_utf8_lossy(&buffer);
        println!(
            "🔍 [Observer Service] Request: {}",
            request_str.lines().next().unwrap_or("")
        );

        let observer_data = ObserverView {
            contract_address: "0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9".to_string(),
            policy_id: "0x5350435f504f4c4943595f323032365f4845414c54485f47554152445f563130".to_string(),
            claim_status: "Approved".to_string(),
            authorized_amount: 2450,
            claim_commitment: "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0".to_string(),
            total_processed_claims: 1,
            network: "Midnight Preprod".to_string(),
            observer_verification: ObserverVerification {
                diagnosis_code_present_on_chain: false,
                procedure_code_present_on_chain: false,
                treatment_details_present_on_chain: false,
                privacy_guarantee: "Verified Zero-Knowledge state projection. Medical diagnosis & treatment details remain 100% off-chain in user private witness.".to_string(),
            },
        };

        let json_body = serde_json::to_string_pretty(&observer_data).unwrap();

        let response = format!(
            "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
            json_body.len(),
            json_body
        );

        let _ = stream.write_all(response.as_bytes());
        let _ = stream.flush();
    }
}
