import { ServiceProto } from 'tsrpc-proto';
import { ReqDaManager, ResDaManager } from './v1/Sui/PtlDaManager';
import { ReqStore, ResStore } from './v1/Warlus/PtlStore';

export interface ServiceType {
    api: {
        "v1/Sui/DaManager": {
            req: ReqDaManager,
            res: ResDaManager
        },
        "v1/Warlus/Store": {
            req: ReqStore,
            res: ResStore
        }
    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 9,
    "services": [
        {
            "id": 2,
            "name": "v1/Sui/DaManager",
            "type": "api"
        },
        {
            "id": 1,
            "name": "v1/Warlus/Store",
            "type": "api"
        }
    ],
    "types": {
        "v1/Sui/PtlDaManager/ReqDaManager": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "da_height",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "digest",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "v1/Sui/PtlDaManager/ResDaManager": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "digest",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "v1/Warlus/PtlStore/ReqStore": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "da_height",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 0,
                    "name": "blob",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "epochs",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "v1/Warlus/PtlStore/ResStore": {
            "type": "Interface",
            "properties": [
                {
                    "id": 2,
                    "name": "sui_digest",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        }
    }
};