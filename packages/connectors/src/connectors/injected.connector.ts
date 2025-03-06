import detectEthereumProvider from '@metamask/detect-provider'
import { EthereumProvider, NetworkDetails } from '../types'
import { EthereumConnector } from './ethereum.connector'

export class InjectedConnector extends EthereumConnector<EthereumProvider> {
  constructor(supportedNetworks: NetworkDetails[], defaultChainId: number) {
    super(supportedNetworks, defaultChainId)
  }

  protected override async getEthereumProvider(): Promise<EthereumProvider | null> {
    const provider = (await detectEthereumProvider()) as EthereumProvider | null
    return (provider?.providers ? provider?.providers[0] ?? provider : provider) as EthereumProvider | null
  }
}
