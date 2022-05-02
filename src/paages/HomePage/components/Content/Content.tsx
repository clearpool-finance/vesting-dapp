import React, { useEffect } from 'react'
import { formatUnits } from '@ethersproject/units'
import { useConnect } from 'web3'
import { contracts, getContract, ownerAddress } from 'contracts'
import { useReducerState } from 'hooks'

import Info from '../Info/Info'

import s from './Content.module.scss'


const Balance = () => {
  const [ { isFetching, balance, vested }, setState ] = useReducerState({ isFetching: true, balance: null, vested: null })

  const fetch = async () => {
    const cpoolContract = getContract('cpool')
    const vestingContract = getContract('manualVesting2')

    const [ balance, totalVest ] = await Promise.all([
      cpoolContract.balanceOf(contracts.manualVesting2.address),
      vestingContract.totalVest(),
    ])

    setState({
      isFetching: false,
      balance: parseFloat(parseFloat(formatUnits(balance, 18)).toFixed(4)),
      vested: parseFloat(parseFloat(formatUnits(totalVest, 18)).toFixed(4)),
    })
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <div className={s.headline}>
      <div className={s.balance}>
        <span>Contract balance:</span>
        {
          isFetching ? (
            <img className={s.spinner} src="/images/svg/16/spinner.svg" alt="" />
          ) : (
            <div>{balance} CPOOL</div>
          )
        }
      </div>
      <div className={s.balance}>
        <span>Vested amount:</span>
        {
          isFetching ? (
            <img className={s.spinner} src="/images/svg/16/spinner.svg" alt="" />
          ) : (
            <div>{vested} CPOOL</div>
          )
        }
      </div>
    </div>
  )
}

const Headline = () => {
  const { account } = useConnect()

  if (account === ownerAddress) {
    return <Balance />
  }

  return (
    <div className={s.headline}>
      <div className={s.title}>Welcome to the investor room</div>
      <div className={s.text}>Review your status and claim your vested tokens</div>
    </div>
  )
}

const Content = () => {

  return (
    <div className={s.content}>
      <Headline />
      <Info />
    </div>
  )
}


export default Content
