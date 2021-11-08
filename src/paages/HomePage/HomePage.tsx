import React from 'react'

import ConnectModal from 'compositions/modals/ConnectModal/ConnectModal'

import Header from './components/Header/Header'
import Content from './components/Content/Content'
import WrongNetworkBanner from 'compositions/WrongNetworkBanner/WrongNetworkBanner'


const HomePage = () => {

  return (
    <>
      <WrongNetworkBanner />
      <Header />
      <Content />
      <ConnectModal />
    </>
  )
}


export default HomePage
