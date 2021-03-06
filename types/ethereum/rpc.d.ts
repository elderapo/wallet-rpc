/// <reference types="node" />
import { Ethereum } from "../../defined/eth";
import { RPCResponse } from "../../defined/rpc";
import Client from "../client";
export declare class EthereumClient extends Client {
    constructor(ip: string, port?: number, user?: string, pass?: string);
    syncProgress(): Promise<RPCResponse<boolean | Ethereum.IEthSyncing>>;
    getBalance(address: string, status?: Ethereum.Status): Promise<RPCResponse<string>>;
    getBlockCount(): Promise<RPCResponse<string>>;
    getBlockByHash(hash: string, getFullTx?: boolean): Promise<RPCResponse<Ethereum.IBlock>>;
    getBlock(symbol: string): Promise<RPCResponse<Ethereum.IBlockSimple>>;
    getBlockVerbose(symbol: string): Promise<RPCResponse<Ethereum.IBlockVerbose>>;
    getTxByHash(hash: string): Promise<RPCResponse<Ethereum.ITransaction>>;
    getRawTxByHash(hash: string): Promise<RPCResponse<string>>;
    getTxReceipt(hash: string): Promise<RPCResponse<Ethereum.ITxReceipt>>;
    sendRawTx(raw: string): Promise<RPCResponse<string>>;
    sendTx(tx: Ethereum.ISentTxStruct): Promise<RPCResponse<string>>;
    getAddrNonce(address: string, status?: Ethereum.Status): Promise<RPCResponse<string>>;
    getAddrNextNonce(address: string): Promise<RPCResponse<string>>;
    getCurrentGasPrice(): Promise<RPCResponse<string>>;
    callFunc(param: Ethereum.ICallFuncParam, status?: Ethereum.Status): Promise<RPCResponse<string>>;
    getCode(address: string, status: Ethereum.Status): Promise<RPCResponse<string>>;
    isContract(address: string): Promise<boolean>;
    getEstimateGas(param: Ethereum.ICallFuncParam): Promise<RPCResponse<string>>;
    signMessage(address: string, data: Buffer): Promise<RPCResponse<string>>;
    traceTx(txid: string, opt?: {
        disableStorage?: boolean;
        disableMemory?: boolean;
        disableStack?: boolean;
        trace?: string;
        timeout?: string;
    }): Promise<RPCResponse<Ethereum.ITraceTxReturn>>;
    traceTxByParity(txid: string): Promise<RPCResponse<Ethereum.IParityTxTrace[] | null>>;
    ERC20Balance(token: string, address: string, isPending?: boolean): Promise<string>;
    ERC20Decimals(token: string): Promise<undefined | number>;
    ERC20TotalSupply(token: string): Promise<string | undefined>;
    ERC20Name(token: string): Promise<undefined | string>;
    ERC20Symbol(token: string): Promise<undefined | string>;
    ERC20TokenInfo(token: string): Promise<{
        address: string;
        decimals: number | undefined;
        name: string | undefined;
        symbol: string | undefined;
        totalSupply: string | undefined;
    }>;
}
