"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniLayerMethods = {
    info: {
        client: "omni_getinfo"
    },
    property: {
        list: "omni_listproperties",
        info: "omni_getproperty"
    },
    address: {
        balance: "omni_getbalance",
        allBalance: "omni_getallbalancesforaddress"
    },
    tx: {
        detail: "omni_gettransaction",
        payload: "omni_getpayload",
        sendRaw: "omni_sendrawtx",
        list: "omni_listblocktransactions",
        pending: "omni_listpendingtransactions",
        wallet: "omni_listtransactions"
    }
};
