JSON RPC client of crypto coins by TypeScript

## Supports

- Bitcoin(core 0.16+)
- BitcoinCash(same with Bitcoin)
- Litecoin(same with Bitcoin)
- Ethereum(geth 1.8.0+ || parity 1.0.0+) and ERC20
- OmniLayer(includes USDT)

And CLI Supports, [learn more](#cli)!

## TODO Supports

- [ ] EOS

## Install

```shell
# pre-required: Node.js 8.9.x LTS && NPM 5.6+
npm install wallet-rpc --save
```

## Usage

### CommonJS

```js
import { Bitcoin, Ethereum } from "wallet-rpc";
// the default rpc port of bitcoin is 8332
const btcClient = new Bitcoin.RPC("username", "password", "ip", 8832);
// the default rpc of geth has no username and no password
// if you config the proxy you can pass them to constructor.
// the param order is ip-port-username-password
const ethClient = new Ethereum.RPC("ip");
btcClient
  .getTxInfo("txid")
  .then(txInfo => console.log)
  .catch(console.log);
// ...
// BulkCall see flow
```

### TypeScript

```typescript
// Bulk Call
btcClient
  // your can set generic `T` and return `T[]`
  // all the useful types can import from defined/*.d.ts
  .bulkRpcExec<string>([{
    id: 0,
    jsonrpc: "2.0",
    method: btcMtd.block.hash
    params: [100]
  },{
    id: 1,
    jsonrpc: "2.0",
    method: btcMtd.block.hash
    params: [200]
  }])

// Also can
btcClient.BulkAdd(Bitcoin.mtd.block.hash, [100], 0);
btcClient.BulkAdd(Bitcoin.mtd.block.hash, [200], 1);
btcClient.BulkCall();
```

## API

- [Bitcoin](./types/bitcoin/rpc.d.ts)
- [Ethereum && ERC20](./types/ethereum/rpc.d.ts)
- [EthereumUtil](./types/ethereum/util.d.ts)
- [OmniLayer(USDT)](./types/omni/rpc.d.ts)

Ethereum Util includes some useful methods like `getABI`, `sha3`.

## RPC Methods List

- [Bitcoin](./src/bitcoin/mtd.ts)
- [Ethereum](./src/ethereum/mtd.ts)
- [OmniLayer(USDT)](./src/omni/mtd.ts)

## CLI

```
npx wallet-rpc

> let eth = new Ethereum.RPC("https://mainnet.infura.io", 443);
> let tmp = eth.getBlockCount(log, log(e => e.message));
```

for development feature with `npx islishude/wallet-rpc@dev`

## Feedback

- [issue](https://github.com/isLishude/wallet-rpc/issues)
