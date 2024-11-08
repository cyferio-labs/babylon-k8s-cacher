import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { InstantiateMsg, ExecuteMsg, SaveDataMsg, QueryMsg, QueryDataMsg, Uint64, DataResponse, StoredData } from "./CyferioStorage.types";
export interface CyferioStorageReadOnlyInterface {
  contractAddress: string;
  queryData: ({
    queryData
  }: {
    queryData: QueryDataMsg;
  }) => Promise<DataResponse>;
}
export class CyferioStorageQueryClient implements CyferioStorageReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;
  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.queryData = this.queryData.bind(this);
  }
  queryData = async ({
    queryData
  }: {
    queryData: QueryDataMsg;
  }): Promise<DataResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      query_data: {
        query_data: queryData
      }
    });
  };
}
export interface CyferioStorageInterface extends CyferioStorageReadOnlyInterface {
  contractAddress: string;
  sender: string;
  saveData: ({
    saveData
  }: {
    saveData: SaveDataMsg;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class CyferioStorageClient extends CyferioStorageQueryClient implements CyferioStorageInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;
  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.saveData = this.saveData.bind(this);
  }
  saveData = async ({
    saveData
  }: {
    saveData: SaveDataMsg;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      save_data: {
        save_data: saveData
      }
    }, fee, memo, _funds);
  };
}