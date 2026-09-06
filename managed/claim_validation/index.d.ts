
export declare class Contract {
    policyId: string;
    claimStatus: string;
    authorizedAmount: bigint;
    claimCommitment: string;
    processedCommitments: Set<string>;
    constructor(policyId: string);
    validateClaim(witness: {
        diagnosisCode: number;
        procedureCode: number;
        claimAmount: number | bigint;
        treatmentDetails: string;
        salt: string;
    }, commitment: string, deductibleLimit: number | bigint): {
        isValid: boolean;
        claimStatus: string;
        authorizedAmount: bigint;
    };
}
