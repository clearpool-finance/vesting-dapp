import React from 'react'
import { useConnect } from 'web3'

import { WidthContainer } from 'components/layout'
import s from './WrongNetworkBanner.module.scss'


const getNetworkName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'Mainnet'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    default:
      return 'Unknown'
  }
}

const WrongNetworkBanner = () => {
  const { chainId, requiredChainId } = useConnect()

  if (!chainId || (chainId === requiredChainId)) return null

  return (
    <div className={s.wrongNetwork}>
      <WidthContainer className="flex items-center">
        {
          `App network (${getNetworkName(chainId)}) doesn’t match to network selected in wallet. Please change network in your wallet to ${getNetworkName(requiredChainId)}`
        }
      </WidthContainer>
    </div>
  )
}


export default React.memo(WrongNetworkBanner)
