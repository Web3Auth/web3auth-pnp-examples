import { AttestationResult, EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import axios from "axios";
import { WalletClient } from "viem";

interface RequestOptions {
	method: string;
	params?: Record<string, unknown>;
	[key: string]: unknown;
}

interface AttestationResponse {
	success: boolean;
	message?: string;
	data?: {
		total: number;
		rows: unknown[];
	};
}

/**
 * Creates a SignProtocolClient instance
 */
function createSignClient(walletClient: WalletClient): SignProtocolClient {
	return new SignProtocolClient(SpMode.OnChain, {
		chain: EvmChains.sepolia,
		walletClient: walletClient,
	});
}

/**
 * Creates an attestation for the given address
 */
export async function attest(walletClient: WalletClient, address: string): Promise<AttestationResult> {
	const signClient = createSignClient(walletClient);
	const response = await signClient.createAttestation({
		schemaId: "0x65",
		data: {
			signer: address,
		},
		indexingValue: address,
	});

	return response;
}

/**
 * Fetches attestations for the given address
 */
export async function fetchAccountAttestations(address: string) {
	const response = await makeSignProtocolRequest("index/attestations", {
		method: "GET",
		params: {
			mode: "onchain",
			schemaId: "onchain_evm_11155111_0x65",
			attester: address,
			indexingValue: address,
		},
	});

	// Make sure the request was successfully processed.
	if (!response.success) {
		return {
			success: false,
			message: response?.message ?? "Attestation query failed.",
		};
	}

	// Return a message if no attestations are found.
	if (response.data?.total === 0) {
		return {
			success: false,
			message: "No attestation for this address found.",
		};
	}

	// Return all attestations that match our query.
	return {
		success: true,
		attestations: response.data?.rows || [],
	};
}

/**
 * Makes a request to the Sign Protocol API
 */
export async function makeSignProtocolRequest(endpoint: string, options: RequestOptions): Promise<AttestationResponse> {
	const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
	const res = await axios.request({
		url,
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		...options,
	});
	// Throw API errors
	if (res.status !== 200) {
		throw new Error(JSON.stringify(res));
	}

	return res.data;
}