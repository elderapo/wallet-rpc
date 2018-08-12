"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const bignumber_js_1 = require("bignumber.js");
const crypto_js_1 = require("crypto-js");
exports.hexToNumber = (hex) => {
    if (hex === "0x") {
        return 0;
    }
    return Number.parseInt(hex, 16);
};
exports.hexToDecimalString = (hex) => {
    if (hex === "0x") {
        return "0";
    }
    if (!hex.includes("0x")) {
        hex = "0x" + hex;
    }
    return new bignumber_js_1.default(hex).toString(10);
};
exports.numberToHex = (int) => {
    return "0x" + new bignumber_js_1.default(int).toString(16);
};
exports.ERC20FuncSig = {
    allowance: "0xdd62ed3e",
    approve: "0x095ea7b3",
    balanceOf: "0x70a08231",
    decimals: "0x313ce567",
    name: "0x06fdde03",
    symbol: "0x95d89b41",
    totalSupply: "0x18160ddd",
    transfer: "0xa9059cbb",
    transferFrom: "0x23b872dd"
};
exports.ERC20FuncSigUpper = {
    DECIMALS: "0x2e0f2625",
    NAME: "0xa3f4df7e",
    SYMBOL: "0xf76f8d78"
};
exports.isAddress = (address) => {
    return /^(0x)?[0-9a-f]{40}$/.test(address.toLowerCase());
};
exports.isChecksumAddress = (address) => {
    if (!exports.isAddress(address)) {
        return false;
    }
    const aHash = exports.sha3(address.replace("0x", "").toLowerCase());
    for (let i = 0; i < 40; i++) {
        const toNumber = Number.parseInt(aHash[i], 16);
        const upper = address[i].toUpperCase();
        if ((toNumber > 7 && upper !== address[i]) ||
            (toNumber <= 7 && upper !== address[i])) {
            return false;
        }
    }
    return true;
};
exports.sha3 = (message) => {
    return crypto_js_1.SHA3(message, { outputLength: 256 }).toString();
};
exports.padAddress = (address) => {
    if (!exports.isAddress(address)) {
        throw new Error("Not a valid address");
    }
    return "0".repeat(24) + address.replace("0x", "");
};
exports.toUtf8 = (hex) => {
    const result = Buffer.from(hex.replace("0x", ""), "hex")
        .toString()
        .match(/\w+/g);
    return result ? result.join("") : "";
};
exports.addressNull = "0x0000000000000000000000000000000000000000";
exports.getABI = async (token, apiKey = "YourApiKeyToken") => {
    const api = "https://api.etherscan.io/api";
    const res = await axios_1.default.get(api, {
        params: {
            module: "contract",
            action: "getabi",
            address: token,
            apiKey
        }
    });
    return res.data;
};
