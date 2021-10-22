import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'


export enum ConnectorNames {
  Injected,
  WalletConnect
}

const injected = new InjectedConnector({
  supportedChainIds: [ 1, 3, 4, 5, 42, 56, 97 ],
})

const walletconnect = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
    4: 'https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213',
  },
  qrcode: true,
  pollingInterval: 12000,
})


export default {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}
