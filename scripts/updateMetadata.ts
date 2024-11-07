import {loadMetadata } from '@0xobelisk/sui-client';
import * as fs from 'fs';
import * as path from 'path';
import { NETWORK, PACKAGE_ID } from '../src/chain/config';

async function main() {
  const metadata = await loadMetadata(NETWORK, PACKAGE_ID);
  console.log(metadata);
  fs.writeFileSync(
    path.join(__dirname, `../metadata/testnet/${PACKAGE_ID}.json`),
    JSON.stringify(metadata, null, 2)
  );
}

main();