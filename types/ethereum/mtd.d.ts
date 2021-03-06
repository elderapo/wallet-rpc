export declare const EthereumMethods: {
    info: {
        syncing: string;
    };
    tool: {
        sign: string;
    };
    address: {
        balance: string;
        code: string;
        nonce: string;
        parity: {
            pendingNonce: string;
        };
    };
    block: {
        byHash: string;
        byHeight: string;
        count: string;
        txCountByHash: string;
        txCountByHeight: string;
    };
    debug: {
        traceBlock: string;
        traceTx: string;
    };
    gas: {
        estimate: string;
        price: string;
    };
    tx: {
        rawByHash: string;
        byHash: string;
        byHeight: string;
        call: string;
        receipt: string;
        send: string;
        sendRaw: string;
        parity: {
            trace: string;
        };
    };
    txpool: {
        content: string;
        status: string;
    };
    uncle: {
        byHash: string;
        byHeight: string;
    };
};
