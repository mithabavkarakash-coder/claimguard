
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;

class Contract {
    constructor(policyId) {
        this.policyId = policyId;
        this.claimStatus = "Unsubmitted";
        this.authorizedAmount = 0n;
        this.claimCommitment = "0x" + "0".repeat(64);
        this.processedCommitments = new Set();
    }

    validateClaim(witness, commitment, deductibleLimit) {
        if (this.processedCommitments.has(commitment)) {
            throw new Error("Duplicate claim commitment detected");
        }
        const allowedProcedures = [101, 102, 103, 104, 201, 202];
        const validProcedure = allowedProcedures.includes(witness.procedureCode);
        const withinLimit = BigInt(witness.claimAmount) <= BigInt(deductibleLimit);
        const isValid = validProcedure && withinLimit;

        this.claimCommitment = commitment;
        this.processedCommitments.add(commitment);

        if (isValid) {
            this.claimStatus = "Approved";
            this.authorizedAmount = BigInt(witness.claimAmount);
        } else {
            this.claimStatus = "Rejected";
            this.authorizedAmount = 0n;
        }

        return {
            isValid,
            claimStatus: this.claimStatus,
            authorizedAmount: this.authorizedAmount
        };
    }
}
exports.Contract = Contract;
