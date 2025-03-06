import { Address } from '@sweet-jets/core'

export interface JsonRpcPayload {
  jsonrpc: string;
  method: string;
  params?: any[];
  id?: string | number;
}

export interface JsonRpcResponse {
  jsonrpc: string;
  id: string | number;
  result?: any;
  error?: {
    readonly code?: number;
    readonly data?: unknown;
    readonly message: string;
  };
}

export interface RequestArguments {
  method: string;
  params?: any;

  [key: string]: any;
}

export interface AbstractProvider {
  connected?: boolean

  request?(args: RequestArguments): Promise<unknown>
}
export type EthereumConnectionInfo = {
  chainId: number | undefined
  account: Address | undefined
  accounts: Address[]
  isConnected: boolean
  isActivating: boolean
  provider: AbstractProvider | null
}

export interface NetworkDetails {
  rpc: string
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export type EthereumListener = (...args: unknown[]) => void

export interface EthereumProvider {
  isMetaMask?: boolean
  providers?: EthereumProvider[]
  connected?: boolean

  once(eventName: string | symbol, listener: EthereumListener): void

  on(eventName: string | symbol, listener: EthereumListener): void

  removeListener(eventName: string | symbol, listener: EthereumListener): void

  request<T = unknown>(args: RequestArguments): Promise<T>

  send?(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void
}
