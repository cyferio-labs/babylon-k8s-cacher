import { ApiCall } from "tsrpc";
import { ReqStore, ResStore } from "../../../shared/protocols/v1/Warlus/PtlStore";
import { BASE_PUBLISHER_URL } from "../../../chain/warlus";
import axios from 'axios';
import { initObeliskClient } from "../../../chain/obelisk";
import { Transaction, TransactionArgument } from "@0xobelisk/sui-client";
import { WARLUS_DA_ID } from "../../../chain/config";

export default async function (call: ApiCall<ReqStore, ResStore>) {
    const { da_height, blob, epochs } = call.req;

    if (!blob) {
        return call.error('Blob is empty');
    }
    try {
        
        // const josn_info = JSON.stringify(blob)
        // // 发送 POST 请求到 Walrus API
        // const response = await axios.put(`${BASE_PUBLISHER_URL}/v1/store`, josn_info, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // // 检查响应
        // if (response.status === 200) {
        //     console.log("response", response);
        //     return call.succ({
        //         time: new Date(),
        //         sui_digest: response.data.id // 假设 Walrus 返回的 ID 作为 sui_digest
        //     });
        // } else {
        //     return call.error('Failed to store blob in Walrus');
        // }
        const obelisk = initObeliskClient();
        const tx = new Transaction();
        
        const [balance, address] = await Promise.all([
            obelisk.getBalance(),
            obelisk.getAddress()
        ]);
        console.log("Address:", address, "Balance:", balance);
        const digest = "1"
        const params: TransactionArgument[] = [
            tx.object(WARLUS_DA_ID),
            tx.pure.u64(da_height),
            tx.pure.string(digest),
        ];
        
        const suiTransactionBlockResponse = await obelisk.tx.walrus_da_system.add_blob(tx, params);  
        console.log("SuiTransactionBlockResponse:", suiTransactionBlockResponse);
        if ('effects' in suiTransactionBlockResponse && suiTransactionBlockResponse.effects?.status?.status === 'success') {
            return call.succ({ 
                time: new Date().getTime().toString(),
                sui_digest: suiTransactionBlockResponse.digest
            });
        } else {
            return call.error('Transaction failed');
        }
    } catch (error) {
        console.error("Error in ApiStore:", error);
        return call.error('An error occurred while processing the request');
    }
}
