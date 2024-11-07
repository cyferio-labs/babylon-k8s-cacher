import { ServiceProto } from 'tsrpc-proto';
import { ReqDaManager, ResDaManager } from './v1/Babylon/PtlDaManager';

export interface ServiceType {
    api: {
        "v1/Babylon/DaManager": {
            req: ReqDaManager,
            res: ResDaManager
        }
    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 10,
    "services": [
        {
            "id": 3,
            "name": "v1/Babylon/DaManager",
            "type": "api"
        }
    ],
    "types": {
        "v1/Babylon/PtlDaManager/ReqDaManager": {
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
                    "name": "blob",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "v1/Babylon/PtlDaManager/ResDaManager": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "digest",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        }
    }
};