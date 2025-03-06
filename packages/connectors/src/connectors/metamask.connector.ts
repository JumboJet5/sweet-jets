import detectEthereumProvider from '@metamask/detect-provider'
import { EthereumProvider } from '../types'
import { InjectedConnector } from './injected.connector'

export class MetamaskConnector extends InjectedConnector {
  protected override async getEthereumProvider(): Promise<EthereumProvider | null> {
    const provider = (await detectEthereumProvider()) as EthereumProvider | null
    if (provider?.providers?.length) {
      return provider.providers.find((p) => p.isMetaMask) ?? provider.providers[0]
    }
    return provider
  }
}
