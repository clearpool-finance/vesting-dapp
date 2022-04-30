import React, { useState } from 'react'
import { useConnect } from 'web3'
import { ownerAddress } from 'contracts'
import dayjs from 'dayjs'
import { getContract } from 'contracts'
import cx from 'classnames'

import { openConnectModal } from 'compositions/modals/ConnectModal/ConnectModal'

import Stats from '../Stats/Stats'
import Form from '../Form/Form'

import useData from './utils/useData'

import s from './Info.module.scss'


const ClaimButton = ({ contractName, availableToClaim, onClaim }) => {
  const { account } = useConnect()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const handleClaimClick = async () => {
    if (!account || !availableToClaim || isSubmitting) {
      return
    }

    try {
      setSubmitting(true)

      const vestingContract = getContract(contractName as 'manualVesting', true)

      const receipt = await vestingContract.claim(account)
      const trx = await receipt.wait()

      setSubmitting(false)
      onClaim()
    }
    catch (err) {
      setSubmitting(false)
      console.error(err)
      alert(err?.message || err)
    }
  }

  return (
    <div className={cx(s.claimButton, { [s.disabled]: !availableToClaim })} onClick={handleClaimClick}>
      <span>Claim my CPOOL tokens</span>
      {
        isSubmitting && (
          <img src="/images/svg/16/spinner.svg" alt="" />
        )
      }
    </div>
  )
}

const Vesting = ({ isFetching, data, withDates }) => {
  const { startDate, cliffDate, endDate } = data || {}

  return (
    <div className={s.vesting}>
      {
        Boolean(data.totalTokens) && (
          <div className={s.dates}>
            {
              withDates && (
                <>Vesting period from {dayjs(startDate).format('DD MMM YYYY')} to {dayjs(endDate).format('DD MMM YYYY')}.&nbsp;</>
              )
            }
            End of your cliff: {dayjs(cliffDate).format('DD MMM YYYY')}
          </div>
        )
      }
      <Stats isFetching={isFetching} data={data} />
    </div>
  )
}

const AutoVesting = ({ isFetching, blocks, onClaim }) => {
  const availableToClaim = blocks.reduce((acc, { availableToClaim }) => acc + availableToClaim, 0)

  return (
    <div className={s.block}>
      {
        blocks.map((autoData, index) => (
          <Vesting
            key={index}
            isFetching={isFetching}
            data={autoData}
            withDates={index === 0}
          />
        ))
      }
      <ClaimButton {...{ contractName: 'autoVesting', availableToClaim, onClaim }} />
    </div>
  )
}

const ManualVesting = ({ isFetching, data, onClaim }) => {
  const { availableToClaim } = data

  return (
    <div className={s.block}>
      <Vesting {...{ isFetching, data, withDates: true, onClaim }} />
      <ClaimButton {...{ contractName: 'manualVesting', availableToClaim, onClaim }} />
    </div>
  )
}

const Info = () => {
  const { account } = useConnect()
  const { isFetching, isAutoFetching, isManualFetching, autoData, manualData, fetchAutoData, fetchManualData } = useData()

  if (!account) {
    return (
      <div className={s.info}>
        <div className={s.title}>Your initial token sale dashboard</div>
        <button
          className={s.connectButton}
          onClick={openConnectModal}
        >
          Connect wallet to see the status
        </button>
      </div>
    )
  }

  if (account === ownerAddress) {
    return (
      <Form />
    )
  }

  return (
    <div className={s.info}>
      <div className={s.title}>Your initial token sale dashboard</div>
      {
        Boolean(autoData && autoData.length) && (
          <AutoVesting
            isFetching={isFetching || isAutoFetching}
            blocks={autoData}
            onClaim={fetchAutoData}
          />
        )
      }
      {
        Boolean(manualData && manualData.totalTokens) && (
          <ManualVesting
            isFetching={isFetching || isManualFetching}
            data={manualData}
            onClaim={fetchManualData}
          />
        )
      }
      {
        !autoData && !manualData && (
          <div className={s.empty}>Nothing to show</div>
        )
      }
    </div>
  )
}


export default Info
