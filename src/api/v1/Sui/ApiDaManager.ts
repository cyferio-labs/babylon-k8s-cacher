import { ApiCall } from "tsrpc";
import { ReqDaManager, ResDaManager } from "../../../shared/protocols/v1/Sui/PtlDaManager";
import { initObeliskClient } from "../../../chain/obelisk";
import { Transaction, TransactionArgument } from "@0xobelisk/sui-client";
import { WARLUS_DA_ID } from "../../../chain/config";

export default async function (call: ApiCall<ReqDaManager, ResDaManager>) {
    const { da_height, digest } = call.req;

    if (!digest) {
        return call.error('Digest is empty');
    }

    try {
        const obelisk = initObeliskClient();
        const tx = new Transaction();
        
        const [balance, address] = await Promise.all([
            obelisk.getBalance(),
            obelisk.getAddress()
        ]);
        console.log("Address:", address, "Balance:", balance);

        const params: TransactionArgument[] = [
            tx.object(WARLUS_DA_ID),
            tx.pure.u64(da_height),
            tx.pure.string(digest),
        ];
        
        const suiTransactionBlockResponse = await obelisk.tx.walrus_da_system.add_blob(tx, params);  
        console.log("SuiTransactionBlockResponse:", suiTransactionBlockResponse);

        if ('effects' in suiTransactionBlockResponse && suiTransactionBlockResponse.effects?.status?.status === 'success') {
            return call.succ({ 
                time: new Date(),
                digest: suiTransactionBlockResponse.digest
            });
        } else {
            return call.error('Transaction failed');
        }
    } catch (error) {
        console.error("Error in ApiDaManager:", error);
        return call.error('An error occurred while processing the request');
    }
}