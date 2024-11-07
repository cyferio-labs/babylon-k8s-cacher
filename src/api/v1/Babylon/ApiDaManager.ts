import { ApiCall } from "tsrpc";
import { toUtf8 } from '@cosmjs/encoding';
import {
	getSignerClient,
	generateAccount,
	getContractClientByWallet,
	contractAddress,
} from '../../../chain/config';
import {
	GasPrice,
	calculateFee,
	MsgSendEncodeObject,
	SignerData,
	StdFee,
} from '@cosmjs/stargate';
import { coins} from '@cosmjs/amino';

import {
	ExecuteInstruction,
	MsgExecuteContractEncodeObject,
	SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { ReqDaManager, ResDaManager } from "../../../shared/protocols/v1/Babylon/PtlDaManager";

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms));

export async function batchSend(signerAddress: string, recipients: string[]) {
	const batchSize = 1500;
	let client = await getSignerClient();

	const amount = coins('100000', 'ubbn'); // 0.1

	const gasPrice = GasPrice.fromString('1ubbn');

	for (let i = 0; i < recipients.length; i += batchSize) {
		const batchRecipients = recipients.slice(i, i + batchSize);
		let msgs: MsgSendEncodeObject[] = batchRecipients.map(recipient => {
			return {
				typeUrl: '/cosmos.bank.v1beta1.MsgSend',
				value: {
					fromAddress: signerAddress,
					toAddress: recipient,
					amount: amount,
				},
			};
		});

		const fee = calculateFee(100000 * msgs.length, gasPrice);
		const result = await client.signAndBroadcast(signerAddress, msgs, fee);
		console.log(`Faucet tx: ${result.transactionHash}`);
	}
}
async function saveData(
	client: SigningCosmWasmClient,
	senderAddress: string,
	data: string,
	da_height: number
) {
	let hexData = Buffer.from(data).toString('hex');
	console.log(hexData);

	let instructions: ExecuteInstruction[] = [
		{
			contractAddress: contractAddress,
			msg: {
				save_data: {
					save_data: {
						data: hexData,
						da_height: da_height,
					},
				},
			},
		},
	];

	const msgs: MsgExecuteContractEncodeObject[] = instructions.map(i => ({
		typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
		value: MsgExecuteContract.fromPartial({
			sender: senderAddress,
			contract: i.contractAddress,
			msg: toUtf8(JSON.stringify(i.msg)),
			funds: [...(i.funds || [])],
		}),
	}));
	// Replace execute call with this approach since there are issues with logs parsing in execute
	// https://github.com/cosmos/cosmjs/blob/main/packages/cosmwasm-stargate/src/signingcosmwasmclient.ts#L532
	// https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/logs.ts#L57-L68
	const result = await client.signAndBroadcast(senderAddress, msgs, 'auto');

	return result;
}

export default async function (call: ApiCall<ReqDaManager, ResDaManager>) {
    const { da_height, blob } = call.req;

    if (!blob) {
        return call.error('blob is empty');
    }

    try {
		let signer = await generateAccount(0);
		let client = await getContractClientByWallet(signer);
		let signerAddress = (await signer.getAccounts())[0].address;
		let res = await saveData(client, signerAddress, blob, Number(da_height));
		console.log(res);
		console.log(res.transactionHash);
		return call.succ({
			time: new Date(),
			digest: res.transactionHash,
		});
	} catch (error) {
        console.error("Error in ApiDaManager:", error);
        return call.error('An error occurred while processing the request');
    }
}