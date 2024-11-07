import { Secp256k1HdWallet } from '@cosmjs/launchpad';
import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
import {
	GasPrice,
	SigningStargateClient,
	SigningStargateClientOptions,
} from '@cosmjs/stargate';
import {
	SigningCosmWasmClient,
	SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import { HdPath, stringToPath } from '@cosmjs/crypto';
import { CyferioStorageClient } from '../ts/CyferioStorage.client';
import * as dotenv from 'dotenv';
dotenv.config();

export const rpcEndpoint = 'https://rpc-euphrates.devnet.babylonlabs.io';
export const restEndpoint = 'https://lcd-euphrates.devnet.babylonlabs.io';
export const chainId = 'euphrates-0.5.0';

export const prefix = 'bbn';

// export const signerAddress = 'bbn10gkn8s52lh9ywu6recy47m6j2laevug4zleg79';
export const contractAddress =
	'bbn1mm3m2lauvc88pcq33cdetwxf6uqsqgll3wq7w94ge0fah2mnmqxq02jd4s';

const defaultSigningClientOptions: SigningStargateClientOptions = {
	broadcastPollIntervalMs: 8_000,
	broadcastTimeoutMs: 32_000,
	gasPrice: GasPrice.fromString('1ubbn'),
};

export async function getSignerClient() {
	const mnemonic = process.env.MNEMONIC;

	if (mnemonic === undefined) {
		console.log('Missing MNEMONIC in .env');
		process.exit(0);
	}
	const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix,
	});
	const signingStargateClient = await SigningStargateClient.connectWithSigner(
		rpcEndpoint,
		wallet,
		{
			...defaultSigningClientOptions,
		}
	);
	return signingStargateClient;
}

export async function getContractClient() {
	const mnemonic = process.env.MNEMONIC;

	if (mnemonic === undefined) {
		console.log('Missing MNEMONIC in .env');
		process.exit(0);
	}
	const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix,
	});
	const client = await SigningCosmWasmClient.connectWithSigner(
		rpcEndpoint,
		wallet,
		{
			...defaultSigningClientOptions,
		}
	);
	return client;
}

export async function getCyferioStorageClientByWallet(
	wallet: DirectSecp256k1HdWallet
) {
	const signingCosmWasmClient = await getContractClientByWallet(wallet);
	const [{ address }] = await wallet.getAccounts();
	return new CyferioStorageClient(
		signingCosmWasmClient,
		address,
		contractAddress
	);
}

export async function getCyferioStorageClient() {
	const contractAddress = process.env.CONTRACT_ADDRESS;
	const mnemonic = process.env.MNEMONIC;
	if (contractAddress === undefined) {
		console.log('Missing CONTRACT_ADDRESS in .env');
		process.exit(0);
	}

	if (mnemonic === undefined) {
		console.log('Missing MNEMONIC in .env');
		process.exit(0);
	}
	const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix,
	});

	const signingCosmWasmClient = await getContractClient();
	const [{ address }] = await wallet.getAccounts();
	return new CyferioStorageClient(
		signingCosmWasmClient,
		address,
		contractAddress
	);
}

export async function getCyferioStorageClientBy(
	wallet: DirectSecp256k1HdWallet,
	contractAddress: string
) {
	const signingCosmWasmClient = await getContractClientByWallet(wallet);
	const [{ address }] = await wallet.getAccounts();
	return new CyferioStorageClient(
		signingCosmWasmClient,
		address,
		contractAddress
	);
}

export async function getContractClientByWallet(
	wallet: DirectSecp256k1HdWallet
) {
	const client = await SigningCosmWasmClient.connectWithSigner(
		rpcEndpoint,
		wallet,
		{
			...defaultSigningClientOptions,
		}
	);
	return client;
}

export async function getSignerClientByWallet(wallet: DirectSecp256k1HdWallet) {
	const signingStargateClient = await SigningStargateClient.connectWithSigner(
		rpcEndpoint,
		wallet,
		{
			...defaultSigningClientOptions,
		}
	);
	return signingStargateClient;
}

export async function generateAccount(index: number) {
	const mnemonic = process.env.MNEMONIC;

	if (mnemonic === undefined) {
		console.log('Missing MNEMONIC in .env');
		process.exit(0);
	}

	const path: HdPath = stringToPath(
		"m/44'/" + '118' + "'/0'/0/" + index.toString()
	);
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix,
		hdPaths: [path],
	});

	return wallet;
}

type MixedData<T> = T | Array<MixedData<T>> | { [key: string]: MixedData<T> };

export const stringizing = (
	o: MixedData<bigint>,
	path: MixedData<bigint>[] = []
): MixedData<string> => {
	if (path.includes(o)) {
		throw new Error('loop nesting!');
	}
	const newPath = [...path, o];

	if (Array.isArray(o)) {
		return o.map(item => stringizing(item, newPath));
	} else if (typeof o === 'object') {
		const output: { [key: string]: MixedData<string> } = {};
		for (const key in o) {
			output[key] = stringizing(o[key], newPath);
		}
		return output;
	} else {
		return o.toString();
	}
};