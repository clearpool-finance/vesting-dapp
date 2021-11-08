import React from 'react'
import cx from 'classnames'

import s from './WidthContainer.module.scss'


type WidthContainerProps = {
  children: any
  className?: string
  ignore?: boolean
}

const WidthContainer: React.FunctionComponent<WidthContainerProps> = (props) => {
  const { children, className, ignore } = props

  const rootClassName = cx(className, {
    [s.widthContainer]: !ignore,
  })

  return (
    <div className={rootClassName}>
      {children}
    </div>
  )
}


export default React.memo(WidthContainer)
