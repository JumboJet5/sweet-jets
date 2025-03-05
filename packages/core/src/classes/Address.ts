import { toChecksumAddress } from 'ethereum-checksum-address'
import { EMPTY_ADDRESS } from '../constants'

const ERROR_ADDRESS_NOT_DEFINED = 'Tried to get not defined address'

export class Address {
  protected _address: string | undefined
  protected _types: string[] = []

  constructor(address: string = EMPTY_ADDRESS) {
    this.set(address)
  }

  public set(address: string = EMPTY_ADDRESS): void {
    if (address.startsWith('0x')) {
      this._address = toChecksumAddress(address)
      this._types = ['erc20']
    } else {
      throw new Error(`Unknown address format: ${address}`)
    }
  }

  public toString(): string {
    return this.toErc20()
  }

  public toErc20(): string {
    if (!this._types.includes('erc20')) {
      throw new Error('View type not supported for current addres')
    }
    if (!this._address) {
      throw new Error('Address not defined')
    }

    return this._address
  }

  public isEmpty(): boolean {
    return this.toErc20() === EMPTY_ADDRESS
  }

  public static from(address: string = EMPTY_ADDRESS): Address {
    return new Address(address)
  }
}
