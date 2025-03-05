"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const ethereum_checksum_address_1 = require("ethereum-checksum-address");
const constants_1 = require("../constants");
const ERROR_ADDRESS_NOT_DEFINED = 'Tried to get not defined address';
class Address {
    constructor(address = constants_1.EMPTY_ADDRESS) {
        this._types = [];
        this.set(address);
    }
    set(address = constants_1.EMPTY_ADDRESS) {
        if (address.startsWith('0x')) {
            this._address = (0, ethereum_checksum_address_1.toChecksumAddress)(address);
            this._types = ['erc20'];
        }
        else {
            throw new Error(`Unknown address format: ${address}`);
        }
    }
    toString() {
        return this.toErc20();
    }
    toErc20() {
        if (!this._types.includes('erc20')) {
            throw new Error('View type not supported for current addres');
        }
        if (!this._address) {
            throw new Error('Address not defined');
        }
        return this._address;
    }
    isEmpty() {
        return this.toErc20() === constants_1.EMPTY_ADDRESS;
    }
    static from(address = constants_1.EMPTY_ADDRESS) {
        return new Address(address);
    }
}
exports.Address = Address;
