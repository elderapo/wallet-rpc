import { ok } from "assert";
import bn from "bignumber.js";
import { Ethereum } from "../../defined/eth";
import { RPCResponse } from "../../defined/rpc";
import Client from "../client";
import { EthereumMethods as mtd } from "./mtd";
import {
  ERC20FuncSig,
  ERC20FuncSigUpper,
  hexToDecimalString,
  hexToNumber,
  isAddress,
  padAddress,
  toUtf8
} from "./util";

export class EthereumClient extends Client {
  // go-ethereum client RPC settings has no user and password for rpc
  constructor(
    ip: string,
    port: number = 8545,
    user: string = "",
    pass: string = ""
  ) {
    super(user, pass, ip, port);
  }

  /**
   * Returns an object with data about the sync status or false.
   * returns value
   * startingBlock: QUANTITY - The block at which the import started (will only be reset, after the sync reached his head)
   * currentBlock: QUANTITY - The current block, same as eth_blockNumber
   * highestBlock: QUANTITY - The estimated highest block
   */
  public syncProgress() {
    return this.RpcCall<boolean | Ethereum.IEthSyncing>(mtd.info.syncing, []);
  }

  public getBalance(
    address: string,
    status: Ethereum.Status = "latest"
  ): Promise<RPCResponse<string>> {
    return this.RpcCall<string>(mtd.address.balance, [address, status]);
  }

  // get block count
  // return hex number
  public getBlockCount() {
    return this.RpcCall(mtd.block.count);
  }

  public getBlockByHash(hash: string, getFullTx: boolean = false) {
    const param: [string, boolean] = [hash, getFullTx];
    return this.RpcCall<Ethereum.IBlock>(mtd.block.byHash, param);
  }

  /**
   * Get information about a block by block number.
   * @param symbol QUANTITY|TAG - integer of a block number, or the string "earliest", "latest" or "pending", as in the default block parameter.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
   */
  public getBlock(symbol: string) {
    const param: [string, boolean] = [symbol, false];
    return this.RpcCall<Ethereum.IBlockSimple>(mtd.block.byHeight, param);
  }

  public getBlockVerbose(symbol: string) {
    const param: [string, boolean] = [symbol, true];
    return this.RpcCall<Ethereum.IBlockVerbose>(mtd.block.byHeight, param);
  }

  public getTxByHash(hash: string) {
    return this.RpcCall<Ethereum.ITransaction>(mtd.tx.byHash, [hash]);
  }

  /**
   * Return raw transaction by hash
   * There is an "undocumented" method eth_getRawTransactionByHash
   * @param hash
   */
  public getRawTxByHash(hash: string) {
    return this.RpcCall<string>(mtd.tx.rawByHash, [hash]);
  }

  /**
   * Returns the receipt of a transaction by transaction hash.
   * Note That the receipt is not available for pending transactions.
   * @param hash tx hash
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges
   */
  public getTxReceipt(hash: string) {
    return this.RpcCall<Ethereum.ITxReceipt>(mtd.tx.receipt, [hash]);
  }

  public sendRawTx(raw: string) {
    return this.RpcCall<string>(mtd.tx.sendRaw, [raw]);
  }

  /**
   * Creates new message call transaction or a contract creation, if the data field contains code.
   * from: DATA, 20 Bytes - The address the transaction is send from.
   * to: DATA, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.
   * gas: QUANTITY - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.
   * gasPrice: QUANTITY - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas
   * value: QUANTITY - (optional) Integer of the value sent with this transaction
   * data: DATA - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. For details see Ethereum Contract ABI
   * nonce: QUANTITY - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
   * @see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
   */
  public sendTx(tx: Ethereum.ISentTxStruct) {
    return this.RpcCall(mtd.tx.send, [tx]);
  }

  /**
   * Returns the number of transactions sent from an address.
   * alias for getTxCount
   * !! Geth(<=1.8.12) isn't supports pending nonce.
   */
  public getAddrNonce(address: string, status: Ethereum.Status = "latest") {
    const param: string[] = [address, status];
    return this.RpcCall<string>(mtd.address.nonce, param);
  }

  /**
   * Returns next available nonce for transaction from given account. Includes pending block and transaction queue.
   * !! Only for parity node
   * @param address 
   * @see https://wiki.parity.io/JSONRPC-parity-module#parity_nextnonce
   */
  public getAddrNextNonce(address: string) {
    return this.RpcCall<string>(mtd.address.parity.pendingNonce, [address]);
  }

  /**
   * Returns the current price per gas in wei.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice
   */
  public getCurrentGasPrice() {
    return this.RpcCall<string>(mtd.gas.price, []);
  }

  /**
   * Executes a new message call immediately without creating a transaction on the block chain.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
   */
  public callFunc(
    param: Ethereum.ICallFuncParam,
    status: Ethereum.Status = "latest"
  ) {
    return this.RpcCall<string>(mtd.tx.call, [param, status]);
  }

  /**
   * Returns code at a given address.
   * @param address DATA, 20 Bytes - address
   * @param status integer block number, or the string "latest", "earliest" or "pending"
   * @returns the code from the given address
   */
  public getCode(address: string, status: Ethereum.Status) {
    return this.RpcCall<string>(mtd.address.code, [address, status]);
  }

  /**
   * Detect the address given is contract address or not
   * if contract self destructor return false
   * @param address string
   * @param status string
   * @returns boolean
   */
  public async isContract(address: string): Promise<boolean> {
    const { result } = await this.getCode(address, "latest");

    if (result !== "0x") {
      return true;
    }

    return false;
  }

  /**
   * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
   * The transaction will not be added to the blockchain.
   * Note that the estimate may be significantly more than the amount of gas actually used by the transaction,
   * for a variety of reasons including EVM mechanics and node performance.
   */
  public getEstimateGas(param: Ethereum.ICallFuncParam) {
    return this.RpcCall<string>(mtd.gas.estimate, [param]);
  }

  /**
   * Sign Message.
   * NOT Supports address which doesn't in you eth-rpc
   * @param address the address to sign with must be unlocked.
   * @param data N Bytes - message to sign
   */
  public signMessage(address: string, data: Buffer) {
    ok(isAddress(address), "Not a valid Ethereum address");
    return this.RpcCall<string>(mtd.tool.sign, [address, data.toString("hex")]);
  }

  /**
   * debug trace transaction
   * you should start geth with `--rpcapi="web3,trace"
   * @see https://github.com/ethereum/go-ethereum/wiki/Management-APIs#debug_tracetransaction
   */
  public traceTx(
    txid: string,
    opt?: {
      disableStorage?: boolean;
      disableMemory?: boolean;
      disableStack?: boolean;
      trace?: string;
      timeout?: string;
    }
  ) {
    return this.RpcCall<Ethereum.ITraceTxReturn>(mtd.debug.traceTx, [
      txid,
      opt
    ]);
  }

  public traceTxByParity(txid: string) {
    return this.RpcCall<Ethereum.IParityTxTrace[] | null>(mtd.tx.parity.trace, [
      txid
    ]);
  }

  public async ERC20Balance(
    token: string,
    address: string,
    isPending: boolean = true
  ) {
    const status = isPending ? "pending" : "latest";
    const param: Ethereum.ICallFuncParam = {
      data: ERC20FuncSig.balanceOf + padAddress(address),
      to: token
    };
    const { result: balance } = await this.callFunc(param, status);
    return balance;
  }

  public async ERC20Decimals(token: string): Promise<undefined | number> {
    const param: Ethereum.ICallFuncParam = {
      data: ERC20FuncSig.decimals,
      to: token
    };

    const PARAM: Ethereum.ICallFuncParam = {
      data: ERC20FuncSigUpper.DECIMALS,
      to: token
    };
    const [{ result: decimals }, { result: DECIMALS }] = await Promise.all([
      this.callFunc(param),
      this.callFunc(PARAM)
    ]);
    if (decimals === "0x" && DECIMALS === "0x") {
      return undefined;
    }
    return hexToNumber(decimals === "0x" ? DECIMALS : decimals);
  }

  public async ERC20TotalSupply(token: string): Promise<string | undefined> {
    const param: Ethereum.ICallFuncParam = {
      data: ERC20FuncSig.totalSupply,
      to: token
    };
    const { result: totalSupply } = await this.callFunc(param);
    if (totalSupply === "0x") {
      return undefined;
    }
    return hexToDecimalString(totalSupply);
  }

  public async ERC20Name(token: string): Promise<undefined | string> {
    const param: Ethereum.ICallFuncParam = {
      data: ERC20FuncSig.name,
      to: token
    };
    const PARAM: Ethereum.ICallFuncParam = {
      data: ERC20FuncSigUpper.NAME,
      to: token
    };
    const [{ result: name }, { result: NAME }] = await Promise.all([
      this.callFunc(param),
      this.callFunc(PARAM)
    ]);
    if (name === "0x" && NAME === "0x") {
      return undefined;
    }
    return toUtf8(name === "0x" ? NAME : name);
  }

  public async ERC20Symbol(token: string): Promise<undefined | string> {
    const param: Ethereum.ICallFuncParam = {
      data: ERC20FuncSig.symbol,
      to: token
    };
    const PARAM: Ethereum.ICallFuncParam = {
      data: ERC20FuncSigUpper.SYMBOL,
      to: token
    };
    const [{ result: symbol }, { result: SYMBOL }] = await Promise.all([
      this.callFunc(param),
      this.callFunc(PARAM)
    ]);
    if (symbol === "0x" && SYMBOL === "0x") {
      return undefined;
    }
    return toUtf8(symbol === "0x" ? SYMBOL : symbol);
  }

  public async ERC20TokenInfo(
    token: string
  ): Promise<{
    address: string;
    decimals: number | undefined;
    name: string | undefined;
    symbol: string | undefined;
    totalSupply: string | undefined;
  }> {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      this.ERC20Name(token),
      this.ERC20Symbol(token),
      this.ERC20Decimals(token),
      this.ERC20TotalSupply(token)
    ]);

    return {
      address: token,
      decimals,
      // if name === "" set it equal with symbol
      // eg. EOS token has no name
      name: name || symbol,
      symbol: symbol || name,
      totalSupply:
        totalSupply === undefined || decimals === undefined
          ? undefined
          : new bn(totalSupply).div(new bn(10).pow(decimals)).toString(10)
    };
  }
}
