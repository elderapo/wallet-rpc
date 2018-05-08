import { Ethereum } from "../defined/eth";
import { NumberResult, StringResult } from "../defined/rpc";
import Client from "./client";
import { EthMtd } from "./methods";

export default class EthereumClient extends Client {
  constructor(user: string, pass: string, ip: string, port: number = 30303) {
    super(user, pass, ip, port);
  }

  public getBlockCount() {
    return this.RpcCall(EthMtd.getBlockNumber) as Promise<StringResult>;
  }

  public getBlockByHash(hash: string, isFullTransaction: boolean = true) {
    const param: [string, boolean] = [hash, isFullTransaction];
    const method = EthMtd.getBlockByHash;
    return this.RpcCall(method, param) as Promise<Ethereum.IBlock>;
  }

  public getUncleByBlockHashAndIndex(hash: string, index: string) {
    const param: string[] = [hash, index];
    const method: string = EthMtd.getUncleByBlockHashAndIndex;
    return this.RpcCall(method, param) as Promise<Ethereum.IBlock>;
  }

  public getUncleByBlockNumberAndIndex(height: string, index: string) {
    const param: string[] = [height, index];
    const method: string = EthMtd.getUncleByBlockNumberAndIndex;
    return this.RpcCall(method, param) as Promise<Ethereum.IBlock>;
  }

  public sendRawTx(raw: string) {
    const method: string = EthMtd.sendRawTransaction;
    return this.RpcCall(method, [raw]) as Promise<StringResult>;
  }

  public sendTransaction(tx: Ethereum.ITxStruct) {
    return this.RpcCall(EthMtd.sendTransaction, [tx]) as Promise<StringResult>;
  }

  /**
   * Returns the number of transactions sent from an address.
   * in other word it's `nonce`
   * @param address
   * @param status
   */
  public getTransactionCount(
    address: string,
    status: Ethereum.Status = "latest"
  ) {
    const param: string[] = [address, status];
    const method: string = EthMtd.getTransactionCount;
    return this.RpcCall(method, param) as Promise<StringResult>;
  }

  /**
   * Returns the current price per gas in wei.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice
   */
  public getCurrentGasPrice() {
    const method: string = EthMtd.getCurrentGasPrice;
    return this.RpcCall(method, []) as Promise<StringResult>;
  }

  /**
   * Executes a new message call immediately without creating a transaction on the block chain.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
   */
  public callFunc(
    param: Ethereum.ICallFuncParam,
    status: Ethereum.Status = "latest"
  ) {
    return this.RpcCall(EthMtd.call, [param]) as Promise<StringResult>;
  }
}