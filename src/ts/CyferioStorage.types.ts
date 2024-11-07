export interface InstantiateMsg {}
export type ExecuteMsg = {
  save_data: {
    save_data: SaveDataMsg;
  };
};
export interface SaveDataMsg {
  da_height: number;
  data: string;
}
export type QueryMsg = {
  query_data: {
    query_data: QueryDataMsg;
  };
};
export interface QueryDataMsg {
  da_height: number;
}
export type Uint64 = string;
export interface DataResponse {
  data: StoredData;
  finalized: boolean;
  latest_finalized_epoch: Uint64;
}
export interface StoredData {
  btc_height: Uint64;
  btc_timestamp: Uint64;
  da_height: number;
  data: string;
  data_hash: string;
  saved_at_btc_epoch: Uint64;
}