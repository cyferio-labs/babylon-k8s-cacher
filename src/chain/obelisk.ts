import { Obelisk, SuiMoveNormalizedModules } from '@0xobelisk/sui-client';
import { NETWORK, PACKAGE_ID} from './config';
import metadata from './metadata.json';
import dotenv from 'dotenv';
dotenv.config();

const initObeliskClient = () => {
    const obelisk = new Obelisk({
      networkType: NETWORK,
      packageId: PACKAGE_ID,
      metadata: metadata as SuiMoveNormalizedModules,
      secretKey: process.env.OBELISK_SECRET_KEY
    });
    console.log(process.env.OBELISK_SECRET_KEY);
    return obelisk;
};


export{
  initObeliskClient
}
