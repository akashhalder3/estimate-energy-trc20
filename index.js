const axios = require('axios');
let host = 'https://nile.trongrid.io/wallet/estimateenergy';
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
    fullNode: 'https://nile.trongrid.io',
    solidityNode: 'https://nile.trongrid.io',
    eventServer: 'https://event.trongrid.io',
}
);
//It is recommended to use ethers4.0.47 version
var ethers = require('ethers')
const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;
const ADDRESS_PREFIX = "41";

async function encodeParams(inputs) {
    let typesValues = inputs
    let parameters = ''
    if (typesValues.length == 0)
        return parameters
    const abiCoder = new AbiCoder();
    let types = [];
    const values = [];
    for (let i = 0; i < typesValues.length; i++) {
        let { type, value } = typesValues[i];
        if (type == 'address')
            value = value.replace(ADDRESS_PREFIX_REGEX, '0x');
        else if (type == 'address[]')
            value = value.map(v => toHex(v).replace(ADDRESS_PREFIX_REGEX, '0x'));
        types.push(type);
        values.push(value);
    }
    try {
        parameters = abiCoder.encode(types, values).replace(/^(0x)/, '');
    } catch (ex) {
        console.log(ex);
    }
    return parameters
}

async function estimateEnergy(contractAddress, senderAddress, receiverAddress, amount) {
    let contractAddress_hex = tronWeb.address.toHex(contractAddress);
    let senderAddress_hex = tronWeb.address.toHex(senderAddress);
    let receiverAddress_hex = tronWeb.address.toHex(receiverAddress);
    let inputs = [
        { type: 'address', value: senderAddress_hex },
        { type: 'uint256', value: amount }
    ]
    let data = await encodeParams(inputs);
    console.log("data: ", data);
    let result = await axios.post(host, {
        "owner_address": senderAddress,
        "contract_address": contractAddress,
        "function_selector": "transfer(address,uint256)",
        "parameter": data,
        "visible": true
    });
    console.log(result.data)
}

estimateEnergy('TAdr4uZrpueLbtcC2JKv6FJDQmVavaXdUo', 'TRGihQiBmjHg1KV18XvdQENzgQPFXccLXz', 'TFDvCFrCE2Xg8uDVLEM5n7tsZH9sJ6uwSL', '10');