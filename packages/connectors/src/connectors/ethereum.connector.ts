import { Address } from '@sweet-jets/core'
import { BehaviorSubject } from 'rxjs'
import { ConnectResultEnum } from '../enum'
import { EthereumConnectionInfo, EthereumListener, EthereumProvider, NetworkDetails } from '../types'
import { AbstractConnector } from './abstract.connector'

// for connectors that extends ethereum as provider
export abstract class EthereumConnector<T extends EthereumProvider = EthereumProvider> extends AbstractConnector<T | null, EthereumConnectionInfo> {
  protected _provider: T | null = null
  protected _state$ = new BehaviorSubject<EthereumConnectionInfo>({
    chainId: undefined,
    account: undefined,
    accounts: [],
    provider: this._provider,
    isConnected: false,
    isActivating: false,
  })
  protected _network_not_exist_error_codes: number[] = [4902]

  // make all public config fields changable but immutable
  get supportedNetworks(): NetworkDetails[] {
    return this._supportedNetworks.map((item) => ({ ...item }))
  }

  set supportedNetworks(value: NetworkDetails[]) {
    this._supportedNetworks = value
  }

  protected constructor(protected _supportedNetworks: NetworkDetails[], public defaultChainId: number) {
    super()
  }

  async connect(chainId: number = this.defaultChainId): Promise<ConnectResultEnum> {
    if (this._state$.value.isConnected) {
      return ConnectResultEnum.ALREADY_CONNECTED
    }

    try {
      this._provider = await this.getEthereumProvider()
    } catch (e) {
      console.warn('Not found ethereum provider', e)
      return ConnectResultEnum.FAIL
    }

    if (!this._provider) {
      return ConnectResultEnum.FAIL
    }

    this._state$.next({ ...this._state$.value, isActivating: true })
    const accountsRequest = this._provider.request<string[]>({ method: 'eth_requestAccounts' })
    const chainIdRequest = this._provider.request<string>({ method: 'eth_chainId' })
    try {
      const accounts = await accountsRequest
      if (!accounts[0]) {
        return ConnectResultEnum.FAIL
      }

      const _accounts = accounts.map((address) => Address.from(address))

      // subscribe on ethereum events
      this._provider.on('connect', this._onConnect as EthereumListener)
      this._provider.on('disconnect', this._onDisconnect as EthereumListener)
      this._provider.on('chainChanged', this._onChangeChainId as EthereumListener)
      this._provider.on('accountsChanged', this._onChangeAccount as EthereumListener)

      const _chainId = await chainIdRequest

      this._state$.next({
        ...this._state$.value,
        accounts: _accounts,
        account: _accounts[0],
        chainId: +_chainId,
        isConnected: true,
        isActivating: false,
      })

      // if current chainId is not equal to expected try switch network
      if (chainId !== +_chainId) {
        this.switchNetwork(chainId)
      }

      return ConnectResultEnum.SUCCESS
    } catch (e) {
      this.disconnect()
      return ConnectResultEnum.FAIL
    }
  }

  async disconnect(): Promise<void> {
    this._onDisconnect()
  }

  async switchNetwork(chainId: number): Promise<void> {
    try {
      const formattedChainId = `0x${chainId.toString(16)}`
      await this._provider?.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: formattedChainId }] })
    } catch (error) {
      const networkDetails = this.supportedNetworks.find((item) => item.chainId === chainId)
      const code = !!error && (error as { code?: unknown }).code
      if (this._network_not_exist_error_codes.includes(code as number) && networkDetails) {
        await this.setupNetwork(networkDetails)
      } else {
        throw error
      }
    }
  }

  async setupNetwork({ chainId, rpc, ...networkDetails }: NetworkDetails): Promise<void> {
    if (!this._supportedNetworks.some((item) => item.chainId === chainId)) {
      this._supportedNetworks = [...this._supportedNetworks, { ...networkDetails, chainId, rpc }]
    }
    const formattedChainId = `0x${chainId.toString(16)}`
    const params = { ...networkDetails, chainId: formattedChainId, rpcUrls: [rpc] }
    await this._provider?.request({ method: 'wallet_addEthereumChain', params: [params] })
  }

  getProvider(): T | null {
    return this._provider
  }

  protected abstract getEthereumProvider(): Promise<T | null>

  protected _onConnect = ({ chainId }: { chainId: string }): void => {
    this._state$.next({ ...this._state$.value, chainId: +chainId, isActivating: false })
  }

  /**
   * remove all provider listeners and update state
   */
  protected _onDisconnect = async (error?: { code: number; } & Record<string, unknown>): Promise<void> => {
    // error code of EthereumProvider inner bug
    if (error?.code === 1013) {
      return
    }

    if (!!error) {
      console.error(error)
    }

    this._state$.next({
      chainId: undefined,
      account: undefined,
      accounts: [],
      provider: this._provider,
      isConnected: false,
      isActivating: false,
    })
    this._provider?.removeListener('connect', this._onConnect as EthereumListener)
    this._provider?.removeListener('disconnect', this._onDisconnect as EthereumListener)
    this._provider?.removeListener('chainChanged', this._onChangeChainId as EthereumListener)
    this._provider?.removeListener('accountsChanged', this._onChangeAccount as EthereumListener)
  }

  protected _onChangeChainId = (chainId: string): void => {
    this._state$.next({ ...this._state$.value, chainId: +chainId })
  }

  protected _onChangeAccount = (accounts: string[]): void => {
    const _accounts = accounts.map((address) => Address.from(address))

    this._state$.next({
      ...this._state$.value,
      accounts: _accounts,
      account: _accounts[0],
    })
  }
}
