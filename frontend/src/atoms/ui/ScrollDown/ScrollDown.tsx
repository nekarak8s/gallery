import React from 'react'

import MouseSvg from '@/assets/svgs/mouse.svg'
import DownArrowSvg from '@/assets/svgs/down-arrow.svg'

import styles from './scrollDown.module.scss'

const ScrollDown = () => {
  return (
    <div className={styles.scrollDown}>
      <MouseSvg />
      <DownArrowSvg />
    </div>
  )
}

export default ScrollDown