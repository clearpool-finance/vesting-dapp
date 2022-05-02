import { useState } from 'react'
import { parseUnits } from '@ethersproject/units'
import { useForm as useFormularForm } from 'formular'
import type { Form } from 'formular'
import { getContract } from 'contracts'
import { useConnect } from 'web3'


const getSeconds = (date: number): number =>
  parseInt(String(new Date(date).getTime() / 1000))

type FormFields = {
  address: string
  amount: string
  startDate: number
  endDate: number
  cliffDate: number
}

export type VestingForm = Form<FormFields>

const useForm = () => {
  const { library } = useConnect()

  const [ isSubmitting, setSubmitting ] = useState(false)

  const form = useFormularForm<FormFields>({
    fields: {
      address: [],
      amount: [],
      startDate: [],
      endDate: [],
      cliffDate: [],
    },
  })

  const submit = async () => {
    if (!library || isSubmitting) {
      return
    }

    try {
      const { values, errors } = await form.submit()

      if (errors) {
        return
      }

      setSubmitting(true)

      const cpoolContract = getContract('cpool')
      const vestingContract = getContract('manualVesting2', true)

      let { address, amount, startDate, endDate, cliffDate } = values

      const decimals = await cpoolContract.decimals()

      startDate = getSeconds(startDate) as any
      endDate = getSeconds(endDate) as any
      cliffDate = getSeconds(cliffDate) as any
      amount = parseUnits(amount, decimals) as any

      const receipt = await vestingContract.holdTokens(address, amount, startDate, cliffDate, endDate)
      await receipt.wait()

      form.unsetValues()
      setSubmitting(false)
      alert('Success!')
    }
    catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  return {
    form,
    submit,
    isSubmitting,
  }
}


export default useForm
